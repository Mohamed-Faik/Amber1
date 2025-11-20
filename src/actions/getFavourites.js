import prisma from "@/libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export default async function getMyFavourites() {
	try {
		const currentUser = await getCurrentUser();
		
		if (!currentUser || !currentUser.id) {
			return [];
		}

		const { id: userId } = currentUser;

		// Fetch favourites without relations
		const favouritesData = await prisma.favourite.findMany({
			where: { userId: userId },
			orderBy: {
				created_at: "desc",
			},
		});

		if (favouritesData.length === 0) {
			return [];
		}

		// Get unique listing IDs
		const listingIds = [...new Set(favouritesData.map((f) => f.listingId))];

		// Fetch listings
		const listings = await prisma.listing.findMany({
			where: { id: { in: listingIds } },
		});

		// Get unique user IDs from listings
		const userIds = [...new Set(listings.map((l) => l.userId))];

		// Fetch users
		const users = await prisma.user.findMany({
			where: { id: { in: userIds } },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
			},
		});

		// Combine favourites with listing and user data
		const favourites = favouritesData.map((favourite) => {
			const listing = listings.find((l) => l.id === favourite.listingId);
			const user = listing ? users.find((u) => u.id === listing.userId) : null;

			return {
				...favourite,
				listing: listing
					? {
							...listing,
							user: user || null,
						}
					: null,
			};
		}).filter((fav) => fav.listing !== null); // Filter out favourites with deleted listings

		return favourites;
	} catch (error) {
		console.error("Error fetching favourites:", error);
		return [];
	}
}

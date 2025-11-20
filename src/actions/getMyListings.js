import prisma from "@/libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export default async function getMyListings() {
	try {
		const currentUser = await getCurrentUser();
		
		if (!currentUser || !currentUser.id) {
			return [];
		}

		const { id: userId } = currentUser;

		// Fetch listings without relations
		const listingsData = await prisma.listing.findMany({
			where: { userId: userId },
			orderBy: {
				created_at: "desc",
			},
		});

		if (listingsData.length === 0) {
			return [];
		}

		// Get unique user IDs (should mostly be the current user, but just in case)
		const userIds = [...new Set(listingsData.map((l) => l.userId))];

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

		// Combine listings with user data
		const listings = listingsData.map((listing) => {
			const user = users.find((u) => u.id === listing.userId);

			return {
				...listing,
				user: user || null,
			};
		});

		return listings;
	} catch (error) {
		console.error("Error fetching my listings:", error);
		return [];
	}
}

import prisma from "@/libs/prismadb";

export default async function getListingBySlug(params) {
	try {
		const { listingId, slug } = params;

		const listing = await prisma.listing.findUnique({
			where: {
				id: parseInt(listingId),
			},
		});

		if (!listing) {
			return null;
		}

		// Fetch user and profile separately to avoid Prisma relation issues
		const user = await prisma.user.findUnique({
			where: { id: listing.userId },
		});

		// Fetch profile separately
		let profile = null;
		if (user) {
			try {
				profile = await prisma.profile.findUnique({
					where: {
						userId: user.id,
					},
				});
			} catch (error) {
				console.error(`Error fetching profile for user ${user.id}:`, error);
			}
		}

		// Combine listing with user data
		return {
			...listing,
			user: user ? {
				...user,
				profile: profile || null,
			} : null,
		};
	} catch (error) {
		console.error("Error fetching listing by slug:", error);
		throw new Error(error);
	}
}

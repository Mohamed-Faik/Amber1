import prisma from "@/libs/prismadb";

export default async function getReviewByListingId(params) {
	try {
		const { listingId } = params;

		// Fetch reviews without relations to avoid Prisma relation issues
		const reviewsData = await prisma.review.findMany({
			where: {
				listingId: parseInt(listingId),
			},
			orderBy: {
				created_at: "desc",
			},
		});

		if (!reviewsData || reviewsData.length === 0) {
			return [];
		}

		// Get unique user IDs
		const userIds = [...new Set(reviewsData.map((r) => r.userId))];

		// Fetch users separately
		const reviewUsers = await prisma.user.findMany({
			where: { id: { in: userIds } },
			select: {
				id: true,
				name: true,
				image: true,
			},
		});

		// Combine reviews with user data
		const reviews = reviewsData.map((review) => ({
			...review,
			user: reviewUsers.find((u) => u.id === review.userId) || null,
		}));

		return reviews;
	} catch (error) {
		console.error("Error fetching reviews by listing ID:", error);
		throw new Error(error);
	}
}

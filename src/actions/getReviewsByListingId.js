import prisma from "@/libs/prismadb";

export default async function getReviewByListingId(params) {
	try {
		const { listingId } = params;

		const reviews = await prisma.review.findMany({
			where: {
				listingId: parseInt(listingId),
			},
			orderBy: {
				created_at: "desc",
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
		});

		if (!reviews) {
			return [];
		}

		return reviews;
	} catch (error) {
		throw new Error(error);
	}
}

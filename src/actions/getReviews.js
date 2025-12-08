import prisma from "@/libs/prismadb";

export default async function getReviews() {
	try {
		const reviews = await prisma.review.findMany({
			orderBy: {
				created_at: "desc",
			},
			include: {
				user: {
					select: {
						name: true,
					},
				},
				listing: {
					select: {
						id: true,
						title: true,
					},
				},
			},
		});

		if (!reviews) {
			return null;
		}

		return reviews;
	} catch (error) {
		throw new Error(error);
	}
}

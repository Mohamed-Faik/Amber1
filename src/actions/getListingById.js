import prisma from "@/libs/prismadb";

export default async function getListingById(listingId) {
	try {
		if (!listingId) {
			return null;
		}

		const id = parseInt(listingId, 10);
		if (Number.isNaN(id)) {
			return null;
		}

		const listing = await prisma.listing.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					},
				},
			},
		});

		return listing;
	} catch (error) {
		console.error("Error fetching listing by id:", error);
		return null;
	}
}


import prisma from "@/libs/prismadb";

export default async function getUserById(params) {
	try {
		const { userId } = params;

		const user = await prisma.user.findUnique({
			where: {
				id: parseInt(userId),
			},
			include: {
				profile: true,
				listings: {
					take: 6,
				},
				// favourites: true,
			},
			// take: 6,
		});

		if (!user) {
			return null;
		}

		return user;
	} catch (error) {
		return null;
	}
}

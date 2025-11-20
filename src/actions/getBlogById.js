import prisma from "@/libs/prismadb";

export default async function getBlogById(params) {
	try {
		const { blogId } = params;

		const post = await prisma.blog.findUnique({
			where: {
				id: parseInt(blogId),
			},
			include: {
				user: {
					include: {
						profile: true,
					},
				},
			},
		});

		if (!post) {
			return null;
		}

		return post;
	} catch (error) {
		throw new Error(error);
	}
}

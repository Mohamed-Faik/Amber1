import prisma from "@/libs/prismadb";

export default async function getBlogPosts(params) {
	try {
		const { limit } = params || {};

		let blogPosts;

		if (limit) {
			blogPosts = await prisma.blog.findMany({
				orderBy: {
					created_at: "desc",
				},
				take: limit,
			});
		} else {
			blogPosts = await prisma.blog.findMany({
				orderBy: {
					created_at: "desc",
				},
			});
		}

		if (!blogPosts) {
			return null;
		}

		// Fetch user information for each blog post separately if needed
		const blogsWithUser = await Promise.all(
			blogPosts.map(async (blog) => {
				try {
					const user = await prisma.user.findUnique({
						where: { id: blog.userId },
						select: {
							name: true,
							id: true,
							image: true,
						},
					});

					return {
						...blog,
						user: user || null,
					};
				} catch (error) {
					console.error(`Error fetching user for blog ${blog.id}:`, error);
					return {
						...blog,
						user: null,
					};
				}
			})
		);

		return blogsWithUser;
	} catch (error) {
		console.error("❌ Error fetching blog posts:");
		console.error("   Error message:", error.message);
		console.error("   Error stack:", error.stack);
		
		// Database connection error - return empty array instead of crashing
		if (error.message?.includes("Can't reach database server") || 
		    error.code === "P1001") {
			console.warn("⚠️  Database connection error - returning empty array");
			return [];
		}
		
		// For other errors, also return empty array to prevent app crash
		console.warn("⚠️  Failed to fetch blog posts - returning empty array");
		return [];
	}
}

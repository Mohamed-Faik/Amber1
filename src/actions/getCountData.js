import prisma from "@/libs/prismadb";

export default async function countData(params) {
	try {
		const users = await prisma.user.count();
		const listings = await prisma.listing.count();
		const reviews = await prisma.review.count();
		const blogPosts = await prisma.blog.count();
		return { users, listings, reviews, blogPosts };
	} catch (error) {
		console.error("Database connection error in getCountData:", error);
		// Return default values instead of throwing to prevent page crash
		return { 
			users: 0, 
			listings: 0, 
			reviews: 0, 
			blogPosts: 0 
		};
	}
}

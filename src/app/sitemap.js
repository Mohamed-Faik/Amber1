import prisma from "@/libs/prismadb";
import getListings from "@/actions/getListings";

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

	// Static pages
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/listings`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/about-us`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/contact-us`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/terms-condition`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/privacy-policy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/faq`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
	];

	// Get all approved listings
	const { listings } = await getListings({ showAll: false });
	const listingPages = listings.map((listing) => ({
		url: `${baseUrl}/listing/${listing.id}/${listing.slug}`,
		lastModified: listing.created_at || new Date(),
		changeFrequency: "weekly",
		priority: 0.8,
	}));

	// Get all blog posts
	let blogPages = [];
	try {
		const blogs = await prisma.blog.findMany({
			orderBy: {
				created_at: "desc",
			},
		});
		blogPages = blogs.map((blog) => ({
			url: `${baseUrl}/blog/${blog.id}/${blog.slug}`,
			lastModified: blog.created_at || new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		}));
	} catch (error) {
		console.error("Error fetching blogs for sitemap:", error);
	}

	return [...staticPages, ...listingPages, ...blogPages];
}


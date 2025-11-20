export default function robots() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
	
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/dashboard/",
					"/administrator/",
					"/admin/",
					"/auth/",
					"/profile/",
					"/listings/new",
					"/listings/my-listings",
					"/listings/favourites",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}


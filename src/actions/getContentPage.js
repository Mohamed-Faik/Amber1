import prisma from "@/libs/prismadb";

export default async function getContentPage(slug) {
	try {
		const content = await prisma.content_page.findUnique({
			where: { slug },
		});

		return content;
	} catch (error) {
		console.error("Error fetching content page:", error);
		return null;
	}
}


import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

// GET - Get content page by slug
export async function GET(request, { params }) {
	try {
		const { slug } = params;

		const content = await prisma.content_page.findUnique({
			where: { slug },
		});

		if (!content) {
			return NextResponse.json(
				{ error: "Content not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(content);
	} catch (error) {
		console.error("Error fetching content:", error);
		return NextResponse.json(
			{ error: "Failed to fetch content" },
			{ status: 500 }
		);
	}
}

// PUT - Update content page (Admin only)
export async function PUT(request, { params }) {
	try {
		const currentUser = await getCurrentUser();
		const { isAdmin } = await import("@/utils/checkRole");
		if (!isAdmin(currentUser)) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { slug } = params;
		const body = await request.json();
		const { title, content: contentBody } = body;

		if (!title || !contentBody) {
			return NextResponse.json(
				{ error: "Title and content are required" },
				{ status: 400 }
			);
		}

		// Check if content exists
		const existingContent = await prisma.content_page.findUnique({
			where: { slug },
		});

		let updatedContent;
		if (existingContent) {
			// Update existing content
			updatedContent = await prisma.content_page.update({
				where: { slug },
				data: {
					title,
					content: contentBody,
					updated_at: new Date(),
				},
			});
		} else {
			// Create new content
			updatedContent = await prisma.content_page.create({
				data: {
					slug,
					title,
					content: contentBody,
				},
			});
		}

		return NextResponse.json(updatedContent);
	} catch (error) {
		console.error("Error updating content:", error);
		return NextResponse.json(
			{ error: "Failed to update content" },
			{ status: 500 }
		);
	}
}


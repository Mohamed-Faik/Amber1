import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

// GET - Get all content pages (Admin only)
export async function GET(request) {
	try {
		const currentUser = await getCurrentUser();
		const { isAdmin } = await import("@/utils/checkRole");
		if (!isAdmin(currentUser)) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const contentPages = await prisma.content_page.findMany({
			orderBy: {
				updated_at: "desc",
			},
		});

		return NextResponse.json(contentPages);
	} catch (error) {
		console.error("Error fetching content pages:", error);
		return NextResponse.json(
			{ error: "Failed to fetch content pages" },
			{ status: 500 }
		);
	}
}


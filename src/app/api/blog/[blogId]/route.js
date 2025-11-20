import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

export async function DELETE(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.json(
			{ message: "Authentication failed!" },
			{ status: 401 }
		);
	}

	// Check if user is admin
	if (currentUser.role !== "ADMIN") {
		return NextResponse.json(
			{ message: "Unauthorized! Admin access required." },
			{ status: 403 }
		);
	}

	const { blogId } = params;
	if (!blogId) {
		return NextResponse.json(
			{ message: "Invalid blog ID" },
			{ status: 400 }
		);
	}

	try {
		const deletedBlog = await prisma.blog.delete({
			where: {
				id: parseInt(blogId, 10),
			},
		});

		return NextResponse.json({
			message: "Blog deleted successfully",
			blog: deletedBlog,
		});
	} catch (error) {
		if (error.code === "P2025") {
			return NextResponse.json(
				{ message: "Blog not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ message: "Failed to delete blog", error: error.message },
			{ status: 500 }
		);
	}
}


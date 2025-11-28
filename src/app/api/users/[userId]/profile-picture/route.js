import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

// This endpoint allows updating profile picture immediately after registration
// It's only accessible for newly created users (within 5 minutes of account creation)
export async function PATCH(request, { params }) {
	try {
		const { userId } = params;
		const body = await request.json();
		const { imageUrl } = body;

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 }
			);
		}

		if (!imageUrl) {
			return NextResponse.json(
				{ error: "Image URL is required" },
				{ status: 400 }
			);
		}

		// Find the user
		const user = await prisma.user.findUnique({
			where: { id: parseInt(userId) },
			select: { id: true, created_at: true },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Allow update only if account was created within the last 5 minutes
		// This ensures only newly registered users can use this endpoint
		const accountAge = Date.now() - new Date(user.created_at).getTime();
		const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

		if (accountAge > fiveMinutes) {
			return NextResponse.json(
				{ error: "This endpoint is only available for newly registered users" },
				{ status: 403 }
			);
		}

		// Update user's profile picture
		const updatedUser = await prisma.user.update({
			where: { id: parseInt(userId) },
			data: {
				image: imageUrl,
				updated_at: new Date(),
			},
		});

		return NextResponse.json({
			success: true,
			user: updatedUser,
		});
	} catch (error) {
		console.error("Error updating profile picture:", error);
		return NextResponse.json(
			{ error: "Failed to update profile picture" },
			{ status: 500 }
		);
	}
}


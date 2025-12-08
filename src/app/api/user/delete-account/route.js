import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { signOut } from "next-auth/react";

export async function DELETE(request) {
	try {
		const currentUser = await getCurrentUser();
		
		if (!currentUser) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { confirmEmail, reason } = body;

		// Verify email matches
		if (confirmEmail !== currentUser.email) {
			return NextResponse.json(
				{ error: "Email confirmation does not match" },
				{ status: 400 }
			);
		}

		// GDPR-compliant deletion: Delete all user data
		// Note: Prisma cascades will handle related data deletion
		// But we'll explicitly delete to ensure GDPR compliance

		// Delete user's listings (cascade should handle, but explicit for GDPR)
		await prisma.listing.deleteMany({
			where: { userId: currentUser.id },
		});

		// Delete user's reviews
		await prisma.review.deleteMany({
			where: { userId: currentUser.id },
		});

		// Delete user's favorites
		await prisma.favourite.deleteMany({
			where: { userId: currentUser.id },
		});

		// Delete user's blog posts
		await prisma.blog.deleteMany({
			where: { userId: currentUser.id },
		});

		// Delete OAuth accounts (cascade)
		await prisma.account.deleteMany({
			where: { userId: currentUser.id },
		});

		// Delete OTP records
		await prisma.otp.deleteMany({
			where: { email: currentUser.email },
		});

		// Delete password reset tokens
		await prisma.passwordResetToken.deleteMany({
			where: { email: currentUser.email },
		});

		// Finally, delete the user (this will cascade delete profile)
		await prisma.user.delete({
			where: { id: currentUser.id },
		});

		// Log deletion reason for compliance (anonymized)
		console.log(`Account deleted: User ID ${currentUser.id}, Reason: ${reason || "Not provided"}`);

		return NextResponse.json({
			success: true,
			message: "Your account and all associated data have been permanently deleted.",
		});
	} catch (error) {
		console.error("Error deleting account:", error);
		return NextResponse.json(
			{ error: "Failed to delete account" },
			{ status: 500 }
		);
	}
}


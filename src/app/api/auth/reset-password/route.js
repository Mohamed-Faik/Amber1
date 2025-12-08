import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import bcrypt from "bcryptjs";

export async function POST(request) {
	try {
		const body = await request.json();
		const { token, password } = body;

		if (!token) {
			return NextResponse.json(
				{ error: "Reset token is required" },
				{ status: 400 }
			);
		}

		if (!password || password.length < 6) {
			return NextResponse.json(
				{ error: "Password must be at least 6 characters long" },
				{ status: 400 }
			);
		}

		// Find the reset token
		const resetToken = await prisma.passwordResetToken.findUnique({
			where: { token },
		});

		if (!resetToken) {
			return NextResponse.json(
				{ error: "Invalid or expired reset token" },
				{ status: 400 }
			);
		}

		// Check if token is already used
		if (resetToken.used) {
			return NextResponse.json(
				{ error: "This reset link has already been used" },
				{ status: 400 }
			);
		}

		// Check if token is expired
		if (new Date() > resetToken.expiresAt) {
			return NextResponse.json(
				{ error: "This reset link has expired. Please request a new one." },
				{ status: 400 }
			);
		}

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email: resetToken.email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Update user password
		await prisma.user.update({
			where: { id: user.id },
			data: {
				hashedPassword,
				updated_at: new Date(),
			},
		});

		// Mark token as used
		await prisma.passwordResetToken.update({
			where: { id: resetToken.id },
			data: { used: true },
		});

		// Delete all other unused tokens for this email
		await prisma.passwordResetToken.deleteMany({
			where: {
				email: resetToken.email,
				used: false,
				id: { not: resetToken.id },
			},
		});

		return NextResponse.json({
			success: true,
			message: "Password has been reset successfully. You can now sign in with your new password.",
		});
	} catch (error) {
		console.error("Error in reset-password route:", error);
		return NextResponse.json(
			{ 
				error: "Internal server error",
				details: process.env.NODE_ENV === "development" ? error.message : undefined
			},
			{ status: 500 }
		);
	}
}


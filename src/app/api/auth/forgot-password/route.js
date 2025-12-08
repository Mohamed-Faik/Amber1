import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { sendPasswordResetEmail } from "@/libs/email";
import crypto from "crypto";

export async function POST(request) {
	try {
		const body = await request.json();
		const { email } = body;

		if (!email || !email.includes("@")) {
			return NextResponse.json(
				{ error: "Please provide a valid email address" },
				{ status: 400 }
			);
		}

		// Check if user exists
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "No account found with this email address. Please check your email and try again." },
				{ status: 404 }
			);
		}

		// Check if user has a password (not OAuth-only user)
		if (!user.hashedPassword) {
			return NextResponse.json(
				{ error: "This email is associated with a social login account. Please sign in using your social account." },
				{ status: 400 }
			);
		}

		// Generate secure random token
		const resetToken = crypto.randomBytes(32).toString("hex");

		// Set expiration to 1 hour from now
		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 1);

		// Delete any existing unused reset tokens for this email
		await prisma.passwordResetToken.deleteMany({
			where: {
				email,
				used: false,
			},
		});

		// Create new reset token
		await prisma.passwordResetToken.create({
			data: {
				email,
				token: resetToken,
				expiresAt,
			},
		});

		// Send password reset email
		const emailResult = await sendPasswordResetEmail(email, resetToken);

		if (!emailResult.success) {
			console.error("❌ Password reset email sending failed!");
			console.error("   Error:", emailResult.error);
			console.error("   Code:", emailResult.code);
			
			// For development: still return success if email fails (user can check server logs)
			const isDevelopment = process.env.NODE_ENV === "development";
			
			if (isDevelopment) {
				console.warn("⚠️  Email sending failed in development mode.");
				console.warn("   Reset Token:", resetToken);
				console.warn("   Check server logs above for email error details");
				return NextResponse.json({
					success: true,
					message: "Password reset link generated (email sending failed - check server logs)",
					token: resetToken,
					warning: "Email not sent - check SMTP configuration",
					error: emailResult.error,
				});
			}
			
			return NextResponse.json(
				{ 
					error: "Failed to send password reset email. Please try again.",
					details: process.env.NODE_ENV === "development" ? emailResult.error : undefined
				},
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Password reset link has been sent to your email address.",
		});
	} catch (error) {
		console.error("Error in forgot-password route:", error);
		return NextResponse.json(
			{ 
				error: "Internal server error",
				details: process.env.NODE_ENV === "development" ? error.message : undefined
			},
			{ status: 500 }
		);
	}
}


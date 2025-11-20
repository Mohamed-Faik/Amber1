import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { sendOTPEmail } from "@/libs/email";

export async function POST(request) {
	try {
		const body = await request.json();
		const { email, forSignup = false } = body;

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		// Only check if user exists if it's NOT for signup
		if (!forSignup) {
			const user = await prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				return NextResponse.json(
					{ error: "No account found with this email address" },
					{ status: 404 }
				);
			}
		}

		// Generate 6-digit OTP
		const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

		// Set expiration to 10 minutes from now
		const expiresAt = new Date();
		expiresAt.setMinutes(expiresAt.getMinutes() + 10);

		// Delete any existing unused OTPs for this email
		await prisma.otp.deleteMany({
			where: {
				email,
				used: false,
			},
		});

		// Create new OTP
		await prisma.otp.create({
			data: {
				email,
				code: otpCode,
				expiresAt,
			},
		});

		// Send OTP email
		const emailResult = await sendOTPEmail(email, otpCode, forSignup);

		if (!emailResult.success) {
			console.error("❌ Email sending failed!");
			console.error("   Error:", emailResult.error);
			console.error("   Code:", emailResult.code);
			
			// For development: still return OTP if email fails (user can check localStorage)
			// In production, you should remove this and require email to be sent
			const isDevelopment = process.env.NODE_ENV === "development";
			
			if (isDevelopment) {
				console.warn("⚠️  Email sending failed in development mode. Returning OTP anyway.");
				console.warn("   OTP Code:", otpCode);
				console.warn("   Check server logs above for email error details");
				return NextResponse.json({
					success: true,
					message: "OTP generated (email sending failed - check server logs)",
					otp: otpCode,
					warning: "Email not sent - check SMTP configuration",
					error: emailResult.error,
				});
			}
			
			return NextResponse.json(
				{ 
					error: "Failed to send OTP email. Please try again.",
					details: process.env.NODE_ENV === "development" ? emailResult.error : undefined
				},
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "OTP sent to your email address",
			otp: otpCode, // Return OTP for localStorage storage (for signup flow)
		});
	} catch (error) {
		console.error("Error in send-otp route:", error);
		return NextResponse.json(
			{ 
				error: "Internal server error",
				details: process.env.NODE_ENV === "development" ? error.message : undefined
			},
			{ status: 500 }
		);
	}
}


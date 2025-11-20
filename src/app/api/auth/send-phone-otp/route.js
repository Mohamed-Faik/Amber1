import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { sendOTPSMS } from "@/libs/twilio";

export async function POST(request) {
	try {
		const body = await request.json();
		const { phoneNumber, forSignup = false } = body;

		if (!phoneNumber) {
			return NextResponse.json(
				{ error: "Phone number is required" },
				{ status: 400 }
			);
		}

		// Only check if user exists if it's NOT for signup
		// Wrap in try-catch to handle database connection errors gracefully
		try {
			if (!forSignup) {
				// Check if phone exists in profile
				const profile = await prisma.profile.findFirst({
					where: {
						phone: phoneNumber,
					},
				});

				if (!profile) {
					return NextResponse.json(
						{ error: "No account found with this phone number" },
						{ status: 404 }
					);
				}
			} else {
				// Check if phone already exists for signup
				const existingProfile = await prisma.profile.findFirst({
					where: {
						phone: phoneNumber,
					},
				});

				if (existingProfile) {
					return NextResponse.json(
						{ error: "Phone number already registered" },
						{ status: 400 }
					);
				}
			}
		} catch (dbError) {
			// Database connection error - log but continue with OTP sending
			console.warn("⚠️  Database connection error (continuing with OTP):", dbError.message);
			console.warn("   Will skip duplicate phone check");
		}

		// Delete any existing unused OTPs for this phone
		// Store phone in email field for OTP lookup
		try {
			await prisma.otp.deleteMany({
				where: {
					email: phoneNumber, // Use email field to store phone number
					used: false,
				},
			});
		} catch (dbError) {
			// Database error - log but continue
			console.warn("⚠️  Could not delete old OTPs (continuing):", dbError.message);
		}

		// Send OTP SMS via Twilio Verify (Twilio generates the code)
		const smsResult = await sendOTPSMS(phoneNumber, null, forSignup);

		if (!smsResult.success) {
			console.error("❌ SMS sending failed!");
			console.error("   Error:", smsResult.error);
			console.error("   Code:", smsResult.code);

			// For development: still return OTP if SMS fails
			const isDevelopment = process.env.NODE_ENV === "development";

			if (isDevelopment) {
				console.warn("⚠️  SMS sending failed in development mode.");
				console.warn("   Check server logs above for SMS error details");
				
				// Check if it's a Twilio trial account error
				const isTrialError = smsResult.code === 21608 || smsResult.status === 403;
				
				if (isTrialError) {
					return NextResponse.json({
						success: true,
						message: "OTP sending failed - Twilio trial account limitation",
						warning: "Trial accounts can only send SMS to verified phone numbers",
						error: smsResult.error,
						trialAccountError: true,
						helpUrl: "https://www.twilio.com/console/phone-numbers/verified",
					});
				}
				
				return NextResponse.json({
					success: true,
					message: "OTP sending failed - check server logs",
					warning: "SMS not sent - check Twilio configuration",
					error: smsResult.error,
				});
			}

			return NextResponse.json(
				{
					error: "Failed to send OTP SMS. Please try again.",
					details: process.env.NODE_ENV === "development" ? smsResult.error : undefined,
				},
				{ status: 500 }
			);
		}

		// Note: Twilio Verify generates its own OTP code
		// We don't return the code since Twilio handles generation
		// Store verification SID for tracking if needed (optional - skip if DB fails)
		try {
			await prisma.otp.create({
				data: {
					email: phoneNumber, // Store phone in email field
					code: smsResult.verificationSid || "pending", // Store verification SID
					expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
				},
			});
		} catch (dbError) {
			// Database error - log but continue (OTP was sent successfully)
			console.warn("⚠️  Could not save OTP to database (OTP was sent):", dbError.message);
		}

		return NextResponse.json({
			success: true,
			message: "OTP sent to your phone number",
			verificationSid: smsResult.verificationSid,
		});
	} catch (error) {
		console.error("❌ Error in send-phone-otp route:");
		console.error("   Error message:", error.message);
		console.error("   Error stack:", error.stack);
		console.error("   Full error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: process.env.NODE_ENV === "development" ? error.message : undefined,
			},
			{ status: 500 }
		);
	}
}


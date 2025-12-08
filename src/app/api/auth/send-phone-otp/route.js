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

		// Send OTP via SMS using Twilio Verify
		// Note: Twilio Verify generates its own OTP code
		const smsResult = await sendOTPSMS(phoneNumber, null, forSignup);

		if (!smsResult.success) {
			console.error("❌ SMS OTP sending failed!");
			console.error("   Error:", smsResult.error);
			console.error("   Code:", smsResult.code);

			// Check for specific Twilio errors
			if (smsResult.code === 60223) {
				return NextResponse.json({
					success: false,
					message: "SMS channel not enabled in Twilio Verify service",
					error: smsResult.error,
					instructions: [
						"1. Go to: https://www.twilio.com/console/verify/services",
						"2. Click on your Verify Service",
						"3. Go to 'Channels' section",
						"4. Enable 'SMS' channel",
						"5. Save the changes"
					],
					helpUrl: "https://www.twilio.com/console/verify/services",
				});
			}

			if (smsResult.code === 21608 || smsResult.status === 403) {
				return NextResponse.json({
					success: false,
					message: "Trial account limitation - verify phone number first",
					error: smsResult.error,
					instructions: [
						"1. Go to: https://www.twilio.com/console/phone-numbers/verified",
						"2. Add and verify the recipient phone number",
						"3. Or upgrade your Twilio account to send to any number"
					],
					helpUrl: "https://www.twilio.com/console/phone-numbers/verified",
				});
			}

			return NextResponse.json(
				{
					error: "Failed to send OTP via SMS. Please try again.",
					details: process.env.NODE_ENV === "development" ? smsResult.error : undefined,
				},
				{ status: 500 }
			);
		}

		// Store verification SID in database for tracking
		// Note: Twilio Verify generates its own OTP, so we store the verification SID
		try {
			await prisma.otp.create({
				data: {
					email: phoneNumber, // Store phone in email field
					code: smsResult.verificationSid || smsResult.sid || "pending", // Store verification SID
					expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
				},
			});
		} catch (dbError) {
			// Database error - log but continue (OTP was sent successfully)
			console.warn("⚠️  Could not save OTP to database (OTP was sent):", dbError.message);
		}

		return NextResponse.json({
			success: true,
			message: "OTP sent to your phone",
			requestId: smsResult.verificationSid || smsResult.sid,
			verificationSid: smsResult.verificationSid || smsResult.sid,
			status: smsResult.status,
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


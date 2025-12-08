import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { verifyOTPCode } from "@/libs/twilio";

export async function POST(request) {
	try {
		const body = await request.json();
		const { phoneNumber, otp } = body;

		if (!phoneNumber || !otp) {
			return NextResponse.json(
				{ error: "Phone number and OTP are required" },
				{ status: 400 }
			);
		}

		// Verify OTP using Twilio Verify API
		const verificationResult = await verifyOTPCode(phoneNumber, otp);

		if (!verificationResult.success) {
			return NextResponse.json(
				{ error: "Invalid or expired OTP. Please request a new one." },
				{ status: 400 }
			);
		}

		// Mark any existing OTP records for this phone as used
		try {
			await prisma.otp.updateMany({
				where: {
					email: phoneNumber, // Phone is stored in email field
					used: false,
				},
				data: {
					used: true,
				},
			});
		} catch (dbError) {
			// Database error - log but continue (verification was successful)
			console.warn("⚠️  Could not update OTP records in database (verification was successful):", dbError.message);
		}

		return NextResponse.json({
			success: true,
			message: "OTP verified successfully",
		});
	} catch (error) {
		console.error("❌ Error in verify-phone-otp route:");
		console.error("   Error message:", error.message);
		console.error("   Error stack:", error.stack);
		return NextResponse.json(
			{ 
				error: "Internal server error",
				details: process.env.NODE_ENV === "development" ? error.message : undefined,
			},
			{ status: 500 }
		);
	}
}


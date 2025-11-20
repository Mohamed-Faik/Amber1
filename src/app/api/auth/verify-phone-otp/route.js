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

		// Verify using Twilio Verify API
		const verifyResult = await verifyOTPCode(phoneNumber, otp);

		if (!verifyResult.success) {
			return NextResponse.json(
				{ error: verifyResult.error || "Invalid or expired OTP" },
				{ status: 400 }
			);
		}

		// Mark OTP record as used if exists (optional - verification already done via Twilio)
		try {
			const otpRecord = await prisma.otp.findFirst({
				where: {
					email: phoneNumber, // Phone is stored in email field
					used: false,
				},
				orderBy: {
					created_at: "desc",
				},
			});

			if (otpRecord) {
				await prisma.otp.update({
					where: { id: otpRecord.id },
					data: { used: true },
				});
			}
		} catch (dbError) {
			// Database error - log but continue (verification was successful via Twilio)
			console.warn("⚠️  Could not update OTP record (verification was successful):", dbError.message);
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


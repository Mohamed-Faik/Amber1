import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
	try {
		const body = await request.json();
		const { email, otp } = body;

		if (!email || !otp) {
			return NextResponse.json(
				{ error: "Email and OTP are required" },
				{ status: 400 }
			);
		}

		// Find the OTP
		const otpRecord = await prisma.otp.findFirst({
			where: {
				email,
				code: otp,
				used: false,
			},
			orderBy: {
				created_at: "desc",
			},
		});

		if (!otpRecord) {
			return NextResponse.json(
				{ error: "Invalid or expired OTP" },
				{ status: 400 }
			);
		}

		// Check if OTP is expired
		if (new Date() > new Date(otpRecord.expiresAt)) {
			// Mark as used even though expired
			await prisma.otp.update({
				where: { id: otpRecord.id },
				data: { used: true },
			});

			return NextResponse.json(
				{ error: "OTP has expired. Please request a new one." },
				{ status: 400 }
			);
		}

		// Mark OTP as used
		await prisma.otp.update({
			where: { id: otpRecord.id },
			data: { used: true },
		});

		// Get user
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "OTP verified successfully",
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		console.error("Error in verify-otp route:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}


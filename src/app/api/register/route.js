import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/libs/prismadb";

export async function POST(request) {
	try {
		const body = await request.json();
		const { name, email, password, phone, whatsappNumber, address, gender } = body;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Email already registered" },
				{ status: 400 }
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create user
		const user = await prisma.user.create({
			data: {
				name,
				email,
				hashedPassword,
				updated_at: new Date(),
			},
		});

		// Create profile (phone and gender are required in signup form)
		await prisma.profile.create({
			data: {
				userId: user.id,
				phone: phone || null,
				whatsappNumber: whatsappNumber || null,
				address: address || null,
				gender: gender || null,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error in register route:", error);
		console.error("Error details:", {
			message: error.message,
			code: error.code,
			meta: error.meta,
		});
		return NextResponse.json(
			{ 
				error: "Registration failed. Please try again.",
				details: process.env.NODE_ENV === "development" ? error.message : undefined
			},
			{ status: 500 }
		);
	}
}

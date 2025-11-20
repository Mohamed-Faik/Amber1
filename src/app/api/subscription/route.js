import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
	const body = await request.json();
	const { email } = body;

	const existingEmail = await prisma.subscription.findFirst({
		where: { email: email },
	});

	if (existingEmail) {
		return NextResponse.json(
			{ message: "Email already exist?" },
			{ status: 422 }
		);
	}

	const subscription = await prisma.subscription.create({
		data: {
			email,
		},
	});

	return NextResponse.json(subscription);
}

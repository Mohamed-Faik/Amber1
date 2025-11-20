import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
	try {
		const body = await request.json();
		const { email } = body;

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		return NextResponse.json({
			exists: !!existingUser,
		});
	} catch (error) {
		console.error("Error in check-email route:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prismadb";

/**
 * API route to get pending listings count
 * Only accessible to admin users
 */
export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is admin
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Check if user is admin
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: { role: true },
		});

		if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
			return NextResponse.json(
				{ error: "Forbidden" },
				{ status: 403 }
			);
		}

		// Get pending listings count
		const pendingCount = await prisma.listing.count({
			where: {
				status: "Pending",
			},
		});

		return NextResponse.json({ count: pendingCount });
	} catch (error) {
		console.error("Error fetching pending listings count:", error);
		return NextResponse.json(
			{ error: "Internal server error", count: 0 },
			{ status: 500 }
		);
	}
}


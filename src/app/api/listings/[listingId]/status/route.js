import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PATCH(request, { params }) {
	const currentUser = await getCurrentUser();
	
	// Check if user is admin
	if (!currentUser || currentUser.role !== "ADMIN") {
		return NextResponse.json(
			{ message: "Unauthorized! Admin access required." },
			{ status: 401 }
		);
	}

	const { listingId } = params;
	const body = await request.json();
	const { status } = body;

	// Validate status
	if (status !== "Approved" && status !== "Pending" && status !== "Canceled") {
		return NextResponse.json(
			{ message: "Invalid status. Must be 'Approved', 'Pending', or 'Canceled'." },
			{ status: 400 }
		);
	}

	try {
		const listing = await prisma.listing.update({
			where: {
				id: parseInt(listingId, 10),
			},
			data: {
				status: status,
			},
		});

		return NextResponse.json({
			message: `Listing ${status.toLowerCase()} successfully!`,
			listing,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to update listing status.", error: error.message },
			{ status: 500 }
		);
	}
}


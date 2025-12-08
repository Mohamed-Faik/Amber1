import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PATCH(request, { params }) {
	const currentUser = await getCurrentUser();
	
	// Check if user is admin
	const { isModerator } = await import("@/utils/checkRole");
	if (!isModerator(currentUser)) {
		return NextResponse.json(
			{ message: "Unauthorized! Admin access required." },
			{ status: 401 }
		);
	}

	const { listingId } = params;
	const body = await request.json();
	const { status } = body;

	// Validate status
	if (status !== "Approved" && status !== "Pending" && status !== "Canceled" && status !== "Sold") {
		return NextResponse.json(
			{ message: "Invalid status. Must be 'Approved', 'Pending', 'Sold', or 'Canceled'." },
			{ status: 400 }
		);
	}

	try {
		// Get the listing first to check if status is changing
		const existingListing = await prisma.listing.findUnique({
			where: {
				id: parseInt(listingId, 10),
			},
			select: {
				id: true,
				status: true,
				userId: true,
			},
		});

		if (!existingListing) {
			return NextResponse.json(
				{ message: "Listing not found." },
				{ status: 404 }
			);
		}

		// Update listing status
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


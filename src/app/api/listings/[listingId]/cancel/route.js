import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

// Allow users to cancel their own listings
export async function PATCH(request, { params }) {
	const currentUser = await getCurrentUser();
	
	if (!currentUser) {
		return NextResponse.json(
			{ message: "Unauthorized! Please login." },
			{ status: 401 }
		);
	}

	const { listingId } = params;

	try {
		// Check if listing exists and belongs to user
		const listing = await prisma.listing.findUnique({
			where: {
				id: parseInt(listingId, 10),
			},
		});

		if (!listing) {
			return NextResponse.json(
				{ message: "Listing not found." },
				{ status: 404 }
			);
		}

		// Check if user owns the listing or is admin
		if (listing.userId !== currentUser.id && currentUser.role !== "ADMIN") {
			return NextResponse.json(
				{ message: "Unauthorized! You can only cancel your own listings." },
				{ status: 403 }
			);
		}

		// Update listing status to Canceled
		const updatedListing = await prisma.listing.update({
			where: {
				id: parseInt(listingId, 10),
			},
			data: {
				status: "Canceled",
			},
		});

		return NextResponse.json({
			message: "Listing canceled successfully!",
			listing: updatedListing,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to cancel listing.", error: error.message },
			{ status: 500 }
		);
	}
}


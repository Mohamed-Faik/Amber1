import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function PATCH(request, { params }) {
	try {
		const { listingId } = params;
		const body = await request.json();
		const { isPremium } = body;

		if (!listingId) {
			return NextResponse.json(
				{ error: "Listing ID is required" },
				{ status: 400 }
			);
		}

		if (typeof isPremium !== "boolean") {
			return NextResponse.json(
				{ error: "isPremium must be a boolean value" },
				{ status: 400 }
			);
		}

		// Update the listing's premium status
		const updatedListing = await prisma.listing.update({
			where: {
				id: parseInt(listingId),
			},
			data: {
				isPremium: isPremium,
			},
		});

		return NextResponse.json(
			{
				message: `Listing ${isPremium ? "marked" : "unmarked"} as premium successfully`,
				listing: updatedListing,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating listing premium status:", error);
		return NextResponse.json(
			{ error: "Failed to update listing premium status" },
			{ status: 500 }
		);
	}
}


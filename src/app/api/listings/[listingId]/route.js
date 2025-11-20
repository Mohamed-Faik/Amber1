import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

export async function DELETE(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { listingId } = params;
	if (!listingId) {
		throw new Error("Invalid ID");
	}

	// const findListing = await prisma.listing.findUnique({
	// 	where: {
	// 		id: parseInt(listingId),
	// 	},
	// });
	// if (!findListing) {
	// 	throw new Error("Not found!");
	// }
	const deletedListing = await prisma.listing.delete({
		where: {
			id: parseInt(listingId),
		},
	});

	return NextResponse.json(deletedListing);
}

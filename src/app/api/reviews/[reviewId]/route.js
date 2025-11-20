import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

export async function DELETE(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { reviewId } = params;
	if (!reviewId) {
		throw new Error("Invalid ID");
	}

	const deletedReview = await prisma.review.delete({
		where: {
			id: parseInt(reviewId),
		},
	});

	return NextResponse.json(deletedReview);
}

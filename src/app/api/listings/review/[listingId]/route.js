import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

export async function POST(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { listingId } = params;

	if (!listingId) {
		throw new Error("Invalid ID");
	}

	const body = await request.json();

	const { rating, comment } = body;

	const review = await prisma.review.create({
		data: {
			userId: currentUser.id,
			listingId: parseInt(listingId),
			rating: parseInt(rating.value),
			comment: comment,
		},
	});

	return NextResponse.json(review);
}

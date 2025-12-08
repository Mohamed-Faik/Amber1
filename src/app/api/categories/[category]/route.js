import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(request, { params }) {
	const { category } = params;

	const categories = await prisma.listing.findMany({
		where: {
			category: {
				contains: category,
			},
		},
		select: {
			id: true,
			category: true,
		},
		distinct: ["category"],
	});

	return NextResponse.json(categories);
}

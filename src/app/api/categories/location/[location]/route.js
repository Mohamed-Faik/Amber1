import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(request, { params }) {
	const { location } = params;

	const locations = await prisma.listing.findMany({
		where: {
			location_value: {
				contains: location,
			},
		},
		select: {
			id: true,
			location_value: true,
		},
		distinct: ["location_value"],
	});

	return NextResponse.json(locations);
}

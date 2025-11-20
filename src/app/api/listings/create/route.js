import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { slugify } from "@/utils/slugify";

export async function POST(request) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.json(
			{ message: "Authentication faild!" },
			{ status: 401 }
		);
	}

	const body = await request.json();
	const {
		title,
		description,
		imageSrc,
		address,
		features,
		category,
		location,
		price,
		area,
		bedrooms,
		bathrooms,
	} = body;

	let slug = slugify(title);
	const slugExist = await prisma.listing.findFirst({
		where: {
			slug: slug,
		},
	});

	if (slugExist) {
		slug = `${slug}-${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`;
	}

	Object.keys(body).forEach((value) => {
		if (!body[value]) {
			NextResponse.json(
				{
					message: "One or more fileds are empty!",
				},
				{ status: 404 }
			);
		}
	});

	// Handle imageSrc - can be JSON string (array) or single string for backward compatibility
	let imageSrcValue = imageSrc;
	if (typeof imageSrc === "string") {
		try {
			const parsed = JSON.parse(imageSrc);
			if (Array.isArray(parsed) && parsed.length > 0) {
				imageSrcValue = JSON.stringify(parsed);
			}
		} catch (e) {
			imageSrcValue = imageSrc;
		}
	} else if (Array.isArray(imageSrc) && imageSrc.length > 0) {
		imageSrcValue = JSON.stringify(imageSrc);
	}

	const listing = await prisma.listing.create({
		data: {
			title,
			slug,
			description,
			imageSrc: imageSrcValue,
			address,
			features,
			category,
			location_value: location.label,
			price: parseInt(price, 10),
			latitude: location.latlng[0],
			longitude: location.latlng[1],
			userId: currentUser.id,
			status: "Pending", // Explicitly set to Pending - requires admin approval
			area: area ? parseInt(area, 10) : null,
			bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
			bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
		},
	});

	return NextResponse.json(listing);
}

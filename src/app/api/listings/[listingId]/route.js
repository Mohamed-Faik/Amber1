import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { slugify } from "@/utils/slugify";

export async function DELETE(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { listingId } = params;
	if (!listingId) {
		throw new Error("Invalid ID");
	}

	const deletedListing = await prisma.listing.delete({
		where: {
			id: parseInt(listingId),
		},
	});

	return NextResponse.json(deletedListing);
}

export async function PATCH(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ message: "Authentication required" }, { status: 401 });
	}

	const listingId = parseInt(params.listingId, 10);
	if (!listingId || Number.isNaN(listingId)) {
		return NextResponse.json({ message: "Invalid listing id" }, { status: 400 });
	}

	const existingListing = await prisma.listing.findUnique({
		where: { id: listingId },
	});

	if (!existingListing) {
		return NextResponse.json({ message: "Listing not found" }, { status: 404 });
	}

	const isOwner = existingListing.userId === currentUser.id;
	const isAdmin = currentUser.role === "ADMIN";

	if (!isOwner && !isAdmin) {
		return NextResponse.json({ message: "Not authorized to edit this listing" }, { status: 403 });
	}

	const body = await request.json();
	const {
		title,
		description,
		imageSrc,
		address,
		features,
		category,
		listingType,
		location,
		price,
		area,
		bedrooms,
		bathrooms,
	} = body;

	if (!title || !description || !imageSrc || !address || !category || !listingType || !location || !price) {
		return NextResponse.json({ message: "One or more required fields are empty!" }, { status: 400 });
	}

	// Validate listing type
	if (listingType !== "SALE" && listingType !== "RENT" && listingType !== "DAILY_RENT") {
		return NextResponse.json(
			{ message: "Invalid listing type. Must be SALE, RENT, or DAILY_RENT." },
			{ status: 400 }
		);
	}

	if (!location.label || !location.latlng || !Array.isArray(location.latlng) || location.latlng.length < 2) {
		return NextResponse.json(
			{ message: "Invalid location data. Please select a valid location." },
			{ status: 400 }
		);
	}

	let imageSrcValue = imageSrc;
	if (typeof imageSrc === "string") {
		try {
			const parsed = JSON.parse(imageSrc);
			if (Array.isArray(parsed) && parsed.length > 0) {
				imageSrcValue = JSON.stringify(parsed);
			}
		} catch (error) {
			imageSrcValue = imageSrc;
		}
	} else if (Array.isArray(imageSrc) && imageSrc.length > 0) {
		imageSrcValue = JSON.stringify(imageSrc);
	}

	const parseOptionalInt = (value) => {
		if (value === "" || value === null || value === undefined) {
			return null;
		}
		const parsed = parseInt(value, 10);
		return Number.isNaN(parsed) ? null : parsed;
	};

	let slug = existingListing.slug;
	if (title !== existingListing.title) {
		let nextSlug = slugify(title);
		const slugExists = await prisma.listing.findFirst({
			where: {
				slug: nextSlug,
				NOT: { id: listingId },
			},
		});
		if (slugExists) {
			nextSlug = `${nextSlug}-${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`;
		}
		slug = nextSlug;
	}

	const shouldResetStatus = existingListing.status === "Approved";
	const listing = await prisma.listing.update({
		where: { id: listingId },
		data: {
			title,
			slug,
			description,
			imageSrc: imageSrcValue,
			address,
			features: features || "",
			category,
			listingType: listingType || existingListing.listingType || "SALE",
			location_value: location.label,
			price: parseInt(price, 10),
			latitude: location.latlng[0],
			longitude: location.latlng[1],
			area: parseOptionalInt(area),
			bedrooms: parseOptionalInt(bedrooms),
			bathrooms: parseOptionalInt(bathrooms),
			status: shouldResetStatus ? "Pending" : existingListing.status,
		},
	});

	return NextResponse.json(listing);
}

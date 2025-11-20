import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { slugify } from "@/utils/slugify";
import { isModerator } from "@/utils/checkRole";

export async function POST(request) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return NextResponse.json(
				{ message: "Authentication failed!" },
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

		// Validate required fields
		if (!title || !description || !imageSrc || !address || !category || !location || !price) {
			return NextResponse.json(
				{ message: "One or more required fields are empty!" },
				{ status: 400 }
			);
		}

		// Validate location object
		if (!location.label || !location.latlng || !Array.isArray(location.latlng) || location.latlng.length < 2) {
			return NextResponse.json(
				{ message: "Invalid location data. Please select a valid location." },
				{ status: 400 }
			);
		}

		// Validate imageSrc
		if (!imageSrc || (Array.isArray(imageSrc) && imageSrc.length === 0)) {
			return NextResponse.json(
				{ message: "Please upload at least one image." },
				{ status: 400 }
			);
		}

		let slug = slugify(title);
		const slugExist = await prisma.listing.findFirst({
			where: {
				slug: slug,
			},
		});

		if (slugExist) {
			slug = `${slug}-${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`;
		}

		// Handle imageSrc - can be JSON string (array) or single string for backward compatibility
		let imageSrcValue = imageSrc;
		if (typeof imageSrc === "string") {
			try {
				const parsed = JSON.parse(imageSrc);
				if (Array.isArray(parsed) && parsed.length > 0) {
					imageSrcValue = JSON.stringify(parsed);
				} else {
					imageSrcValue = imageSrc;
				}
			} catch (e) {
				imageSrcValue = imageSrc;
			}
		} else if (Array.isArray(imageSrc) && imageSrc.length > 0) {
			imageSrcValue = JSON.stringify(imageSrc);
		}

		// Helper function to safely parse integers
		const parseOptionalInt = (value) => {
			if (!value || value === "" || value === null || value === undefined) {
				return null;
			}
			const parsed = parseInt(value, 10);
			return isNaN(parsed) ? null : parsed;
		};

		// Determine listing status: Moderators and Admins get auto-approved
		const listingStatus = isModerator(currentUser) ? "Approved" : "Pending";

		const listingData = {
			title,
			slug,
			description,
			imageSrc: imageSrcValue,
			address,
			features: features || "",
			category,
			location_value: location.label,
			price: parseInt(price, 10),
			latitude: location.latlng[0],
			longitude: location.latlng[1],
			userId: currentUser.id,
			status: listingStatus, // Auto-approved for moderators/admins, Pending for regular users
			area: parseOptionalInt(area),
			bedrooms: parseOptionalInt(bedrooms),
			bathrooms: parseOptionalInt(bathrooms),
		};

		// Log the data being sent (for debugging)
		console.log("Creating listing with data:", {
			...listingData,
			description: listingData.description?.substring(0, 100) + "...",
			features: listingData.features?.substring(0, 100) + "...",
			imageSrc: listingData.imageSrc?.substring(0, 100) + "..."
		});

		const listing = await prisma.listing.create({
			data: listingData,
		});

		return NextResponse.json(listing);
	} catch (error) {
		console.error("Error creating listing:", error);
		console.error("Error details:", {
			message: error.message,
			code: error.code,
			meta: error.meta,
			stack: error.stack
		});
		return NextResponse.json(
			{ 
				message: error.message || "Failed to create listing. Please try again.",
				error: process.env.NODE_ENV === "development" ? {
					message: error.message,
					code: error.code,
					meta: error.meta,
					stack: error.stack
				} : undefined
			},
			{ status: 500 }
		);
	}
}

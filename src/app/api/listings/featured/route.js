import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(request) {
	try {
		// Check if DATABASE_URL is set
		if (!process.env.DATABASE_URL) {
			console.error("❌ DATABASE_URL environment variable is not set!");
			return NextResponse.json(
				{
					error: "Database configuration error",
					message: "DATABASE_URL environment variable is not set. Please configure it in Vercel settings.",
					details: "This usually happens when environment variables are not set in Vercel deployment settings.",
				},
				{ status: 500 }
			);
		}

		const category = request.nextUrl.searchParams.get("category") || "all";

		console.log("📡 Featured listings API called with category:", category);
		console.log("🔍 Environment check:", {
			hasDatabaseUrl: !!process.env.DATABASE_URL,
			nodeEnv: process.env.NODE_ENV,
		});

		let listings;

	try {
	if (category === "all") {
		listings = await prisma.listing.findMany({
			where: {
				status: { in: ["Approved", "Sold"] }, // Show approved and sold listings on home page
				featureType: "HOMES", // Only show HOMES on the home page
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					},
				},
			},
			orderBy: {
				created_at: "desc",
			},
			take: 100, // Get more listings for multiple sections
		});
	} else {
		listings = await prisma.listing.findMany({
			where: {
				category: category,
				status: { in: ["Approved", "Sold"] }, // Show approved and sold listings on home page
				featureType: "HOMES", // Only show HOMES on the home page
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					},
				},
			},
			orderBy: {
				created_at: "desc",
			},
			take: 100,
		});
	}
		} catch (dbError) {
			console.error("❌ Database query error:", dbError);
			console.error("   Error code:", dbError.code);
			console.error("   Error message:", dbError.message);
			
			// Check for specific Prisma errors
			if (dbError.code === "P1001") {
				return NextResponse.json(
					{
						error: "Database connection failed",
						message: "Unable to connect to the database server. Please check your DATABASE_URL configuration in Vercel.",
						code: dbError.code,
					},
					{ status: 503 }
				);
			}

			if (dbError.code === "P2025") {
				// Record not found - return empty array
				return NextResponse.json([]);
			}

			// For other database errors, return error response
			return NextResponse.json(
				{
					error: "Database query error",
					message: dbError.message || "An error occurred while fetching listings.",
					code: dbError.code,
				},
				{ status: 500 }
			);
		}

		console.log("✅ Found listings:", listings.length);
		if (listings.length > 0) {
			console.log("📋 Sample listing:", {
				id: listings[0].id,
				title: listings[0].title,
				location: listings[0].location_value,
				status: listings[0].status,
				imageSrc: listings[0].imageSrc?.substring(0, 100) + "...",
			});
		} else {
			console.warn("⚠️  No approved listings found. Check if listings have status='Approved'");
			// Log count of all listings by status for debugging (but don't fail if this fails)
			try {
				const statusCounts = await prisma.listing.groupBy({
					by: ["status"],
					_count: true,
				});
				console.log("📊 Listings by status:", statusCounts);
			} catch (err) {
				console.warn("⚠️  Could not fetch status counts:", err.message);
			}
			// Return empty array if no listings found (this is normal, not an error)
			return NextResponse.json([]);
		}

	// Return listings with user data
	// Format the response to match what the frontend expects
	const formattedListings = listings.map((listing) => ({
		id: listing.id,
		title: listing.title,
		slug: listing.slug,
		imageSrc: listing.imageSrc,
		category: listing.category,
		price: listing.price,
		location_value: listing.location_value,
		address: listing.address,
		created_at: listing.created_at,
		userId: listing.userId,
		user: listing.user, // Include user data for profile display
		area: listing.area,
		bedrooms: listing.bedrooms,
		bathrooms: listing.bathrooms,
		listingType: listing.listingType || "SALE", // Include listingType field
		featureType: listing.featureType || "HOMES", // Include featureType field
		status: listing.status, // Include status field for SOLD badge
		isPremium: listing.isPremium || false, // Include isPremium field
		// Add default rating if not available (can be calculated from reviews later)
		rating: null,
	}));

		console.log("📤 Returning formatted listings:", formattedListings.length);
		return NextResponse.json(formattedListings);
	} catch (error) {
		console.error("❌ Unexpected error in featured listings API:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.code);
		console.error("   Error stack:", error.stack);
		
		// Return proper error response instead of empty array
		return NextResponse.json(
			{
				error: "Internal server error",
				message: error.message || "An unexpected error occurred while fetching listings.",
				code: error.code,
			},
			{ status: 500 }
		);
	}
}

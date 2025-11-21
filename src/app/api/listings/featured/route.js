import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(request) {
	try {
		const category = request.nextUrl.searchParams.get("category") || "all";

		console.log("📡 Featured listings API called with category:", category);

		let listings;

		if (category === "all") {
			listings = await prisma.listing.findMany({
				where: {
					status: "Approved", // Only show approved listings on home page
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
					status: "Approved", // Only show approved listings on home page
				},
				orderBy: {
					created_at: "desc",
				},
				take: 100,
			});
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
			// Log count of all listings by status for debugging
			const statusCounts = await prisma.listing.groupBy({
				by: ["status"],
				_count: true,
			});
			console.log("📊 Listings by status:", statusCounts);
		}

		// Return listings (user data is not critical for display)
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
			area: listing.area,
			bedrooms: listing.bedrooms,
			bathrooms: listing.bathrooms,
			// Add default rating if not available (can be calculated from reviews later)
			rating: null,
		}));

		console.log("📤 Returning formatted listings:", formattedListings.length);
		return NextResponse.json(formattedListings);
	} catch (error) {
		console.error("❌ Error fetching featured listings:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.code);
		console.error("   Error stack:", error.stack);
		
		// Database connection error - return empty array instead of 500 error
		if (error.message?.includes("Can't reach database server") || 
		    error.code === "P1001") {
			console.warn("⚠️  Database connection error - returning empty array");
			return NextResponse.json([]);
		}

		// For other errors, also return empty array to prevent app crash
		console.warn("⚠️  Failed to fetch listings - returning empty array");
		return NextResponse.json([]);
	}
}

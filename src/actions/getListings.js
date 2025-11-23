import prisma from "@/libs/prismadb";

export default async function getListings(params) {
	try {
		const {
			category,
			location_value,
			title,
			min_price,
			max_price,
			listingType, // Filter by SALE or RENT
			page = 1,
			pageSize = 9,
			status, // For admin filtering
			showAll = false, // For admin to see all listings
		} = params;

		const parsedPage = parseInt(page, 10);
		const parsedPageSize = parseInt(pageSize, 10);

		// Build where clause
		const whereClause = {};

		// Title search
		if (title) {
			whereClause.title = { contains: title };
		}

		// Category filter
		if (category) {
			whereClause.category = category;
		}

		// Location filter
		if (location_value) {
			whereClause.location_value = location_value;
		}

		// Listing type filter (SALE, RENT, or DAILY_RENT)
		if (listingType && (listingType === "SALE" || listingType === "RENT" || listingType === "DAILY_RENT")) {
			whereClause.listingType = listingType;
		}

		// Price filter
		if (min_price || max_price) {
			whereClause.price = {};
			if (min_price) {
				const minPrice = parseInt(min_price, 10);
				if (!isNaN(minPrice)) {
					whereClause.price.gte = minPrice;
				}
			}
			if (max_price) {
				const maxPrice = parseInt(max_price, 10);
				if (!isNaN(maxPrice)) {
					whereClause.price.lte = maxPrice;
				}
			}
		}

		// Status filter - only show approved for public, unless admin wants to see all
		// For public users, only show Approved listings
		if (!showAll && !status) {
			whereClause.status = "Approved"; // Only show approved listings to public users
		} else if (status) {
			// Admin filtering by specific status
			whereClause.status = status;
		}
		// If showAll is true and no status filter, admin sees all (including null/undefined status)

		const skip = (parsedPage - 1) * parsedPageSize;
		const totalListings = await prisma.listing.count({
			where: whereClause,
		});
		const totalPages = Math.ceil(totalListings / parsedPageSize);

		const listings = await prisma.listing.findMany({
			where: whereClause,
			skip: skip,
			take: parsedPageSize,
			orderBy: {
				created_at: "desc",
			},
		});

		// Fetch user information for each listing separately if needed
		const listingsWithUser = await Promise.all(
			listings.map(async (listing) => {
				try {
					const user = await prisma.user.findUnique({
						where: { id: listing.userId },
						select: {
							name: true,
							id: true,
							image: true,
						},
					});

					return {
						...listing,
						user: user || null,
					};
				} catch (error) {
					console.error(`Error fetching user for listing ${listing.id}:`, error);
					return {
						...listing,
						user: null,
					};
				}
			})
		);

		const startListingNumber = skip + 1;
		const endListingNumber = Math.min(skip + parsedPageSize, totalListings);

		return {
			listings: listingsWithUser,
			totalPages,
			startListingNumber,
			endListingNumber,
			totalListings,
		};
	} catch (error) {
		console.error("❌ Error fetching listings:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.code);
		console.error("   Error stack:", error.stack);
		
		// Database connection error - return empty result instead of crashing
		if (error.message?.includes("Can't reach database server") || 
		    error.code === "P1001") {
			console.warn("⚠️  Database connection error - returning empty result");
			return {
				listings: [],
				totalPages: 0,
				startListingNumber: 0,
				endListingNumber: 0,
				totalListings: 0,
			};
		}
		
		// For other errors, also return empty result to prevent app crash
		console.warn("⚠️  Failed to fetch listings - returning empty result");
		return {
			listings: [],
			totalPages: 0,
			startListingNumber: 0,
			endListingNumber: 0,
			totalListings: 0,
		};
	}
}

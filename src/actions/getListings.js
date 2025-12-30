import prisma from "@/libs/prismadb";

export default async function getListings(params) {
	try {
		const {
			category,
			location_value,
			title,
			min_price: minPriceParam,
			max_price: maxPriceParam,
			minPrice, // Backward compatibility
			maxPrice, // Backward compatibility
			bedrooms,
			bathrooms,
			listingType, // Filter by SALE or RENT
			featureType, // Filter by HOMES, EXPERIENCES, or SERVICES
			page = 1,
			pageSize = 9,
			status, // For admin filtering
			showAll = false, // For admin to see all listings
			// Dynamic filters
			gatedCommunity,
			elevator,
			securitySystem,
			heating,
			airConditioning,
			equippedKitchen,
			balcony,
			terrace,
			privateGarden,
			swimmingPool,
			greenSpaces,
			garageBox,
			parkingSpaces,
			basement,
		} = params;

		// Support both min_price and minPrice for backward compatibility
		const min_price = minPriceParam || minPrice;
		const max_price = maxPriceParam || maxPrice;

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

		// Location filter - use contains to support neighborhood search
		if (location_value) {
			whereClause.location_value = {
				contains: location_value,
			};
		}

		// Listing type filter (SALE, RENT, or DAILY_RENT)
		if (listingType && (listingType === "SALE" || listingType === "RENT" || listingType === "DAILY_RENT")) {
			whereClause.listingType = listingType;
		}

		// Feature type filter (HOMES, EXPERIENCES, or SERVICES)
		if (featureType && (featureType === "HOMES" || featureType === "EXPERIENCES" || featureType === "SERVICES")) {
			whereClause.featureType = featureType;
		}
		// Note: If no featureType is specified, show all types (for backward compatibility)


		// Dynamic Boolean Filters
		if (gatedCommunity === "true") whereClause.gatedCommunity = true;
		if (elevator === "true") whereClause.elevator = true;
		if (securitySystem === "true") whereClause.securitySystem = true;
		if (heating === "true") whereClause.heating = true;
		if (airConditioning === "true") whereClause.airConditioning = true;
		if (equippedKitchen === "true") whereClause.equippedKitchen = true;
		if (balcony === "true") whereClause.balcony = true;
		if (terrace === "true") whereClause.terrace = true;
		if (privateGarden === "true") whereClause.privateGarden = true;
		if (swimmingPool === "true") whereClause.swimmingPool = true;
		if (greenSpaces === "true") whereClause.greenSpaces = true;
		if (garageBox === "true") whereClause.garageBox = true;
		if (parkingSpaces === "true") whereClause.parkingSpaces = true;
		if (basement === "true") whereClause.basement = true;

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

		// Bedrooms filter
		if (bedrooms) {
			if (bedrooms === "5+") {
				whereClause.bedrooms = { gte: 5 };
			} else {
				const bedroomsCount = parseInt(bedrooms, 10);
				if (!isNaN(bedroomsCount)) {
					whereClause.bedrooms = bedroomsCount;
				}
			}
		}

		// Bathrooms filter
		if (bathrooms) {
			if (bathrooms === "5+") {
				whereClause.bathrooms = { gte: 5 };
			} else {
				const bathroomsCount = parseInt(bathrooms, 10);
				if (!isNaN(bathroomsCount)) {
					whereClause.bathrooms = bathroomsCount;
				}
			}
		}

		// Status filter - only show approved and sold for public, unless admin wants to see all
		// For public users, show Approved and Sold listings
		if (!showAll && !status) {
			whereClause.status = { in: ["Approved", "Sold"] }; // Show approved and sold listings to public users
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

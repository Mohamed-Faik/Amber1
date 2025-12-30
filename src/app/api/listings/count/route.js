import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Build where clause
        const whereClause = {};

        // Feature type filter (HOMES)
        const featureType = searchParams.get('featureType');
        if (featureType && (featureType === "HOMES" || featureType === "EXPERIENCES" || featureType === "SERVICES")) {
            whereClause.featureType = featureType;
        }

        // Dynamic Boolean Filters
        if (searchParams.get('gatedCommunity') === "true") whereClause.gatedCommunity = true;
        if (searchParams.get('elevator') === "true") whereClause.elevator = true;
        if (searchParams.get('securitySystem') === "true") whereClause.securitySystem = true;
        if (searchParams.get('heating') === "true") whereClause.heating = true;
        if (searchParams.get('airConditioning') === "true") whereClause.airConditioning = true;
        if (searchParams.get('equippedKitchen') === "true") whereClause.equippedKitchen = true;
        if (searchParams.get('balcony') === "true") whereClause.balcony = true;
        if (searchParams.get('terrace') === "true") whereClause.terrace = true;
        if (searchParams.get('privateGarden') === "true") whereClause.privateGarden = true;
        if (searchParams.get('swimmingPool') === "true") whereClause.swimmingPool = true;
        if (searchParams.get('greenSpaces') === "true") whereClause.greenSpaces = true;
        if (searchParams.get('garageBox') === "true") whereClause.garageBox = true;
        if (searchParams.get('parkingSpaces') === "true") whereClause.parkingSpaces = true;
        if (searchParams.get('basement') === "true") whereClause.basement = true;

        // Price filter
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) {
                const min = parseInt(minPrice, 10);
                if (!isNaN(min)) {
                    whereClause.price.gte = min;
                }
            }
            if (maxPrice) {
                const max = parseInt(maxPrice, 10);
                if (!isNaN(max)) {
                    whereClause.price.lte = max;
                }
            }
        }

        // Bedrooms filter
        const bedrooms = searchParams.get('bedrooms');
        if (bedrooms) {
            const bedroomsCount = parseInt(bedrooms, 10);
            if (!isNaN(bedroomsCount) && bedroomsCount > 0) {
                whereClause.bedrooms = bedroomsCount;
            }
        }

        // Beds filter
        const beds = searchParams.get('beds');
        if (beds) {
            const bedsCount = parseInt(beds, 10);
            if (!isNaN(bedsCount) && bedsCount > 0) {
                whereClause.beds = bedsCount;
            }
        }

        // Bathrooms filter
        const bathrooms = searchParams.get('bathrooms');
        if (bathrooms) {
            const bathroomsCount = parseInt(bathrooms, 10);
            if (!isNaN(bathroomsCount) && bathroomsCount > 0) {
                whereClause.bathrooms = bathroomsCount;
            }
        }

        // Status filter - only show approved and sold for public
        whereClause.status = { in: ["Approved", "Sold"] };

        const count = await prisma.listing.count({
            where: whereClause,
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error("Error counting listings:", error);
        return NextResponse.json({ count: 0 }, { status: 500 });
    }
}

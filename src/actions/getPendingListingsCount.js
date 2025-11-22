import prisma from "@/libs/prismadb";

/**
 * Get the count of pending listings awaiting admin approval
 * @returns {Promise<number>} Number of pending listings
 */
export default async function getPendingListingsCount() {
	try {
		const pendingCount = await prisma.listing.count({
			where: {
				status: "Pending",
			},
		});
		return pendingCount;
	} catch (error) {
		console.error("Database connection error in getPendingListingsCount:", error);
		// Return 0 instead of throwing to prevent page crash
		return 0;
	}
}


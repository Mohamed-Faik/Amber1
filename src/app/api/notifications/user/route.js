import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prismadb";

/**
 * API route to get notifications for regular users
 * Returns notifications for:
 * - When someone favorites their listing
 * - When their listing gets approved
 */
export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Get current user
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: { id: true, role: true },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		const notifications = [];

		// Get user's listings
		const userListings = await prisma.listing.findMany({
			where: { userId: user.id },
			select: { id: true, title: true, slug: true, status: true },
		});

		const listingIds = userListings.map(l => l.id);

		if (listingIds.length > 0) {
			// Calculate date ranges for queries
			const sevenDaysAgo = new Date();
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
			
			// Use 30 days for approved listings to catch listings that were created earlier but approved recently
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

			// Get recent favorites on user's listings (last 7 days)

			const recentFavourites = await prisma.favourite.findMany({
				where: {
					listingId: { in: listingIds },
					created_at: {
						gte: sevenDaysAgo,
					},
					// Exclude if the user favorited their own listing
					userId: { not: user.id },
				},
				orderBy: {
					created_at: "desc",
				},
				take: 20,
				select: {
					id: true,
					listingId: true,
					created_at: true,
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
				},
			});

			// Add favorite notifications
			recentFavourites.forEach((favourite) => {
				const listing = userListings.find(l => l.id === favourite.listingId);
				if (listing) {
					notifications.push({
						id: `favorite-${favourite.id}`,
						type: "listing_favorited",
						title: "Your Listing Was Favorited",
						message: `${favourite.user?.name || favourite.user?.email || "Someone"} favorited your listing "${listing.title}"`,
						createdAt: favourite.created_at.toISOString(),
						unread: true,
						listingId: listing.id,
						listingSlug: listing.slug,
						userImage: favourite.user?.image,
						userName: favourite.user?.name || favourite.user?.email || "User",
					});
				}
			});

			// Get all approved listings that belong to the user
			// Since we can't track when status changed (no updated_at field),
			// we'll show all approved listings created in last 60 days
			// This ensures users see their approved listings even if approval was delayed
			const sixtyDaysAgo = new Date();
			sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

			const approvedListings = await prisma.listing.findMany({
				where: {
					userId: user.id,
					status: "Approved",
					created_at: {
						gte: sixtyDaysAgo,
					},
				},
				orderBy: {
					created_at: "desc",
				},
				take: 50, // Get more to ensure we catch recent approvals
				select: {
					id: true,
					title: true,
					slug: true,
					status: true,
					created_at: true,
				},
			});

			// Add approval notifications for all approved listings
			// This will show users their approved listings so they know they're live
			// Note: Without updated_at field, we show all approved listings created recently
			// For more accurate tracking, consider adding updated_at to schema or a notification table
			approvedListings.forEach((listing) => {
				// Only show if created in last 60 days to avoid showing very old listings
				notifications.push({
					id: `approved-${listing.id}`,
					type: "listing_approved",
					title: "Your Listing Was Approved",
					message: `Your listing "${listing.title}" has been approved and is now live!`,
					createdAt: listing.created_at.toISOString(),
					unread: true,
					listingId: listing.id,
					listingSlug: listing.slug,
				});
			});
		}

		// Sort notifications by date (newest first)
		notifications.sort((a, b) => {
			return new Date(b.createdAt) - new Date(a.createdAt);
		});

		// Limit to most recent 20 notifications
		const limitedNotifications = notifications.slice(0, 20);

		return NextResponse.json({ 
			notifications: limitedNotifications,
			totalCount: notifications.length,
		});
	} catch (error) {
		console.error("Error fetching user notifications:", error);
		return NextResponse.json(
			{ error: "Internal server error", notifications: [] },
			{ status: 500 }
		);
	}
}


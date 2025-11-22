import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prismadb";

/**
 * API route to get all notifications for admin users
 * Returns notifications for new users and pending listings
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

		// Check if user is admin
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: { role: true },
		});

		if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
			return NextResponse.json(
				{ error: "Forbidden" },
				{ status: 403 }
			);
		}

		const notifications = [];

		// Get recent users (last 24 hours)
		const oneDayAgo = new Date();
		oneDayAgo.setHours(oneDayAgo.getHours() - 24);

		const recentUsers = await prisma.user.findMany({
			where: {
				created_at: {
					gte: oneDayAgo,
				},
			},
			orderBy: {
				created_at: "desc",
			},
			take: 10,
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				created_at: true,
			},
		});

		// Add new user notifications
		recentUsers.forEach((user) => {
			notifications.push({
				id: `user-${user.id}`,
				type: "new_user",
				title: "New User Registered",
				message: `${user.name || user.email || "A new user"} has registered on the website`,
				createdAt: user.created_at.toISOString(),
				unread: true,
				userId: user.id,
				userImage: user.image,
				userName: user.name || user.email || "User",
			});
		});

		// Get pending listings
		const pendingListings = await prisma.listing.findMany({
			where: {
				status: "Pending",
			},
			orderBy: {
				created_at: "desc",
			},
			take: 10,
			select: {
				id: true,
				title: true,
				slug: true,
				created_at: true,
				user: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		});

		// Add new listing notifications
		pendingListings.forEach((listing) => {
			notifications.push({
				id: `listing-${listing.id}`,
				type: "new_listing",
				title: "New Listing Pending Approval",
				message: `"${listing.title}" by ${listing.user?.name || listing.user?.email || "Unknown"} needs your review`,
				createdAt: listing.created_at.toISOString(),
				unread: true,
				listingId: listing.id,
				listingSlug: listing.slug,
			});
		});

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
		console.error("Error fetching notifications:", error);
		return NextResponse.json(
			{ error: "Internal server error", notifications: [] },
			{ status: 500 }
		);
	}
}


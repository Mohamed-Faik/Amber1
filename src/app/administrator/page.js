import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/getCurrentUser";
import AdministratorPanel from "@/components/Administrator/AdministratorPanel";
import getListings from "@/actions/getListings";
import getAllUsers from "@/actions/getAllUser";
import getBlogPosts from "@/actions/getBlogPosts";
import prisma from "@/libs/prismadb";

export const dynamic = "force-dynamic";

const AdministratorPage = async () => {
	const currentUser = await getCurrentUser();
	const { hasAdminAccess } = await import("@/utils/checkRole");
	
	if (!hasAdminAccess(currentUser)) {
		redirect("/");
	}

	// Fetch all data
	const { listings } = await getListings({ showAll: true });
	const users = await getAllUsers();
	const blogPosts = await getBlogPosts();
	
	// Fetch reviews and manually join with user and listing data
	const reviewsData = await prisma.review.findMany({
		orderBy: {
			created_at: "desc",
		},
	});

	// Get unique user IDs and listing IDs
	const userIds = [...new Set(reviewsData.map((r) => r.userId))];
	const listingIds = [...new Set(reviewsData.map((r) => r.listingId))];

	// Fetch users and listings
	const reviewUsers = await prisma.user.findMany({
		where: { id: { in: userIds } },
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	});

	const reviewListings = await prisma.listing.findMany({
		where: { id: { in: listingIds } },
		select: {
			id: true,
			title: true,
			slug: true,
		},
	});

	// Combine reviews with user and listing data
	const reviews = reviewsData.map((review) => ({
		...review,
		user: reviewUsers.find((u) => u.id === review.userId) || null,
		listing: reviewListings.find((l) => l.id === review.listingId) || null,
	}));

	return (
		<div style={{
			backgroundColor: "#FAFAFA",
			minHeight: "100vh",
			position: "relative",
			overflow: "hidden",
		}}>
			{/* Decorative Background Elements */}
			<div style={{
				position: "absolute",
				top: "-200px",
				right: "-200px",
				width: "600px",
				height: "600px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(255, 56, 92, 0.05) 0%, rgba(230, 30, 77, 0.08) 100%)",
				zIndex: 0,
			}} />
			<div style={{
				position: "absolute",
				bottom: "-250px",
				left: "-250px",
				width: "700px",
				height: "700px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(215, 4, 102, 0.05) 0%, rgba(255, 56, 92, 0.08) 100%)",
				zIndex: 0,
			}} />
			
			<div style={{ height: "80px" }} />
			<Suspense fallback={
				<div style={{ 
					padding: "64px 32px", 
					textAlign: "center",
					position: "relative",
					zIndex: 1,
				}}>
					<div style={{
						display: "inline-block",
						width: "40px",
						height: "40px",
						border: "3px solid #FF385C",
						borderTopColor: "transparent",
						borderRadius: "50%",
						animation: "spin 0.8s linear infinite",
					}} />
					<style jsx>{`
						@keyframes spin {
							from { transform: rotate(0deg); }
							to { transform: rotate(360deg); }
						}
					`}</style>
				</div>
			}>
				<AdministratorPanel
					listings={listings || []}
					users={users || []}
					reviews={reviews || []}
					blogPosts={blogPosts || []}
				/>
			</Suspense>
		</div>
	);
};

export default AdministratorPage;


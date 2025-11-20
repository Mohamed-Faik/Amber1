import React from "react";
import { redirect } from "next/navigation";
import PageBanner from "@/components/Common/PageBanner";
import { getCurrentUser } from "@/actions/getCurrentUser";
import ListingCard from "./ListingCard";
import getListings from "@/actions/getListings";
export const dynamic = "force-dynamic";
import LeftSidebar from "@/components/Dashboard/LeftSidebar";
import StatusFilter from "@/components/Dashboard/StatusFilter";

const page = async ({ searchParams }) => {
	const currentUser = await getCurrentUser();
	const { isModerator } = await import("@/utils/checkRole");
	
	if (!isModerator(currentUser)) {
		redirect("/");
	}

	// For admin, show all listings with status filter
	const statusFilter = searchParams?.status || "all";
	const { listings } = await getListings({
		...searchParams,
		showAll: true,
		status: statusFilter !== "all" ? statusFilter : undefined,
	});

	return (
		<>
			<div
				className="dashboard-listings-page"
				style={{
					backgroundColor: "#F9FAFB",
					minHeight: "100vh",
					paddingTop: "24px",
					paddingBottom: "48px",
				}}
			>
				<div className="container">
					<div
						className="dashboard-listings-grid"
						style={{
							display: "grid",
							gridTemplateColumns: "280px 1fr",
							gap: "24px",
							alignItems: "start",
						}}
					>
						<LeftSidebar />

						<div>
							<div
								style={{
									marginBottom: "24px",
								}}
							>
								<h1
									style={{
										fontSize: "32px",
										fontWeight: "700",
										color: "#111827",
										marginBottom: "8px",
									}}
								>
									All Listings
								</h1>
								<p
									style={{
										fontSize: "16px",
										color: "#6B7280",
										margin: 0,
									}}
								>
									Manage and review property listings
								</p>
							</div>

							<StatusFilter currentStatus={statusFilter} />

							<ListingCard listings={listings} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default page;

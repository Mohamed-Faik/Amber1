import React from "react";
import { redirect } from "next/navigation";
import PageBanner from "@/components/Common/PageBanner";
import { getCurrentUser } from "@/actions/getCurrentUser";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import countData from "@/actions/getCountData";
import LeftSidebar from "@/components/Dashboard/LeftSidebar";

const page = async () => {
	const { users, listings, blogPosts, reviews } = await countData();

	const currentUser = await getCurrentUser();
	const { hasAdminAccess } = await import("@/utils/checkRole");
	
	if (!hasAdminAccess(currentUser)) {
		redirect("/");
	}
	return (
		<>
			{/* Top Navigation Spacer */}
			<div style={{ height: "80px" }} />

			{/* Page Container */}
			<div
				style={{
					backgroundColor: "#FFFFFF",
					minHeight: "calc(100vh - 80px)",
				}}
			>
				{/* Main Wrapper */}
				<div
					style={{
						maxWidth: "1280px",
						margin: "0 auto",
						padding: "0 24px",
					}}
				>
					{/* Layout Grid */}
					<div
						className="dashboard-layout-grid"
						style={{
							display: "grid",
							gridTemplateColumns: "220px 1fr",
							gap: "24px",
							paddingTop: "32px",
							paddingBottom: "48px",
							minHeight: "calc(100vh - 80px)",
						}}
					>
						{/* Left Sidebar Navigation */}
						<aside
							className="dashboard-sidebar"
							style={{
								borderRight: "1px solid #EBEBEB",
								paddingRight: "24px",
							}}
						>
							<div
								style={{
									position: "sticky",
									top: "96px",
								}}
							>
								<LeftSidebar />
							</div>
						</aside>

						{/* Main Content Area */}
						<main
							className="dashboard-main"
							style={{
								paddingLeft: "24px",
								maxWidth: "1000px",
							}}
						>
							{/* Page Header */}
							<header
								style={{
									marginBottom: "40px",
									paddingBottom: "24px",
									borderBottom: "1px solid #EBEBEB",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginBottom: "8px",
									}}
								>
									<h1
										style={{
											fontSize: "32px",
											fontWeight: "600",
											color: "#222222",
											letterSpacing: "-0.02em",
											margin: 0,
										}}
									>
										Dashboard
									</h1>
									<div
										style={{
											fontSize: "14px",
											color: "#717171",
											backgroundColor: "#F7F7F7",
											padding: "6px 12px",
											borderRadius: "8px",
											fontWeight: "500",
										}}
									>
										Admin Panel
									</div>
								</div>
								<p
									style={{
										fontSize: "16px",
										color: "#717171",
										margin: 0,
										fontWeight: "400",
									}}
								>
									Hi {currentUser?.name || "Admin"}, welcome back to your dashboard
								</p>
							</header>

							{/* Stats Section */}
							<section>
								<div
									style={{
										marginBottom: "24px",
									}}
								>
									<h2
										style={{
											fontSize: "22px",
											fontWeight: "600",
											color: "#222222",
											marginBottom: "8px",
											letterSpacing: "-0.01em",
										}}
									>
										Platform Overview
									</h2>
									<p
										style={{
											fontSize: "14px",
											color: "#717171",
											margin: 0,
										}}
									>
										Key metrics and statistics at a glance
									</p>
								</div>

								{/* Stats Cards Container */}
								<div
									style={{
										backgroundColor: "#FAFAFA",
										borderRadius: "12px",
										padding: "24px",
										border: "1px solid #EBEBEB",
									}}
								>
									<DashboardStats
										users={users}
										listings={listings}
										blogPosts={blogPosts}
										reviews={reviews}
									/>
								</div>
							</section>

							{/* Additional Space */}
							<div style={{ height: "40px" }} />
						</main>
					</div>
				</div>
			</div>
		</>
	);
};

export default page;
"use client";
import React from "react";
import Link from "next/link";

const DashboardStats = ({ listings, blogPosts, users, reviews, pendingListingsCount = 0 }) => {
	const stats = [
		{
			title: "Total Listings",
			value: listings,
			icon: "📋",
			color: "#3B82F6",
			bgColor: "#EFF6FF",
			href: "/dashboard/listings",
			badgeCount: pendingListingsCount,
			badgeLabel: "Pending",
		},
		{
			title: "Blog Posts",
			value: blogPosts,
			icon: "📝",
			color: "#10B981",
			bgColor: "#ECFDF5",
			href: "/dashboard/blog",
		},
		{
			title: "Total Reviews",
			value: reviews,
			icon: "⭐",
			color: "#F59E0B",
			bgColor: "#FFFBEB",
			href: "/dashboard/reviews",
		},
		{
			title: "Registered Users",
			value: users,
			icon: "👥",
			color: "#8B5CF6",
			bgColor: "#F5F3FF",
			href: "/dashboard/users",
		},
	];

	return (
		<div>
			{/* Alert Banner for Pending Listings */}
			{pendingListingsCount > 0 && (
				<div
					style={{
						backgroundColor: "#FEF3C7",
						border: "2px solid #F59E0B",
						borderRadius: "16px",
						padding: "20px 24px",
						marginBottom: "32px",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<span style={{ fontSize: "32px" }}>⏳</span>
						<div>
							<h3
								style={{
									fontSize: "18px",
									fontWeight: "700",
									color: "#92400E",
									margin: "0 0 4px 0",
								}}
							>
								{pendingListingsCount} Listing{pendingListingsCount !== 1 ? 's' : ''} Awaiting Approval
							</h3>
							<p
								style={{
									fontSize: "14px",
									color: "#78350F",
									margin: 0,
								}}
							>
								New properties have been submitted and need your review.
							</p>
						</div>
					</div>
					<Link
						href="/dashboard/listings?status=Pending"
						style={{
							padding: "12px 24px",
							backgroundColor: "#F59E0B",
							color: "#FFFFFF",
							borderRadius: "8px",
							textDecoration: "none",
							fontWeight: "600",
							fontSize: "14px",
							transition: "all 0.2s ease",
							whiteSpace: "nowrap",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#D97706";
							e.currentTarget.style.transform = "translateY(-2px)";
							e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.4)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#F59E0B";
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.boxShadow = "none";
						}}
					>
						Review Now
					</Link>
				</div>
			)}

			{/* Welcome Section */}
			<div
				style={{
					backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					borderRadius: "16px",
					padding: "32px",
					marginBottom: "32px",
					color: "#ffffff",
					boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
				}}
			>
				<h2
					style={{
						fontSize: "28px",
						fontWeight: "700",
						marginBottom: "8px",
						color: "#ffffff",
					}}
				>
					Welcome to Admin Dashboard
				</h2>
				<p
					style={{
						fontSize: "16px",
						color: "rgba(255, 255, 255, 0.9)",
						margin: 0,
					}}
				>
					Manage your platform from here
				</p>
			</div>

			{/* Stats Grid */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
					gap: "24px",
					marginBottom: "32px",
				}}
			>
				{stats.map((stat, index) => (
					<Link
						key={index}
						href={stat.href}
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<div
							style={{
								backgroundColor: "#ffffff",
								borderRadius: "16px",
								padding: "24px",
								boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
								border: "1px solid #e5e7eb",
								transition: "all 0.3s ease",
								cursor: "pointer",
								height: "100%",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = "translateY(-4px)";
								e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = "translateY(0)";
								e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									marginBottom: "16px",
								}}
							>
								<div
									style={{
										width: "56px",
										height: "56px",
										borderRadius: "12px",
										backgroundColor: stat.bgColor,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: "28px",
									}}
								>
									{stat.icon}
								</div>
								<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
									{stat.badgeCount > 0 && stat.badgeLabel && (
										<span
											style={{
												display: "inline-flex",
												alignItems: "center",
												padding: "4px 10px",
												backgroundColor: "#EF4444",
												color: "#FFFFFF",
												borderRadius: "12px",
												fontSize: "11px",
												fontWeight: "700",
												whiteSpace: "nowrap",
											}}
										>
											{stat.badgeCount} {stat.badgeLabel}
										</span>
									)}
									<div
										style={{
											width: "8px",
											height: "8px",
											borderRadius: "50%",
											backgroundColor: stat.color,
										}}
									/>
								</div>
							</div>
							<h3
								style={{
									fontSize: "32px",
									fontWeight: "700",
									color: "#111827",
									marginBottom: "4px",
								}}
							>
								{stat.value}
							</h3>
							<p
								style={{
									fontSize: "14px",
									color: "#6B7280",
									margin: 0,
									fontWeight: "500",
								}}
							>
								{stat.title}
							</p>
						</div>
					</Link>
				))}
			</div>

			{/* Quick Actions */}
			<div
				style={{
					backgroundColor: "#ffffff",
					borderRadius: "16px",
					padding: "24px",
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
					border: "1px solid #e5e7eb",
				}}
			>
				<h3
					style={{
						fontSize: "20px",
						fontWeight: "600",
						color: "#111827",
						marginBottom: "20px",
					}}
				>
					Quick Actions
				</h3>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
						gap: "16px",
					}}
				>
					<Link
						href="/dashboard/blog/new"
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							padding: "16px",
							backgroundColor: "#F9FAFB",
							borderRadius: "12px",
							textDecoration: "none",
							color: "#111827",
							transition: "all 0.2s ease",
							border: "1px solid #e5e7eb",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#F3F4F6";
							e.currentTarget.style.borderColor = "#D1D5DB";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#F9FAFB";
							e.currentTarget.style.borderColor = "#e5e7eb";
						}}
					>
						<span style={{ fontSize: "24px" }}>➕</span>
						<span style={{ fontWeight: "500" }}>Create Blog Post</span>
					</Link>
					<Link
						href="/dashboard/listings?status=Pending"
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							padding: "16px",
							backgroundColor: "#F9FAFB",
							borderRadius: "12px",
							textDecoration: "none",
							color: "#111827",
							transition: "all 0.2s ease",
							border: "1px solid #e5e7eb",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#F3F4F6";
							e.currentTarget.style.borderColor = "#D1D5DB";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#F9FAFB";
							e.currentTarget.style.borderColor = "#e5e7eb";
						}}
					>
						<span style={{ fontSize: "24px" }}>⏳</span>
						<span style={{ fontWeight: "500" }}>Review Pending Listings</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default DashboardStats;

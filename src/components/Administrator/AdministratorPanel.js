"use client";
import React, { useState } from "react";
import { Shield, LayoutGrid, Users, Star, FileText } from "lucide-react";
import ListingsSection from "./ListingsSection";
import UsersSection from "./UsersSection";
import ReviewsSection from "./ReviewsSection";
import BlogsSection from "./BlogsSection";

const AdministratorPanel = ({
	listings = [],
	users = [],
	reviews = [],
	blogPosts = [],
}) => {
	const [activeTab, setActiveTab] = useState("listings");

	const tabs = [
		{ id: "listings", label: "Listings", icon: LayoutGrid, count: listings?.length || 0 },
		{ id: "users", label: "Users", icon: Users, count: users?.length || 0 },
		{ id: "reviews", label: "Reviews", icon: Star, count: reviews?.length || 0 },
		{ id: "blogs", label: "Blogs", icon: FileText, count: blogPosts?.length || 0 },
	];

	return (
		<div
			style={{
				minHeight: "calc(100vh - 80px)",
				padding: "48px 0",
				position: "relative",
				zIndex: 1,
			}}
		>
			<div
				style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: "0 80px",
				}}
			>
				{/* Header */}
				<div style={{ marginBottom: "48px" }}>
					<div style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
						marginBottom: "20px",
					}}>
						<div style={{
							width: "56px",
							height: "56px",
							borderRadius: "16px",
							background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 8px 24px rgba(255, 56, 92, 0.25)",
						}}>
							<Shield size={28} color="#FFFFFF" strokeWidth={2.5} />
						</div>
						<div>
							<h1
								style={{
									fontSize: "36px",
									fontWeight: "700",
									color: "#222222",
									margin: "0 0 4px 0",
									lineHeight: "1.1",
									letterSpacing: "-0.5px",
								}}
							>
								Admin Portal
							</h1>
							<p
								style={{
									fontSize: "15px",
									color: "#717171",
									margin: "0",
									fontWeight: "500",
								}}
							>
								Control Panel
							</p>
						</div>
					</div>
					<p
						style={{
							fontSize: "16px",
							color: "#767676",
							lineHeight: "1.6",
							margin: "0",
						}}
					>
						Manage listings, users, reviews, and blog posts with full administrative control.
					</p>
				</div>

				{/* Tabs */}
				<div
					style={{
						display: "flex",
						gap: "12px",
						marginBottom: "32px",
						backgroundColor: "#FFFFFF",
						padding: "8px",
						borderRadius: "12px",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
						border: "1px solid #E0E0E0",
					}}
				>
					{tabs.map((tab) => {
						const IconComponent = tab.icon;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								style={{
									backgroundColor: activeTab === tab.id 
										? "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)"
										: "transparent",
									background: activeTab === tab.id 
										? "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)"
										: "transparent",
									border: "none",
									padding: "12px 20px",
									borderRadius: "10px",
									fontSize: "15px",
									fontWeight: activeTab === tab.id ? "600" : "500",
									color: activeTab === tab.id ? "#FFFFFF" : "#717171",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									gap: "10px",
									transition: "all 0.2s ease",
									position: "relative",
								}}
								onMouseEnter={(e) => {
									if (activeTab !== tab.id) {
										e.currentTarget.style.backgroundColor = "#F7F7F7";
										e.currentTarget.style.color = "#222222";
									}
								}}
								onMouseLeave={(e) => {
									if (activeTab !== tab.id) {
										e.currentTarget.style.backgroundColor = "transparent";
										e.currentTarget.style.color = "#717171";
									}
								}}
							>
								<IconComponent 
									size={18} 
									color={activeTab === tab.id ? "#FFFFFF" : "#717171"}
									strokeWidth={activeTab === tab.id ? 2.5 : 2}
								/>
								<span>{tab.label}</span>
								<span
									style={{
										backgroundColor: activeTab === tab.id 
											? "rgba(255, 255, 255, 0.2)"
											: "#F7F7F7",
										padding: "4px 10px",
										borderRadius: "12px",
										fontSize: "12px",
										fontWeight: "600",
										color: activeTab === tab.id ? "#FFFFFF" : "#717171",
										minWidth: "24px",
										textAlign: "center",
									}}
								>
									{tab.count}
								</span>
							</button>
						);
					})}
				</div>

				{/* Content */}
				<div
					style={{
						backgroundColor: "#FFFFFF",
						borderRadius: "16px",
						padding: "40px",
						boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
						border: "1px solid #E0E0E0",
					}}
				>
					{activeTab === "listings" && (
						<ListingsSection listings={listings} />
					)}
					{activeTab === "users" && <UsersSection users={users} />}
					{activeTab === "reviews" && <ReviewsSection reviews={reviews} />}
					{activeTab === "blogs" && <BlogsSection blogPosts={blogPosts} />}
				</div>
			</div>
		</div>
	);
};

export default AdministratorPanel;


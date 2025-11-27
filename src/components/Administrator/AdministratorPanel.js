"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Shield, LayoutGrid, Users, Star, FileText, FileEdit, Sparkles, Plus, Home as HomeIcon } from "lucide-react";
import ListingsSection from "./ListingsSection";
import UsersSection from "./UsersSection";
import ReviewsSection from "./ReviewsSection";
import BlogsSection from "./BlogsSection";
import ContentSection from "./ContentSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const AdministratorPanel = ({
	listings = [],
	users = [],
	reviews = [],
	blogPosts = [],
}) => {
	const [activeTab, setActiveTab] = useState("listings");
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;

	const tabs = [
		{ id: "listings", label: getTranslation(displayLanguage, "admin.listings"), icon: LayoutGrid, count: listings?.length || 0 },
		{ id: "users", label: getTranslation(displayLanguage, "admin.users"), icon: Users, count: users?.length || 0 },
		{ id: "reviews", label: getTranslation(displayLanguage, "admin.reviews"), icon: Star, count: reviews?.length || 0 },
		{ id: "blogs", label: getTranslation(displayLanguage, "admin.blogs"), icon: FileText, count: blogPosts?.length || 0 },
		{ id: "content", label: getTranslation(displayLanguage, "admin.content"), icon: FileEdit, count: null },
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
					padding: "0 10px",
				}}
				className="admin-container"
			>
				{/* Header */}
				<div style={{ marginBottom: "48px" }} className="admin-header">
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
						}} className="admin-icon">
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
								className="admin-title"
					>
						{getTranslation(displayLanguage, "admin.adminPortal")}
					</h1>
					<p
						style={{
							fontSize: "15px",
							color: "#717171",
							margin: "0",
							fontWeight: "500",
						}}
					>
						{getTranslation(displayLanguage, "admin.controlPanel")}
					</p>
				</div>
			</div>
			<p
				style={{
					fontSize: "16px",
					color: "#767676",
					lineHeight: "1.6",
					margin: "0 0 24px 0",
				}}
				className="admin-description"
			>
				{getTranslation(displayLanguage, "admin.manageDescription")}
			</p>
					
					{/* Quick Actions */}
					<div style={{
						display: "flex",
						gap: "12px",
						flexWrap: "wrap",
					}}>
						<Link
							href="/listings/new"
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								padding: "10px 20px",
								backgroundColor: "#FFFFFF",
								border: "2px solid #FF385C",
								borderRadius: "10px",
								color: "#FF385C",
								fontSize: "14px",
								fontWeight: "600",
								textDecoration: "none",
								transition: "all 0.2s ease",
								cursor: "pointer",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#FF385C";
								e.currentTarget.style.color = "#FFFFFF";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#FFFFFF";
								e.currentTarget.style.color = "#FF385C";
							}}
					>
						<Plus size={18} />
						<HomeIcon size={18} />
						<span>{getTranslation(displayLanguage, "admin.createHomeListing")}</span>
					</Link>
					<Link
						href="/administrator/experiences/new"
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								padding: "10px 20px",
								backgroundColor: "#FFFFFF",
								border: "2px solid #FF385C",
								borderRadius: "10px",
								color: "#FF385C",
								fontSize: "14px",
								fontWeight: "600",
								textDecoration: "none",
								transition: "all 0.2s ease",
								cursor: "pointer",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#FF385C";
								e.currentTarget.style.color = "#FFFFFF";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#FFFFFF";
								e.currentTarget.style.color = "#FF385C";
							}}
						>
				<Plus size={18} />
				<Sparkles size={18} />
				<span>{getTranslation(displayLanguage, "admin.createExperience")}</span>
			</Link>
					</div>
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
					className="admin-tabs"
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
					className="admin-content"
				>
				{activeTab === "listings" && (
					<ListingsSection listings={listings} displayLanguage={displayLanguage} />
				)}
				{activeTab === "users" && <UsersSection users={users} displayLanguage={displayLanguage} />}
				{activeTab === "reviews" && <ReviewsSection reviews={reviews} displayLanguage={displayLanguage} />}
				{activeTab === "blogs" && <BlogsSection blogPosts={blogPosts} displayLanguage={displayLanguage} />}
				{activeTab === "content" && <ContentSection displayLanguage={displayLanguage} />}
				</div>
			</div>
			<style jsx>{`
				/* Tablet: 768px - 991px */
				@media (max-width: 991px) {
					.admin-container {
						padding: 0 40px !important;
					}
					.admin-title {
						font-size: 28px !important;
					}
					.admin-tabs {
						flex-wrap: wrap !important;
					}
					.admin-content {
						padding: 24px !important;
					}
				}

				/* Mobile: < 768px */
				@media (max-width: 767px) {
					.admin-container {
						padding: 0 20px !important;
					}
					.admin-header {
						margin-bottom: 32px !important;
					}
					.admin-icon {
						width: 48px !important;
						height: 48px !important;
					}
					.admin-title {
						font-size: 24px !important;
					}
					.admin-description {
						font-size: 14px !important;
					}
					.admin-tabs {
						flex-direction: column !important;
						gap: 8px !important;
					}
					.admin-tabs button {
						width: 100% !important;
						justify-content: flex-start !important;
					}
					.admin-content {
						padding: 20px 16px !important;
						border-radius: 12px !important;
					}
				}

				/* Small Mobile: < 480px */
				@media (max-width: 480px) {
					.admin-container {
						padding: 0 16px !important;
					}
					.admin-title {
						font-size: 20px !important;
					}
					.admin-content {
						padding: 16px 12px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default AdministratorPanel;


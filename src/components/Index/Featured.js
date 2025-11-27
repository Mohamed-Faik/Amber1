"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FeaturedItem from "./FeaturedItem";
import ListingSkeleton from "./ListingSkeleton";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const Featured = ({ currentUser }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [sections, setSections] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				console.log("📡 Fetching all listings...");
				// Fetch all listings without category filter
				const response = await axios.get(`/api/listings/featured?category=all`);
				
				// Check if response is an error object
				if (response.data && response.data.error) {
					console.error("❌ API returned error:", response.data);
					console.error("   Error message:", response.data.message);
					
					// Show specific error message to user
					if (response.data.message?.includes("DATABASE_URL")) {
						toast.error("Database configuration error. Please check server configuration.");
					} else if (response.data.message?.includes("connection")) {
						toast.error("Database connection failed. Please check your database settings.");
					} else {
						toast.error(response.data.message || "Failed to load listings. Please try again.");
					}
					
					setSections([]);
					return;
				}
				
				const allListings = Array.isArray(response.data) ? response.data : [];
				
				console.log("✅ Received listings:", allListings.length);
				if (allListings.length > 0) {
					console.log("📋 Sample listing:", allListings[0]);
				}

		if (allListings.length === 0) {
			console.warn("⚠️  No listings found in response");
			setSections([]);
			return;
		}

		// Filter listings that are marked as premium in the database
		const premiumListings = allListings.filter(listing => listing.isPremium === true);
		
		console.log("⭐ Premium listings found:", premiumListings.length);
		
		// Premium listings already have isPremium flag from database
		const premiumListingsWithFlag = premiumListings;
		
		// Create two sections: Premium Properties and All Properties
		// Store sections without titles - titles will be computed on render for instant translation
		const newSections = [
			{
				titleKey: "listings.premiumProperties",
				listings: premiumListingsWithFlag,
				key: "premium-properties",
			},
			{
				titleKey: "listings.allProperties",
				listings: allListings,
				key: "all-listings",
			}
		];

			console.log("📦 Created sections:", newSections.length);
			setSections(newSections);
			} catch (error) {
				console.error("❌ Error fetching listings:", error);
				console.error("   Error response:", error.response?.data);
				console.error("   Error status:", error.response?.status);
				
				// Handle different error types
				if (error.response?.status === 503) {
					toast.error("Database connection failed. Please check your database settings in Vercel.");
				} else if (error.response?.status === 500) {
					const errorMsg = error.response?.data?.message || "Server error. Please contact support.";
					toast.error(errorMsg);
				} else if (error.response?.data?.error) {
					toast.error(error.response.data.message || "Failed to load listings.");
				} else {
					toast.error("Failed to load listings. Please try again.");
				}
				
				setSections([]);
			} finally {
				setIsLoading(false);
			}
		};

	fetchData();
}, []);


	return (
		<div
			className="featured-section"
			style={{
				backgroundColor: "#FFFFFF",
				paddingTop: "40px",
				paddingBottom: "80px",
			}}
		>
			<div
				className="featured-container"
				style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: "0 10px",
				}}
			>
				{/* Loading State - Skeleton Loaders */}
				{isLoading && (
					<div>
						{/* Section Header Skeleton */}
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "32px",
							}}
						>
							<div
								style={{
									width: "200px",
									height: "34px",
									borderRadius: "8px",
									backgroundColor: "#f0f0f0",
									animation: "shimmer 2s infinite",
									background: "linear-gradient(to right, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%, #f0f0f0 100%)",
									backgroundSize: "1000px 100%",
								}}
							/>
						</div>

						{/* Skeleton Grid */}
						<div
							className="featured-grid"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
								gap: "32px",
							}}
						>
							{Array.from({ length: 6 }).map((_, index) => (
								<ListingSkeleton key={`skeleton-${index}`} />
							))}
						</div>
					</div>
				)}

			{/* Loaded State - Actual Listings */}
			{!isLoading && sections.map((section, index) => (
				<React.Fragment key={section.key}>
					<div>
						{/* Section Header */}
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "32px",
							}}
						>
						<h2
							style={{
								fontSize: "28px",
								fontWeight: "600",
								color: "#222222",
								margin: 0,
							}}
						>
							{getTranslation(displayLanguage, section.titleKey)}
						</h2>
						</div>

						{/* Grid Layout */}
						<div
							className="featured-grid"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
								gap: "32px",
							}}
						>
							{section.listings.map((list) => (
								<FeaturedItem
									key={list.id}
									currentUser={currentUser}
									{...list}
								/>
							))}
						</div>
					</div>

					{/* Elegant Divider Between Sections */}
					{index < sections.length - 1 && (
						<div style={{ 
							margin: "80px 0", 
							position: "relative",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}>
							{/* Gradient Line */}
							<div style={{
								position: "absolute",
								width: "100%",
								height: "2px",
								background: "linear-gradient(to right, transparent 0%, #E0E0E0 20%, #FF385C 50%, #E0E0E0 80%, transparent 100%)",
								opacity: 0.6
							}} />
							
							{/* Center Decoration */}
							<div style={{
								position: "relative",
								backgroundColor: "#FFFFFF",
								padding: "12px 32px",
								borderRadius: "40px",
								border: "2px solid #FF385C",
								boxShadow: "0 4px 12px rgba(255, 56, 92, 0.15)",
								display: "flex",
								alignItems: "center",
								gap: "12px"
							}}>
								<div style={{
									width: "8px",
									height: "8px",
									borderRadius: "50%",
									backgroundColor: "#FF385C",
									animation: "pulse 2s infinite"
								}} />
								<span style={{
									fontSize: "14px",
									fontWeight: "600",
									color: "#FF385C",
									letterSpacing: "1px",
									textTransform: "uppercase"
								}}>
									{getTranslation(displayLanguage, "listings.exploreMore")}
								</span>
								<div style={{
									width: "8px",
									height: "8px",
									borderRadius: "50%",
									backgroundColor: "#FF385C",
									animation: "pulse 2s infinite 1s"
								}} />
							</div>

							{/* Pulse Animation */}
							<style jsx>{`
								@keyframes pulse {
									0%, 100% {
										opacity: 1;
										transform: scale(1);
									}
									50% {
										opacity: 0.5;
										transform: scale(0.8);
									}
								}
							`}</style>
						</div>
					)}
				</React.Fragment>
			))}

				{/* Empty State */}
				{!isLoading && sections.length === 0 && (
					<div
						style={{
							textAlign: "center",
							padding: "80px 20px",
						}}
					>
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#dddddd"
							strokeWidth="1.5"
							style={{ marginBottom: "16px" }}
						>
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
							<circle cx="12" cy="10" r="3"></circle>
						</svg>
						<h3
							style={{
								fontSize: "20px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "8px",
							}}
						>
							No properties found
						</h3>
						<p style={{ color: "#717171", margin: 0 }}>
							Check back later for new listings
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Featured;

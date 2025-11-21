"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FeaturedItem from "./FeaturedItem";
import { toast } from "react-hot-toast";

const Featured = ({ currentUser }) => {
	const [sections, setSections] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
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

				// Display all listings in a single section without grouping
				const newSections = [{
					title: "All Properties",
					listings: allListings, // Show all listings
					key: "all-listings",
				}];

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
					padding: "0 80px",
				}}
			>
				{sections.map((section) => (
					<div key={section.key}>
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
								{section.title}
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
				))}

				{/* Empty State */}
				{sections.length === 0 && (
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

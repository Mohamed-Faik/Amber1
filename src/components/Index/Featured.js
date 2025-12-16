"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import FeaturedItem from "./FeaturedItem";
import ListingSkeleton from "./ListingSkeleton";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Featured = ({ currentUser }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [sections, setSections] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [premiumCurrentIndex, setPremiumCurrentIndex] = useState(0);
	const premiumCarouselRef = useRef(null);
	const [listingsPerSlide, setListingsPerSlide] = useState(5);

	// Update listings per slide based on screen size
	useEffect(() => {
		const updateListingsPerSlide = () => {
			let newValue;
			if (window.innerWidth <= 768) {
				newValue = 2;
			} else {
				newValue = 5;
			}
			setListingsPerSlide(newValue);
			// Reset carousel index when screen size changes
			setPremiumCurrentIndex(0);
		};

		updateListingsPerSlide();
		window.addEventListener("resize", updateListingsPerSlide);
		return () => window.removeEventListener("resize", updateListingsPerSlide);
	}, []);

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
				{!isLoading && sections.map((section, index) => {
					const isPremiumSection = section.key === "premium-properties";
					const totalSlides = isPremiumSection
						? Math.ceil(section.listings.length / listingsPerSlide)
						: 1;

					return (
						<React.Fragment key={section.key}>
							<div style={{
								marginTop: !isPremiumSection ? "60px" : "0"
							}}>
								{/* Section Header */}
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: "32px",
										flexWrap: "wrap",
										gap: "16px",
									}}
								>
									<h2
										className="section-heading-canela"
										style={{
											fontSize: "24px",
											fontWeight: "300",
											fontFamily: "var(--font-canela), 'Canela', serif",
											color: "#222222",
											margin: 0,
											flex: "1 1 auto",
										}}
									>
										{getTranslation(displayLanguage, section.titleKey)}
									</h2>
									{/* Carousel Navigation Buttons - Only for Premium Section Desktop */}
									{isPremiumSection && section.listings.length > listingsPerSlide && totalSlides > 1 && (
										<div
											className="premium-carousel-nav"
											style={{
												display: "flex",
												gap: "8px",
												alignItems: "center",
												flexShrink: 0,
											}}
										>
											<button
												onClick={() => {
													setPremiumCurrentIndex((prev) =>
														prev > 0 ? prev - 1 : totalSlides - 1
													);
												}}
												style={{
													width: "32px",
													height: "32px",
													borderRadius: "50%",
													border: "1px solid #DDDDDD",
													backgroundColor: "#FFFFFF",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													cursor: "pointer",
													transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
													boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.borderColor = "#FF385C";
													e.currentTarget.style.backgroundColor = "#FFF5F7";
													e.currentTarget.style.transform = "scale(1.1)";
													e.currentTarget.style.boxShadow = "0 4px 8px rgba(255, 56, 92, 0.2)";
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.borderColor = "#DDDDDD";
													e.currentTarget.style.backgroundColor = "#FFFFFF";
													e.currentTarget.style.transform = "scale(1)";
													e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
												}}
											>
												<ChevronLeft size={18} color="#222222" />
											</button>
											<button
												onClick={() => {
													setPremiumCurrentIndex((prev) =>
														prev < totalSlides - 1 ? prev + 1 : 0
													);
												}}
												style={{
													width: "32px",
													height: "32px",
													borderRadius: "50%",
													border: "1px solid #DDDDDD",
													backgroundColor: "#FFFFFF",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													cursor: "pointer",
													transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
													boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.borderColor = "#FF385C";
													e.currentTarget.style.backgroundColor = "#FFF5F7";
													e.currentTarget.style.transform = "scale(1.1)";
													e.currentTarget.style.boxShadow = "0 4px 8px rgba(255, 56, 92, 0.2)";
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.borderColor = "#DDDDDD";
													e.currentTarget.style.backgroundColor = "#FFFFFF";
													e.currentTarget.style.transform = "scale(1)";
													e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
												}}
											>
												<ChevronRight size={18} color="#222222" />
											</button>
										</div>
									)}
								</div>

								{/* Carousel Container for Premium Section, Grid for Others */}
								{isPremiumSection ? (
									<>
										{/* Desktop: Slide-based carousel */}
										<div
											ref={premiumCarouselRef}
											className="premium-carousel-container desktop-carousel"
											style={{
												position: "relative",
												overflow: "hidden",
												width: "100%",
											}}
										>
											<div
												className="premium-carousel-wrapper"
												style={{
													display: "flex",
													transform: `translateX(-${premiumCurrentIndex * 100}%)`,
													transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
													willChange: "transform",
												}}
											>
												{Array.from({ length: totalSlides }).map((_, slideIndex) => {
													const slideListings = section.listings.slice(
														slideIndex * listingsPerSlide,
														(slideIndex + 1) * listingsPerSlide
													);
													return (
														<div
															key={slideIndex}
															className="premium-carousel-slide"
															style={{
																minWidth: "100%",
																width: "100%",
																flexShrink: 0,
																display: "grid",
																gridTemplateColumns: `repeat(${listingsPerSlide}, 1fr)`,
																gap: "32px",
															}}
														>
															{slideListings.map((list) => (
																<FeaturedItem
																	key={list.id}
																	currentUser={currentUser}
																	{...list}
																/>
															))}
														</div>
													);
												})}
											</div>
											{/* Slide Indicators */}
											{totalSlides > 1 && (
												<div
													style={{
														display: "flex",
														justifyContent: "center",
														gap: "8px",
														marginTop: "24px",
													}}
												>
													{Array.from({ length: totalSlides }).map((_, slideIndex) => (
														<button
															key={slideIndex}
															onClick={() => setPremiumCurrentIndex(slideIndex)}
															style={{
																width: slideIndex === premiumCurrentIndex ? "24px" : "8px",
																height: "8px",
																borderRadius: "4px",
																backgroundColor: slideIndex === premiumCurrentIndex ? "#FF385C" : "#DDDDDD",
																border: "none",
																cursor: "pointer",
																transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
																transform: slideIndex === premiumCurrentIndex ? "scale(1.2)" : "scale(1)",
															}}
															onMouseEnter={(e) => {
																if (slideIndex !== premiumCurrentIndex) {
																	e.currentTarget.style.backgroundColor = "#FFB3C1";
																	e.currentTarget.style.transform = "scale(1.1)";
																}
															}}
															onMouseLeave={(e) => {
																if (slideIndex !== premiumCurrentIndex) {
																	e.currentTarget.style.backgroundColor = "#DDDDDD";
																	e.currentTarget.style.transform = "scale(1)";
																}
															}}
														/>
													))}
												</div>
											)}
										</div>
										{/* Mobile: Horizontal scrollable carousel */}
										<div
											className="premium-carousel-container mobile-carousel"
											style={{
												overflowX: "auto",
												overflowY: "hidden",
												width: "100%",
												scrollBehavior: "smooth",
												WebkitOverflowScrolling: "touch",
												msOverflowStyle: "none",
												scrollbarWidth: "none",
											}}
										>
											<div
												className="premium-mobile-scroll-wrapper"
												style={{
													display: "flex",
													gap: "16px",
													paddingBottom: "8px",
												}}
											>
												{section.listings.map((list) => (
													<div
														key={list.id}
														className="premium-mobile-item"
														style={{
															minWidth: "260px",
															width: "260px",
															flexShrink: 0,
														}}
													>
														<FeaturedItem
															currentUser={currentUser}
															{...list}
														/>
													</div>
												))}
											</div>
										</div>
									</>
								) : (
									<div
										className="featured-grid all-properties-grid desktop-grid"
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
								)}
							</div>
						</React.Fragment>
					);
				})}

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

			{/* Premium Carousel Styles */}
			<style jsx global>{`
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
				
				@keyframes fadeInSlide {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				
				.premium-carousel-wrapper {
					display: flex;
				}
				
				.premium-carousel-slide {
					min-width: 100%;
					width: 100%;
					flex-shrink: 0;
				}
				
				.premium-carousel-slide > * {
					animation: fadeInSlide 0.6s ease-out;
				}
				
				.premium-carousel-slide {
					grid-template-columns: repeat(5, 1fr) !important;
				}
				@media (max-width: 768px) {
					.premium-carousel-slide {
						grid-template-columns: repeat(2, 1fr) !important;
						gap: 16px !important;
					}
				}
				@media (max-width: 480px) {
					.premium-carousel-slide {
						grid-template-columns: repeat(2, 1fr) !important;
						gap: 16px !important;
					}
				}
				
				.premium-carousel-container {
					width: 100% !important;
				}
				
				.desktop-carousel {
					overflow: hidden !important;
				}
				
				.mobile-carousel {
					display: none;
				}
				
				.premium-mobile-scroll-wrapper::-webkit-scrollbar {
					display: none;
				}
				
				@media (max-width: 768px) {
					.desktop-carousel {
						display: none !important;
					}
					
					.mobile-carousel {
						display: block !important;
					}
					
					.premium-carousel-nav {
						display: none !important;
					}
					
					.featured-container {
						padding: 0 24px !important;
					}
					
					.premium-mobile-item {
						width: 260px !important;
						min-width: 260px !important;
					}
					
					.premium-mobile-scroll-wrapper {
						padding-left: 0 !important;
						padding-right: 0 !important;
					}
					
					.all-properties-grid {
						display: block !important;
						column-count: 2 !important;
						column-gap: 16px !important;
					}
					
					.all-properties-grid > * {
						break-inside: avoid !important;
						display: inline-block !important;
						width: 100% !important;
						margin-bottom: 16px !important;
					}
					
					.section-heading-canela {
						font-size: 20px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default Featured;


"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FeaturedItem from "../Index/FeaturedItem";
import { getTranslation } from "@/utils/translations";

const SimilarListings = ({ currentListingId, category, location_value, displayLanguage, currentUser }) => {
	const [similarListings, setSimilarListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const carouselRef = useRef(null);
	const [listingsPerSlide, setListingsPerSlide] = useState(5);
	
	// Update listings per slide based on screen size
	useEffect(() => {
		const updateListingsPerSlide = () => {
			let newValue;
			if (window.innerWidth <= 768) {
				newValue = 1;
			} else if (window.innerWidth <= 1100) {
				newValue = 3;
			} else if (window.innerWidth <= 1400) {
				newValue = 4;
			} else {
				newValue = 5;
			}
			setListingsPerSlide(newValue);
			setCurrentIndex(0);
		};
		
		updateListingsPerSlide();
		window.addEventListener("resize", updateListingsPerSlide);
		return () => window.removeEventListener("resize", updateListingsPerSlide);
	}, []);
	
	useEffect(() => {
		const fetchSimilarListings = async () => {
			try {
				// Fetch more listings for carousel (15-20)
				const response = await fetch(`/api/listings/featured?category=${category || "all"}`);
				if (response.ok) {
					const data = await response.json();
					// Filter out current listing, filter by location if available
					let filtered = Array.isArray(data) ? data : [];
					filtered = filtered
						.filter(listing => listing.id !== currentListingId)
						.filter(listing => {
							if (location_value) {
								return listing.location_value?.includes(location_value.split(",")[0]);
							}
							return true;
						})
						.slice(0, 20); // Get up to 20 similar listings
					setSimilarListings(filtered);
				}
			} catch (error) {
				console.error("Error fetching similar listings:", error);
			} finally {
				setLoading(false);
			}
		};
		
		fetchSimilarListings();
	}, [currentListingId, category, location_value]);
	
	if (loading) {
		return (
			<div style={{ textAlign: "center", padding: "40px" }}>
				<div style={{ fontSize: "16px", color: "#717171" }}>{getTranslation(displayLanguage, "listings.loading")}</div>
			</div>
		);
	}
	
	if (similarListings.length === 0) {
		return null;
	}
	
	const totalSlides = Math.ceil(similarListings.length / listingsPerSlide);
	
	return (
		<div style={{ marginBottom: "48px" }}>
			{/* Header with Navigation */}
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
						fontSize: "24px",
						fontWeight: "700",
						color: "#222222",
						margin: 0,
					}}
				>
					{getTranslation(displayLanguage, "listings.similarProperties")}
				</h2>
				
				{/* Navigation Buttons */}
				{totalSlides > 1 && (
					<div
						style={{
							display: "flex",
							gap: "12px",
							alignItems: "center",
						}}
					>
						<button
							onClick={() => {
								setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
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
							<ChevronLeft size={18} style={{ color: "#222222" }} />
						</button>
						<button
							onClick={() => {
								setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
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
							<ChevronRight size={18} style={{ color: "#222222" }} />
						</button>
					</div>
				)}
			</div>
			
			{/* Carousel Container */}
			<div
				ref={carouselRef}
				className="similar-listings-carousel-container"
				style={{
					position: "relative",
					overflow: "hidden",
					width: "100%",
				}}
			>
				<div
					className="similar-listings-carousel-wrapper"
					style={{
						display: "flex",
						transform: `translateX(-${currentIndex * 100}%)`,
						transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
						willChange: "transform",
					}}
				>
					{Array.from({ length: totalSlides }).map((_, slideIndex) => {
						const slideListings = similarListings.slice(
							slideIndex * listingsPerSlide,
							(slideIndex + 1) * listingsPerSlide
						);
						return (
							<div
								key={slideIndex}
								className="similar-listings-carousel-slide"
								style={{
									minWidth: "100%",
									width: "100%",
									flexShrink: 0,
									display: "grid",
									gridTemplateColumns: `repeat(${listingsPerSlide}, 1fr)`,
									gap: "32px",
								}}
							>
								{slideListings.map((listing) => (
									<FeaturedItem
										key={listing.id}
										currentUser={currentUser}
										{...listing}
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
								onClick={() => setCurrentIndex(slideIndex)}
								style={{
									width: slideIndex === currentIndex ? "24px" : "8px",
									height: "8px",
									borderRadius: "4px",
									backgroundColor: slideIndex === currentIndex ? "#FF385C" : "#DDDDDD",
									border: "none",
									cursor: "pointer",
									transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
									transform: slideIndex === currentIndex ? "scale(1.2)" : "scale(1)",
								}}
								onMouseEnter={(e) => {
									if (slideIndex !== currentIndex) {
										e.currentTarget.style.backgroundColor = "#FFB3C1";
										e.currentTarget.style.transform = "scale(1.1)";
									}
								}}
								onMouseLeave={(e) => {
									if (slideIndex !== currentIndex) {
										e.currentTarget.style.backgroundColor = "#DDDDDD";
										e.currentTarget.style.transform = "scale(1)";
									}
								}}
							/>
						))}
					</div>
				)}
			</div>
			
			<style jsx>{`
				@media (max-width: 768px) {
					.similar-listings-carousel-slide {
						grid-template-columns: repeat(1, 1fr) !important;
						gap: 24px !important;
					}
				}
				@media (min-width: 769px) and (max-width: 1100px) {
					.similar-listings-carousel-slide {
						grid-template-columns: repeat(3, 1fr) !important;
					}
				}
				@media (min-width: 1101px) and (max-width: 1400px) {
					.similar-listings-carousel-slide {
						grid-template-columns: repeat(4, 1fr) !important;
					}
				}
				@media (min-width: 1401px) {
					.similar-listings-carousel-slide {
						grid-template-columns: repeat(5, 1fr) !important;
					}
				}
			`}</style>
		</div>
	);
};

export default SimilarListings;

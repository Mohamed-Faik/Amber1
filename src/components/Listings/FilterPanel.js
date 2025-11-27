"use client";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { SlidersHorizontal, X, DollarSign, Bed, Bath, Home as HomeIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTranslation } from "@/utils/translations";
import { useLanguage } from "@/contexts/LanguageContext";

const FilterPanel = ({ featureType = "HOMES" }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	
	const [showFilters, setShowFilters] = useState(false);
	const filterRef = useRef(null);
	const [navbarHeight, setNavbarHeight] = useState(70);
	const [isMobile, setIsMobile] = useState(false);

	// Filter states - check both old and new parameter names for backward compatibility
	const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || searchParams.get("minPrice") || "");
	const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || searchParams.get("maxPrice") || "");
	const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
	const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "");
	const [propertyType, setPropertyType] = useState(searchParams.get("category") || "");

	// Detect mobile and navbar height immediately - useLayoutEffect runs synchronously before paint
	useLayoutEffect(() => {
		const checkMobile = () => {
			if (typeof window !== "undefined") {
				const mobile = window.innerWidth <= 768;
				setIsMobile(mobile);
				
				if (mobile) {
					const header = document.querySelector("header");
					if (header) {
						const height = header.offsetHeight;
						setNavbarHeight(height);
					}
				}
			}
		};

		// Check immediately before paint
		checkMobile();
		
		window.addEventListener("resize", checkMobile);
		window.addEventListener("orientationchange", checkMobile);

		return () => {
			window.removeEventListener("resize", checkMobile);
			window.removeEventListener("orientationchange", checkMobile);
		};
	}, []);

	// Close on click outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (filterRef.current && !filterRef.current.contains(event.target)) {
				setShowFilters(false);
			}
		};

		if (showFilters) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showFilters]);

	const handleApplyFilters = () => {
		const params = new URLSearchParams(searchParams.toString());
		
		// Update or remove price filters - use min_price and max_price to match getListings
		// Remove old parameter names for backward compatibility
		params.delete("minPrice");
		params.delete("maxPrice");
		
		if (minPrice) {
			params.set("min_price", minPrice);
		} else {
			params.delete("min_price");
		}
		
		if (maxPrice) {
			params.set("max_price", maxPrice);
		} else {
			params.delete("max_price");
		}
		
		// Update or remove room filters (only for HOMES)
		if (featureType === "HOMES") {
			if (bedrooms) {
				params.set("bedrooms", bedrooms);
			} else {
				params.delete("bedrooms");
			}
			
			if (bathrooms) {
				params.set("bathrooms", bathrooms);
			} else {
				params.delete("bathrooms");
			}
		} else {
			// Remove bedrooms/bathrooms for non-HOMES types
			params.delete("bedrooms");
			params.delete("bathrooms");
		}
		
		// Update or remove property type/category
		if (propertyType) {
			params.set("category", propertyType);
		} else {
			params.delete("category");
		}

		router.push(`/${featureType.toLowerCase()}?${params.toString()}`);
		setShowFilters(false);
	};

	const handleClearFilters = () => {
		setMinPrice("");
		setMaxPrice("");
		setBedrooms("");
		setBathrooms("");
		setPropertyType("");
		
		const params = new URLSearchParams(searchParams.toString());
		// Remove both old and new parameter names
		params.delete("minPrice");
		params.delete("maxPrice");
		params.delete("min_price");
		params.delete("max_price");
		params.delete("bedrooms");
		params.delete("bathrooms");
		params.delete("category");
		
		router.push(`/${featureType.toLowerCase()}?${params.toString()}`);
		setShowFilters(false);
	};

	// Count active filters - only include bedrooms/bathrooms for HOMES
	const activeFiltersCount = featureType === "HOMES" 
		? [minPrice, maxPrice, bedrooms, bathrooms, propertyType].filter(Boolean).length
		: [minPrice, maxPrice, propertyType].filter(Boolean).length;

	return (
		<div 
			ref={filterRef} 
			className="filter-button-container" 
			style={{ 
				position: "relative",
				zIndex: showFilters && !isMobile ? 10 : 1,
				"--navbar-height": `${navbarHeight}px`
			}}
		>
			{/* Filter Button */}
			<button
				onClick={() => setShowFilters(!showFilters)}
				style={{
					display: "flex",
					alignItems: "center",
					gap: "8px",
					padding: "10px 18px",
					backgroundColor: showFilters ? "#FF385C" : "#FFFFFF",
					color: showFilters ? "#FFFFFF" : "#222222",
					border: `2px solid ${showFilters ? "#FF385C" : "#DDDDDD"}`,
					borderRadius: "12px",
					fontSize: "15px",
					fontWeight: "600",
					cursor: "pointer",
					transition: "all 0.2s ease",
					position: "relative",
				}}
				onMouseEnter={(e) => {
					if (!showFilters) {
						e.currentTarget.style.borderColor = "#FF385C";
						e.currentTarget.style.backgroundColor = "#FFF5F7";
					}
				}}
				onMouseLeave={(e) => {
					if (!showFilters) {
						e.currentTarget.style.borderColor = "#DDDDDD";
						e.currentTarget.style.backgroundColor = "#FFFFFF";
					}
				}}
			>
				<SlidersHorizontal size={18} strokeWidth={2.5} />
				<span>{getTranslation(displayLanguage, "filters.filters")}</span>
				{activeFiltersCount > 0 && (
					<div style={{
						position: "absolute",
						top: "-6px",
						right: "-6px",
						backgroundColor: "#FF385C",
						color: "#FFFFFF",
						borderRadius: "50%",
						width: "20px",
						height: "20px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "11px",
						fontWeight: "700",
						border: "2px solid #FFFFFF",
					}}>
						{activeFiltersCount}
					</div>
				)}
			</button>

		{/* Filter Panel */}
		{showFilters && (
				<div 
					className="filter-dropdown"
					style={{
						position: "absolute",
						top: "calc(100% + 12px)",
						left: "auto",
						right: "0",
						width: "380px",
						maxWidth: "380px",
						maxHeight: "500px",
						overflowY: "auto",
						backgroundColor: "#FFFFFF",
						border: "1px solid #DDDDDD",
						borderRadius: "16px",
						boxShadow: "0 8px 28px rgba(0, 0, 0, 0.12)",
						zIndex: 10,
						padding: "24px",
						transition: "none",
						opacity: 1,
					}}>
					{/* Header */}
					<div style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						marginBottom: "20px",
						paddingBottom: "16px",
						borderBottom: "1px solid #E0E0E0",
					}}>
						<h3 style={{
							fontSize: "18px",
							fontWeight: "700",
							color: "#222222",
							margin: 0,
						}}>
							{getTranslation(displayLanguage, "filters.filters")}
						</h3>
						<button
							onClick={() => setShowFilters(false)}
							className="filter-close-button"
							style={{
								background: "#F7F7F7",
								border: "2px solid #DDDDDD",
								cursor: "pointer",
								padding: "8px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "50%",
								transition: "all 0.2s ease",
								minWidth: "36px",
								minHeight: "36px",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#FF385C";
								e.currentTarget.style.borderColor = "#FF385C";
								const icon = e.currentTarget.querySelector("svg");
								if (icon) icon.style.color = "#FFFFFF";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#F7F7F7";
								e.currentTarget.style.borderColor = "#DDDDDD";
								const icon = e.currentTarget.querySelector("svg");
								if (icon) icon.style.color = "#222222";
							}}
						>
							<X size={20} color="#222222" strokeWidth={2.5} />
						</button>
					</div>

					{/* Price Range */}
					<div style={{ marginBottom: "24px" }}>
						<label style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							fontSize: "14px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
						}}>
							<DollarSign size={18} color="#FF385C" />
							{getTranslation(displayLanguage, "filters.priceRange")}
						</label>
						<div style={{ display: "flex", gap: "12px" }}>
							<input
								type="number"
								placeholder={getTranslation(displayLanguage, "filters.minPrice")}
								value={minPrice}
								onChange={(e) => setMinPrice(e.target.value)}
								style={{
									flex: 1,
									padding: "10px 12px",
									border: "1px solid #DDDDDD",
									borderRadius: "8px",
									fontSize: "14px",
									outline: "none",
									transition: "border 0.2s ease",
								}}
								onFocus={(e) => {
									e.target.style.borderColor = "#FF385C";
								}}
								onBlur={(e) => {
									e.target.style.borderColor = "#DDDDDD";
								}}
							/>
							<input
								type="number"
								placeholder={getTranslation(displayLanguage, "filters.maxPrice")}
								value={maxPrice}
								onChange={(e) => setMaxPrice(e.target.value)}
								style={{
									flex: 1,
									padding: "10px 12px",
									border: "1px solid #DDDDDD",
									borderRadius: "8px",
									fontSize: "14px",
									outline: "none",
									transition: "border 0.2s ease",
								}}
								onFocus={(e) => {
									e.target.style.borderColor = "#FF385C";
								}}
								onBlur={(e) => {
									e.target.style.borderColor = "#DDDDDD";
								}}
							/>
						</div>
					</div>

					{/* Bedrooms - Only show for HOMES */}
					{featureType === "HOMES" && (
						<div style={{ marginBottom: "24px" }}>
							<label style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								fontSize: "14px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "12px",
							}}>
								<Bed size={18} color="#FF385C" />
								{getTranslation(displayLanguage, "filters.bedrooms")}
							</label>
							<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
								{["Any", "1", "2", "3", "4", "5+"].map((option) => (
									<button
										key={option}
										onClick={() => setBedrooms(option === "Any" ? "" : option)}
										style={{
											padding: "10px",
											backgroundColor: (bedrooms === option || (option === "Any" && !bedrooms)) ? "#FF385C" : "#FFFFFF",
											color: (bedrooms === option || (option === "Any" && !bedrooms)) ? "#FFFFFF" : "#222222",
											border: `1px solid ${(bedrooms === option || (option === "Any" && !bedrooms)) ? "#FF385C" : "#DDDDDD"}`,
											borderRadius: "8px",
											fontSize: "14px",
											fontWeight: "600",
											cursor: "pointer",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											if (bedrooms !== option && !(option === "Any" && !bedrooms)) {
												e.currentTarget.style.borderColor = "#FF385C";
												e.currentTarget.style.backgroundColor = "#FFF5F7";
											}
										}}
										onMouseLeave={(e) => {
											if (bedrooms !== option && !(option === "Any" && !bedrooms)) {
												e.currentTarget.style.borderColor = "#DDDDDD";
												e.currentTarget.style.backgroundColor = "#FFFFFF";
											}
										}}
									>
										{option}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Bathrooms - Only show for HOMES */}
					{featureType === "HOMES" && (
						<div style={{ marginBottom: "24px" }}>
							<label style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								fontSize: "14px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "12px",
							}}>
								<Bath size={18} color="#FF385C" />
								{getTranslation(displayLanguage, "filters.bathrooms")}
							</label>
							<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
								{["Any", "1", "2", "3", "4", "5+"].map((option) => (
									<button
										key={option}
										onClick={() => setBathrooms(option === "Any" ? "" : option)}
										style={{
											padding: "10px",
											backgroundColor: (bathrooms === option || (option === "Any" && !bathrooms)) ? "#FF385C" : "#FFFFFF",
											color: (bathrooms === option || (option === "Any" && !bathrooms)) ? "#FFFFFF" : "#222222",
											border: `1px solid ${(bathrooms === option || (option === "Any" && !bathrooms)) ? "#FF385C" : "#DDDDDD"}`,
											borderRadius: "8px",
											fontSize: "14px",
											fontWeight: "600",
											cursor: "pointer",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											if (bathrooms !== option && !(option === "Any" && !bathrooms)) {
												e.currentTarget.style.borderColor = "#FF385C";
												e.currentTarget.style.backgroundColor = "#FFF5F7";
											}
										}}
										onMouseLeave={(e) => {
											if (bathrooms !== option && !(option === "Any" && !bathrooms)) {
												e.currentTarget.style.borderColor = "#DDDDDD";
												e.currentTarget.style.backgroundColor = "#FFFFFF";
											}
										}}
									>
										{option}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Property Type - Only show for HOMES */}
					{featureType === "HOMES" && (
					<div style={{ marginBottom: "24px" }}>
						<label style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							fontSize: "14px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
						}}>
							<HomeIcon size={18} color="#FF385C" />
							{getTranslation(displayLanguage, "filters.propertyType")}
						</label>
						<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
							{["House", "Apartment", "Villa", "Land"].map((type) => (
								<button
									key={type}
									onClick={() => setPropertyType(propertyType === type ? "" : type)}
									style={{
										padding: "12px",
										backgroundColor: propertyType === type ? "#FF385C" : "#FFFFFF",
										color: propertyType === type ? "#FFFFFF" : "#222222",
										border: `1px solid ${propertyType === type ? "#FF385C" : "#DDDDDD"}`,
										borderRadius: "8px",
										fontSize: "14px",
										fontWeight: "600",
										cursor: "pointer",
										transition: "all 0.2s ease",
										textAlign: "left",
									}}
									onMouseEnter={(e) => {
										if (propertyType !== type) {
											e.currentTarget.style.borderColor = "#FF385C";
											e.currentTarget.style.backgroundColor = "#FFF5F7";
										}
									}}
									onMouseLeave={(e) => {
										if (propertyType !== type) {
											e.currentTarget.style.borderColor = "#DDDDDD";
											e.currentTarget.style.backgroundColor = "#FFFFFF";
										}
									}}
								>
									{getTranslation(displayLanguage, `categories.${type.toLowerCase()}`)}
								</button>
							))}
						</div>
					</div>
					)}

					{/* Action Buttons */}
					<div style={{
						display: "flex",
						gap: "12px",
						paddingTop: "16px",
						borderTop: "1px solid #E0E0E0",
					}}>
						<button
							onClick={handleClearFilters}
							style={{
								flex: 1,
								padding: "12px",
								backgroundColor: "#FFFFFF",
								color: "#222222",
								border: "1px solid #DDDDDD",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "600",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#F0F0F0";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#FFFFFF";
							}}
						>
							{getTranslation(displayLanguage, "filters.clear")}
						</button>
						<button
							onClick={handleApplyFilters}
							style={{
								flex: 1,
								padding: "12px",
								backgroundColor: "#FF385C",
								color: "#FFFFFF",
								border: "none",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "600",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#E61E4D";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#FF385C";
							}}
						>
							{getTranslation(displayLanguage, "filters.apply")}
						</button>
					</div>
				</div>
			)}

			{/* Mobile Responsive Styles */}
			<style jsx global>{`
				.filter-backdrop {
					display: none;
				}

				/* Tablet and below (1024px and below) */
				@media (max-width: 1024px) {
					.filter-dropdown {
						width: 100% !important;
						max-width: 100% !important;
					}
				}

				/* Mobile - Standard (768px and below) */
				@media (max-width: 768px) {
					.filter-button-container {
						position: relative !important;
						z-index: auto !important;
					}

					.filter-button-container > button {
						padding: 8px 14px !important;
						font-size: 14px !important;
					}

					/* Ensure navbar and search sections stay behind filter */
					.filter-backdrop ~ * header,
					body:has(.filter-backdrop) header {
						z-index: 1 !important;
					}
					
					/* Lower search sections z-index when filter is open */
					body:has(.filter-backdrop) .homes-search-section,
					body:has(.filter-backdrop) .experiences-search-section,
					.filter-backdrop ~ * .homes-search-section,
					.filter-backdrop ~ * .experiences-search-section {
						z-index: 1 !important;
						position: relative !important;
					}

					.filter-backdrop {
						display: none !important;
					}

					.filter-dropdown {
						position: absolute !important;
						top: calc(100% + 12px) !important;
						left: auto !important;
						right: 0 !important;
						transform: none !important;
						width: calc(100% - 24px) !important;
						max-width: calc(100% - 24px) !important;
						max-height: 500px !important;
						height: auto !important;
						border-radius: 8px !important;
						border: 1px solid #DDDDDD !important;
						z-index: 100 !important;
						padding: 14px 12px 20px 12px !important;
						overflow-y: auto !important;
						box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
					}

					.filter-dropdown > div:first-child {
						position: sticky !important;
						top: 0 !important;
						background: #FFFFFF !important;
						z-index: 10 !important;
						padding-top: 0 !important;
						margin-top: 0 !important;
					}

					.filter-close-button {
						background: #F7F7F7 !important;
						border: 2px solid #DDDDDD !important;
						min-width: 40px !important;
						min-height: 40px !important;
						padding: 8px !important;
						box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
					}

					.filter-close-button svg {
						color: #222222 !important;
						width: 20px !important;
						height: 20px !important;
						stroke-width: 2.5 !important;
					}

					.filter-dropdown h3 {
						font-size: 17px !important;
						font-weight: 700 !important;
					}

					.filter-dropdown label {
						font-size: 14px !important;
						margin-bottom: 10px !important;
					}

					.filter-dropdown label svg {
						width: 16px !important;
						height: 16px !important;
					}

					.filter-dropdown input {
						font-size: 15px !important;
						padding: 10px 12px !important;
					}

					.filter-dropdown > div[style*="marginBottom"] {
						margin-bottom: 20px !important;
					}

					/* Bedrooms/Bathrooms Grid - 3 columns on mobile */
					.filter-dropdown > div > div[style*="gridTemplateColumns"] {
						grid-template-columns: repeat(3, 1fr) !important;
						gap: 8px !important;
					}

					.filter-dropdown button:not(.filter-close-button) {
						font-size: 13px !important;
						padding: 10px 8px !important;
						min-height: 42px !important;
					}

					/* Action buttons */
					.filter-dropdown > div[style*="flex"][style*="gap: 12px"] {
						gap: 10px !important;
						padding-top: 14px !important;
					}

					.filter-dropdown > div[style*="flex"][style*="gap: 12px"] button {
						padding: 12px !important;
						font-size: 14px !important;
					}
				}

				/* Small Mobile (640px and below) */
				@media (max-width: 640px) {
					.filter-dropdown {
						top: var(--navbar-height, 65px) !important;
						left: 12px !important;
						right: 12px !important;
						width: calc(100% - 24px) !important;
						max-width: calc(100% - 24px) !important;
						max-height: calc(100vh - var(--navbar-height, 65px) + 100px) !important;
						padding: 14px 12px 20px 12px !important;
					}

					.filter-dropdown h3 {
						font-size: 16px !important;
					}

					.filter-close-button {
						min-width: 36px !important;
						min-height: 36px !important;
						padding: 5px !important;
					}

					.filter-close-button svg {
						width: 16px !important;
						height: 16px !important;
					}

					.filter-dropdown label {
						font-size: 13px !important;
					}

					.filter-dropdown input {
						font-size: 14px !important;
						padding: 9px 11px !important;
					}

					.filter-dropdown button:not(.filter-close-button) {
						font-size: 12px !important;
						padding: 9px 6px !important;
						min-height: 40px !important;
					}
				}

				/* Extra Small Mobile (480px and below) */
				@media (max-width: 480px) {
					.filter-button-container > button {
						padding: 7px 12px !important;
						font-size: 13px !important;
						gap: 6px !important;
					}

					.filter-button-container > button svg {
						width: 16px !important;
						height: 16px !important;
					}

					.filter-dropdown {
						top: var(--navbar-height, 60px) !important;
						left: 12px !important;
						right: 12px !important;
						width: calc(100% - 24px) !important;
						max-width: calc(100% - 24px) !important;
						max-height: calc(100vh - var(--navbar-height, 60px) + 100px) !important;
						padding: 14px 12px 20px 12px !important;
					}

					.filter-dropdown h3 {
						font-size: 15px !important;
					}

					.filter-close-button {
						min-width: 34px !important;
						min-height: 34px !important;
						padding: 4px !important;
					}

					.filter-close-button svg {
						width: 15px !important;
						height: 15px !important;
					}

					.filter-dropdown label {
						font-size: 12px !important;
						margin-bottom: 8px !important;
					}

					.filter-dropdown label svg {
						width: 15px !important;
						height: 15px !important;
					}

					.filter-dropdown input {
						font-size: 13px !important;
						padding: 8px 10px !important;
					}

					.filter-dropdown > div[style*="marginBottom"] {
						margin-bottom: 18px !important;
					}

					/* Bedrooms/Bathrooms Grid - 2 columns on very small phones */
					.filter-dropdown > div > div[style*="gridTemplateColumns"] {
						grid-template-columns: repeat(2, 1fr) !important;
						gap: 6px !important;
					}

					.filter-dropdown button:not(.filter-close-button) {
						font-size: 12px !important;
						padding: 8px 6px !important;
						min-height: 38px !important;
					}

					/* Action buttons */
					.filter-dropdown > div[style*="flex"][style*="gap: 12px"] {
						gap: 8px !important;
						padding-top: 12px !important;
					}

					.filter-dropdown > div[style*="flex"][style*="gap: 12px"] button {
						padding: 11px !important;
						font-size: 13px !important;
					}

					/* Price inputs side by side */
					.filter-dropdown > div > div[style*="display: flex"][style*="gap: 12px"] {
						gap: 8px !important;
					}
				}

				/* Very Small Mobile (375px and below) */
				@media (max-width: 375px) {
					.filter-button-container > button {
						padding: 6px 10px !important;
						font-size: 12px !important;
					}

					.filter-dropdown {
						top: var(--navbar-height, 60px) !important;
						left: 12px !important;
						right: 12px !important;
						width: calc(100% - 24px) !important;
						max-width: calc(100% - 24px) !important;
						max-height: calc(100vh - var(--navbar-height, 60px) + 100px) !important;
						padding: 12px 10px 18px 10px !important;
					}

					.filter-dropdown h3 {
						font-size: 14px !important;
					}

					.filter-close-button {
						min-width: 32px !important;
						min-height: 32px !important;
					}

					.filter-close-button svg {
						width: 14px !important;
						height: 14px !important;
					}

					.filter-dropdown label {
						font-size: 11px !important;
					}

					.filter-dropdown input {
						font-size: 12px !important;
						padding: 7px 9px !important;
					}

					.filter-dropdown button:not(.filter-close-button) {
						font-size: 11px !important;
						padding: 7px 5px !important;
						min-height: 36px !important;
					}

					.filter-dropdown > div[style*="flex"][style*="gap: 12px"] button {
						padding: 10px !important;
						font-size: 12px !important;
					}
				}

				/* Tiny Mobile (320px and below) */
				@media (max-width: 320px) {
					.filter-button-container > button {
						padding: 5px 8px !important;
						font-size: 11px !important;
					}

					.filter-button-container > button span {
						display: none;
					}

					.filter-dropdown {
						top: var(--navbar-height, 60px) !important;
						left: 10px !important;
						right: 10px !important;
						width: calc(100% - 20px) !important;
						max-width: calc(100% - 20px) !important;
						max-height: calc(100vh - var(--navbar-height, 60px) + 100px) !important;
						padding: 10px 8px 16px 8px !important;
					}

					.filter-dropdown h3 {
						font-size: 13px !important;
					}

					.filter-close-button {
						min-width: 30px !important;
						min-height: 30px !important;
					}

					.filter-dropdown label {
						font-size: 10px !important;
					}

					.filter-dropdown input {
						font-size: 11px !important;
						padding: 6px 8px !important;
					}

					.filter-dropdown button:not(.filter-close-button) {
						font-size: 10px !important;
						padding: 6px 4px !important;
						min-height: 34px !important;
					}
				}

				/* Landscape Mobile */
				@media (max-width: 768px) and (orientation: landscape) {
					.filter-dropdown {
						top: var(--navbar-height, 60px) !important;
						max-height: calc(100vh - var(--navbar-height, 60px) - 40px) !important;
					}
				}
			`}</style>
		</div>
	);
};

export default FilterPanel;


"use client";
import React, { useState, useEffect, useRef } from "react";
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

	// Filter states
	const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
	const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
	const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
	const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "");
	const [propertyType, setPropertyType] = useState(searchParams.get("category") || "");

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
		
		// Update or remove price filters
		if (minPrice) {
			params.set("minPrice", minPrice);
		} else {
			params.delete("minPrice");
		}
		
		if (maxPrice) {
			params.set("maxPrice", maxPrice);
		} else {
			params.delete("maxPrice");
		}
		
		// Update or remove room filters
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
		
		// Update or remove property type
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
		params.delete("minPrice");
		params.delete("maxPrice");
		params.delete("bedrooms");
		params.delete("bathrooms");
		params.delete("category");
		
		router.push(`/${featureType.toLowerCase()}?${params.toString()}`);
		setShowFilters(false);
	};

	const activeFiltersCount = [minPrice, maxPrice, bedrooms, bathrooms, propertyType].filter(Boolean).length;

	return (
		<div ref={filterRef} className="filter-button-container" style={{ position: "relative" }}>
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
			<>
				{/* Backdrop for mobile */}
				<div 
					className="filter-backdrop"
					onClick={() => setShowFilters(false)}
				/>
				
				<div 
					className="filter-dropdown"
					style={{
						position: "absolute",
						top: "calc(100% + 12px)",
						right: "0",
						width: "380px",
						maxHeight: "500px",
						overflowY: "auto",
						backgroundColor: "#FFFFFF",
						border: "1px solid #DDDDDD",
						borderRadius: "16px",
						boxShadow: "0 8px 28px rgba(0, 0, 0, 0.12)",
						zIndex: 1000,
						padding: "24px",
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
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: "4px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "50%",
								transition: "background 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#F0F0F0";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							<X size={20} color="#717171" />
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

					{/* Bedrooms */}
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

					{/* Bathrooms */}
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

					{/* Property Type */}
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
			</>
			)}

			{/* Mobile Responsive Styles */}
			<style jsx global>{`
				.filter-backdrop {
					display: none;
				}

				@media (max-width: 768px) {
					.filter-button-container {
						position: relative !important;
						z-index: 99999999 !important;
					}

					.filter-backdrop {
						display: block;
						position: fixed;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background-color: rgba(0, 0, 0, 0.5);
						z-index: 99999998 !important;
					}

					.filter-dropdown {
						position: fixed !important;
						top: 50% !important;
						left: 50% !important;
						right: auto !important;
						transform: translate(-50%, -50%) !important;
						width: calc(100vw - 32px) !important;
						max-width: 360px !important;
						max-height: 80vh !important;
						z-index: 99999999 !important;
						padding: 20px !important;
					}

					.filter-dropdown h3 {
						font-size: 16px !important;
					}

					.filter-dropdown label {
						font-size: 13px !important;
					}

					.filter-dropdown input {
						font-size: 14px !important;
					}

					.filter-dropdown button {
						font-size: 13px !important;
						padding: 8px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default FilterPanel;


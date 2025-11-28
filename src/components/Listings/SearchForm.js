"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, Globe, MapPin, ArrowRight, Sparkles, Mountain, UtensilsCrossed, Palette, Heart, Map, BookOpen, Film, Dumbbell, ShoppingBag, Trees, Castle, Building2, Home as HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { moroccanCities, getNeighborhoodsByCity } from "@/libs/moroccanCities";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";
import axios from "axios";

// Get icon component by name
const getIcon = (iconName, size = 18, color = "#FF385C") => {
	const icons = {
		Mountain: <Mountain size={size} strokeWidth={2} color={color} />,
		UtensilsCrossed: <UtensilsCrossed size={size} strokeWidth={2} color={color} />,
		Palette: <Palette size={size} strokeWidth={2} color={color} />,
		Heart: <Heart size={size} strokeWidth={2} color={color} />,
		Map: <Map size={size} strokeWidth={2} color={color} />,
		BookOpen: <BookOpen size={size} strokeWidth={2} color={color} />,
		Film: <Film size={size} strokeWidth={2} color={color} />,
		Dumbbell: <Dumbbell size={size} strokeWidth={2} color={color} />,
		ShoppingBag: <ShoppingBag size={size} strokeWidth={2} color={color} />,
		Trees: <Trees size={size} strokeWidth={2} color={color} />,
		Castle: <Castle size={size} strokeWidth={2} color={color} />,
		Building2: <Building2 size={size} strokeWidth={2} color={color} />,
		HomeIcon: <HomeIcon size={size} strokeWidth={2} color={color} />,
	};
	return icons[iconName] || null;
};

// Experience Categories
const experienceCategories = [
	{ value: "Adventure & Outdoor", label: "Adventure & Outdoor", icon: "Mountain" },
	{ value: "Food & Drink", label: "Food & Drink", icon: "UtensilsCrossed" },
	{ value: "Art & Culture", label: "Art & Culture", icon: "Palette" },
	{ value: "Wellness", label: "Wellness", icon: "Heart" },
	{ value: "Tours & Sightseeing", label: "Tours & Sightseeing", icon: "Map" },
	{ value: "Classes & Workshops", label: "Classes & Workshops", icon: "BookOpen" },
	{ value: "Entertainment", label: "Entertainment", icon: "Film" },
	{ value: "Sports & Fitness", label: "Sports & Fitness", icon: "Dumbbell" },
	{ value: "Shopping", label: "Shopping", icon: "ShoppingBag" },
	{ value: "Nature & Wildlife", label: "Nature & Wildlife", icon: "Trees" },
];

// Property Categories for Homes
const propertyCategories = [
	{ value: "Villa", label: "Villa", icon: "Castle" },
	{ value: "Apartment", label: "Apartment", icon: "Building2" },
	{ value: "House", label: "House", icon: "HomeIcon" },
	{ value: "Land", label: "Land", icon: "Trees" },
];

const SearchForm = ({ searchParams, featureType }) => {
	const [category, setCategory] = useState("");
	const [locationValue, setLocationValue] = useState("");
	const [listingType, setListingType] = useState("");
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
	const [showLocationDropdown, setShowLocationDropdown] = useState(false);
	const [locationSearchTerm, setLocationSearchTerm] = useState("");
	const dropdownRef = useRef(null);
	const locationDropdownRef = useRef(null);
	const router = useRouter();
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;

	// Select categories based on feature type
	const categories = featureType === "EXPERIENCES" ? experienceCategories : propertyCategories;

	// Filter cities and neighborhoods based on search term
	const lowerSearchTerm = locationSearchTerm.toLowerCase();
	
	// Check if searching for Marrakech neighborhoods
	const isMarrakechSearch = lowerSearchTerm.includes("marrakech") || 
		moroccanCities.find(city => 
			city.value === "marrakech" && 
			(city.label.toLowerCase().includes(lowerSearchTerm) || lowerSearchTerm.includes(city.label.toLowerCase()))
		);
	
	// Get neighborhoods if searching for Marrakech
	let filteredNeighborhoods = [];
	if (isMarrakechSearch || lowerSearchTerm.length > 0) {
		const marrakechNeighborhoods = getNeighborhoodsByCity("marrakech");
		filteredNeighborhoods = marrakechNeighborhoods.filter(neighborhood =>
			neighborhood.label.toLowerCase().includes(lowerSearchTerm) ||
			lowerSearchTerm.includes(neighborhood.label.toLowerCase()) ||
			lowerSearchTerm.length === 0 // Show all if empty
		).map(neighborhood => ({
			value: `${neighborhood.label}, Marrakech`,
			label: `${neighborhood.label}, Marrakech`,
			isNeighborhood: true,
		}));
	}
	
	// Filter cities based on search term
	const filteredCities = moroccanCities.filter((city) =>
		city.label.toLowerCase().includes(lowerSearchTerm)
	).map(city => ({
		...city,
		isNeighborhood: false,
	}));

	useEffect(() => {
		if (searchParams) {
			const { category: cat, location_value: loc, listingType: lt } = searchParams;
			setCategory(cat || "");
			setLocationValue(loc || "");
			setListingType(lt || "");
		}
	}, [searchParams]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowCategoryDropdown(false);
			}
			if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
				setShowLocationDropdown(false);
			}
		};

		if (showCategoryDropdown || showLocationDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showCategoryDropdown, showLocationDropdown]);

	const handleSearch = useCallback((e) => {
		if (e) {
			e.preventDefault();
		}
		const params = new URLSearchParams();
		if (category) params.append("category", category);
		if (locationValue) params.append("location_value", locationValue);
		if (listingType) params.append("listingType", listingType);
		
		// Route to correct page based on feature type
		const basePath = featureType === "EXPERIENCES" 
			? "/experiences" 
			: featureType === "HOMES" 
				? "/homes" 
				: "/listings";
		router.push(`${basePath}?${params.toString()}`);
	}, [category, locationValue, listingType, featureType, router]);

	// Airbnb-style compact design for Experiences and Homes
	if (featureType === "EXPERIENCES" || featureType === "HOMES") {
		return (
			<form onSubmit={handleSearch} className="airbnb-search-form" style={{ position: "relative", zIndex: 100 }}>
				<div className="search-form-container" style={{
					display: "flex",
					alignItems: "center",
					backgroundColor: "#FFFFFF",
					border: "1px solid #DDDDDD",
					borderRadius: "50px",
					padding: "8px",
					boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
					transition: "box-shadow 0.2s ease",
					position: "relative",
					zIndex: 10,
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)";
				}}
				>
				{/* Where Section */}
				<div 
					ref={locationDropdownRef}
					className="search-where-section"
					style={{
						flex: 1,
						padding: "14px 24px",
						cursor: "pointer",
						borderRadius: "40px",
						transition: "background-color 0.2s ease",
						position: "relative",
						zIndex: 10,
					}}
					onClick={() => setShowLocationDropdown(!showLocationDropdown)}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#EBEBEB";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "transparent";
					}}
				>
					<div style={{
						fontSize: "12px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "2px",
					}}>
						{getTranslation(displayLanguage, "filters.where")}
					</div>
					<div style={{
						fontSize: "14px",
						color: locationValue ? "#222222" : "#717171",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}>
						{locationValue || getTranslation(displayLanguage, "filters.searchDestinations")}
					</div>

			{/* Location Dropdown Menu */}
			{showLocationDropdown && (
				<div className="location-dropdown" style={{
					position: "absolute",
					top: "calc(100% + 12px)",
					left: 0,
					right: 0,
					backgroundColor: "#FFFFFF",
					border: "1px solid rgba(0, 0, 0, 0.08)",
					borderRadius: "20px",
					boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
					zIndex: 99999,
					maxHeight: "360px",
					overflowY: "auto",
					minWidth: "300px",
					animation: "dropdownFadeIn 0.2s ease-out",
				}}>
						{/* Search Input Inside Dropdown */}
						<div style={{
							padding: "16px",
							borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
							position: "sticky",
							top: 0,
							backgroundColor: "#FFFFFF",
							zIndex: 1,
							backdropFilter: "blur(10px)",
						}}>
							<input
								type="text"
								placeholder="Search cities or neighborhoods (e.g. Issil, Gueliz)..."
								value={locationSearchTerm}
								onChange={(e) => setLocationSearchTerm(e.target.value)}
								onClick={(e) => e.stopPropagation()}
								style={{
									width: "100%",
									border: "2px solid #EEEEEE",
									borderRadius: "12px",
									padding: "12px 16px",
									fontSize: "14px",
									outline: "none",
									fontFamily: "inherit",
									transition: "all 0.2s ease",
									backgroundColor: "#F9F9F9",
									fontWeight: "500",
								}}
								onFocus={(e) => {
									e.target.style.border = "2px solid #FF385C";
									e.target.style.backgroundColor = "#FFFFFF";
								}}
								onBlur={(e) => {
									e.target.style.border = "2px solid #EEEEEE";
									e.target.style.backgroundColor = "#F9F9F9";
								}}
							/>
						</div>
						<div style={{ padding: "8px 0" }}>
							{/* Show neighborhoods first if searching for Marrakech */}
							{filteredNeighborhoods.length > 0 && (
								<>
									{filteredNeighborhoods.map((neighborhood, index) => (
										<div
											key={`neighborhood-${neighborhood.value}`}
											onClick={(e) => {
												e.stopPropagation();
												setLocationValue(neighborhood.label);
												setLocationSearchTerm(neighborhood.label);
												setShowLocationDropdown(false);
											}}
											style={{
												padding: "14px 20px",
												margin: "4px 8px",
												cursor: "pointer",
												transition: "all 0.2s ease",
												display: "flex",
												alignItems: "center",
												gap: "12px",
												fontSize: "15px",
												color: "#222222",
												fontWeight: "500",
												backgroundColor: locationValue === neighborhood.label ? "rgba(255, 56, 92, 0.08)" : "transparent",
												borderRadius: "12px",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = locationValue === neighborhood.label 
													? "rgba(255, 56, 92, 0.12)" 
													: "rgba(0, 0, 0, 0.04)";
												e.currentTarget.style.transform = "translateX(4px)";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = locationValue === neighborhood.label 
													? "rgba(255, 56, 92, 0.08)" 
													: "transparent";
												e.currentTarget.style.transform = "translateX(0)";
											}}
										>
											<div style={{
												width: "32px",
												height: "32px",
												borderRadius: "10px",
												background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												flexShrink: 0,
											}}>
												<MapPin size={16} color="#FFFFFF" strokeWidth={2.5} />
											</div>
											<span style={{ flex: 1 }}>{neighborhood.label}</span>
											{locationValue === neighborhood.label && (
												<div style={{
													width: "6px",
													height: "6px",
													borderRadius: "50%",
													background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
												}} />
											)}
										</div>
									))}
									{/* Divider between neighborhoods and cities */}
									{filteredCities.length > 0 && (
										<div style={{
											height: "1px",
											backgroundColor: "rgba(0, 0, 0, 0.06)",
											margin: "8px 16px",
										}} />
									)}
								</>
							)}
							{/* Show cities */}
							{filteredCities.map((city, index) => (
								<div
									key={city.value}
									onClick={(e) => {
										e.stopPropagation();
										setLocationValue(city.label);
										setLocationSearchTerm(city.label);
										setShowLocationDropdown(false);
									}}
									style={{
										padding: "14px 20px",
										margin: "4px 8px",
										cursor: "pointer",
										transition: "all 0.2s ease",
										display: "flex",
										alignItems: "center",
										gap: "12px",
										fontSize: "15px",
										color: "#222222",
										fontWeight: "500",
										backgroundColor: locationValue === city.label ? "rgba(255, 56, 92, 0.08)" : "transparent",
										borderRadius: "12px",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = locationValue === city.label 
											? "rgba(255, 56, 92, 0.12)" 
											: "rgba(0, 0, 0, 0.04)";
										e.currentTarget.style.transform = "translateX(4px)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = locationValue === city.label 
											? "rgba(255, 56, 92, 0.08)" 
											: "transparent";
										e.currentTarget.style.transform = "translateX(0)";
									}}
								>
									<div style={{
										width: "32px",
										height: "32px",
										borderRadius: "10px",
										background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
									}}>
										<MapPin size={16} color="#FFFFFF" strokeWidth={2.5} />
									</div>
									<span style={{ flex: 1 }}>{city.label}</span>
									{locationValue === city.label && (
										<div style={{
											width: "6px",
											height: "6px",
											borderRadius: "50%",
											background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
										}} />
									)}
								</div>
							))}
						</div>
					</div>
				)}
				</div>

				{/* Divider */}
				<div className="search-divider" style={{
					width: "1px",
					height: "32px",
					backgroundColor: "#DDDDDD",
				}} />

				{/* Type of Service Section */}
				<div 
					ref={dropdownRef}
					className="search-type-section"
					style={{
						flex: 1,
						padding: "14px 24px",
						cursor: "pointer",
						borderRadius: "40px",
						transition: "background-color 0.2s ease",
						position: "relative",
						zIndex: 10,
					}}
					onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#EBEBEB";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "transparent";
					}}
				>
					<div style={{
						fontSize: "12px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "2px",
					}}>
						{getTranslation(displayLanguage, "filters.propertyType")}
					</div>
						<div style={{
							fontSize: "14px",
							color: category ? "#222222" : "#717171",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}>
							{category 
								? getTranslation(displayLanguage, `categories.${category.toLowerCase()}`)
								: getTranslation(displayLanguage, "filters.addPropertyType")
							}
						</div>

				{/* Dropdown Menu */}
				{showCategoryDropdown && (
					<div className="category-dropdown" style={{
						position: "absolute",
						top: "calc(100% + 12px)",
						left: 0,
						right: 0,
						backgroundColor: "#FFFFFF",
						border: "1px solid rgba(0, 0, 0, 0.08)",
						borderRadius: "20px",
						boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
						zIndex: 99999,
						maxHeight: "420px",
						overflowY: "auto",
						minWidth: "280px",
						animation: "dropdownFadeIn 0.2s ease-out",
					}}>
						<div style={{ padding: "8px 0" }}>
							{categories.map((cat, index) => (
								<div
									key={cat.value}
									onClick={(e) => {
										e.stopPropagation();
										setCategory(cat.value);
										setShowCategoryDropdown(false);
									}}
									style={{
										padding: "14px 20px",
										margin: "4px 8px",
										cursor: "pointer",
										transition: "all 0.2s ease",
										display: "flex",
										alignItems: "center",
										gap: "14px",
										fontSize: "15px",
										color: "#222222",
										fontWeight: "500",
										backgroundColor: category === cat.value ? "rgba(255, 56, 92, 0.08)" : "transparent",
										borderRadius: "12px",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = category === cat.value 
											? "rgba(255, 56, 92, 0.12)" 
											: "rgba(0, 0, 0, 0.04)";
										e.currentTarget.style.transform = "translateX(4px)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = category === cat.value 
											? "rgba(255, 56, 92, 0.08)" 
											: "transparent";
										e.currentTarget.style.transform = "translateX(0)";
									}}
								>
									<div style={{
										width: "36px",
										height: "36px",
										borderRadius: "10px",
										background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
									}}>
										{getIcon(cat.icon, 18, "#FFFFFF")}
									</div>
									<span style={{ flex: 1 }}>{cat.label}</span>
									{category === cat.value && (
										<div style={{
											width: "6px",
											height: "6px",
											borderRadius: "50%",
											background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
										}} />
									)}
								</div>
							))}
						</div>
					</div>
				)}
				</div>

				{/* Search Button */}
				<button
					type="submit"
					className="search-submit-button"
					style={{
						background: "linear-gradient(to right, #E61E4D 0%, #D70466 100%)",
						color: "#FFFFFF",
						border: "none",
						borderRadius: "50%",
						width: "48px",
						height: "48px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
						transition: "transform 0.1s ease",
						boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "scale(1.04)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
				>
					<Search size={18} strokeWidth={3} />
				</button>
			</div>

			{/* Dropdown Animation & Mobile Responsive Styles */}
			<style jsx>{`
				@keyframes dropdownFadeIn {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				
				.location-dropdown::-webkit-scrollbar,
				.category-dropdown::-webkit-scrollbar {
					width: 8px;
				}
				
				.location-dropdown::-webkit-scrollbar-track,
				.category-dropdown::-webkit-scrollbar-track {
					background: transparent;
					margin: 8px 0;
				}
				
				.location-dropdown::-webkit-scrollbar-thumb,
				.category-dropdown::-webkit-scrollbar-thumb {
					background: linear-gradient(135deg, #FF385C 0%, #E61E4D 100%);
					border-radius: 10px;
				}
				
				.location-dropdown::-webkit-scrollbar-thumb:hover,
				.category-dropdown::-webkit-scrollbar-thumb:hover {
					background: linear-gradient(135deg, #E61E4D 0%, #D70466 100%);
				}
				
				@media (max-width: 768px) {
					.search-form-container {
						flex-direction: column !important;
						border-radius: 16px !important;
						padding: 16px !important;
						align-items: stretch !important;
					}
					
					.search-where-section,
					.search-type-section {
						padding: 16px 16px !important;
						width: 100% !important;
						flex: none !important;
						border-radius: 12px !important;
						background-color: #F7F7F7 !important;
						position: relative !important;
					}
					
					.search-where-section {
						margin-bottom: 12px !important;
						z-index: 20 !important;
					}
					
					.search-type-section {
						z-index: 15 !important;
					}
					
					.search-divider {
						display: none !important;
					}
					
					.search-submit-button {
						width: 100% !important;
						border-radius: 12px !important;
						height: 52px !important;
						margin-top: 12px !important;
						font-size: 16px !important;
						font-weight: 600 !important;
						position: relative !important;
						z-index: 5 !important;
					}
					
					/* Dropdown positioning for mobile */
					.location-dropdown,
					.category-dropdown {
						position: absolute !important;
						left: 0 !important;
						right: 0 !important;
						top: calc(100% + 8px) !important;
						width: 100% !important;
						max-height: 300px !important;
						z-index: 999999 !important;
						box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25) !important;
					}
				}
			`}</style>
		</form>
		);
	}

	// Original design for other pages
	return (
		<form
			onSubmit={handleSearch}
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "24px",
			}}
		>
			<div style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
				gap: "20px",
				alignItems: "flex-end",
			}}
			className="search-form-grid"
			>
			{/* Category/What Search - Dropdown for Experiences, Text Input for Others */}
			<div style={{ position: "relative", flex: 1 }} ref={dropdownRef}>
				<label style={{
					display: "block",
					fontSize: "14px",
					fontWeight: "600",
					color: "#222222",
					marginBottom: "8px",
				}}>
					{featureType === "EXPERIENCES" ? "Type of Experience" : "What are you looking for?"}
				</label>
				<div style={{ position: "relative" }}>
					{featureType === "EXPERIENCES" ? (
						// Dropdown for Experiences
						<>
							<div
								onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
								style={{
									width: "100%",
									padding: "16px 45px 16px 50px",
									border: showCategoryDropdown ? "2px solid #FF385C" : "2px solid #E0E0E0",
									borderRadius: "12px",
									fontSize: "15px",
									fontFamily: "inherit",
									backgroundColor: "#FFFFFF",
									color: category ? "#222222" : "#717171",
									transition: "all 0.2s ease",
									outline: "none",
									boxSizing: "border-box",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									boxShadow: showCategoryDropdown ? "0 0 0 4px rgba(255, 56, 92, 0.1)" : "none",
								}}
							>
					<span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						{category ? (
							<>
								{getIcon(categories.find(cat => cat.value === category)?.icon, 18, "#FF385C")}
								<span>{category}</span>
							</>
						) : (
							<span>{featureType === "EXPERIENCES" ? "Select experience type..." : "Select property type..."}</span>
						)}
					</span>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									style={{
										transform: showCategoryDropdown ? "rotate(180deg)" : "rotate(0deg)",
										transition: "transform 0.2s ease",
										color: "#717171",
										position: "absolute",
										right: "16px",
									}}
								>
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</div>
							
							{/* Dropdown Menu */}
							{showCategoryDropdown && (
								<div style={{
									position: "absolute",
									top: "calc(100% + 8px)",
									left: 0,
									right: 0,
									backgroundColor: "#FFFFFF",
									border: "1px solid #E0E0E0",
									borderRadius: "12px",
									boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
									zIndex: 1000,
									maxHeight: "320px",
									overflowY: "auto",
								}}>
									{categories.map((cat) => (
										<div
											key={cat.value}
											onClick={() => {
												setCategory(cat.value);
												setShowCategoryDropdown(false);
											}}
											style={{
												padding: "14px 20px",
												cursor: "pointer",
												transition: "background-color 0.15s ease",
												borderBottom: "1px solid #F7F7F7",
												display: "flex",
												alignItems: "center",
												gap: "12px",
												fontSize: "15px",
												color: "#222222",
												backgroundColor: category === cat.value ? "#FFF4F6" : "transparent",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = "#FFF4F6";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = category === cat.value ? "#FFF4F6" : "transparent";
											}}
										>
									{getIcon(cat.icon, 20, "#FF385C")}
											<span style={{ fontWeight: category === cat.value ? "600" : "400" }}>
												{cat.label}
											</span>
										</div>
									))}
								</div>
							)}
						</>
					) : (
						// Text Input for other pages
						<input
							type="text"
							placeholder="Type what are you looking for..."
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							style={{
								width: "100%",
								padding: "16px 20px 16px 50px",
								border: "2px solid #E0E0E0",
								borderRadius: "12px",
								fontSize: "15px",
								fontFamily: "inherit",
								backgroundColor: "#FFFFFF",
								color: "#222222",
								transition: "all 0.2s ease",
								outline: "none",
								boxSizing: "border-box",
							}}
							onFocus={(e) => {
								e.currentTarget.style.borderColor = "#FF385C";
								e.currentTarget.style.boxShadow = "0 0 0 4px rgba(255, 56, 92, 0.1)";
							}}
							onBlur={(e) => {
								e.currentTarget.style.borderColor = "#E0E0E0";
								e.currentTarget.style.boxShadow = "none";
							}}
						/>
					)}
					<div style={{
						position: "absolute",
						left: "16px",
						top: "50%",
						transform: "translateY(-50%)",
						display: "flex",
						alignItems: "center",
						pointerEvents: "none",
					}}>
						{featureType === "EXPERIENCES" ? (
							<Sparkles size={20} color="#717171" strokeWidth={2} />
						) : (
							<Globe size={20} color="#717171" strokeWidth={2} />
						)}
					</div>
				</div>
			</div>

				{/* Location Input */}
				<div style={{ position: "relative", flex: 1 }}>
					<label style={{
						display: "block",
						fontSize: "14px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "8px",
					}}>
						Location
					</label>
					<div style={{ position: "relative" }}>
						<input
							type="text"
							placeholder="Enter Neighborhood (e.g. Gueliz Marrakech)"
							value={locationValue}
							onChange={(e) => setLocationValue(e.target.value)}
							style={{
								width: "100%",
								padding: "16px 20px 16px 50px",
								border: "2px solid #E0E0E0",
								borderRadius: "12px",
								fontSize: "15px",
								fontFamily: "inherit",
								backgroundColor: "#FFFFFF",
								color: "#222222",
								transition: "all 0.2s ease",
								outline: "none",
								boxSizing: "border-box",
							}}
							onFocus={(e) => {
								e.currentTarget.style.borderColor = "#FF385C";
								e.currentTarget.style.boxShadow = "0 0 0 4px rgba(255, 56, 92, 0.1)";
							}}
							onBlur={(e) => {
								e.currentTarget.style.borderColor = "#E0E0E0";
								e.currentTarget.style.boxShadow = "none";
							}}
						/>
						<div style={{
							position: "absolute",
							left: "16px",
							top: "50%",
							transform: "translateY(-50%)",
							display: "flex",
							alignItems: "center",
							pointerEvents: "none",
						}}>
							<MapPin size={20} color="#717171" strokeWidth={2} />
						</div>
					</div>
			</div>

			{/* Listing Type Filter */}
				<div style={{ position: "relative", flex: 1 }}>
					<label style={{
						display: "block",
						fontSize: "14px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "8px",
					}}>
						Type
					</label>
					<div style={{ position: "relative" }}>
						<select
							value={listingType}
							onChange={(e) => setListingType(e.target.value)}
							style={{
								width: "100%",
								padding: "16px 20px",
								border: "2px solid #E0E0E0",
								borderRadius: "12px",
								fontSize: "15px",
								fontFamily: "inherit",
								backgroundColor: "#FFFFFF",
								color: listingType ? "#222222" : "#717171",
								transition: "all 0.2s ease",
								outline: "none",
								boxSizing: "border-box",
								cursor: "pointer",
								appearance: "none",
								backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23717171' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "right 16px center",
								paddingRight: "48px",
							}}
							onFocus={(e) => {
								e.currentTarget.style.borderColor = "#FF385C";
								e.currentTarget.style.boxShadow = "0 0 0 4px rgba(255, 56, 92, 0.1)";
							}}
							onBlur={(e) => {
								e.currentTarget.style.borderColor = "#E0E0E0";
								e.currentTarget.style.boxShadow = "none";
							}}
						>
							<option value="">All Types</option>
							<option value="SALE">For Sale</option>
							<option value="RENT">For Rent (Monthly)</option>
							<option value="DAILY_RENT">For Rent (Daily)</option>
						</select>
					</div>
				</div>

				{/* Search Button */}
				<div style={{
					display: "flex",
					alignItems: "flex-end",
					flex: "0 0 auto",
				}}>
					<button
						type="submit"
						style={{
							background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
							color: "#FFFFFF",
							border: "none",
							padding: "16px 32px",
							borderRadius: "12px",
							fontSize: "16px",
							fontWeight: "600",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "10px",
							transition: "all 0.2s ease",
							boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
							whiteSpace: "nowrap",
							minWidth: "160px",
							justifyContent: "center",
							height: "52px",
							width: "100%",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "translateY(-2px)";
							e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 56, 92, 0.4)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.3)";
						}}
					>
						<Search size={20} strokeWidth={2.5} />
						Search Now
					</button>
				</div>
			</div>

			<style jsx>{`
				/* Hide number input spinners */
				input[type="number"]::-webkit-inner-spin-button,
				input[type="number"]::-webkit-outer-spin-button {
					-webkit-appearance: none;
					margin: 0;
				}
				input[type="number"] {
					-moz-appearance: textfield;
				}
				
				@media (max-width: 768px) {
					.search-form-grid {
						grid-template-columns: 1fr !important;
					}
				}
				@media (min-width: 769px) and (max-width: 1128px) {
					.search-form-grid {
						grid-template-columns: 1fr 1fr !important;
					}
					.search-form-grid > div:last-child {
						grid-column: 1 / -1;
					}
				}
				@media (min-width: 1129px) and (max-width: 1400px) {
					.search-form-grid {
						grid-template-columns: 1fr 1fr 1fr 1fr !important;
					}
					.search-form-grid > div:last-child {
						grid-column: 1 / -1;
					}
				}
			`}</style>
		</form>
	);
};

export default SearchForm;

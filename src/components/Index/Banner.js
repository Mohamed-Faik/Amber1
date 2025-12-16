"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { categories as allCategories } from "@/libs/Categories";
import { moroccanCities, getNeighborhoodsByCity } from "@/libs/moroccanCities";
import LocationFind from "./LocationFind";
import { toast } from "react-hot-toast";
import { Home, MapPin, Navigation, ChevronDown, Castle, Building2, Trees } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

// Map category names to Lucide icons
const getCategoryIcon = (categoryLabel) => {
	const iconMap = {
		"Villa": Castle,
		"Apartment": Building2,
		"House": Home,
		"Land": Trees,
		"Commercial": Building2,
		"Riad": Castle,
	};
	return iconMap[categoryLabel] || Home;
};

const Banner = () => {
	const router = useRouter();
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [saleType, setSaleType] = useState("forSale");
	const [category, setCategory] = useState("");
	const [location, setLocation] = useState("");
	const [street, setStreet] = useState("");
	const [streetOptions, setStreetOptions] = useState([]);
	const [showStreetDropdown, setShowStreetDropdown] = useState(false);
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
	const [showSaleTypeDropdown, setShowSaleTypeDropdown] = useState(false);
	const [showLocationDropdown, setShowLocationDropdown] = useState(false);
	const [locationSearchTerm, setLocationSearchTerm] = useState("");
	const [locations, setLocations] = useState([]);
	const [locSuggest, setLocSuggest] = useState(false);
	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const categoryInputRef = useRef(null);
	const saleTypeInputRef = useRef(null);
	const locationInputRef = useRef(null);
	const streetInputRef = useRef(null);
	const dropdownRef = useRef(null);
	const saleTypeDropdownRef = useRef(null);
	const locationDropdownRef = useRef(null);
	const streetDropdownRef = useRef(null);

	const handleSearch = (e) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (category) params.append("category", category);
		if (location) params.append("location_value", location);
		if (street) params.append("street", street);

		// Map saleType to listingType
		if (saleType === "forSale") {
			params.append("listingType", "SALE");
		} else if (saleType === "forRent") {
			params.append("listingType", "RENT");
		} else if (saleType === "forRentDaily") {
			params.append("listingType", "DAILY_RENT");
		}

		router.push(`/listings?${params.toString()}`);
	};

	const handleCategorySelect = (cat) => {
		setCategory(cat);
		setShowCategoryDropdown(false);
	};

	const handleCategoryClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowCategoryDropdown((prev) => !prev);
	};

	const handleSaleTypeSelect = (type) => {
		setSaleType(type);
		setShowSaleTypeDropdown(false);
	};

	const handleSaleTypeClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowSaleTypeDropdown((prev) => !prev);
	};

	const handleLocationClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowLocationDropdown((prev) => !prev);
	};

	const getCityByLabel = (label) =>
		moroccanCities.find((city) => city.label.toLowerCase() === label.toLowerCase());

	const handleLocationCitySelect = (cityLabel) => {
		const city = getCityByLabel(cityLabel);
		const neighborhoods = city ? getNeighborhoodsByCity(city.value) : [];
		setLocation(cityLabel);
		setLocationSearchTerm(cityLabel);
		setStreet("");
		setStreetOptions(neighborhoods);
		setShowLocationDropdown(false);
		setShowStreetDropdown(false);
	};

	const handleNeighborhoodSelect = (cityLabel, neighborhoodLabel) => {
		const city = getCityByLabel(cityLabel);
		const neighborhoods = city ? getNeighborhoodsByCity(city.value) : [];
		setLocation(cityLabel);
		setLocationSearchTerm(cityLabel);
		setStreet(neighborhoodLabel);
		setStreetOptions(neighborhoods);
		setShowLocationDropdown(false);
		setShowStreetDropdown(false);
	};

	const handleLocationSelect = (loc) => {
		setLocSuggest(false);
		setLocation(loc);
	};

	// Filter cities and neighborhoods based on search term
	const lowerSearchTerm = locationSearchTerm.toLowerCase();

	// Filter cities based on search term
	const filteredCities = moroccanCities.filter((city) =>
		city.label.toLowerCase().includes(lowerSearchTerm)
	).map(city => ({
		...city,
		isNeighborhood: false,
	}));

	// Get neighborhoods from all cities when user is actively searching
	let filteredNeighborhoods = [];
	if (lowerSearchTerm.length > 0) {
		// Get neighborhoods from all Moroccan cities
		moroccanCities.forEach(city => {
			const cityNeighborhoods = getNeighborhoodsByCity(city.value);
			const matchingNeighborhoods = cityNeighborhoods.filter(neighborhood =>
				neighborhood.label.toLowerCase().includes(lowerSearchTerm) ||
				lowerSearchTerm.includes(neighborhood.label.toLowerCase()) ||
				neighborhood.value.toLowerCase().includes(lowerSearchTerm)
			).map(neighborhood => ({
				value: `${neighborhood.label}, ${city.label}`,
				label: `${neighborhood.label}, ${city.label}`,
				isNeighborhood: true,
				city: city.label,
			}));
			filteredNeighborhoods = [...filteredNeighborhoods, ...matchingNeighborhoods];
		});
	}

	const locationFind = useCallback((locValue) => {
		if (locValue) {
			axios
				.get(`/api/categories/location/${locValue}`)
				.then((response) => {
					setLocations(response.data);
				})
				.catch((error) => {
					toast.error("Something went wrong!");
				});
			setLocSuggest(true);
		}
	}, []);

	// Check if page is fully loaded
	useEffect(() => {
		// Check if already loaded
		if (document.readyState === 'complete') {
			// Add a small delay to ensure styles are fully applied
			const timer = setTimeout(() => {
				setIsPageLoaded(true);
			}, 100);
			return () => clearTimeout(timer);
		}

		// Wait for load event
		const handleLoad = () => {
			// Add a small delay to ensure styles are fully applied, especially on mobile
			setTimeout(() => {
				setIsPageLoaded(true);
			}, 100);
		};

		window.addEventListener('load', handleLoad);
		return () => {
			window.removeEventListener('load', handleLoad);
		};
	}, []);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				categoryInputRef.current &&
				!categoryInputRef.current.contains(event.target)
			) {
				setShowCategoryDropdown(false);
			}
			if (
				saleTypeDropdownRef.current &&
				!saleTypeDropdownRef.current.contains(event.target) &&
				saleTypeInputRef.current &&
				!saleTypeInputRef.current.contains(event.target)
			) {
				setShowSaleTypeDropdown(false);
			}
			if (
				locationDropdownRef.current &&
				!locationDropdownRef.current.contains(event.target) &&
				locationInputRef.current &&
				!locationInputRef.current.contains(event.target)
			) {
				setShowLocationDropdown(false);
			}
			if (
				streetDropdownRef.current &&
				!streetDropdownRef.current.contains(event.target) &&
				streetInputRef.current &&
				!streetInputRef.current.contains(event.target)
			) {
				setShowStreetDropdown(false);
			}
		};

		if (showCategoryDropdown || showSaleTypeDropdown || showLocationDropdown || showStreetDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showCategoryDropdown, showSaleTypeDropdown, showLocationDropdown, showStreetDropdown]);

	const saleTypes = [
		{ key: "forSale", label: getTranslation(displayLanguage, "hero.forSale") },
		{ key: "forRent", label: getTranslation(displayLanguage, "hero.forRent") },
		{ key: "forRentDaily", label: getTranslation(displayLanguage, "hero.forRentDaily") }
	];

	// Get translated label for current saleType
	const getSaleTypeLabel = (key) => {
		const type = saleTypes.find(t => t.key === key);
		return type ? type.label : key;
	};

	return (
		<div
			className="hero-banner-container"
			style={{
				position: "relative",
				height: "750px",
				overflow: "visible",
			}}
		>
			{/* Hero Background Video */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 1,
					overflow: "hidden",
				}}
			>
				<video
					autoPlay
					loop
					muted
					playsInline
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
				>
					<source src="/videos/5138024-uhd_4096_2160_25fps.mp4" type="video/mp4" />
					{/* Fallback image if video doesn't load */}
					<Image
						src="/images/banner/hero-bg-1.jpg"
						alt="Hero Background"
						fill
						style={{
							objectFit: "cover",
						}}
					/>
				</video>
			</div>

			{/* Gradient Overlay */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						"linear-gradient(to bottom, rgba(255, 56, 92, 0.15) 0%, rgba(0, 0, 0, 0.25) 40%, rgba(0, 0, 0, 0.5) 100%)",
					zIndex: 2,
				}}
			/>

			{/* Gradient Overlay Enhancement */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)",
					zIndex: 2,
					pointerEvents: "none",
				}}
			/>

			{/* Content Container */}
			<div
				className="banner-content-container"
				style={{
					position: "relative",
					zIndex: 3,
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "flex-end",
					paddingBottom: "60px",
					overflow: "visible",
				}}
			>
				<div
					className="banner-content-wrapper"
					style={{
						maxWidth: "1000px",
						width: "100%",
						margin: "0 auto",
						padding: "0 11px",
					}}
				>
					{/* Quote Text */}
					<div
						className="banner-quote-text"
						style={{
							textAlign: "center",
							marginBottom: "40px",
							marginTop: "clamp(60px, 10vw, 120px)",
							width: "100%",
							animation: "fadeInUp 0.8s ease-out",
							position: "relative",
							padding: "0 20px",
							minHeight: "clamp(120px, 15vw, 200px)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						{/* First Line - Upper Left with Opening Quote */}
						<div
							style={{
								display: "flex",
								alignItems: "flex-start",
								marginBottom: "0",
								position: "relative",
								zIndex: 2,
								justifyContent: "center",
							}}
						>
							{/* Opening Quote Mark */}
							<span
								style={{
									color: "#FF385C",
									fontSize: "clamp(64px, 9vw, 128px)",
									fontWeight: "400",
									lineHeight: "0.7",
									display: "inline-block",
									fontFamily: "Georgia, serif",
									opacity: "1",
									marginRight: "clamp(8px, 1vw, 16px)",
									alignSelf: "flex-start",
								}}
							>"</span>

							<div
								style={{
									fontSize: "clamp(40px, 6vw, 80px)",
									fontWeight: "700",
									color: "#FFFFFF",
									fontFamily: "var(--font-satisfy), 'Satisfy', cursive",
									lineHeight: "1.2",
									textShadow: "0 4px 16px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.4)",
									margin: 0,
									letterSpacing: "1.5px",
									whiteSpace: "nowrap",
									fontStyle: "italic",
								}}
							>
								{(() => {
									const quote = getTranslation(displayLanguage, "hero.quote");
									if (quote.includes(",")) {
										return quote.split(",")[0] + ",";
									} else if (quote.includes(" not")) {
										return quote.split(" not")[0];
									}
									return quote;
								})()}
							</div>
						</div>

						{/* Second Line - Lower Right, Slightly Indented with Closing Quote */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginTop: "clamp(8px, 1.5vw, 16px)",
								paddingLeft: "clamp(40px, 5vw, 80px)",
								position: "relative",
								zIndex: 2,
								justifyContent: "center",
							}}
						>
							<div
								style={{
									fontSize: "clamp(40px, 6vw, 80px)",
									fontWeight: "700",
									color: "#FFFFFF",
									fontFamily: "var(--font-satisfy), 'Satisfy', cursive",
									lineHeight: "1.2",
									textShadow: "0 4px 16px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.4)",
									margin: 0,
									letterSpacing: "1.5px",
									whiteSpace: "nowrap",
									fontStyle: "italic",
								}}
							>
								{(() => {
									const quote = getTranslation(displayLanguage, "hero.quote");
									if (quote.includes(",")) {
										return quote.split(",").slice(1).join(",").trim();
									} else if (quote.includes(" not")) {
										return "not" + quote.split(" not")[1];
									}
									return quote;
								})()}
							</div>

							{/* Closing Quote Mark */}
							<span
								style={{
									color: "#FF385C",
									fontSize: "clamp(64px, 9vw, 128px)",
									fontWeight: "400",
									lineHeight: "0.7",
									display: "inline-block",
									marginLeft: "clamp(8px, 1vw, 16px)",
									fontFamily: "Georgia, serif",
									opacity: "1",
									alignSelf: "flex-start",
								}}
							>"</span>
						</div>
					</div>

					{/* Search Form Container */}
					<div
						className="banner-search-form"
						style={{
							backgroundColor: "#FFFFFF",
							borderRadius: "56px",
							padding: "24px",
							boxShadow: "0 24px 80px rgba(0, 0, 0, 0.16), 0 8px 32px rgba(0, 0, 0, 0.12)",
							width: "85%",
							maxWidth: "800px",
							margin: "0 auto",
							position: "relative",
							zIndex: 1000,
							border: "2px solid rgba(255, 255, 255, 0.9)",
							background: "linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)",
							animation: "fadeInUp 1s ease-out 0.2s both",
							opacity: isPageLoaded ? 1 : 0,
							visibility: isPageLoaded ? "visible" : "hidden",
							transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
						}}
					>
						<form onSubmit={handleSearch}>
							{/* Top Row */}
							<div
								className="banner-form-top-row"
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "12px",
									marginBottom: "12px",
									paddingBottom: "12px",
									borderBottom: "2px solid #F0F0F0",
								}}
							>
								{/* For Sale Dropdown */}
								<div style={{ position: "relative", zIndex: showSaleTypeDropdown ? 1001 : 1 }} ref={saleTypeInputRef}>
									<div
										onClick={handleSaleTypeClick}
										style={{
											width: "100%",
											padding: "12px 16px 12px 44px",
											border: showSaleTypeDropdown ? "3px solid #FF385C" : "2px solid #E0E0E0",
											borderRadius: "32px",
											backgroundColor: showSaleTypeDropdown ? "#FFF5F7" : "#F8F8F8",
											fontSize: "14px",
											fontWeight: "600",
											outline: "none",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											color: saleType ? "#1A1A1A" : "#666666",
											transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
											boxShadow: showSaleTypeDropdown
												? "0 12px 32px rgba(255, 56, 92, 0.25), 0 4px 12px rgba(255, 56, 92, 0.15)"
												: "0 4px 8px rgba(0, 0, 0, 0.06)",
										}}
										onMouseEnter={(e) => {
											if (!showSaleTypeDropdown) {
												e.currentTarget.style.borderColor = "#FF385C";
												e.currentTarget.style.backgroundColor = "#FFFFFF";
												e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.15)";
												e.currentTarget.style.transform = "translateY(-1px)";
											}
										}}
										onMouseLeave={(e) => {
											if (!showSaleTypeDropdown) {
												e.currentTarget.style.borderColor = "#E8E8E8";
												e.currentTarget.style.backgroundColor = "#FAFAFA";
												e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.04)";
												e.currentTarget.style.transform = "translateY(0)";
											}
										}}
									>
										<span>{getSaleTypeLabel(saleType)}</span>
										<ChevronDown
											size={16}
											color={showSaleTypeDropdown ? "#FF385C" : "#717171"}
											style={{
												transform: showSaleTypeDropdown ? "rotate(180deg)" : "rotate(0deg)",
												transition: "transform 0.2s ease",
											}}
										/>
									</div>
									<div
										style={{
											position: "absolute",
											left: "16px",
											top: "50%",
											transform: "translateY(-50%)",
											pointerEvents: "none",
											zIndex: 1,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: "20px",
											height: "20px",
											backgroundColor: showSaleTypeDropdown ? "rgba(255, 56, 92, 0.1)" : "rgba(0, 0, 0, 0.05)",
											borderRadius: "8px",
											transition: "all 0.3s ease",
										}}
									>
										<Home size={18} color={showSaleTypeDropdown ? "#FF385C" : "#666666"} strokeWidth={2.5} />
									</div>
									{/* Sale Type Dropdown */}
									<div
										ref={saleTypeDropdownRef}
										style={{
											position: "absolute",
											top: "calc(100% + 8px)",
											left: 0,
											right: 0,
											backgroundColor: "#FFFFFF",
											border: "1px solid rgba(0, 0, 0, 0.06)",
											borderRadius: "16px",
											boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)",
											zIndex: 1002,
											overflow: "hidden",
											marginTop: "4px",
											opacity: showSaleTypeDropdown ? 1 : 0,
											transform: showSaleTypeDropdown ? "translateY(0)" : "translateY(-10px)",
											visibility: showSaleTypeDropdown ? "visible" : "hidden",
											transition: "opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out",
											pointerEvents: showSaleTypeDropdown ? "auto" : "none",
											animation: showSaleTypeDropdown ? "dropdownFadeIn 0.2s ease-out" : "none",
										}}
									>
										<div style={{ padding: "8px 0" }}>
											{saleTypes.map((type, index) => (
												<div
													key={type.key}
													onClick={() => handleSaleTypeSelect(type.key)}
													style={{
														padding: "10px 18px",
														margin: "3px 6px",
														cursor: "pointer",
														transition: "all 0.2s ease",
														fontSize: "14px",
														fontWeight: "500",
														color: "#222222",
														backgroundColor: saleType === type.key ? "rgba(255, 56, 92, 0.08)" : "transparent",
														display: "flex",
														alignItems: "center",
														gap: "12px",
														borderRadius: "8px",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.backgroundColor = saleType === type.key
															? "rgba(255, 56, 92, 0.12)"
															: "rgba(0, 0, 0, 0.04)";
														e.currentTarget.style.transform = "translateX(2px)";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.backgroundColor = saleType === type.key
															? "rgba(255, 56, 92, 0.08)"
															: "transparent";
														e.currentTarget.style.transform = "translateX(0)";
													}}
												>
													<div style={{
														width: "32px",
														height: "32px",
														borderRadius: "8px",
														background: saleType === type.key
															? "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)"
															: "rgba(0, 0, 0, 0.06)",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														flexShrink: 0,
														transition: "all 0.2s ease",
													}}>
														<Home
															size={16}
															color={saleType === type.key ? "#FFFFFF" : "#717171"}
															strokeWidth={2.5}
														/>
													</div>
													<span style={{ flex: 1 }}>{type.label}</span>
													{saleType === type.key && (
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
								</div>

								{/* What Type Dropdown */}
								<div style={{ position: "relative", zIndex: showCategoryDropdown ? 1001 : 1 }} ref={categoryInputRef}>
									<div
										onClick={handleCategoryClick}
										style={{
											width: "100%",
											padding: "12px 16px 12px 44px",
											border: showCategoryDropdown ? "3px solid #FF385C" : "2px solid #E0E0E0",
											borderRadius: "32px",
											backgroundColor: showCategoryDropdown ? "#FFF5F7" : "#F8F8F8",
											fontSize: "14px",
											fontWeight: "600",
											outline: "none",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											color: category ? "#1A1A1A" : "#666666",
											transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
											boxShadow: showCategoryDropdown
												? "0 12px 32px rgba(255, 56, 92, 0.25), 0 4px 12px rgba(255, 56, 92, 0.15)"
												: "0 4px 8px rgba(0, 0, 0, 0.06)",
										}}
										onMouseEnter={(e) => {
											if (!showCategoryDropdown) {
												e.currentTarget.style.borderColor = "#FF385C";
												e.currentTarget.style.backgroundColor = "#FFFFFF";
												e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.15)";
												e.currentTarget.style.transform = "translateY(-1px)";
											}
										}}
										onMouseLeave={(e) => {
											if (!showCategoryDropdown) {
												e.currentTarget.style.borderColor = "#E8E8E8";
												e.currentTarget.style.backgroundColor = "#FAFAFA";
												e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.04)";
												e.currentTarget.style.transform = "translateY(0)";
											}
										}}
									>
										<span>{category ? (() => { const k = `categories.${category.toLowerCase()}`; const t = getTranslation(displayLanguage, k); return t !== k ? t : category; })() : getTranslation(displayLanguage, "hero.category")}</span>
										<ChevronDown
											size={16}
											color={showCategoryDropdown ? "#FF385C" : "#717171"}
											style={{
												transform: showCategoryDropdown ? "rotate(180deg)" : "rotate(0deg)",
												transition: "transform 0.2s ease",
											}}
										/>
									</div>
									<div
										style={{
											position: "absolute",
											left: "16px",
											top: "50%",
											transform: "translateY(-50%)",
											pointerEvents: "none",
											zIndex: 1,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: "20px",
											height: "20px",
											backgroundColor: showCategoryDropdown ? "rgba(255, 56, 92, 0.1)" : "rgba(0, 0, 0, 0.05)",
											borderRadius: "8px",
											transition: "all 0.3s ease",
										}}
									>
										<Home size={18} color={showCategoryDropdown ? "#FF385C" : "#666666"} strokeWidth={2.5} />
									</div>
									{/* Category Dropdown */}
									<div
										ref={dropdownRef}
										style={{
											position: "absolute",
											top: "calc(100% + 8px)",
											left: 0,
											right: 0,
											backgroundColor: "#FFFFFF",
											border: "1px solid rgba(0, 0, 0, 0.06)",
											borderRadius: "16px",
											boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)",
											zIndex: 1002,
											maxHeight: "360px",
											overflowY: "auto",
											marginTop: "4px",
											opacity: showCategoryDropdown ? 1 : 0,
											transform: showCategoryDropdown ? "translateY(0)" : "translateY(-10px)",
											visibility: showCategoryDropdown ? "visible" : "hidden",
											transition: "opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out",
											pointerEvents: showCategoryDropdown ? "auto" : "none",
											animation: showCategoryDropdown ? "dropdownFadeIn 0.2s ease-out" : "none",
										}}
										className="category-dropdown"
									>
										<div style={{ padding: "8px 0" }}>
											{allCategories && allCategories.length > 0 && allCategories.map((cat, index) => (
												<div
													key={cat.value}
													onClick={() => handleCategorySelect(cat.label)}
													style={{
														padding: "10px 18px",
														margin: "3px 6px",
														cursor: "pointer",
														transition: "all 0.2s ease",
														display: "flex",
														alignItems: "center",
														gap: "12px",
														fontSize: "14px",
														fontWeight: "500",
														color: "#222222",
														backgroundColor: category === cat.label ? "rgba(255, 56, 92, 0.08)" : "transparent",
														borderRadius: "10px",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.backgroundColor = category === cat.label
															? "rgba(255, 56, 92, 0.12)"
															: "rgba(0, 0, 0, 0.04)";
														e.currentTarget.style.transform = "translateX(2px)";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.backgroundColor = category === cat.label
															? "rgba(255, 56, 92, 0.08)"
															: "transparent";
														e.currentTarget.style.transform = "translateX(0)";
													}}
												>
													<div
														style={{
															width: "32px",
															height: "32px",
															borderRadius: "8px",
															background: category === cat.label
																? "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)"
																: "rgba(0, 0, 0, 0.06)",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															flexShrink: 0,
															transition: "all 0.2s ease",
														}}
													>
														{(() => {
															const IconComponent = getCategoryIcon(cat.label);
															return (
																<IconComponent
																	size={16}
																	color={category === cat.label ? "#FFFFFF" : "#717171"}
																	strokeWidth={2}
																/>
															);
														})()}
													</div>
													<span style={{ flex: 1 }}>{(() => { const k = `categories.${cat.label.toLowerCase()}`; const t = getTranslation(displayLanguage, k); return t !== k ? t : cat.label; })()}</span>
													{category === cat.label && (
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
								</div>
							</div>

							{/* Bottom Row */}
							<div
								className="banner-form-bottom-row"
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr auto",
									gap: "12px",
									alignItems: "end",
								}}
							>
								{/* City/Location Dropdown */}
								<div style={{ position: "relative", zIndex: showLocationDropdown ? 1001 : 1 }} ref={locationInputRef}>
									<input
										type="text"
										placeholder={getTranslation(displayLanguage, "hero.locationPlaceholder")}
										value={locationSearchTerm}
										onChange={(e) => {
											setLocationSearchTerm(e.target.value);
											setLocation(e.target.value);
											setShowLocationDropdown(true);
										}}
										onClick={handleLocationClick}
										style={{
											width: "100%",
											padding: "12px 16px 12px 44px",
											border: showLocationDropdown ? "3px solid #FF385C" : "2px solid #E0E0E0",
											borderRadius: "32px",
											backgroundColor: showLocationDropdown ? "#FFF5F7" : "#F8F8F8",
											fontSize: "16px",
											fontWeight: "600",
											outline: "none",
											cursor: "text",
											color: locationSearchTerm ? "#1A1A1A" : "#666666",
											transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
											boxShadow: showLocationDropdown
												? "0 12px 32px rgba(255, 56, 92, 0.25), 0 4px 12px rgba(255, 56, 92, 0.15)"
												: "0 4px 8px rgba(0, 0, 0, 0.06)",
										}}
										onMouseEnter={(e) => {
											if (!showLocationDropdown) {
												e.currentTarget.style.borderColor = "#FF385C";
												e.currentTarget.style.backgroundColor = "#FFFFFF";
											}
										}}
										onMouseLeave={(e) => {
											if (!showLocationDropdown) {
												e.currentTarget.style.borderColor = "#E0E0E0";
												e.currentTarget.style.backgroundColor = "#F7F7F7";
											}
										}}
									/>
									<div
										style={{
											position: "absolute",
											left: "16px",
											top: "50%",
											transform: "translateY(-50%)",
											pointerEvents: "none",
											zIndex: 1,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: "20px",
											height: "20px",
											backgroundColor: showLocationDropdown ? "rgba(255, 56, 92, 0.1)" : "rgba(0, 0, 0, 0.05)",
											borderRadius: "8px",
											transition: "all 0.3s ease",
										}}
									>
										<MapPin size={18} color={showLocationDropdown ? "#FF385C" : "#666666"} strokeWidth={2.5} />
									</div>
									{/* Location Dropdown */}
									<div
										ref={locationDropdownRef}
										style={{
											position: "absolute",
											top: "calc(100% + 8px)",
											left: 0,
											right: 0,
											backgroundColor: "#FFFFFF",
											border: "1px solid rgba(0, 0, 0, 0.06)",
											borderRadius: "16px",
											boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)",
											zIndex: 1002,
											maxHeight: "360px",
											overflowY: "auto",
											marginTop: "4px",
											opacity: showLocationDropdown ? 1 : 0,
											transform: showLocationDropdown ? "translateY(0)" : "translateY(-10px)",
											visibility: showLocationDropdown ? "visible" : "hidden",
											transition: "opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out",
											pointerEvents: showLocationDropdown ? "auto" : "none",
											animation: showLocationDropdown ? "dropdownFadeIn 0.2s ease-out" : "none",
										}}
										className="location-dropdown"
									>
										<div style={{ padding: "8px 0" }}>
											{/* Show cities first (always visible) */}
											{filteredCities.length > 0 ? (
												filteredCities.map((city, index) => (
													<div
														key={city.value}
														onClick={() => handleLocationCitySelect(city.label)}
														style={{
															padding: "10px 18px",
															margin: "3px 6px",
															cursor: "pointer",
															transition: "all 0.2s ease",
															fontSize: "14px",
															fontWeight: "500",
															color: "#222222",
															backgroundColor: location === city.label ? "rgba(255, 56, 92, 0.08)" : "transparent",
															display: "flex",
															alignItems: "center",
															gap: "12px",
															borderRadius: "10px",
														}}
														onMouseEnter={(e) => {
															e.currentTarget.style.backgroundColor = location === city.label
																? "rgba(255, 56, 92, 0.12)"
																: "rgba(0, 0, 0, 0.04)";
															e.currentTarget.style.transform = "translateX(2px)";
														}}
														onMouseLeave={(e) => {
															e.currentTarget.style.backgroundColor = location === city.label
																? "rgba(255, 56, 92, 0.08)"
																: "transparent";
															e.currentTarget.style.transform = "translateX(0)";
														}}
													>
														<div style={{
															width: "32px",
															height: "32px",
															borderRadius: "8px",
															background: location === city.label
																? "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)"
																: "rgba(0, 0, 0, 0.06)",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															flexShrink: 0,
															transition: "all 0.2s ease",
														}}>
															<MapPin
																size={14}
																color={location === city.label ? "#FFFFFF" : "#717171"}
																strokeWidth={2.5}
															/>
														</div>
														<span style={{ flex: 1 }}>{city.label}</span>
														{location === city.label && (
															<div style={{
																width: "6px",
																height: "6px",
																borderRadius: "50%",
																background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
															}} />
														)}
													</div>
												))
											) : null}

											{/* Show neighborhoods only when user is searching (has typed something) */}
											{filteredNeighborhoods.length > 0 && (
												<>
													{/* Divider between cities and neighborhoods */}
													{filteredCities.length > 0 && (
														<div style={{
															height: "1px",
															backgroundColor: "rgba(0, 0, 0, 0.06)",
															margin: "8px 16px",
														}} />
													)}
													{filteredNeighborhoods.map((neighborhood, index) => (
														<div
															key={`neighborhood-${neighborhood.value}`}
															onClick={() => handleNeighborhoodSelect(neighborhood.city, neighborhood.label.split(",")[0])}
															style={{
																padding: "10px 18px",
																margin: "3px 6px",
																cursor: "pointer",
																transition: "all 0.2s ease",
																fontSize: "14px",
																fontWeight: "500",
																color: "#222222",
																backgroundColor: location === neighborhood.label ? "rgba(255, 56, 92, 0.08)" : "transparent",
																display: "flex",
																alignItems: "center",
																gap: "12px",
																borderRadius: "10px",
															}}
															onMouseEnter={(e) => {
																e.currentTarget.style.backgroundColor = location === neighborhood.label
																	? "rgba(255, 56, 92, 0.12)"
																	: "rgba(0, 0, 0, 0.04)";
																e.currentTarget.style.transform = "translateX(2px)";
															}}
															onMouseLeave={(e) => {
																e.currentTarget.style.backgroundColor = location === neighborhood.label
																	? "rgba(255, 56, 92, 0.08)"
																	: "transparent";
																e.currentTarget.style.transform = "translateX(0)";
															}}
														>
															<div style={{
																width: "32px",
																height: "32px",
																borderRadius: "8px",
																background: location === neighborhood.label
																	? "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)"
																	: "rgba(0, 0, 0, 0.06)",
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																flexShrink: 0,
																transition: "all 0.2s ease",
															}}>
																<MapPin
																	size={14}
																	color={location === neighborhood.label ? "#FFFFFF" : "#717171"}
																	strokeWidth={2.5}
																/>
															</div>
															<span style={{ flex: 1 }}>{neighborhood.label}</span>
															{location === neighborhood.label && (
																<div style={{
																	width: "6px",
																	height: "6px",
																	borderRadius: "50%",
																	background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
																}} />
															)}
														</div>
													))}
												</>
											)}

											{/* Show message if no results */}
											{filteredCities.length === 0 && filteredNeighborhoods.length === 0 && (
												<div
													style={{
														padding: "16px 20px",
														fontSize: "14px",
														color: "#717171",
														textAlign: "center",
													}}
												>
													No locations found
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Street Input */}
								<div style={{ position: "relative" }} ref={streetInputRef}>
									<input
										type="text"
										placeholder={getTranslation(displayLanguage, "hero.streetPlaceholder")}
										value={street}
										onChange={(e) => {
											setStreet(e.target.value);
											setShowStreetDropdown(true);
										}}
										onClick={() => {
											if (streetOptions.length > 0) setShowStreetDropdown(true);
										}}
										style={{
											width: "100%",
											padding: "12px 16px 12px 44px",
											border: "2px solid #E0E0E0",
											borderRadius: "32px",
											backgroundColor: "#F8F8F8",
											fontSize: "16px",
											fontWeight: "600",
											outline: "none",
											cursor: "text",
											color: street ? "#1A1A1A" : "#666666",
											transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
											boxShadow: "0 4px 8px rgba(0, 0, 0, 0.06)",
										}}
										onFocus={(e) => {
											if (streetOptions.length > 0) setShowStreetDropdown(true);
											e.currentTarget.style.border = "3px solid #FF385C";
											e.currentTarget.style.backgroundColor = "#FFF5F7";
										}}
										onBlur={(e) => {
											e.currentTarget.style.border = "2px solid #E0E0E0";
											e.currentTarget.style.backgroundColor = "#F8F8F8";
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = "#FF385C";
											e.currentTarget.style.backgroundColor = "#FFFFFF";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = "#E0E0E0";
											e.currentTarget.style.backgroundColor = "#F7F7F7";
										}}
									/>
									<div
										style={{
											position: "absolute",
											left: "16px",
											top: "50%",
											transform: "translateY(-50%)",
											pointerEvents: "none",
											zIndex: 1,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: "20px",
											height: "20px",
											backgroundColor: "rgba(0, 0, 0, 0.05)",
											borderRadius: "8px",
											transition: "all 0.3s ease",
										}}
									>
										<Navigation size={18} color="#666666" strokeWidth={2.5} />
									</div>
									{/* Street Dropdown */}
									<div
										ref={streetDropdownRef}
										style={{
											position: "absolute",
											top: "calc(100% + 8px)",
											left: 0,
											right: 0,
											backgroundColor: "#FFFFFF",
											border: "1px solid rgba(0, 0, 0, 0.06)",
											borderRadius: "16px",
											boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)",
											zIndex: 1002,
											maxHeight: "320px",
											overflowY: "auto",
											marginTop: "4px",
											opacity: showStreetDropdown ? 1 : 0,
											transform: showStreetDropdown ? "translateY(0)" : "translateY(-10px)",
											visibility: showStreetDropdown ? "visible" : "hidden",
											transition: "opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out",
											pointerEvents: showStreetDropdown ? "auto" : "none",
										}}
									>
										{streetOptions
											.filter((option) =>
												option.label.toLowerCase().includes(street.toLowerCase())
											)
											.map((option) => (
												<div
													key={option.value}
													onClick={() => {
														setStreet(option.label);
														setShowStreetDropdown(false);
													}}
													style={{
														padding: "10px 18px",
														margin: "3px 6px",
														cursor: "pointer",
														transition: "all 0.2s ease",
														fontSize: "14px",
														fontWeight: "500",
														color: "#222222",
														backgroundColor: street === option.label ? "rgba(255, 56, 92, 0.08)" : "transparent",
														display: "flex",
														alignItems: "center",
														gap: "12px",
														borderRadius: "10px",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.backgroundColor = street === option.label
															? "rgba(255, 56, 92, 0.12)"
															: "rgba(0, 0, 0, 0.04)";
														e.currentTarget.style.transform = "translateX(2px)";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.backgroundColor = street === option.label
															? "rgba(255, 56, 92, 0.08)"
															: "transparent";
														e.currentTarget.style.transform = "translateX(0)";
													}}
												>
													<div style={{
														width: "32px",
														height: "32px",
														borderRadius: "8px",
														background: street === option.label
															? "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)"
															: "rgba(0, 0, 0, 0.06)",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														flexShrink: 0,
														transition: "all 0.2s ease",
													}}>
														<Navigation
															size={14}
															color={street === option.label ? "#FFFFFF" : "#717171"}
															strokeWidth={2.5}
														/>
													</div>
													<span style={{ flex: 1 }}>{option.label}</span>
													{street === option.label && (
														<div style={{
															width: "6px",
															height: "6px",
															borderRadius: "50%",
															background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
														}} />
													)}
												</div>
											))}
										{streetOptions.length === 0 && (
											<div style={{ padding: "10px 18px", color: "#777", fontSize: "13px" }}>
												Select a city to load neighborhoods
											</div>
										)}
									</div>
								</div>

								{/* Search Button */}
								<button
									type="submit"
									style={{
										padding: "14px 32px",
										borderRadius: "32px",
										background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)",
										color: "#FFFFFF",
										border: "none",
										fontSize: "15px",
										fontWeight: "700",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										gap: "8px",
										transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
										whiteSpace: "nowrap",
										boxShadow: "0 12px 40px rgba(255, 56, 92, 0.4), 0 6px 20px rgba(255, 56, 92, 0.3)",
										position: "relative",
										overflow: "hidden",
										letterSpacing: "0.3px",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = "linear-gradient(135deg, #E61E4D 0%, #D91A3D 100%)";
										e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
										e.currentTarget.style.boxShadow = "0 12px 32px rgba(255, 56, 92, 0.45), 0 6px 16px rgba(255, 56, 92, 0.3)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = "linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)";
										e.currentTarget.style.transform = "translateY(0) scale(1)";
										e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 56, 92, 0.35), 0 4px 12px rgba(255, 56, 92, 0.2)";
									}}
									onMouseDown={(e) => {
										e.currentTarget.style.transform = "translateY(0) scale(0.98)";
									}}
									onMouseUp={(e) => {
										e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
									}}
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<circle cx="11" cy="11" r="8"></circle>
										<path d="m21 21-4.35-4.35"></path>
									</svg>
									{getTranslation(displayLanguage, "hero.search")}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			{/* Dropdown Animations & Scrollbar Styles */}
			<style jsx global>{`
			@keyframes fadeInUp {
				from {
					opacity: 0;
					transform: translateY(30px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}

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
		`}</style>

			{/* Responsive Styles */}
			<style jsx>{`
			/* Tablet: 768px - 991px */
			@media (max-width: 991px) {
					.hero-banner-container {
						height: auto !important;
						min-height: 700px !important;
					}

					.banner-content-container {
						justify-content: center !important;
						padding-bottom: 40px !important;
						padding-top: 40px !important;
					}

					.banner-quote-text {
						margin-top: 40px !important;
						margin-bottom: 32px !important;
					}

					.banner-content-wrapper {
						padding: 0 40px !important;
					}

					.banner-search-form {
						padding: 20px !important;
					}

					.banner-form-top-row {
						grid-template-columns: 1fr !important;
						gap: 12px !important;
					}

					.banner-form-bottom-row {
						grid-template-columns: 1fr !important;
						gap: 12px !important;
					}

					.banner-form-bottom-row button {
						grid-column: 1 !important;
						width: 100% !important;
						justify-content: center !important;
					}

					/* Price inputs container stays side by side on tablet */
					.banner-price-inputs {
						display: flex !important;
						gap: 12px !important;
					}
				}

				/* Mobile: < 768px */
				@media (max-width: 767px) {
					.hero-banner-container {
						height: auto !important;
						min-height: 700px !important;
					}

					.banner-content-container {
						justify-content: center !important;
						padding-bottom: 32px !important;
						padding-top: 60px !important;
					}

					.banner-quote-text {
						margin-top: clamp(80px, 15vw, 140px) !important;
						margin-bottom: 32px !important;
					}

					.banner-content-wrapper {
						padding: 0 16px !important;
					}

					.banner-search-form {
						padding: 16px !important;
						border-radius: 20px !important;
					}

					.banner-form-top-row {
						grid-template-columns: 1fr !important;
						gap: 12px !important;
						margin-bottom: 12px !important;
					}

					.banner-form-bottom-row {
						grid-template-columns: 1fr !important;
						gap: 12px !important;
					}

					.banner-form-bottom-row button {
						grid-column: 1 !important;
						width: 100% !important;
						justify-content: center !important;
						margin-top: 4px !important;
					}

					/* Price inputs stay side by side on mobile */
					.banner-price-inputs {
						display: flex !important;
						gap: 10px !important;
						flex-direction: row !important;
					}
				}

				/* Small Mobile: < 480px */
				@media (max-width: 480px) {
					.hero-banner-container {
						min-height: 650px !important;
					}

					.banner-content-container {
						justify-content: center !important;
						padding-bottom: 24px !important;
						padding-top: 50px !important;
					}

					.banner-quote-text {
						margin-top: clamp(70px, 14vw, 120px) !important;
						margin-bottom: 28px !important;
					}

					.banner-content-wrapper {
						padding: 0 12px !important;
					}

					.banner-search-form {
						padding: 12px !important;
						border-radius: 16px !important;
					}

					.banner-form-top-row,
					.banner-form-bottom-row {
						gap: 10px !important;
					}

					/* Input field adjustments */
					.banner-form-top-row input,
					.banner-form-top-row div[style*="padding"],
					.banner-form-bottom-row input {
						font-size: 16px !important;
					}

					/* Icon adjustments */
					.banner-form-top-row svg,
					.banner-form-bottom-row svg {
						width: 16px !important;
						height: 16px !important;
					}

					/* Button adjustments */
					.banner-form-bottom-row button {
						padding: 12px 24px !important;
						font-size: 14px !important;
					}
				}

			/* Dropdown responsive adjustments */
			@media (max-width: 767px) {
				div[style*="position: \"absolute\""][style*="top: \"calc(100% + 8px)\""] {
					position: fixed !important;
					left: 16px !important;
					right: 16px !important;
					width: auto !important;
					max-height: 50vh !important;
					overflow-y: auto !important;
				}

				/* AGGRESSIVE: Target ALL dropdown items on mobile - FLUSH LEFT */
				.category-dropdown div[style*="padding: 14px"],
				.location-dropdown div[style*="padding: 14px"],
				div[style*="position: fixed"] div[style*="padding: 14px 20px"],
				div[style*="position: fixed"] div[style*="margin: 4px 8px"] {
					margin: 0 !important;
					margin-top: 2px !important;
					margin-bottom: 2px !important;
					padding: 14px 8px !important;
				}

				/* Dropdown container - NO padding */
				.category-dropdown > div,
				.location-dropdown > div,
				div[style*="position: fixed"] > div[style*="padding"] {
					padding: 0 !important;
					padding-top: 4px !important;
					padding-bottom: 4px !important;
				}

				/* Override any hover transform */
				.category-dropdown div[style*="padding: 14px"]:hover,
				.location-dropdown div[style*="padding: 14px"]:hover {
					transform: translateX(0) !important;
				}
			}
			`}</style>
		</div>
	);
};

export default Banner;

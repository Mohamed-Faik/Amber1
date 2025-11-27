"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { categories as allCategories } from "@/libs/Categories";
import { moroccanCities } from "@/libs/moroccanCities";
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
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
	const [showSaleTypeDropdown, setShowSaleTypeDropdown] = useState(false);
	const [showLocationDropdown, setShowLocationDropdown] = useState(false);
	const [locationSearchTerm, setLocationSearchTerm] = useState("");
	const [locations, setLocations] = useState([]);
	const [locSuggest, setLocSuggest] = useState(false);
	const categoryInputRef = useRef(null);
	const saleTypeInputRef = useRef(null);
	const locationInputRef = useRef(null);
	const dropdownRef = useRef(null);
	const saleTypeDropdownRef = useRef(null);
	const locationDropdownRef = useRef(null);

	const handleSearch = (e) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (category) params.append("category", category);
		if (location) params.append("location_value", location);
		
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

	const handleLocationCitySelect = (cityLabel) => {
		setLocation(cityLabel);
		setLocationSearchTerm(cityLabel);
		setShowLocationDropdown(false);
	};

	const handleLocationSelect = (loc) => {
		setLocSuggest(false);
		setLocation(loc);
	};

	// Filter cities based on search term
	const filteredCities = moroccanCities.filter((city) =>
		city.label.toLowerCase().includes(locationSearchTerm.toLowerCase())
	);

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
		};

		if (showCategoryDropdown || showSaleTypeDropdown || showLocationDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showCategoryDropdown, showSaleTypeDropdown, showLocationDropdown]);

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
				height: "660px",
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
					<source src="/videos/house-interior.mp4" type="video/mp4" />
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
						"linear-gradient(to bottom, rgb(255 56 92 / 18%), rgb(0 0 0 / 30%))",
					zIndex: 2,
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
					paddingBottom: "40px",
					overflow: "visible",
				}}
			>
				<div
					className="banner-content-wrapper"
					style={{
						maxWidth: "1000px",
						width: "100%",
						margin: "0 auto",
						padding: "0 10px",
					}}
				>
					{/* Quote Text */}
					<div
						className="banner-quote-text"
						style={{
							textAlign: "center",
							marginBottom: "32px",
							marginTop: "0",
							width: "100%",
						}}
					>
						<p
							style={{
								fontSize: "clamp(32px, 5vw, 64px)",
								fontWeight: "400",
								color: "#FFFFFF",
								fontFamily: "var(--font-brush), 'Caveat Brush', 'Brush Script MT', cursive",
								lineHeight: "1.2",
								textShadow: "0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)",
								margin: 0,
								display: "inline-block",
								letterSpacing: "1px",
								fontStyle: "normal",
							}}
						>
							<span style={{ color: "#FF385C" }}>"</span>
							{getTranslation(displayLanguage, "hero.quote")}
							<span style={{ color: "#FF385C" }}>"</span>
						</p>
					</div>

					{/* Search Form Container */}
					<div
						className="banner-search-form"
						style={{
							backgroundColor: "#FFFFFF",
							borderRadius: "29px",
							padding: "24px",
							boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
							width: "100%",
							position: "relative",
							zIndex: 1000,
						}}
					>
						<form onSubmit={handleSearch}>
							{/* Top Row */}
							<div
								className="banner-form-top-row"
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px",
									marginBottom: "16px",
								}}
							>
								{/* For Sale Dropdown */}
								<div style={{ position: "relative", zIndex: showSaleTypeDropdown ? 1001 : 1 }} ref={saleTypeInputRef}>
									<div
										onClick={handleSaleTypeClick}
										style={{
											width: "100%",
											padding: "14px 16px 14px 44px",
											border: showSaleTypeDropdown ? "2px solid #FF385C" : "1px solid #E0E0E0",
											borderRadius: "12px",
											backgroundColor: showSaleTypeDropdown ? "#FFFFFF" : "#F7F7F7",
											fontSize: "14px",
											fontWeight: "500",
											outline: "none",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											color: saleType ? "#222222" : "#717171",
											transition: "all 0.2s ease",
											boxShadow: showSaleTypeDropdown ? "0 4px 12px rgba(255, 56, 92, 0.15)" : "none",
										}}
										onMouseEnter={(e) => {
											if (!showSaleTypeDropdown) {
												e.currentTarget.style.borderColor = "#FF385C";
												e.currentTarget.style.backgroundColor = "#FFFFFF";
											}
										}}
										onMouseLeave={(e) => {
											if (!showSaleTypeDropdown) {
												e.currentTarget.style.borderColor = "#E0E0E0";
												e.currentTarget.style.backgroundColor = "#F7F7F7";
											}
										}}
									>
										<span>{getSaleTypeLabel(saleType)}</span>
										<ChevronDown 
											size={18} 
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
										}}
									>
										<Home size={18} color={showSaleTypeDropdown ? "#FF385C" : "#717171"} />
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
											border: "1px solid rgba(0, 0, 0, 0.08)",
											borderRadius: "20px",
											boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
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
														padding: "14px 20px",
														margin: "4px 8px",
														cursor: "pointer",
														transition: "all 0.2s ease",
														fontSize: "15px",
														fontWeight: "500",
														color: "#222222",
														backgroundColor: saleType === type.key ? "rgba(255, 56, 92, 0.08)" : "transparent",
														display: "flex",
														alignItems: "center",
														gap: "14px",
														borderRadius: "12px",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.backgroundColor = saleType === type.key 
															? "rgba(255, 56, 92, 0.12)" 
															: "rgba(0, 0, 0, 0.04)";
														e.currentTarget.style.transform = "translateX(4px)";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.backgroundColor = saleType === type.key 
															? "rgba(255, 56, 92, 0.08)" 
															: "transparent";
														e.currentTarget.style.transform = "translateX(0)";
													}}
												>
													<div style={{
														width: "36px",
														height: "36px",
														borderRadius: "10px",
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
															size={18}
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
											padding: "14px 16px 14px 44px",
											border: showCategoryDropdown ? "2px solid #FF385C" : "1px solid #E0E0E0",
											borderRadius: "12px",
											backgroundColor: showCategoryDropdown ? "#FFFFFF" : "#F7F7F7",
											fontSize: "14px",
											fontWeight: "500",
											outline: "none",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											color: category ? "#222222" : "#717171",
											transition: "all 0.2s ease",
											boxShadow: showCategoryDropdown ? "0 4px 12px rgba(255, 56, 92, 0.15)" : "none",
										}}
										onMouseEnter={(e) => {
											if (!showCategoryDropdown) {
												e.currentTarget.style.borderColor = "#FF385C";
												e.currentTarget.style.backgroundColor = "#FFFFFF";
											}
										}}
										onMouseLeave={(e) => {
											if (!showCategoryDropdown) {
												e.currentTarget.style.borderColor = "#E0E0E0";
												e.currentTarget.style.backgroundColor = "#F7F7F7";
											}
										}}
									>
										<span>{category || getTranslation(displayLanguage, "hero.category")}</span>
										<ChevronDown 
											size={18} 
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
										}}
									>
										<Home size={18} color={showCategoryDropdown ? "#FF385C" : "#717171"} />
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
											border: "1px solid rgba(0, 0, 0, 0.08)",
											borderRadius: "20px",
											boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
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
														padding: "14px 20px",
														margin: "4px 8px",
														cursor: "pointer",
														transition: "all 0.2s ease",
														display: "flex",
														alignItems: "center",
														gap: "14px",
														fontSize: "15px",
														fontWeight: "500",
														color: "#222222",
														backgroundColor: category === cat.label ? "rgba(255, 56, 92, 0.08)" : "transparent",
														borderRadius: "12px",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.backgroundColor = category === cat.label 
															? "rgba(255, 56, 92, 0.12)" 
															: "rgba(0, 0, 0, 0.04)";
														e.currentTarget.style.transform = "translateX(4px)";
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
															width: "36px",
															height: "36px",
															borderRadius: "10px",
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
																	size={18}
																	color={category === cat.label ? "#FFFFFF" : "#717171"}
																	strokeWidth={2}
																/>
															);
														})()}
													</div>
													<span style={{ flex: 1 }}>{cat.label}</span>
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
									gridTemplateColumns: "1fr auto",
									gap: "16px",
									alignItems: "end",
								}}
							>
								{/* City/Location Dropdown */}
								<div style={{ position: "relative", zIndex: showLocationDropdown ? 1001 : 1 }} ref={locationInputRef}>
									<input
										type="text"
										placeholder={getTranslation(displayLanguage, "hero.location")}
										value={locationSearchTerm}
										onChange={(e) => {
											setLocationSearchTerm(e.target.value);
											setLocation(e.target.value);
											setShowLocationDropdown(true);
										}}
										onClick={handleLocationClick}
										style={{
											width: "100%",
											padding: "14px 16px 14px 44px",
											border: showLocationDropdown ? "2px solid #FF385C" : "1px solid #E0E0E0",
											borderRadius: "12px",
											backgroundColor: showLocationDropdown ? "#FFFFFF" : "#F7F7F7",
											fontSize: "14px",
											fontWeight: "500",
											outline: "none",
											cursor: "text",
											color: locationSearchTerm ? "#222222" : "#717171",
											transition: "all 0.2s ease",
											boxShadow: showLocationDropdown ? "0 4px 12px rgba(255, 56, 92, 0.15)" : "none",
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
										}}
									>
										<MapPin size={18} color={showLocationDropdown ? "#FF385C" : "#717171"} />
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
											border: "1px solid rgba(0, 0, 0, 0.08)",
											borderRadius: "20px",
											boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
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
											{filteredCities.length > 0 ? (
												filteredCities.map((city, index) => (
													<div
														key={city.value}
														onClick={() => handleLocationCitySelect(city.label)}
														style={{
															padding: "14px 20px",
															margin: "4px 8px",
															cursor: "pointer",
															transition: "all 0.2s ease",
															fontSize: "15px",
															fontWeight: "500",
															color: "#222222",
															backgroundColor: location === city.label ? "rgba(255, 56, 92, 0.08)" : "transparent",
															display: "flex",
															alignItems: "center",
															gap: "14px",
															borderRadius: "12px",
														}}
														onMouseEnter={(e) => {
															e.currentTarget.style.backgroundColor = location === city.label 
																? "rgba(255, 56, 92, 0.12)" 
																: "rgba(0, 0, 0, 0.04)";
															e.currentTarget.style.transform = "translateX(4px)";
														}}
														onMouseLeave={(e) => {
															e.currentTarget.style.backgroundColor = location === city.label 
																? "rgba(255, 56, 92, 0.08)" 
																: "transparent";
															e.currentTarget.style.transform = "translateX(0)";
														}}
													>
														<div style={{
															width: "36px",
															height: "36px",
															borderRadius: "10px",
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
																size={16}
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
											) : (
												<div
													style={{
														padding: "16px 20px",
														fontSize: "14px",
														color: "#717171",
														textAlign: "center",
													}}
												>
													No cities found
												</div>
											)}
										</div>
									</div>
							</div>

							{/* Search Button */}
								<button
									type="submit"
									style={{
										padding: "14px 32px",
										borderRadius: "12px",
										backgroundColor: "#FF385C",
										color: "#FFFFFF",
										border: "none",
										fontSize: "16px",
										fontWeight: "600",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										gap: "8px",
										transition: "all 0.2s ease",
										whiteSpace: "nowrap",
										boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = "#E61E4D";
										e.currentTarget.style.transform = "translateY(-2px)";
										e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 56, 92, 0.4)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = "#FF385C";
										e.currentTarget.style.transform = "translateY(0)";
										e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.3)";
									}}
								>
									<svg
										width="20"
										height="20"
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
						min-height: 600px !important;
					}

					.banner-content-container {
						justify-content: center !important;
						padding-bottom: 32px !important;
						padding-top: 32px !important;
					}

					.banner-quote-text {
						margin-top: 60px !important;
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

					/* Quote text adjustments */
					p[style*="fontSize: \"clamp(32px, 5vw, 64px)\""] {
						font-size: clamp(24px, 6vw, 40px) !important;
						margin-bottom: 24px !important;
					}
				}

				/* Small Mobile: < 480px */
				@media (max-width: 480px) {
					.hero-banner-container {
						min-height: 550px !important;
					}

					.banner-content-container {
						justify-content: center !important;
						padding-bottom: 24px !important;
						padding-top: 24px !important;
					}

					.banner-quote-text {
						margin-top: 50px !important;
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
						padding: 12px 14px 12px 40px !important;
						font-size: 13px !important;
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

					/* Quote text smaller on small mobile */
					p[style*="fontSize: \"clamp(32px, 5vw, 64px)\""] {
						font-size: clamp(20px, 5vw, 32px) !important;
						margin-bottom: 20px !important;
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
				}
			`}</style>
		</div>
	);
};

export default Banner;

"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { categories as allCategories } from "@/libs/Categories";
import LocationFind from "./LocationFind";
import { toast } from "react-hot-toast";
import { Home, MapPin, Navigation, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const Banner = () => {
	const router = useRouter();
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [saleType, setSaleType] = useState("For sale");
	const [category, setCategory] = useState("");
	const [location, setLocation] = useState("");
	const [street, setStreet] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
	const [showSaleTypeDropdown, setShowSaleTypeDropdown] = useState(false);
	const [locations, setLocations] = useState([]);
	const [locSuggest, setLocSuggest] = useState(false);
	const categoryInputRef = useRef(null);
	const saleTypeInputRef = useRef(null);
	const dropdownRef = useRef(null);
	const saleTypeDropdownRef = useRef(null);

	const handleSearch = (e) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (category) params.append("category", category);
		if (location) params.append("location_value", location);
		if (minPrice) params.append("min_price", minPrice);
		if (maxPrice) params.append("max_price", maxPrice);
		// Map saleType to listingType: "For sale" -> "SALE", "For rent" -> "RENT"
		const listingType = saleType === "For rent" ? "RENT" : saleType === "For sale" ? "SALE" : null;
		if (listingType) params.append("listingType", listingType);
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

	const handleLocationSelect = (loc) => {
		setLocSuggest(false);
		setLocation(loc);
	};

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
		};

		if (showCategoryDropdown || showSaleTypeDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showCategoryDropdown, showSaleTypeDropdown]);

	const saleTypes = ["For sale", "For rent"];

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
						padding: "0 80px",
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
										<span>{saleType}</span>
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
											backgroundColor: "#ffffff",
											border: "1px solid #E0E0E0",
											borderRadius: "12px",
											boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)",
											zIndex: 1002,
											overflow: "hidden",
											marginTop: "4px",
											opacity: showSaleTypeDropdown ? 1 : 0,
											transform: showSaleTypeDropdown ? "translateY(0)" : "translateY(-10px)",
											visibility: showSaleTypeDropdown ? "visible" : "hidden",
											transition: "opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out",
											pointerEvents: showSaleTypeDropdown ? "auto" : "none",
										}}
									>
										{saleTypes.map((type, index) => (
											<div
												key={type}
												onClick={() => handleSaleTypeSelect(type)}
												style={{
													padding: "16px 20px",
													cursor: "pointer",
													borderBottom:
														index !== saleTypes.length - 1
															? "1px solid #F0F0F0"
															: "none",
														transition: "all 0.15s ease",
														fontSize: "14px",
														fontWeight: saleType === type ? "600" : "400",
														color: saleType === type ? "#FF385C" : "#222222",
														backgroundColor: saleType === type ? "#FFF5F7" : "#ffffff",
														display: "flex",
														alignItems: "center",
														gap: "8px",
													}}
													onMouseEnter={(e) => {
														if (saleType !== type) {
															e.currentTarget.style.backgroundColor = "#F7F7F7";
														}
													}}
													onMouseLeave={(e) => {
														if (saleType !== type) {
															e.currentTarget.style.backgroundColor = "#ffffff";
														} else {
															e.currentTarget.style.backgroundColor = "#FFF5F7";
														}
													}}
												>
													{saleType === type && (
														<svg
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="none"
															stroke="#FF385C"
															strokeWidth="3"
															style={{ flexShrink: 0 }}
														>
															<polyline points="20 6 9 17 4 12"></polyline>
														</svg>
													)}
													<span>{type}</span>
												</div>
											))}
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
										<span>{category || "What type are you looking for?"}</span>
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
											backgroundColor: "#ffffff",
											border: "1px solid #E0E0E0",
											borderRadius: "12px",
											boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)",
											zIndex: 1002,
											overflow: "hidden",
											maxHeight: "300px",
											overflowY: "auto",
											marginTop: "4px",
											opacity: showCategoryDropdown ? 1 : 0,
											transform: showCategoryDropdown ? "translateY(0)" : "translateY(-10px)",
											visibility: showCategoryDropdown ? "visible" : "hidden",
											transition: "opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out",
											pointerEvents: showCategoryDropdown ? "auto" : "none",
										}}
									>
										{allCategories && allCategories.length > 0 && allCategories.map((cat, index) => (
											<div
												key={cat.value}
												onClick={() => handleCategorySelect(cat.label)}
												style={{
													padding: "16px 20px",
													cursor: "pointer",
													borderBottom:
														index !== allCategories.length - 1
															? "1px solid #F0F0F0"
															: "none",
													transition: "all 0.15s ease",
													display: "flex",
													alignItems: "center",
													gap: "12px",
													backgroundColor: category === cat.label ? "#FFF5F7" : "#ffffff",
												}}
												onMouseEnter={(e) => {
													if (category !== cat.label) {
														e.currentTarget.style.backgroundColor = "#F7F7F7";
													}
												}}
												onMouseLeave={(e) => {
													if (category !== cat.label) {
														e.currentTarget.style.backgroundColor = "#ffffff";
													} else {
														e.currentTarget.style.backgroundColor = "#FFF5F7";
													}
												}}
											>
												<div
													style={{
														width: "32px",
														height: "32px",
														borderRadius: "6px",
														backgroundColor: "#f0f4f8",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														flexShrink: 0,
													}}
												>
													<Image
														src={cat.imageSrc}
														width={20}
														height={20}
														alt={cat.label}
														style={{ objectFit: "contain" }}
													/>
												</div>
												<div
													style={{
														fontSize: "14px",
														fontWeight: category === cat.label ? "600" : "500",
														color: category === cat.label ? "#FF385C" : "#222222",
														flex: 1,
													}}
												>
													{cat.label}
												</div>
												{category === cat.label && (
													<svg
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="#FF385C"
														strokeWidth="3"
														style={{ flexShrink: 0 }}
													>
														<polyline points="20 6 9 17 4 12"></polyline>
													</svg>
												)}
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Bottom Row */}
							<div
								className="banner-form-bottom-row"
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr auto",
									gap: "16px",
									alignItems: "end",
								}}
							>
								{/* Where are you looking? */}
								<div style={{ position: "relative" }}>
									<input
										type="text"
										placeholder="Where are you looking?"
										value={location}
										onChange={(e) => {
											setLocation(e.target.value);
											locationFind(e.target.value);
										}}
										style={{
											width: "100%",
											padding: "14px 16px 14px 44px",
											border: "1px solid #E0E0E0",
											borderRadius: "12px",
											backgroundColor: "#F7F7F7",
											fontSize: "14px",
											outline: "none",
											transition: "all 0.2s ease",
										}}
										onFocus={(e) => {
											e.currentTarget.style.borderColor = "#FF385C";
											e.currentTarget.style.backgroundColor = "#FFFFFF";
										}}
										onBlur={(e) => {
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
										}}
									>
										<MapPin size={18} color="#717171" />
									</div>
									{locations.length > 0 && locSuggest && (
										<LocationFind
											locations={locations}
											onSelect={handleLocationSelect}
										/>
									)}
								</div>

								{/* Price Inputs Container - Side by Side */}
								<div 
									className="banner-price-inputs"
									style={{
										display: "flex",
										gap: "12px",
									}}
								>
									{/* Min Price */}
									<div style={{ position: "relative", flex: "1" }}>
										<input
											type="number"
											placeholder="Min Price (MAD)"
											value={minPrice}
											onChange={(e) => {
												const value = e.target.value;
												if (value === "" || (!isNaN(value) && parseInt(value) >= 0)) {
													setMinPrice(value);
												}
											}}
											min="0"
											style={{
												width: "100%",
												padding: "14px 16px 14px 44px",
												border: "1px solid #E0E0E0",
												borderRadius: "12px",
												backgroundColor: "#F7F7F7",
												fontSize: "14px",
												outline: "none",
												transition: "all 0.2s ease",
											}}
											onFocus={(e) => {
												e.currentTarget.style.borderColor = "#FF385C";
												e.currentTarget.style.backgroundColor = "#FFFFFF";
											}}
											onBlur={(e) => {
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
											}}
										>
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
												<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
											</svg>
										</div>
									</div>

									{/* Max Price */}
									<div style={{ position: "relative", flex: "1" }}>
										<input
											type="number"
											placeholder="Max Price (MAD)"
											value={maxPrice}
											onChange={(e) => {
												const value = e.target.value;
												if (value === "" || (!isNaN(value) && parseInt(value) >= 0)) {
													setMaxPrice(value);
												}
											}}
											min="0"
											style={{
												width: "100%",
												padding: "14px 16px 14px 44px",
												border: "1px solid #E0E0E0",
												borderRadius: "12px",
												backgroundColor: "#F7F7F7",
												fontSize: "14px",
												outline: "none",
												transition: "all 0.2s ease",
											}}
											onFocus={(e) => {
												e.currentTarget.style.borderColor = "#FF385C";
												e.currentTarget.style.backgroundColor = "#FFFFFF";
											}}
											onBlur={(e) => {
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
											}}
										>
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
												<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
											</svg>
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
									Search
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

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

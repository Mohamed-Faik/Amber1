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

const Banner = () => {
	const router = useRouter();
	const [saleType, setSaleType] = useState("For sale");
	const [category, setCategory] = useState("");
	const [location, setLocation] = useState("");
	const [street, setStreet] = useState("");
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

	const saleTypes = ["For sale", "For rent", "New construction"];

	return (
		<div
			style={{
				position: "relative",
				height: "660px",
				overflow: "hidden",
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
					<source src="https://www.immofusion.be/assets/video/Immofusion-1.mp4" type="video/mp4" />
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
				style={{
					position: "relative",
					zIndex: 3,
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "flex-end",
					paddingBottom: "40px",
				}}
			>
				<div
					style={{
						maxWidth: "1000px",
						width: "100%",
						margin: "0 auto",
						padding: "0 80px",
					}}
				>
					{/* Quote Text */}
					<div
						style={{
							textAlign: "center",
							marginBottom: "32px",
							width: "100%",
						}}
					>
						<p
							style={{
								fontSize: "clamp(32px, 5vw, 64px)",
								fontWeight: "400",
								color: "#FFFFFF",
								fontFamily: "'Dancing Script', 'Brush Script MT', 'Lucida Handwriting', cursive",
								lineHeight: "1.2",
								textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
								margin: 0,
								display: "inline-block",
							}}
						>
							<span style={{ color: "#FF385C" }}>"</span>
							It's about people, not about stones
							<span style={{ color: "#FF385C" }}>"</span>
						</p>
					</div>

					{/* Search Form Container */}
					<div
						style={{
							backgroundColor: "#FFFFFF",
							borderRadius: "29px",
							padding: "24px",
							boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
							width: "100%",
						}}
					>
						<form onSubmit={handleSearch}>
							{/* Top Row */}
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "16px",
									marginBottom: "16px",
								}}
							>
								{/* For Sale Dropdown */}
								<div style={{ position: "relative" }} ref={saleTypeInputRef}>
									<div
										onClick={handleSaleTypeClick}
										style={{
											width: "100%",
											padding: "14px 16px 14px 44px",
											border: "1px solid #E0E0E0",
											borderRadius: "12px",
											backgroundColor: "#F7F7F7",
											fontSize: "14px",
											outline: "none",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											color: saleType ? "#222222" : "#717171",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = "#FF385C";
											e.currentTarget.style.backgroundColor = "#FFFFFF";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = "#E0E0E0";
											e.currentTarget.style.backgroundColor = "#F7F7F7";
										}}
									>
										<span>{saleType}</span>
										<ChevronDown 
											size={18} 
											color="#717171"
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
										}}
									>
										<Home size={18} color="#717171" />
									</div>
									{/* Sale Type Dropdown */}
									{showSaleTypeDropdown && (
										<div
											ref={saleTypeDropdownRef}
											style={{
												position: "absolute",
												top: "calc(100% + 8px)",
												left: 0,
												right: 0,
												backgroundColor: "#ffffff",
												border: "1px solid #e0e0e0",
												borderRadius: "12px",
												boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
												zIndex: 10000,
												overflow: "hidden",
											}}
										>
											{saleTypes.map((type, index) => (
												<div
													key={type}
													onClick={() => handleSaleTypeSelect(type)}
													style={{
														padding: "14px 20px",
														cursor: "pointer",
														borderBottom:
															index !== saleTypes.length - 1
																? "1px solid #f5f5f5"
																: "none",
														transition: "all 0.2s ease",
														fontSize: "14px",
														color: "#222222",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.backgroundColor = "#F7F7F7";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.backgroundColor = "#ffffff";
													}}
												>
													{type}
												</div>
											))}
										</div>
									)}
								</div>

								{/* What Type Dropdown */}
								<div style={{ position: "relative" }} ref={categoryInputRef}>
									<div
										onClick={handleCategoryClick}
										style={{
											width: "100%",
											padding: "14px 16px 14px 44px",
											border: "1px solid #E0E0E0",
											borderRadius: "12px",
											backgroundColor: "#F7F7F7",
											fontSize: "14px",
											outline: "none",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											color: category ? "#222222" : "#717171",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = "#FF385C";
											e.currentTarget.style.backgroundColor = "#FFFFFF";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = "#E0E0E0";
											e.currentTarget.style.backgroundColor = "#F7F7F7";
										}}
									>
										<span>{category || "What type are you looking for?"}</span>
										<ChevronDown 
											size={18} 
											color="#717171"
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
										}}
									>
										<Home size={18} color="#717171" />
									</div>
									{/* Category Dropdown */}
									{showCategoryDropdown && allCategories && allCategories.length > 0 && (
										<div
											ref={dropdownRef}
											style={{
												position: "absolute",
												top: "calc(100% + 8px)",
												left: 0,
												right: 0,
												backgroundColor: "#ffffff",
												border: "1px solid #e0e0e0",
												borderRadius: "12px",
												boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
												zIndex: 10000,
												overflow: "hidden",
												maxHeight: "300px",
												overflowY: "auto",
											}}
										>
											{allCategories.map((cat, index) => (
												<div
													key={cat.value}
													onClick={() => handleCategorySelect(cat.label)}
													style={{
														padding: "14px 20px",
														cursor: "pointer",
														borderBottom:
															index !== allCategories.length - 1
																? "1px solid #f5f5f5"
																: "none",
														transition: "all 0.2s ease",
														display: "flex",
														alignItems: "center",
														gap: "12px",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.backgroundColor = "#F7F7F7";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.backgroundColor = "#ffffff";
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
															fontWeight: "500",
															color: "#222222",
														}}
													>
														{cat.label}
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>

							{/* Bottom Row */}
							<div
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

								{/* Street */}
								<div style={{ position: "relative" }}>
									<input
										type="text"
										placeholder="Street"
										value={street}
										onChange={(e) => setStreet(e.target.value)}
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
										<Navigation size={18} color="#717171" />
									</div>
								</div>

								{/* Seek Button */}
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
									Seek
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Banner;

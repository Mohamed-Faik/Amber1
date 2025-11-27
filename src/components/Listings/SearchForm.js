"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, Globe, MapPin, ArrowRight, Sparkles, Mountain, UtensilsCrossed, Palette, Heart, Map, BookOpen, Film, Dumbbell, ShoppingBag, Trees, Castle, Building2, Home as HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { moroccanCities } from "@/libs/moroccanCities";

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

	// Select categories based on feature type
	const categories = featureType === "EXPERIENCES" ? experienceCategories : propertyCategories;

	// Filter cities based on search term
	const filteredCities = moroccanCities.filter((city) =>
		city.label.toLowerCase().includes(locationSearchTerm.toLowerCase())
	);

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
			<form onSubmit={handleSearch} style={{ position: "relative", zIndex: 100 }}>
				<div style={{
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
						Where
					</div>
					<div style={{
						fontSize: "14px",
						color: locationValue ? "#222222" : "#717171",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}>
						{locationValue || "Search destinations"}
					</div>

					{/* Location Dropdown Menu */}
					{showLocationDropdown && (
						<div style={{
							position: "absolute",
							top: "calc(100% + 12px)",
							left: 0,
							right: 0,
							backgroundColor: "#FFFFFF",
							border: "1px solid #DDDDDD",
							borderRadius: "16px",
							boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
							zIndex: 99999,
							maxHeight: "320px",
							overflowY: "auto",
							minWidth: "280px",
						}}>
							{/* Search Input Inside Dropdown */}
							<div style={{
								padding: "12px",
								borderBottom: "1px solid #EEEEEE",
								position: "sticky",
								top: 0,
								backgroundColor: "#FFFFFF",
								zIndex: 1,
							}}>
								<input
									type="text"
									placeholder="Type to search cities..."
									value={locationSearchTerm}
									onChange={(e) => setLocationSearchTerm(e.target.value)}
									onClick={(e) => e.stopPropagation()}
									style={{
										width: "100%",
										border: "1px solid #DDDDDD",
										borderRadius: "8px",
										padding: "8px 12px",
										fontSize: "14px",
										outline: "none",
										fontFamily: "inherit",
									}}
								/>
							</div>
							{filteredCities.map((city) => (
								<div
									key={city.value}
									onClick={(e) => {
										e.stopPropagation();
										setLocationValue(city.label);
										setLocationSearchTerm(city.label);
										setShowLocationDropdown(false);
									}}
									style={{
										padding: "12px 16px",
										cursor: "pointer",
										transition: "background-color 0.15s ease",
										display: "flex",
										alignItems: "center",
										gap: "10px",
										fontSize: "14px",
										color: "#222222",
										backgroundColor: locationValue === city.label ? "#F7F7F7" : "transparent",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = "#F7F7F7";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = locationValue === city.label ? "#F7F7F7" : "transparent";
									}}
								>
									<MapPin size={16} color="#FF385C" strokeWidth={2} />
									<span>{city.label}</span>
								</div>
							))}
						</div>
					)}
				</div>

					{/* Divider */}
					<div style={{
						width: "1px",
						height: "32px",
						backgroundColor: "#DDDDDD",
					}} />

					{/* Type of Service Section */}
					<div 
						ref={dropdownRef}
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
						{featureType === "EXPERIENCES" ? "Type of service" : "Property type"}
					</div>
						<div style={{
							fontSize: "14px",
							color: category ? "#222222" : "#717171",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}>
							{category 
								? categories.find(cat => cat.value === category)?.label
								: (featureType === "EXPERIENCES" ? "Add service" : "Add property type")
							}
						</div>

						{/* Dropdown Menu */}
						{showCategoryDropdown && (
							<div style={{
								position: "absolute",
								top: "calc(100% + 12px)",
								left: 0,
								right: 0,
								backgroundColor: "#FFFFFF",
								border: "1px solid #DDDDDD",
								borderRadius: "16px",
								boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
								zIndex: 99999,
								maxHeight: "400px",
								overflowY: "auto",
								minWidth: "240px",
							}}>
								{categories.map((cat) => (
									<div
										key={cat.value}
										onClick={(e) => {
											e.stopPropagation();
											setCategory(cat.value);
											setShowCategoryDropdown(false);
										}}
										style={{
											padding: "12px 16px",
											cursor: "pointer",
											transition: "background-color 0.15s ease",
											display: "flex",
											alignItems: "center",
											gap: "10px",
											fontSize: "14px",
											color: "#222222",
											backgroundColor: category === cat.value ? "#F7F7F7" : "transparent",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#F7F7F7";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = category === cat.value ? "#F7F7F7" : "transparent";
										}}
									>
								{getIcon(cat.icon, 18, "#FF385C")}
										<span>{cat.label}</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Search Button */}
					<button
						type="submit"
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

				{/* Mobile Responsive Styles */}
				<style jsx>{`
					@media (max-width: 768px) {
						form > div {
							flex-direction: column !important;
							border-radius: 16px !important;
							padding: 16px !important;
						}
						form > div > div:first-child,
						form > div > div:nth-child(3) {
							padding: 12px 0 !important;
							width: 100%;
						}
						form > div > div:nth-child(2) {
							width: 100%;
							height: 1px;
							margin: 8px 0;
						}
						form > div > button {
							width: 100%;
							border-radius: 8px !important;
							height: 48px;
							margin-top: 12px;
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

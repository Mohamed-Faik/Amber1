"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, Check, Search } from "lucide-react";
import { moroccanCities } from "@/libs/moroccanCities";
import { useLanguage } from "@/contexts/LanguageContext";

// Property Categories
const propertyCategories = [
	{ value: "Apartment", label: "Apartment" },
	{ value: "Villa", label: "Villa" },
	{ value: "Land", label: "Land" },
	{ value: "Commercial", label: "Commercial" },
	{ value: "Riad", label: "Riad" },
	{ value: "House", label: "House" },
];


const amenities = [
	{ id: "gatedCommunity", label: "Gated Community" },
	{ id: "elevator", label: "Elevator" },
	{ id: "securitySystem", label: "Security System" },
	{ id: "heating", label: "Heating" },
	{ id: "airConditioning", label: "Air Conditioning" },
	{ id: "equippedKitchen", label: "Equipped Kitchen" },
	{ id: "balcony", label: "Balcony" },
	{ id: "terrace", label: "Terrace" },
	{ id: "privateGarden", label: "Private Garden" },
	{ id: "swimmingPool", label: "Swimming Pool" },
	{ id: "greenSpaces", label: "Green Spaces" },
	{ id: "garageBox", label: "Garage Box" },
	{ id: "parkingSpaces", label: "Parking Spaces" },
	{ id: "basement", label: "Basement" },
];

const ExperiencesStyleSearchForm = ({ searchParams }) => {
	const router = useRouter();
	const { language } = useLanguage();
	const isRTL = language === 'ar';

	const [whereValue, setWhereValue] = useState("");
	const [propertyType, setPropertyType] = useState("");
	const [selectedAmenities, setSelectedAmenities] = useState({});
	const [showWhereDropdown, setShowWhereDropdown] = useState(false);
	const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [whereSearchTerm, setWhereSearchTerm] = useState("");

	// Mobile state
	const [isMobile, setIsMobile] = useState(false);
	const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);

	const propertyTypeDropdownRef = useRef(null);
	const filterDropdownRef = useRef(null);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		checkMobile(); // Check on mount
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Initialize form values from searchParams
	useEffect(() => {
		if (searchParams) {
			if (searchParams.location_value) {
				setWhereValue(searchParams.location_value);
			}
			if (searchParams.category) {
				setPropertyType(searchParams.category);
			}

			// Initialize amenities from search params
			const newAmenities = {};
			amenities.forEach(amenity => {
				if (searchParams[amenity.id] === 'true') {
					newAmenities[amenity.id] = true;
				}
			});
			setSelectedAmenities(newAmenities);
		}
	}, [searchParams]);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (propertyTypeDropdownRef.current && !propertyTypeDropdownRef.current.contains(e.target)) {
				setShowPropertyTypeDropdown(false);
			}
			if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
				setShowFilters(false);
			}
			if (!e.target.closest(".where-dropdown-container")) {
				setShowWhereDropdown(false);
			}
		};
		if (showPropertyTypeDropdown || showWhereDropdown || showFilters) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [showPropertyTypeDropdown, showWhereDropdown, showFilters]);

	// Filter cities based on search
	const filteredCities = moroccanCities.filter(city =>
		city.label.toLowerCase().includes(whereSearchTerm.toLowerCase())
	);

	// Handle search
	const handleSearch = (e) => {
		if (e) {
			e.preventDefault();
		}
		const params = new URLSearchParams();

		// Add location
		if (whereValue) {
			params.append("location_value", whereValue);
		}


		// Add property type/category
		if (propertyType) {
			params.append("category", propertyType);
		}

		// Add amenities
		Object.keys(selectedAmenities).forEach(key => {
			if (selectedAmenities[key]) {
				params.append(key, "true");
			}
		});


		// Navigate to listings page with search params
		router.push(`/listings?${params.toString()}`);

		// Close mobile modal if open
		if (isMobile) {
			setShowMobileSearchModal(false);
		}
	};

	return (
		<>
			{/* Mobile Search Button */}
			{isMobile && !showMobileSearchModal && (
				<button
					onClick={() => setShowMobileSearchModal(true)}
					style={{
						width: "100%",
						maxWidth: "600px",
						padding: "14px 20px",
						borderRadius: "30px",
						border: "none",
						backgroundColor: "#FFFFFF",
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "12px",
						cursor: "pointer",
						fontSize: "14px",
						fontWeight: "500",
						color: "#222222",
						flexDirection: isRTL ? 'row-reverse' : 'row'
					}}
				>
					<Search size={18} color="#222222" />
					<span>{isRTL ? "ابدأ البحث" : "Start your search"}</span>
				</button>
			)}

			{/* Mobile Search Modal */}
			{isMobile && showMobileSearchModal && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "#F7F7F7",
						zIndex: 99999,
						overflowY: "auto",
						padding: "16px",
						display: "flex",
						flexDirection: "column",
						direction: isRTL ? 'rtl' : 'ltr'
					}}
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowMobileSearchModal(false);
						}
					}}
				>
					<div
						style={{
							maxWidth: "600px",
							width: "100%",
							margin: "40px auto 0",
							backgroundColor: "#FFFFFF",
							borderRadius: "16px",
							padding: "24px",
							boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
							position: "relative",
							display: "flex",
							flexDirection: "column",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close Button */}
						<button
							onClick={() => setShowMobileSearchModal(false)}
							style={{
								position: "absolute",
								top: "16px",
								[isRTL ? 'left' : 'right']: "16px",
								width: "32px",
								height: "32px",
								borderRadius: "50%",
								border: "none",
								backgroundColor: "#F7F7F7",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								zIndex: 10,
							}}
						>
							<X size={18} color="#222222" />
						</button>

						<div style={{ flex: 1 }}>
							{/* Location */}
							<div style={{ marginBottom: "24px" }}>
								<h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#222222", textAlign: isRTL ? 'right' : 'left' }}>
									{isRTL ? "إلى أين؟" : "Where"}
								</h2>
								<input
									type="text"
									placeholder={isRTL ? "بحث عن وجهات" : "Search destinations"}
									value={whereValue}
									onChange={(e) => {
										setWhereValue(e.target.value);
										setWhereSearchTerm(e.target.value);
									}}
									style={{
										width: "100%",
										padding: "16px",
										fontSize: "16px",
										border: "1px solid #DDDDDD",
										borderRadius: "12px",
										outline: "none",
										backgroundColor: "#FFFFFF",
										textAlign: isRTL ? 'right' : 'left'
									}}
								/>
								{/* City Suggestions */}
								{whereValue && (
									<div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
										{filteredCities.slice(0, 3).map((city) => (
											<button
												key={city.value}
												onClick={() => setWhereValue(city.label)}
												style={{
													textAlign: isRTL ? 'right' : 'left',
													background: "none",
													border: "none",
													padding: "8px",
													fontSize: "14px",
													color: "#717171",
													cursor: "pointer",
												}}
											>
												{city.label}
											</button>
										))}
									</div>
								)}
							</div>

							<div style={{ width: "100%", height: "1px", backgroundColor: "#EBEBEB", margin: "24px 0" }} />

							{/* Property Type */}
							<div style={{ marginBottom: "24px" }}>
								<h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#222222", textAlign: isRTL ? 'right' : 'left' }}>
									{isRTL ? "نوع العقار" : "Property Type"}
								</h2>
								<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
									{propertyCategories.map((category) => (
										<button
											key={category.value}
											onClick={() => setPropertyType(category.label)}
											style={{
												padding: "8px 16px",
												borderRadius: "20px",
												border: `1px solid ${propertyType === category.label ? "#222222" : "#DDDDDD"}`,
												backgroundColor: propertyType === category.label ? "#222222" : "transparent",
												color: propertyType === category.label ? "#FFFFFF" : "#222222",
												fontSize: "14px",
												cursor: "pointer",
												transition: "all 0.2s",
											}}
										>
											{category.label}
										</button>
									))}
								</div>
							</div>

							<div style={{ width: "100%", height: "1px", backgroundColor: "#EBEBEB", margin: "24px 0" }} />

							{/* Amenities Filters */}
							<div style={{ marginBottom: "24px" }}>
								<h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#222222" }}>Amenities</h2>
								<div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
									{amenities.map((amenity) => (
										<div
											key={amenity.id}
											onClick={() => setSelectedAmenities(prev => ({
												...prev,
												[amenity.id]: !prev[amenity.id]
											}))}
											style={{
												display: "flex",
												alignItems: "center",
												gap: "12px",
												cursor: "pointer",
												padding: "12px",
												borderRadius: "8px",
												backgroundColor: selectedAmenities[amenity.id] ? "#F7F7F7" : "transparent",
												border: "1px solid transparent",
											}}
										>
											<div
												style={{
													width: "24px",
													height: "24px",
													border: `2px solid ${selectedAmenities[amenity.id] ? "#222222" : "#B0B0B0"}`,
													borderRadius: "4px",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													backgroundColor: selectedAmenities[amenity.id] ? "#222222" : "white",
													flexShrink: 0,
												}}
											>
												{selectedAmenities[amenity.id] && <Check size={16} color="white" strokeWidth={3} />}
											</div>
											<span style={{ fontSize: "16px", color: "#222222" }}>{amenity.label}</span>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Search Button */}
						<div style={{ marginTop: "16px" }}>
							<button
								onClick={handleSearch}
								style={{
									width: "100%",
									padding: "16px",
									backgroundColor: "#FF385C",
									color: "#FFFFFF",
									border: "none",
									borderRadius: "8px",
									fontSize: "16px",
									fontWeight: "600",
									cursor: "pointer",
								}}
							>
								Search
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Desktop Search Form */}
			{!isMobile && (
				<div
					className="desktop-search-form"
					style={{
						display: "flex",
						alignItems: "center",
						backgroundColor: "#F7F7F7",
						borderRadius: "40px",
						padding: isRTL ? "4px 20px 4px 4px" : "4px 4px 4px 20px",
						boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
						maxWidth: "850px",
						width: "100%",
						margin: "0 auto",
						direction: isRTL ? 'rtl' : 'ltr'
					}}
				>
					{/* Where */}
					<div
						className="where-dropdown-container"
						style={{
							flex: 1,
							position: "relative",
							minWidth: "200px",
						}}
					>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setShowWhereDropdown(!showWhereDropdown);
								setShowPropertyTypeDropdown(false);
								setShowFilters(false);
							}}
							style={{
								width: "100%",
								padding: "12px 16px",
								border: "none",
								backgroundColor: "transparent",
								textAlign: isRTL ? "right" : "left",
								cursor: "pointer",
								fontSize: "14px",
								fontWeight: "600",
								color: whereValue ? "#222222" : "#717171",
							}}
						>
							<div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#222222" }}>
								{isRTL ? "إلى أين" : "Where"}
							</div>
							<div style={{ fontSize: "14px", color: whereValue ? "#222222" : "#717171" }}>
								{whereValue || (isRTL ? "وجهات البحث" : "Search destinations")}
							</div>
						</button>
						{showWhereDropdown && (
							<div
								style={{
									position: "absolute",
									top: "100%",
									left: 0,
									right: 0,
									backgroundColor: "#FFFFFF",
									border: "1px solid #DDDDDD",
									borderRadius: "12px",
									marginTop: "8px",
									boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
									maxHeight: "300px",
									overflowY: "auto",
									zIndex: 10000,
								}}
								onClick={(e) => e.stopPropagation()}
							>
								<input
									type="text"
									placeholder={isRTL ? "البحث في المدن..." : "Search cities..."}
									value={whereSearchTerm}
									onChange={(e) => setWhereSearchTerm(e.target.value)}
									style={{
										width: "100%",
										padding: "12px 16px",
										border: "none",
										borderBottom: "1px solid #E0E0E0",
										fontSize: "14px",
										textAlign: isRTL ? "right" : "left"
									}}
								/>
								{filteredCities.map((city) => (
									<button
										key={city.value}
										onClick={() => {
											setWhereValue(city.label);
											setShowWhereDropdown(false);
										}}
										style={{
											width: "100%",
											padding: "12px 16px",
											border: "none",
											backgroundColor: "transparent",
											textAlign: isRTL ? "right" : "left",
											cursor: "pointer",
											fontSize: "14px",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#F7F7F7";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = "transparent";
										}}
									>
										{city.label}
									</button>
								))}
							</div>
						)}
					</div>

					<div
						style={{
							width: "1px",
							height: "32px",
							backgroundColor: "#E0E0E0",
							margin: "0 8px",
						}}
					/>

					{/* Property Type */}
					<div
						ref={propertyTypeDropdownRef}
						style={{
							flex: 1,
							position: "relative",
							minWidth: "180px",
						}}
					>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setShowPropertyTypeDropdown(!showPropertyTypeDropdown);
								setShowWhereDropdown(false);
								setShowFilters(false);
							}}
							style={{
								width: "100%",
								padding: "12px 16px",
								border: "none",
								backgroundColor: "transparent",
								textAlign: isRTL ? "right" : "left",
								cursor: "pointer",
								fontSize: "14px",
								fontWeight: "600",
								color: propertyType ? "#222222" : "#717171",
							}}
						>
							<div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#222222" }}>
								{isRTL ? "نوع العقار" : "Property Type"}
							</div>
							<div style={{ fontSize: "14px", color: propertyType ? "#222222" : "#717171" }}>
								{propertyType || (isRTL ? "حدد النوع" : "Select type")}
							</div>
						</button>
						{showPropertyTypeDropdown && (
							<div
								style={{
									position: "absolute",
									top: "100%",
									left: 0,
									right: 0,
									backgroundColor: "#FFFFFF",
									border: "1px solid #DDDDDD",
									borderRadius: "12px",
									marginTop: "8px",
									boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
									maxHeight: "300px",
									overflowY: "auto",
									zIndex: 10000,
								}}
								onClick={(e) => e.stopPropagation()}
							>
								{propertyCategories.map((category) => (
									<button
										key={category.value}
										onClick={() => {
											setPropertyType(category.label);
											setShowPropertyTypeDropdown(false);
										}}
										style={{
											width: "100%",
											padding: "12px 16px",
											border: "none",
											backgroundColor: propertyType === category.label ? "#F7F7F7" : "transparent",
											textAlign: isRTL ? "right" : "left",
											cursor: "pointer",
											fontSize: "14px",
											borderBottom: "1px solid #F0F0F0",
										}}
										onMouseEnter={(e) => {
											if (propertyType !== category.label) {
												e.currentTarget.style.backgroundColor = "#F7F7F7";
											}
										}}
										onMouseLeave={(e) => {
											if (propertyType !== category.label) {
												e.currentTarget.style.backgroundColor = "transparent";
											}
										}}
									>
										{category.label}
									</button>
								))}
							</div>
						)}
					</div>



					{/* Search Button */}
					<button
						onClick={handleSearch}
						style={{
							width: "48px",
							height: "48px",
							borderRadius: "50%",
							backgroundColor: "#FF385C",
							border: "none",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							flexShrink: 0,
							[isRTL ? 'marginRight' : 'marginLeft']: "8px",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#E61E4D";
							e.currentTarget.style.transform = "scale(1.05)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#FF385C";
							e.currentTarget.style.transform = "scale(1)";
						}}
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.35-4.35"></path>
						</svg>
					</button>
				</div>
			)}
		</>
	);
};

export default ExperiencesStyleSearchForm;

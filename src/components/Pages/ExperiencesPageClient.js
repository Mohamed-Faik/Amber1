"use client";
import React, { useState, useRef, useEffect } from "react";
import { Heart, ChevronRight, ChevronLeft, MapPin, Calendar, Users, Search, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getListingImage } from "@/utils/getListingImage";
import { formattedPrice } from "@/utils/formattedPrice";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import { moroccanCities } from "@/libs/moroccanCities";

const ExperiencesPageClient = ({
	listings,
	totalPages,
	startListingNumber,
	endListingNumber,
	totalCount,
	currentUser,
	searchParams
}) => {
	const router = useRouter();
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [whereValue, setWhereValue] = useState("");
	const [whenValue, setWhenValue] = useState("");
	const [whoValue, setWhoValue] = useState("");
	const [showWhereDropdown, setShowWhereDropdown] = useState(false);
	const [showWhenDropdown, setShowWhenDropdown] = useState(false);
	const [showWhoDropdown, setShowWhoDropdown] = useState(false);
	const [whereSearchTerm, setWhereSearchTerm] = useState("");
	const [isFavorite, setIsFavorite] = useState({});
	const originalsScrollRef = useRef(null);
	const [mounted, setMounted] = useState(false);
	const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Guest selector state
	const [adults, setAdults] = useState(0);
	const [children, setChildren] = useState(0);
	const [infants, setInfants] = useState(0);
	
	// Date picker state
	const [selectedDate, setSelectedDate] = useState(null);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const whenDropdownRef = useRef(null);
	const whoDropdownRef = useRef(null);
	const whoButtonRef = useRef(null);

	// Initialize form values from searchParams
	useEffect(() => {
		if (searchParams) {
			if (searchParams.location_value) {
				setWhereValue(searchParams.location_value);
			}
			if (searchParams.date) {
				setWhenValue(searchParams.date);
				// Parse date string to Date object if needed
				const date = new Date(searchParams.date);
				if (!isNaN(date.getTime())) {
					setSelectedDate(date);
				}
			}
			if (searchParams.adults) {
				setAdults(parseInt(searchParams.adults, 10) || 0);
			}
			if (searchParams.children) {
				setChildren(parseInt(searchParams.children, 10) || 0);
			}
			if (searchParams.infants) {
				setInfants(parseInt(searchParams.infants, 10) || 0);
			}
		}
	}, [searchParams]);

	useEffect(() => {
		setMounted(true);
		
		// Check if mobile
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Update whoValue when guests change
	useEffect(() => {
		const total = adults + children + infants;
		if (total === 0) {
			setWhoValue("");
		} else {
			const parts = [];
			if (adults > 0) parts.push(`${adults} ${adults === 1 ? "guest" : "guests"}`);
			if (children > 0) parts.push(`${children} ${children === 1 ? "child" : "children"}`);
			if (infants > 0) parts.push(`${infants} ${infants === 1 ? "infant" : "infants"}`);
			setWhoValue(parts.join(", "));
		}
	}, [adults, children, infants]);


	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (whenDropdownRef.current && !whenDropdownRef.current.contains(e.target)) {
				setShowWhenDropdown(false);
			}
			if (whoDropdownRef.current && !whoDropdownRef.current.contains(e.target)) {
				setShowWhoDropdown(false);
			}
			if (!e.target.closest(".where-dropdown-container")) {
				setShowWhereDropdown(false);
			}
		};
		if (showWhenDropdown || showWhoDropdown || showWhereDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [showWhenDropdown, showWhoDropdown, showWhereDropdown]);

	// Group listings by city
	const groupListingsByCity = () => {
		const grouped = {};
		listings.forEach(listing => {
			const city = listing.location_value?.split(",")[1]?.trim() || "Other";
			if (!grouped[city]) {
				grouped[city] = [];
			}
			grouped[city].push(listing);
		});
		return grouped;
	};

	const groupedListings = groupListingsByCity();
	const featuredListings = listings.filter(l => l.isPremium).slice(0, 7);

	// Filter cities based on search
	const filteredCities = moroccanCities.filter(city =>
		city.label.toLowerCase().includes(whereSearchTerm.toLowerCase())
	);

	const scrollOriginals = (direction) => {
		if (originalsScrollRef.current) {
			const scrollAmount = 400;
			originalsScrollRef.current.scrollBy({
				left: direction === "right" ? scrollAmount : -scrollAmount,
				behavior: "smooth"
			});
		}
	};

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
		
		// Add date if selected
		if (selectedDate) {
			const dateStr = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
			params.append("date", dateStr);
		}
		
		// Add guests
		if (adults > 0) {
			params.append("adults", adults.toString());
		}
		if (children > 0) {
			params.append("children", children.toString());
		}
		if (infants > 0) {
			params.append("infants", infants.toString());
		}
		
		// Close mobile modal if open
		if (isMobile) {
			setShowMobileSearchModal(false);
		}
		
		// Navigate to experiences page with search params
		router.push(`/experiences?${params.toString()}`);
	};

	// Clear all search values
	const handleClearAll = () => {
		setWhereValue("");
		setWhenValue("");
		setWhoValue("");
		setSelectedDate(null);
		setAdults(0);
		setChildren(0);
		setInfants(0);
		setWhereSearchTerm("");
		setShowWhereDropdown(false);
		setShowWhenDropdown(false);
		setShowWhoDropdown(false);
	};

	// Experience Card Component
	const ExperienceCard = ({ listing, isOriginal = false }) => {
		const { translatedContent: translatedTitle } = useTranslatedContent(
			listing.title,
			displayLanguage,
			false
		);
		const mainImage = getListingImage(listing.imageSrc);

	return (
			<Link
				href={`/listing/${listing.id}/${listing.slug}`}
				style={{
					textDecoration: "none",
					color: "inherit",
					display: "block",
					flexShrink: 0,
				}}
			>
				<div
					style={{
			position: "relative",
						width: isOriginal ? "280px" : "100%",
						borderRadius: "12px",
			overflow: "hidden",
						backgroundColor: "#ffffff",
						cursor: "pointer",
						transition: "transform 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "scale(1.02)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
				>
					{/* Image */}
					<div
						style={{
			position: "relative",
							width: "100%",
							height: isOriginal ? "280px" : "240px",
			overflow: "hidden",
						}}
					>
						{mainImage ? (
							<Image
								src={mainImage}
								alt={translatedTitle}
								fill
								style={{ objectFit: "cover" }}
								unoptimized
							/>
						) : (
							<div
								style={{
									width: "100%",
									height: "100%",
									backgroundColor: "#E0E0E0",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#717171",
								}}
							>
								No Image
							</div>
						)}
						
						{/* Heart Icon */}
						<button
							onClick={(e) => {
								e.preventDefault();
								setIsFavorite(prev => ({
									...prev,
									[listing.id]: !prev[listing.id]
								}));
							}}
							style={{
				position: "absolute",
								top: "12px",
								right: "12px",
								width: "32px",
								height: "32px",
				borderRadius: "50%",
								backgroundColor: "#FFFFFF",
								border: "none",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
								zIndex: 10,
							}}
						>
							<Heart
								size={18}
								fill={isFavorite[listing.id] ? "#FF385C" : "none"}
								color={isFavorite[listing.id] ? "#FF385C" : "#222222"}
							/>
						</button>
					</div>

					{/* Content */}
					<div style={{ padding: "16px 0px" }}>
						{/* Title */}
						<h3
							style={{
								fontSize: "16px",
							fontWeight: "600",
							color: "#222222",
							margin: "0 0 8px 0",
								lineHeight: "1.3",
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
							}}
						>
							{translatedTitle}
						</h3>

						{/* Location */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "4px",
								marginBottom: "8px",
								fontSize: "14px",
							color: "#717171",
							}}
						>
							<MapPin size={14} />
							<span>{listing.location_value || "Location"}</span>
					</div>

						{/* Price */}
						<div
							style={{
								fontSize: "15px",
								fontWeight: "600",
								color: "#222222",
							}}
						>
							{listing.price
								? `From ${formattedPrice(listing.price, displayLanguage)}/guest`
								: "Price on request"}
						</div>
					</div>
				</div>
			</Link>
		);
	};

	// Original Card Component (with profile picture)
	const OriginalCard = ({ listing }) => {
		const { translatedContent: translatedTitle } = useTranslatedContent(
			listing.title,
			displayLanguage,
			false
		);
		const mainImage = getListingImage(listing.imageSrc);

		return (
			<Link
				href={`/listing/${listing.id}/${listing.slug}`}
				style={{
					textDecoration: "none",
					color: "inherit",
					display: "block",
					flexShrink: 0,
					width: "280px",
				}}
			>
				<div
					style={{
						position: "relative",
						width: "280px",
						borderRadius: "12px",
						overflow: "hidden",
						backgroundColor: "#ffffff",
						cursor: "pointer",
						transition: "transform 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "scale(1.02)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
				>
					{/* Profile Picture */}
					<div
						style={{
							position: "absolute",
							top: "16px",
							left: "16px",
							width: "64px",
							height: "64px",
							borderRadius: "50%",
							border: "3px solid #FFFFFF",
							overflow: "hidden",
							zIndex: 10,
							backgroundColor: "#E0E0E0",
						}}
					>
						{listing.user?.image ? (
							<Image
								src={listing.user.image}
								alt={listing.user.name || "Host"}
								width={64}
								height={64}
								style={{ objectFit: "cover" }}
								unoptimized
							/>
						) : (
							<div
								style={{
									width: "100%",
									height: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "#FF385C",
									color: "#FFFFFF",
									fontWeight: "600",
								}}
							>
								{(listing.user?.name || "H")[0].toUpperCase()}
							</div>
						)}
			</div>

					{/* Image */}
					<div
						style={{
							position: "relative",
							width: "100%",
							height: "280px",
							overflow: "hidden",
						}}
					>
						{mainImage ? (
							<Image
								src={mainImage}
								alt={translatedTitle}
								fill
								style={{ objectFit: "cover" }}
								unoptimized
							/>
						) : (
							<div
								style={{
									width: "100%",
									height: "100%",
									backgroundColor: "#E0E0E0",
								}}
							/>
						)}
					</div>

					{/* Content */}
					<div style={{ padding: "16px" }}>
						{/* Host Name */}
						<div
							style={{
								fontSize: "14px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "4px",
							}}
						>
							{listing.user?.name || "Host"}
						</div>

						{/* Title */}
						<h3
							style={{
								fontSize: "16px",
								fontWeight: "600",
								color: "#222222",
								margin: "0 0 8px 0",
								lineHeight: "1.3",
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
							}}
						>
							{translatedTitle}
						</h3>

						{/* Location and Price */}
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								fontSize: "14px",
								color: "#717171",
							}}
						>
							<span>{listing.location_value || "Location"}</span>
							<span style={{ fontWeight: "600", color: "#222222" }}>
								{listing.price
									? `From ${formattedPrice(listing.price, displayLanguage)}/guest`
									: "Price on request"}
							</span>
						</div>
					</div>
				</div>
			</Link>
		);
	};

	return (
		<div
			style={{
				backgroundColor: "#FFFFFF",
				minHeight: "100vh",
			}}
		>
			{/* Search Bar Section */}
			<div
				style={{
					position: "relative",
					zIndex: 100,
					backgroundColor: "#FFFFFF",
					borderBottom: "1px solid #E0E0E0",
					padding: isMobile ? "16px" : "24px 0",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
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
						}}
					>
						<Search size={18} color="#222222" />
						<span>Start your search</span>
					</button>
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
							padding: "4px 4px 4px 20px",
							boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
							maxWidth: "850px",
							width: "100%",
							margin: "0 auto",
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
									setShowWhenDropdown(false);
									setShowWhoDropdown(false);
								}}
								style={{
									width: "100%",
									padding: "12px 16px",
									border: "none",
									backgroundColor: "transparent",
									textAlign: "left",
									cursor: "pointer",
									fontSize: "14px",
									fontWeight: "600",
									color: whereValue ? "#222222" : "#717171",
								}}
							>
								<div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#222222" }}>
									Where
								</div>
								<div style={{ fontSize: "14px", color: whereValue ? "#222222" : "#717171" }}>
									{whereValue || "Search destinations"}
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
										zIndex: 1000,
									}}
									onClick={(e) => e.stopPropagation()}
								>
									<input
										type="text"
										placeholder="Search cities..."
										value={whereSearchTerm}
										onChange={(e) => setWhereSearchTerm(e.target.value)}
										style={{
											width: "100%",
											padding: "12px 16px",
											border: "none",
											borderBottom: "1px solid #E0E0E0",
											fontSize: "14px",
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
												textAlign: "left",
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

						{/* When */}
						<div
							ref={whenDropdownRef}
							style={{
								flex: 1,
								position: "relative",
								minWidth: "180px",
							}}
						>
							<button
								onClick={(e) => {
									e.stopPropagation();
									setShowWhenDropdown(!showWhenDropdown);
									setShowWhereDropdown(false);
									setShowWhoDropdown(false);
								}}
								style={{
									width: "100%",
									padding: "12px 16px",
									border: "none",
									backgroundColor: "transparent",
									textAlign: "left",
									cursor: "pointer",
									fontSize: "14px",
									fontWeight: "600",
									color: whenValue ? "#222222" : "#717171",
								}}
							>
								<div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#222222" }}>
									When
								</div>
								<div style={{ fontSize: "14px", color: whenValue ? "#222222" : "#717171" }}>
									{whenValue || "Add dates"}
								</div>
							</button>
							{showWhenDropdown && (
								<div
									style={{
										position: "absolute",
										top: "100%",
										left: 0,
										backgroundColor: "#FFFFFF",
										border: "1px solid #DDDDDD",
										borderRadius: "12px",
										marginTop: "8px",
										boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
										zIndex: 1000,
										width: "600px",
										display: "flex",
										overflow: "hidden",
									}}
									onClick={(e) => e.stopPropagation()}
								>
									{/* Quick Date Options */}
									<div
										style={{
											width: "200px",
											borderRight: "1px solid #E0E0E0",
											padding: "16px",
										}}
									>
										<button
											onClick={() => {
												const today = new Date();
												setSelectedDate(today);
												setWhenValue(today.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
												setShowWhenDropdown(false);
											}}
											style={{
												width: "100%",
												padding: "12px",
												border: "none",
												backgroundColor: "transparent",
												textAlign: "left",
												cursor: "pointer",
												borderRadius: "8px",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = "#F7F7F7";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = "transparent";
											}}
										>
											<div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
												Today
											</div>
											<div style={{ fontSize: "12px", color: "#717171" }}>
												{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
											</div>
										</button>
										<button
											onClick={() => {
												const tomorrow = new Date();
												tomorrow.setDate(tomorrow.getDate() + 1);
												setSelectedDate(tomorrow);
												setWhenValue(tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
												setShowWhenDropdown(false);
											}}
											style={{
												width: "100%",
												padding: "12px",
												border: "none",
												backgroundColor: "transparent",
												textAlign: "left",
												cursor: "pointer",
												borderRadius: "8px",
												marginTop: "8px",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = "#F7F7F7";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = "transparent";
											}}
										>
											<div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
												Tomorrow
											</div>
											<div style={{ fontSize: "12px", color: "#717171" }}>
												{(() => {
													const tomorrow = new Date();
													tomorrow.setDate(tomorrow.getDate() + 1);
													return tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric" });
												})()}
											</div>
										</button>
										<button
											onClick={() => {
												const today = new Date();
												const dayOfWeek = today.getDay();
												const daysUntilSaturday = 6 - dayOfWeek;
												const saturday = new Date(today);
												saturday.setDate(today.getDate() + daysUntilSaturday);
												const sunday = new Date(saturday);
												sunday.setDate(saturday.getDate() + 1);
												setSelectedDate(saturday);
												setWhenValue(`${saturday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`);
												setShowWhenDropdown(false);
											}}
											style={{
												width: "100%",
												padding: "12px",
												border: "none",
												backgroundColor: "transparent",
												textAlign: "left",
												cursor: "pointer",
												borderRadius: "8px",
												marginTop: "8px",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = "#F7F7F7";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = "transparent";
											}}
										>
											<div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
												This weekend
											</div>
											<div style={{ fontSize: "12px", color: "#717171" }}>
												{(() => {
													const today = new Date();
													const dayOfWeek = today.getDay();
													const daysUntilSaturday = 6 - dayOfWeek;
													const saturday = new Date(today);
													saturday.setDate(today.getDate() + daysUntilSaturday);
													const sunday = new Date(saturday);
													sunday.setDate(saturday.getDate() + 1);
													return `${saturday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
												})()}
											</div>
										</button>
									</div>

									{/* Calendar */}
									<div
										style={{
											flex: 1,
											padding: "16px",
										}}
									>
										{/* Calendar Header */}
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												marginBottom: "16px",
											}}
										>
											<button
												onClick={() => {
													const prevMonth = new Date(currentMonth);
													prevMonth.setMonth(prevMonth.getMonth() - 1);
													setCurrentMonth(prevMonth);
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
												}}
											>
												<ChevronLeft size={16} />
											</button>
											<div
												style={{
													fontSize: "16px",
													fontWeight: "600",
													color: "#222222",
												}}
											>
												{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
											</div>
											<button
												onClick={() => {
													const nextMonth = new Date(currentMonth);
													nextMonth.setMonth(nextMonth.getMonth() + 1);
													setCurrentMonth(nextMonth);
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
												}}
											>
												<ChevronRight size={16} />
											</button>
										</div>

										{/* Calendar Grid */}
										<div>
											{/* Day Headers */}
											<div
												style={{
													display: "grid",
													gridTemplateColumns: "repeat(7, 1fr)",
													gap: "4px",
													marginBottom: "8px",
												}}
											>
												{["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
													<div
														key={idx}
														style={{
															textAlign: "center",
															fontSize: "12px",
															fontWeight: "600",
															color: "#717171",
															padding: "8px",
														}}
													>
														{day}
													</div>
												))}
											</div>

											{/* Calendar Days */}
											<div
												style={{
													display: "grid",
													gridTemplateColumns: "repeat(7, 1fr)",
													gap: "4px",
												}}
											>
												{(() => {
													const year = currentMonth.getFullYear();
													const month = currentMonth.getMonth();
													const firstDay = new Date(year, month, 1);
													const lastDay = new Date(year, month + 1, 0);
													const daysInMonth = lastDay.getDate();
													const startingDayOfWeek = firstDay.getDay();
													const days = [];

													// Empty cells for days before month starts
													for (let i = 0; i < startingDayOfWeek; i++) {
														days.push(null);
													}

													// Days of the month
													for (let day = 1; day <= daysInMonth; day++) {
														days.push(day);
													}

													return days.map((day, idx) => {
														if (day === null) {
															return <div key={idx} style={{ padding: "8px" }} />;
														}
														const date = new Date(year, month, day);
														const isToday = date.toDateString() === new Date().toDateString();
														const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

														return (
															<button
																key={idx}
																onClick={() => {
																	setSelectedDate(date);
																	setWhenValue(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
																	setShowWhenDropdown(false);
																}}
																style={{
																	padding: "8px",
																	border: "none",
																	backgroundColor: isSelected ? "#222222" : isToday ? "#F7F7F7" : "transparent",
																	color: isSelected ? "#FFFFFF" : "#222222",
																	borderRadius: "8px",
																	cursor: "pointer",
																	fontSize: "14px",
																	fontWeight: isSelected ? "600" : "400",
																}}
																onMouseEnter={(e) => {
																	if (!isSelected) {
																		e.currentTarget.style.backgroundColor = "#F7F7F7";
																	}
																}}
																onMouseLeave={(e) => {
																	if (!isSelected) {
																		e.currentTarget.style.backgroundColor = isToday ? "#F7F7F7" : "transparent";
																	}
																}}
															>
																{day}
															</button>
														);
													});
												})()}
											</div>
										</div>
									</div>
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

						{/* Who */}
						<div
							ref={whoDropdownRef}
							style={{
								flex: 1,
								position: "relative",
								minWidth: "180px",
							}}
						>
							<button
								ref={whoButtonRef}
								onClick={(e) => {
									e.stopPropagation();
									setShowWhoDropdown(!showWhoDropdown);
									setShowWhereDropdown(false);
									setShowWhenDropdown(false);
								}}
								style={{
									width: "100%",
									padding: "12px 16px",
									border: "none",
									backgroundColor: "transparent",
									textAlign: "left",
									cursor: "pointer",
									fontSize: "14px",
									fontWeight: "600",
									color: whoValue ? "#222222" : "#717171",
								}}
							>
								<div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#222222" }}>
									Who
								</div>
								<div style={{ fontSize: "14px", color: whoValue ? "#222222" : "#717171" }}>
									{whoValue || "Add guests"}
								</div>
							</button>
							{showWhoDropdown && (
								<div
									style={{
										position: "absolute",
										top: "100%",
										right: 0,
										backgroundColor: "#FFFFFF",
										border: "1px solid #DDDDDD",
										borderRadius: "12px",
										marginTop: "8px",
										boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
										zIndex: 10000,
										width: "320px",
										padding: "16px",
									}}
									onClick={(e) => e.stopPropagation()}
									onMouseDown={(e) => e.stopPropagation()}
								>
									{/* Adults */}
									<div
										style={{
							display: "flex",
											alignItems: "center",
							justifyContent: "space-between",
											padding: "16px 0",
							borderBottom: "1px solid #E0E0E0",
										}}
									>
										<div>
											<div
												style={{
													fontSize: "16px",
													fontWeight: "600",
													color: "#222222",
													marginBottom: "4px",
												}}
											>
												Adults
											</div>
											<div
												style={{
													fontSize: "14px",
													color: "#717171",
												}}
											>
												Ages 13 or above
											</div>
										</div>
										<div
											style={{
								display: "flex",
								alignItems: "center",
								gap: "16px",
											}}
										>
											<button
												onClick={() => setAdults(Math.max(0, adults - 1))}
												disabled={adults === 0}
												style={{
													width: "32px",
													height: "32px",
													borderRadius: "50%",
													border: "1px solid #B0B0B0",
													backgroundColor: adults === 0 ? "#F7F7F7" : "#FFFFFF",
													color: adults === 0 ? "#B0B0B0" : "#222222",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
													cursor: adults === 0 ? "not-allowed" : "pointer",
													fontSize: "18px",
													fontWeight: "600",
												}}
											>
												−
											</button>
											<span
												style={{
													fontSize: "16px",
													fontWeight: "600",
									color: "#222222",
													minWidth: "24px",
													textAlign: "center",
												}}
											>
												{adults}
											</span>
											<button
												onClick={() => setAdults(adults + 1)}
												style={{
													width: "32px",
													height: "32px",
													borderRadius: "50%",
													border: "1px solid #222222",
													backgroundColor: "#FFFFFF",
													color: "#222222",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													cursor: "pointer",
													fontSize: "18px",
													fontWeight: "600",
												}}
											>
												+
											</button>
										</div>
							</div>

									{/* Children */}
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											padding: "16px 0",
											borderBottom: "1px solid #E0E0E0",
										}}
									>
										<div>
											<div
												style={{
													fontSize: "16px",
													fontWeight: "600",
													color: "#222222",
													marginBottom: "4px",
												}}
											>
												Children
											</div>
											<div
												style={{
													fontSize: "14px",
													color: "#717171",
												}}
											>
												Ages 2-12
											</div>
										</div>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "16px",
											}}
										>
								<button
												onClick={() => setChildren(Math.max(0, children - 1))}
												disabled={children === 0}
									style={{
													width: "32px",
													height: "32px",
													borderRadius: "50%",
													border: "1px solid #B0B0B0",
													backgroundColor: children === 0 ? "#F7F7F7" : "#FFFFFF",
													color: children === 0 ? "#B0B0B0" : "#222222",
										display: "flex",
										alignItems: "center",
													justifyContent: "center",
													cursor: children === 0 ? "not-allowed" : "pointer",
													fontSize: "18px",
													fontWeight: "600",
												}}
											>
												−
											</button>
											<span
												style={{
													fontSize: "16px",
													fontWeight: "600",
													color: "#222222",
													minWidth: "24px",
													textAlign: "center",
												}}
											>
												{children}
											</span>
											<button
												onClick={() => setChildren(children + 1)}
												style={{
													width: "32px",
													height: "32px",
													borderRadius: "50%",
													border: "1px solid #222222",
										backgroundColor: "#FFFFFF",
													color: "#222222",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													cursor: "pointer",
													fontSize: "18px",
													fontWeight: "600",
												}}
											>
												+
											</button>
										</div>
									</div>

									{/* Infants */}
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											padding: "16px 0",
										}}
									>
										<div>
											<div
												style={{
													fontSize: "16px",
													fontWeight: "600",
													color: "#222222",
													marginBottom: "4px",
												}}
											>
												Infants
											</div>
											<div
												style={{
										fontSize: "14px",
													color: "#717171",
												}}
											>
												Under 2
											</div>
										</div>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "16px",
											}}
										>
											<button
												onClick={() => setInfants(Math.max(0, infants - 1))}
												disabled={infants === 0}
												style={{
													width: "32px",
													height: "32px",
													borderRadius: "50%",
													border: "1px solid #B0B0B0",
													backgroundColor: infants === 0 ? "#F7F7F7" : "#FFFFFF",
													color: infants === 0 ? "#B0B0B0" : "#222222",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													cursor: infants === 0 ? "not-allowed" : "pointer",
													fontSize: "18px",
													fontWeight: "600",
												}}
											>
												−
											</button>
											<span
												style={{
													fontSize: "16px",
										fontWeight: "600",
										color: "#222222",
													minWidth: "24px",
													textAlign: "center",
												}}
											>
												{infants}
											</span>
											<button
												onClick={() => setInfants(infants + 1)}
												style={{
													width: "32px",
													height: "32px",
													borderRadius: "50%",
													border: "1px solid #222222",
													backgroundColor: "#FFFFFF",
													color: "#222222",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
										cursor: "pointer",
													fontSize: "18px",
													fontWeight: "600",
												}}
											>
												+
											</button>
										</div>
									</div>
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
								marginLeft: "8px",
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
								stroke="#FFFFFF"
								strokeWidth="2.5"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
						</button>
					</div>
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
							zIndex: 1000,
							overflowY: "auto",
							padding: "16px",
						}}
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								setShowMobileSearchModal(false);
							}
						}}
					>
						{/* Modal Content */}
						<div
							style={{
								maxWidth: "600px",
								margin: "0 auto",
								backgroundColor: "#FFFFFF",
								borderRadius: "16px",
								padding: "24px",
								marginTop: "40px",
								boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
								position: "relative",
							}}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close Button */}
							<button
								onClick={() => setShowMobileSearchModal(false)}
								style={{
									position: "absolute",
									top: "16px",
									right: "16px",
									width: "32px",
									height: "32px",
									borderRadius: "50%",
									border: "none",
									backgroundColor: "#F7F7F7",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
								}}
							>
								<X size={18} color="#222222" />
							</button>
							{/* Where Section */}
							<div style={{ marginBottom: "16px" }}>
								<h2
									style={{
										fontSize: "22px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "16px",
									}}
								>
									Where?
								</h2>
								<div
									className="where-dropdown-container"
									style={{
										position: "relative",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											padding: "16px",
											border: "1px solid #DDDDDD",
											borderRadius: "12px",
											backgroundColor: "#FFFFFF",
											cursor: "pointer",
										}}
										onClick={(e) => {
											e.stopPropagation();
											setShowWhereDropdown(!showWhereDropdown);
											setShowWhenDropdown(false);
											setShowWhoDropdown(false);
										}}
									>
										<Search size={20} color="#717171" style={{ marginRight: "12px" }} />
										<span
											style={{
												flex: 1,
												fontSize: "16px",
												color: whereValue ? "#222222" : "#717171",
											}}
										>
											{whereValue || "Search destinations"}
										</span>
										<ChevronDown
											size={20}
											color="#717171"
											style={{
												transform: showWhereDropdown ? "rotate(180deg)" : "rotate(0deg)",
												transition: "transform 0.2s",
											}}
										/>
									</div>
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
												zIndex: 1000,
											}}
											onClick={(e) => e.stopPropagation()}
										>
											<input
												type="text"
												placeholder="Search cities..."
												value={whereSearchTerm}
												onChange={(e) => setWhereSearchTerm(e.target.value)}
												style={{
													width: "100%",
													padding: "12px 16px",
													border: "none",
													borderBottom: "1px solid #E0E0E0",
													fontSize: "14px",
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
														textAlign: "left",
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
							</div>

							{/* When Section */}
							<div
								ref={whenDropdownRef}
								style={{
									marginBottom: "16px",
									position: "relative",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										padding: "16px",
										backgroundColor: "#F7F7F7",
										borderRadius: "12px",
										cursor: "pointer",
									}}
									onClick={(e) => {
										e.stopPropagation();
										setShowWhenDropdown(!showWhenDropdown);
										setShowWhereDropdown(false);
										setShowWhoDropdown(false);
									}}
								>
									<span
										style={{
											fontSize: "16px",
											fontWeight: "600",
											color: "#222222",
										}}
									>
										When
									</span>
									<span
										style={{
											fontSize: "16px",
											color: whenValue ? "#222222" : "#717171",
										}}
									>
										{whenValue || "Add dates"}
									</span>
								</div>
								{showWhenDropdown && (
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
											zIndex: 1000,
											padding: "16px",
										}}
										onClick={(e) => e.stopPropagation()}
									>
										{/* Quick Date Options */}
										<div style={{ marginBottom: "16px" }}>
											<button
												onClick={() => {
													const today = new Date();
													setSelectedDate(today);
													setWhenValue(today.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
													setShowWhenDropdown(false);
												}}
												style={{
													width: "100%",
													padding: "12px",
													border: "none",
													backgroundColor: "transparent",
													textAlign: "left",
													cursor: "pointer",
													borderRadius: "8px",
													marginBottom: "8px",
												}}
											>
												<div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
													Today
												</div>
												<div style={{ fontSize: "12px", color: "#717171" }}>
													{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
												</div>
											</button>
											<button
												onClick={() => {
													const tomorrow = new Date();
													tomorrow.setDate(tomorrow.getDate() + 1);
													setSelectedDate(tomorrow);
													setWhenValue(tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
													setShowWhenDropdown(false);
												}}
												style={{
													width: "100%",
													padding: "12px",
													border: "none",
													backgroundColor: "transparent",
													textAlign: "left",
													cursor: "pointer",
													borderRadius: "8px",
													marginBottom: "8px",
												}}
											>
												<div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
													Tomorrow
												</div>
												<div style={{ fontSize: "12px", color: "#717171" }}>
													{(() => {
														const tomorrow = new Date();
														tomorrow.setDate(tomorrow.getDate() + 1);
														return tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric" });
													})()}
												</div>
											</button>
										</div>
										{/* Simple Calendar */}
										<div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													marginBottom: "16px",
												}}
											>
												<button
													onClick={() => {
														const prevMonth = new Date(currentMonth);
														prevMonth.setMonth(prevMonth.getMonth() - 1);
														setCurrentMonth(prevMonth);
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
													}}
												>
													<ChevronLeft size={16} />
												</button>
												<div
													style={{
														fontSize: "16px",
														fontWeight: "600",
														color: "#222222",
													}}
												>
													{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
												</div>
												<button
													onClick={() => {
														const nextMonth = new Date(currentMonth);
														nextMonth.setMonth(nextMonth.getMonth() + 1);
														setCurrentMonth(nextMonth);
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
													}}
												>
													<ChevronRight size={16} />
												</button>
											</div>
											<div>
												<div
													style={{
														display: "grid",
														gridTemplateColumns: "repeat(7, 1fr)",
														gap: "4px",
														marginBottom: "8px",
													}}
												>
													{["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
														<div
															key={idx}
															style={{
																textAlign: "center",
																fontSize: "12px",
																fontWeight: "600",
																color: "#717171",
																padding: "8px",
															}}
														>
															{day}
														</div>
													))}
												</div>
												<div
													style={{
														display: "grid",
														gridTemplateColumns: "repeat(7, 1fr)",
														gap: "4px",
													}}
												>
													{(() => {
														const year = currentMonth.getFullYear();
														const month = currentMonth.getMonth();
														const firstDay = new Date(year, month, 1);
														const lastDay = new Date(year, month + 1, 0);
														const daysInMonth = lastDay.getDate();
														const startingDayOfWeek = firstDay.getDay();
														const days = [];

														for (let i = 0; i < startingDayOfWeek; i++) {
															days.push(null);
														}

														for (let day = 1; day <= daysInMonth; day++) {
															days.push(day);
														}

														return days.map((day, idx) => {
															if (day === null) {
																return <div key={idx} style={{ padding: "8px" }} />;
															}
															const date = new Date(year, month, day);
															const isToday = date.toDateString() === new Date().toDateString();
															const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

															return (
																<button
																	key={idx}
																	onClick={() => {
																		setSelectedDate(date);
																		setWhenValue(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
																		setShowWhenDropdown(false);
																	}}
																	style={{
																		padding: "8px",
																		border: "none",
																		backgroundColor: isSelected ? "#222222" : isToday ? "#F7F7F7" : "transparent",
																		color: isSelected ? "#FFFFFF" : "#222222",
																		borderRadius: "8px",
																		cursor: "pointer",
																		fontSize: "14px",
																		fontWeight: isSelected ? "600" : "400",
																	}}
																>
																	{day}
																</button>
															);
														});
													})()}
												</div>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* What/Who Section */}
							<div
								ref={whoDropdownRef}
								style={{
									marginBottom: "24px",
									position: "relative",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										padding: "16px",
										backgroundColor: "#F7F7F7",
										borderRadius: "12px",
										cursor: "pointer",
									}}
									onClick={(e) => {
										e.stopPropagation();
										setShowWhoDropdown(!showWhoDropdown);
										setShowWhereDropdown(false);
										setShowWhenDropdown(false);
									}}
								>
									<span
										style={{
											fontSize: "16px",
											fontWeight: "600",
											color: "#222222",
										}}
									>
										What
									</span>
									<span
										style={{
											fontSize: "16px",
											color: whoValue ? "#222222" : "#717171",
										}}
									>
										{whoValue || "Add service"}
									</span>
								</div>
								{showWhoDropdown && (
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
											zIndex: 1000,
											padding: "16px",
										}}
										onClick={(e) => e.stopPropagation()}
									>
										{/* Adults */}
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												padding: "16px 0",
												borderBottom: "1px solid #E0E0E0",
											}}
										>
											<div>
												<div
													style={{
														fontSize: "16px",
														fontWeight: "600",
														color: "#222222",
														marginBottom: "4px",
													}}
												>
													Adults
												</div>
												<div
													style={{
														fontSize: "14px",
														color: "#717171",
													}}
												>
													Ages 13 or above
												</div>
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "16px",
												}}
											>
												<button
													onClick={() => setAdults(Math.max(0, adults - 1))}
													disabled={adults === 0}
													style={{
														width: "32px",
														height: "32px",
														borderRadius: "50%",
														border: "1px solid #B0B0B0",
														backgroundColor: adults === 0 ? "#F7F7F7" : "#FFFFFF",
														color: adults === 0 ? "#B0B0B0" : "#222222",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														cursor: adults === 0 ? "not-allowed" : "pointer",
														fontSize: "18px",
														fontWeight: "600",
													}}
												>
													−
												</button>
												<span
													style={{
														fontSize: "16px",
														fontWeight: "600",
														color: "#222222",
														minWidth: "24px",
														textAlign: "center",
													}}
												>
													{adults}
												</span>
												<button
													onClick={() => setAdults(adults + 1)}
													style={{
														width: "32px",
														height: "32px",
														borderRadius: "50%",
														border: "1px solid #222222",
														backgroundColor: "#FFFFFF",
														color: "#222222",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														cursor: "pointer",
														fontSize: "18px",
														fontWeight: "600",
													}}
												>
													+
												</button>
											</div>
										</div>

										{/* Children */}
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												padding: "16px 0",
												borderBottom: "1px solid #E0E0E0",
											}}
										>
											<div>
												<div
													style={{
														fontSize: "16px",
														fontWeight: "600",
														color: "#222222",
														marginBottom: "4px",
													}}
												>
													Children
												</div>
												<div
													style={{
														fontSize: "14px",
														color: "#717171",
													}}
												>
													Ages 2-12
												</div>
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "16px",
												}}
											>
												<button
													onClick={() => setChildren(Math.max(0, children - 1))}
													disabled={children === 0}
													style={{
														width: "32px",
														height: "32px",
														borderRadius: "50%",
														border: "1px solid #B0B0B0",
														backgroundColor: children === 0 ? "#F7F7F7" : "#FFFFFF",
														color: children === 0 ? "#B0B0B0" : "#222222",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														cursor: children === 0 ? "not-allowed" : "pointer",
														fontSize: "18px",
														fontWeight: "600",
													}}
												>
													−
												</button>
												<span
													style={{
														fontSize: "16px",
														fontWeight: "600",
														color: "#222222",
														minWidth: "24px",
														textAlign: "center",
													}}
												>
													{children}
												</span>
												<button
													onClick={() => setChildren(children + 1)}
													style={{
														width: "32px",
														height: "32px",
														borderRadius: "50%",
														border: "1px solid #222222",
														backgroundColor: "#FFFFFF",
														color: "#222222",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														cursor: "pointer",
														fontSize: "18px",
														fontWeight: "600",
													}}
												>
													+
												</button>
											</div>
										</div>

										{/* Infants */}
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												padding: "16px 0",
											}}
										>
											<div>
												<div
													style={{
														fontSize: "16px",
														fontWeight: "600",
														color: "#222222",
														marginBottom: "4px",
													}}
												>
													Infants
												</div>
												<div
													style={{
														fontSize: "14px",
														color: "#717171",
													}}
												>
													Under 2
												</div>
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "16px",
												}}
											>
												<button
													onClick={() => setInfants(Math.max(0, infants - 1))}
													disabled={infants === 0}
													style={{
														width: "32px",
														height: "32px",
														borderRadius: "50%",
														border: "1px solid #B0B0B0",
														backgroundColor: infants === 0 ? "#F7F7F7" : "#FFFFFF",
														color: infants === 0 ? "#B0B0B0" : "#222222",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														cursor: infants === 0 ? "not-allowed" : "pointer",
														fontSize: "18px",
														fontWeight: "600",
													}}
												>
													−
												</button>
												<span
													style={{
														fontSize: "16px",
														fontWeight: "600",
														color: "#222222",
														minWidth: "24px",
														textAlign: "center",
													}}
												>
													{infants}
												</span>
												<button
													onClick={() => setInfants(infants + 1)}
													style={{
														width: "32px",
														height: "32px",
														borderRadius: "50%",
														border: "1px solid #222222",
														backgroundColor: "#FFFFFF",
														color: "#222222",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														cursor: "pointer",
														fontSize: "18px",
														fontWeight: "600",
													}}
												>
													+
												</button>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Footer Actions */}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									paddingTop: "16px",
									borderTop: "1px solid #E0E0E0",
								}}
							>
								<button
									onClick={handleClearAll}
									style={{
										border: "none",
										backgroundColor: "transparent",
										cursor: "pointer",
										fontSize: "16px",
										fontWeight: "600",
										color: "#222222",
										textDecoration: "underline",
									}}
								>
									Clear all
								</button>
								<button
									onClick={handleSearch}
									style={{
										padding: "14px 24px",
										borderRadius: "8px",
										border: "none",
										background: "linear-gradient(to right, #FF385C, #E61E4D)",
										color: "#FFFFFF",
										fontSize: "16px",
										fontWeight: "600",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										gap: "8px",
									}}
								>
									<Search size={18} color="#FFFFFF" />
									Search
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Main Content */}
			<div
				style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: isMobile ? "24px 16px" : "48px 80px",
				}}
			>
				{/* Airbnb Originals Section */}
				{featuredListings.length > 0 && (
					<div style={{ marginBottom: "64px" }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "24px",
							}}
						>
							<div>
								<div
									style={{
										fontSize: "12px",
										fontWeight: "600",
										color: "#717171",
										textTransform: "uppercase",
										letterSpacing: "0.5px",
										marginBottom: "8px",
									}}
								>
									AmberHomes Originals
								</div>
								<h2
									style={{
										fontSize: "22px",
										fontWeight: "600",
									color: "#222222",
										margin: 0,
									}}
								>
									Hosted by the world's most interesting people
								</h2>
							</div>
							<div style={{ display: "flex", gap: "8px" }}>
								<button
									onClick={() => scrollOriginals("left")}
									style={{
										width: "40px",
										height: "40px",
										borderRadius: "50%",
										border: "1px solid #DDDDDD",
										backgroundColor: "#FFFFFF",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
									}}
								>
									<ChevronLeft size={20} />
								</button>
								<button
									onClick={() => scrollOriginals("right")}
									style={{
										width: "40px",
										height: "40px",
										borderRadius: "50%",
										border: "1px solid #DDDDDD",
										backgroundColor: "#FFFFFF",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
									}}
								>
									<ChevronRight size={20} />
								</button>
							</div>
						</div>
						<div
							ref={originalsScrollRef}
							style={{
								display: "flex",
								gap: "24px",
								overflowX: "auto",
								scrollbarWidth: "none",
								msOverflowStyle: "none",
								paddingBottom: "16px",
							}}
						>
							{featuredListings.map((listing) => (
								<OriginalCard key={listing.id} listing={listing} />
							))}
						</div>
					</div>
				)}

				{/* Popular with travelers from your area */}
				<div style={{ marginBottom: "64px" }}>
					<h2
						style={{
							fontSize: "22px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "32px",
						}}
					>
						Popular with travelers from your area
					</h2>

					{/* City Sections */}
					{Object.entries(groupedListings).map(([city, cityListings]) => (
						<div key={city} style={{ marginBottom: "48px" }}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									marginBottom: "24px",
								}}
							>
								<h3
									style={{
										fontSize: "18px",
										fontWeight: "600",
										color: "#222222",
										margin: 0,
									}}
								>
									Experiences in {city}
								</h3>
								<button
									style={{
										display: "flex",
										alignItems: "center",
										gap: "4px",
										border: "none",
										backgroundColor: "transparent",
										cursor: "pointer",
										fontSize: "14px",
										fontWeight: "600",
										color: "#222222",
									}}
								>
									Show all
									<ChevronRight size={16} />
								</button>
					</div>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
									gap: "24px",
								}}
							>
								{cityListings.slice(0, 7).map((listing) => (
									<ExperienceCard key={listing.id} listing={listing} />
								))}
							</div>
						</div>
					))}
				</div>
			</div>


			<style jsx global>{`
				.experiences-page-container ::-webkit-scrollbar {
					display: none;
				}
				.experiences-page-container {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</div>
	);
};

export default ExperiencesPageClient;

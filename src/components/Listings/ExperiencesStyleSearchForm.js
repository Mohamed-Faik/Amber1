"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { moroccanCities } from "@/libs/moroccanCities";

// Property Categories
const propertyCategories = [
	{ value: "Villa", label: "Villa" },
	{ value: "Apartment", label: "Apartment" },
	{ value: "House", label: "House" },
	{ value: "Land", label: "Land" },
	{ value: "Dwelling", label: "Dwelling" },
	{ value: "Riads", label: "Riads" },
	{ value: "Soil", label: "Soil" },
	{ value: "Office", label: "Office" },
	{ value: "Commercial", label: "Commercial" },
	{ value: "Industrial", label: "Industrial" },
	{ value: "Investment property", label: "Investment property" },
];

const ExperiencesStyleSearchForm = ({ searchParams }) => {
	const router = useRouter();
	const [whereValue, setWhereValue] = useState("");
	const [propertyType, setPropertyType] = useState("");
	const [showWhereDropdown, setShowWhereDropdown] = useState(false);
	const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
	const [whereSearchTerm, setWhereSearchTerm] = useState("");
	const propertyTypeDropdownRef = useRef(null);

	// Initialize form values from searchParams
	useEffect(() => {
		if (searchParams) {
			if (searchParams.location_value) {
				setWhereValue(searchParams.location_value);
			}
			if (searchParams.category) {
				setPropertyType(searchParams.category);
			}
		}
	}, [searchParams]);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (propertyTypeDropdownRef.current && !propertyTypeDropdownRef.current.contains(e.target)) {
				setShowPropertyTypeDropdown(false);
			}
			if (!e.target.closest(".where-dropdown-container")) {
				setShowWhereDropdown(false);
			}
		};
		if (showPropertyTypeDropdown || showWhereDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [showPropertyTypeDropdown, showWhereDropdown]);

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
		
		// Navigate to listings page with search params
		router.push(`/listings?${params.toString()}`);
	};

	return (
		<div
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
						setShowPropertyTypeDropdown(false);
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
							zIndex: 10000,
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
						color: propertyType ? "#222222" : "#717171",
					}}
				>
					<div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#222222" }}>
						Property Type
					</div>
					<div style={{ fontSize: "14px", color: propertyType ? "#222222" : "#717171" }}>
						{propertyType || "Select type"}
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
									textAlign: "left",
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
	);
};

export default ExperiencesStyleSearchForm;

"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import searchZoom from "../../../public/images/icon/search-zoom-in.svg";
import locationIco from "../../../public/images/icon/location.svg";
import globalIco from "../../../public/images/icon/global.svg";
import LocationFind from "./LocationFind";
import { toast } from "react-hot-toast";
import { categories as allCategories } from "@/libs/Categories";

const SearchForm = () => {
	const [locations, setLocations] = useState([]);
	const [category, setCategory] = useState("");
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
	const [locSuggest, setLocSuggest] = useState(false);
	const [LocationValue, setLocationValue] = useState("");
	const router = useRouter();
	const categoryInputRef = useRef(null);
	const dropdownRef = useRef(null);

	const handleSearch = useCallback(() => {
		router.push(
			`/listings?category=${category}&location_value=${LocationValue}`
		);
	}, [category, LocationValue, router]);

	const handleCategorySelect = (cat) => {
		setCategory(cat);
		setShowCategoryDropdown(false);
		// Stay on the same page, no action until Search is clicked
	};

	const handleCategoryClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("Category clicked, current state:", showCategoryDropdown);
		console.log("Categories available:", allCategories);
		setShowCategoryDropdown((prev) => {
			console.log("Setting dropdown to:", !prev);
			return !prev;
		});
	};

	const handleLocationSelect = (loc) => {
		setLocSuggest(false);
		setLocationValue(loc);
	};

	// Close dropdown when clicking outside
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
		};

		if (showCategoryDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showCategoryDropdown]);

	const locationFind = useCallback((locValue) => {
		if (locValue) {
			axios
				.get(`/api/categories/location/${locValue}`)
				.then((response) => {
					setLocations(response.data);
				})
				.catch((error) => {
					toast.error("Something went wromg!");
				});

			setLocSuggest(true);
		}
	}, []);

	return (
		<form
			className="search-form"
			onSubmit={(e) => {
				e.preventDefault();
				handleSearch();
			}}
			style={{
				display: "flex",
				alignItems: "center",
				gap: "8px",
				width: "100%",
			}}
		>
			<div
				style={{
					display: "flex",
					flex: 1,
					gap: "0",
					backgroundColor: "#f7f7f7",
					borderRadius: "40px",
					border: "1px solid #e0e0e0",
					position: "relative",
				}}
			>
				{/* Category Dropdown */}
				<div
					style={{
						position: "relative",
						flex: 1,
						minWidth: "200px",
						overflow: "visible",
					}}
				>
					<div
						ref={categoryInputRef}
						onClick={handleCategoryClick}
						style={{
							width: "100%",
							padding: "16px 20px 16px 48px",
							border: "none",
							backgroundColor: "transparent",
							fontSize: "14px",
							outline: "none",
							borderRight: "1px solid #e0e0e0",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							color: category ? "#222222" : "#717171",
						}}
					>
						<span>{category || "What are you looking for?"}</span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							style={{
								transform: showCategoryDropdown
									? "rotate(180deg)"
									: "rotate(0deg)",
								transition: "transform 0.2s ease",
								color: "#717171",
							}}
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
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
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#717171"
							strokeWidth="2"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.35-4.35"></path>
						</svg>
					</div>

					{/* Category Dropdown Menu */}
					{showCategoryDropdown && allCategories && allCategories.length > 0 && (
						<div
							ref={dropdownRef}
							className="category-dropdown"
							style={{
								position: "absolute",
								top: "calc(100% + 8px)",
								left: 0,
								right: 0,
								backgroundColor: "#ffffff",
								border: "1px solid #e0e0e0",
								borderRadius: "12px",
								boxShadow:
									"0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
								zIndex: 10000,
								overflow: "hidden",
								minWidth: "100%",
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
										transition: "all 0.2s ease-in-out",
										display: "flex",
										alignItems: "center",
										gap: "12px",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor =
											"#f8f9fa";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor =
											"#ffffff";
									}}
								>
									<div
										style={{
											width: "40px",
											height: "40px",
											borderRadius: "8px",
											backgroundColor: "#f0f4f8",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
											boxShadow:
												"0 2px 4px rgba(0,0,0,0.05)",
										}}
									>
								<Image
									src={cat.imageSrc}
									width={24}
									height={24}
									alt={cat.label}
									style={{
										objectFit: "contain",
									}}
								/>
									</div>
									<div
										style={{
											flex: 1,
											fontSize: "15px",
											fontWeight: "500",
											color: "#333",
											letterSpacing: "0.3px",
										}}
									>
										{cat.label}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

					{/* Location Input */}
					<div
						style={{
							position: "relative",
							flex: 1,
							minWidth: "200px",
						}}
					>
					<input
						type="text"
						placeholder="Neighborhood in Marrakech?"
						value={LocationValue}
						onChange={(e) => {
							setLocationValue(e.target.value);
							locationFind(e.target.value);
						}}
							style={{
								width: "100%",
								padding: "16px 20px 16px 48px",
								border: "none",
								backgroundColor: "transparent",
								fontSize: "14px",
								outline: "none",
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
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#717171"
								strokeWidth="2"
							>
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
						</div>

						{locations.length > 0 && locSuggest && (
							<LocationFind
								locations={locations}
								onSelect={handleLocationSelect}
							/>
						)}
					</div>
				</div>

				{/* Search Button */}
				<button
					type="submit"
					style={{
						backgroundColor: "#FF385C",
						color: "#ffffff",
						border: "none",
						padding: "14px 32px",
						borderRadius: "40px",
						fontSize: "16px",
						fontWeight: "600",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: "8px",
						transition: "all 0.3s ease",
						whiteSpace: "nowrap",
					}}
					onMouseEnter={(e) => {
						e.target.style.backgroundColor = "#E61E4D";
						e.target.style.transform = "scale(1.02)";
					}}
					onMouseLeave={(e) => {
						e.target.style.backgroundColor = "#FF385C";
						e.target.style.transform = "scale(1)";
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
			</form>
	);
};

export default SearchForm;

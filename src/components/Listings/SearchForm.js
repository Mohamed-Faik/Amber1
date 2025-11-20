"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Globe, MapPin, ArrowRight, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchForm = ({ searchParams }) => {
	const [category, setCategory] = useState("");
	const [locationValue, setLocationValue] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (searchParams) {
			const { category: cat, location_value: loc, min_price: min, max_price: max } = searchParams;
			setCategory(cat || "");
			setLocationValue(loc || "");
			setMinPrice(min || "");
			setMaxPrice(max || "");
		}
	}, [searchParams]);

	const handleSearch = useCallback((e) => {
		if (e) {
			e.preventDefault();
		}
		const params = new URLSearchParams();
		if (category) params.append("category", category);
		if (locationValue) params.append("location_value", locationValue);
		if (minPrice) params.append("min_price", minPrice);
		if (maxPrice) params.append("max_price", maxPrice);
		
		router.push(`/listings?${params.toString()}`);
	}, [category, locationValue, minPrice, maxPrice, router]);

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
				gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
				gap: "20px",
				alignItems: "flex-end",
			}}
			className="search-form-grid"
			>
				{/* Category/What Search Input */}
				<div style={{ position: "relative", flex: 1 }}>
					<label style={{
						display: "block",
						fontSize: "14px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "8px",
					}}>
						What are you looking for?
					</label>
					<div style={{ position: "relative" }}>
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
						<div style={{
							position: "absolute",
							left: "16px",
							top: "50%",
							transform: "translateY(-50%)",
							display: "flex",
							alignItems: "center",
							pointerEvents: "none",
						}}>
							<Globe size={20} color="#717171" strokeWidth={2} />
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

				{/* Min Price Input */}
				<div style={{ position: "relative", flex: 1 }}>
					<label style={{
						display: "block",
						fontSize: "14px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "8px",
					}}>
						Min Price (MAD)
					</label>
					<div style={{ position: "relative" }}>
						<input
							type="number"
							placeholder="Min price"
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
							<DollarSign size={20} color="#717171" strokeWidth={2} />
						</div>
					</div>
				</div>

				{/* Max Price Input */}
				<div style={{ position: "relative", flex: 1 }}>
					<label style={{
						display: "block",
						fontSize: "14px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "8px",
					}}>
						Max Price (MAD)
					</label>
					<div style={{ position: "relative" }}>
						<input
							type="number"
							placeholder="Max price"
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
							<DollarSign size={20} color="#717171" strokeWidth={2} />
						</div>
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

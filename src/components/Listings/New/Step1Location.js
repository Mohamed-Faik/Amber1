"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { moroccanCities, getNeighborhoodsByCity } from "@/libs/moroccanCities";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";
import { MapPin } from "lucide-react";

// Function to find nearest city/neighborhood from coordinates
const findNearestLocation = (lat, lng) => {
	let nearestCity = null;
	let nearestNeighborhood = null;
	let minDistance = Infinity;

	moroccanCities.forEach(city => {
		const cityLat = city.latlng[0];
		const cityLng = city.latlng[1];

		// Calculate distance using Haversine formula (simplified)
		const distance = Math.sqrt(
			Math.pow(lat - cityLat, 2) + Math.pow(lng - cityLng, 2)
		);

		if (distance < minDistance) {
			minDistance = distance;
			nearestCity = city;

			// Find nearest neighborhood
			if (city.neighborhoods && city.neighborhoods.length > 0) {
				// For simplicity, use the first neighborhood or city center
				nearestNeighborhood = city.neighborhoods[0];
			}
		}
	});

	if (nearestCity) {
		if (nearestNeighborhood) {
			return `${nearestNeighborhood.label}, ${nearestCity.label}`;
		}
		return nearestCity.label;
	}

	return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
};

// Dynamically import the entire map to avoid SSR issues
const LocationMap = dynamic(() => import("./LocationMap"), {
	ssr: false,
	loading: () => (
		<div
			style={{
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#717171",
			}}
		>
			Loading map...
		</div>
	),
});

const Step1Location = ({ formData, updateFormData, onNext, showMap = false, currentSubStep = 1 }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [address, setAddress] = useState(formData.address || "");
	const [markerPosition, setMarkerPosition] = useState(
		formData.location || { lat: 31.6295, lng: -7.9811 } // Default to Morocco center
	);
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const inputRef = useRef(null);
	const suggestionsRef = useRef(null);
	const totalSteps = 7;
	const progressPercentage = (currentSubStep / totalSteps) * 100;

	// Sync local state with formData changes (Map Sync Logic)
	useEffect(() => {
		if (formData.address !== undefined && formData.address !== address) {
			setAddress(formData.address);
		}
		if (formData.location && (formData.location.lat !== markerPosition.lat || formData.location.lng !== markerPosition.lng)) {
			setMarkerPosition(formData.location);
		}
	}, [formData.address, formData.location]);

	const handleAddressChange = (e) => {
		const value = e.target.value;
		setAddress(value);

		// Generate autocomplete suggestions
		if (value.trim().length > 0) {
			const lowerValue = value.toLowerCase().trim();
			const allSuggestions = [];

			// Search through cities and neighborhoods
			moroccanCities.forEach(city => {
				// Check if city name matches
				if (city.label.toLowerCase().startsWith(lowerValue)) {
					allSuggestions.push({
						label: city.label,
						value: city.label,
						type: "city",
						latlng: city.latlng,
					});
				}

				// Check neighborhoods
				const neighborhoods = getNeighborhoodsByCity(city.value);
				neighborhoods.forEach(neighborhood => {
					const fullAddress = `${neighborhood.label}, ${city.label}`;
					if (
						neighborhood.label.toLowerCase().startsWith(lowerValue) ||
						fullAddress.toLowerCase().startsWith(lowerValue) ||
						city.label.toLowerCase().startsWith(lowerValue)
					) {
						allSuggestions.push({
							label: fullAddress,
							value: fullAddress,
							type: "neighborhood",
							latlng: city.latlng,
							city: city.label,
						});
					}
				});
			});

			// Limit to 10 suggestions
			setSuggestions(allSuggestions.slice(0, 10));
			setShowSuggestions(allSuggestions.length > 0);
			setSelectedIndex(-1);
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	};

	const handleSuggestionSelect = (suggestion) => {
		setAddress(suggestion.value);

		// Update marker position if latlng is available
		if (suggestion.latlng && Array.isArray(suggestion.latlng) && suggestion.latlng.length >= 2) {
			const newPosition = {
				lat: parseFloat(suggestion.latlng[0]),
				lng: parseFloat(suggestion.latlng[1])
			};

			// Update marker position - this will trigger map update
			setMarkerPosition(newPosition);

			// Update form data
			updateFormData({
				address: suggestion.value,
				location: newPosition
			});
		} else {
			updateFormData({
				address: suggestion.value,
				location: markerPosition
			});
		}

		setShowSuggestions(false);
		setSuggestions([]);
		if (inputRef.current) {
			inputRef.current.blur();
		}
	};

	const handleKeyDown = (e) => {
		if (!showSuggestions || suggestions.length === 0) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex(prev =>
				prev < suggestions.length - 1 ? prev + 1 : prev
			);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
		} else if (e.key === "Enter" && selectedIndex >= 0) {
			e.preventDefault();
			handleSuggestionSelect(suggestions[selectedIndex]);
		} else if (e.key === "Escape") {
			setShowSuggestions(false);
		}
	};

	// Close suggestions when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target) &&
				inputRef.current &&
				!inputRef.current.contains(event.target)
			) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleMarkerDragEnd = (position) => {
		setMarkerPosition(position);

		// Find address from coordinates when marker is dragged
		const addressFromMap = findNearestLocation(position.lat, position.lng);
		setAddress(addressFromMap);

		updateFormData({
			address: addressFromMap,
			location: position
		});
	};

	const handleMapClick = (position) => {
		setMarkerPosition(position);

		// Find address from coordinates (reverse geocoding)
		const addressFromMap = findNearestLocation(position.lat, position.lng);
		setAddress(addressFromMap);

		updateFormData({
			address: addressFromMap,
			location: position
		});
	};

	const handleNextClick = () => {
		if (address.trim()) {
			updateFormData({ address, location: markerPosition });
			onNext();
		}
	};

	const canProceed = address.trim().length > 0;

	// If showMap is true, only render the map
	if (showMap) {
		return (
			<div
				style={{
					position: "relative",
					height: "100%",
					width: "100%",
				}}
			>
				<LocationMap
					markerPosition={markerPosition}
					onMarkerDragEnd={handleMarkerDragEnd}
					onMapClick={handleMapClick}
				/>
			</div>
		);
	}

	// Otherwise, render only the form
	return (
		<>
			<style jsx>{`
				.step1-location-container {
					display: flex;
					flex-direction: column;
					height: 100%;
					overflow: hidden;
				}
				.content-wrapper {
					max-width: 600px;
					width: 100%;
					margin: 0 auto;
					display: flex;
					flex-direction: column;
					flex: 1;
					min-height: 0;
					overflow-y: auto;
					overflow-x: hidden;
					padding-bottom: 20px;
				}
				.progress-bar-container {
					width: 100%;
					height: 4px;
					background-color: #E0E0E0;
					border-radius: 0;
					overflow: hidden;
					margin: 0;
					margin-top: -1px;
					position: relative;
				}
				.progress-bar-fill {
					height: 100%;
					background-color: #222222;
					border-radius: 0;
					transition: width 0.3s ease;
				}
				.footer-navigation {
					position: fixed;
					bottom: 0;
					left: 0;
					right: 0;
					background-color: #FFFFFF;
					border-top: 1px solid #E0E0E0;
					padding: 0;
					z-index: 100;
					box-shadow: 0 -2px 4px rgba(0,0,0,0.02);
				}
				.footer-content {
					width: 100%;
					padding: 16px 24px;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-end;
				}
				.progress-bar-container {
					width: 100%;
					margin: 0;
				}
				.next-button-wrapper {
					margin: 0;
					display: flex;
					justify-content: flex-end;
					flex-shrink: 0;
					margin-right: 0;
				}
				.content-wrapper {
					padding-bottom: 120px;
				}
				.location-input:focus {
					border-color: #222222 !important;
				}
				@media (max-width: 767px) {
					.map-section {
						height: 300px !important;
						border-radius: 12px !important;
					}
				}
			`}</style>
			<div className="step1-location-container">
				<div className="content-wrapper">
				<h1
					style={{
						fontSize: "clamp(24px, 4vw, 32px)",
						fontWeight: "500",
						fontFamily: "'Times New Roman', serif",
						color: "#222222",
						paddingTop: "20px",
						marginBottom: "32px",
						lineHeight: "1.2",
					}}
				>
					{getTranslation(displayLanguage, "listings.whereIsPropertyLocated")}
				</h1>

				<div style={{ marginBottom: "32px", position: "relative" }}>
					<input
						ref={inputRef}
						type="text"
						value={address}
						onChange={handleAddressChange}
						onKeyDown={handleKeyDown}
						onFocus={(e) => {
							if (suggestions.length > 0) {
								setShowSuggestions(true);
							}
						}}
						placeholder={getTranslation(displayLanguage, "listings.addressPlaceholder")}
						style={{
							width: "100%",
							padding: "16px",
							fontSize: "16px",
							border: "1px solid #e0e0e0",
							borderRadius: "8px",
							outline: "none",
							backgroundColor: "white",
							transition: "border-color 0.2s",
							boxShadow: "none",
						}}
						className="location-input"
					/>

					{showSuggestions && suggestions.length > 0 && (
						<div
							ref={suggestionsRef}
							style={{
								position: "absolute",
								top: "100%",
								left: 0,
								right: 0,
								backgroundColor: "#FFFFFF",
								border: "1px solid #E0E0E0",
								borderRadius: "8px",
								boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
								zIndex: 1000,
								maxHeight: "300px",
								overflowY: "auto",
								marginTop: "4px",
							}}
						>
							{suggestions.map((suggestion, index) => (
								<div
									key={`${suggestion.value}-${index}`}
									onClick={() => handleSuggestionSelect(suggestion)}
									style={{
										padding: "12px 16px",
										cursor: "pointer",
										backgroundColor: selectedIndex === index ? "#FFF5F7" : "transparent",
										borderBottom: index < suggestions.length - 1 ? "1px solid #F0F0F0" : "none",
										transition: "background-color 0.2s ease",
										display: "flex",
										alignItems: "center",
										gap: "12px"
									}}
									onMouseEnter={() => setSelectedIndex(index)}
									onMouseLeave={() => setSelectedIndex(-1)}
								>
									<div style={{
										backgroundColor: "#f0f0f0",
										padding: "8px",
										borderRadius: "50%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									}}>
										<MapPin size={16} color="#222222" />
									</div>
									<div>
										<div
											style={{
												fontSize: "14px",
												color: "#222222",
												fontWeight: "500",
											}}
										>
											{suggestion.label}
										</div>
										{suggestion.type && (
											<div
												style={{
													fontSize: "12px",
													color: "#717171",
													marginTop: "2px",
												}}
											>
												{suggestion.type === "city" ? "City" : "Neighborhood"}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Map Section */}
				<div 
					className="map-section"
					style={{ 
						marginBottom: "32px", 
						height: "400px",
						borderRadius: "16px",
						overflow: "hidden",
						boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
						position: "relative"
					}}
				>
					<LocationMap
						markerPosition={markerPosition}
						onMarkerDragEnd={handleMarkerDragEnd}
						onMapClick={handleMapClick}
					/>
				</div>

				</div>

				{/* Fixed Footer with Progress Bar and Buttons */}
				<div className="footer-navigation">
					{/* Progress Bar */}
					<div className="progress-bar-container">
						<div 
							className="progress-bar-fill"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
					<div className="footer-content">
						{/* Next Button */}
						<div className="next-button-wrapper">
							<button
								type="button"
								onClick={handleNextClick}
								disabled={!canProceed}
								style={{
									backgroundColor: canProceed ? "#FF385C" : "#DDDDDD",
									color: "#FFFFFF",
									padding: "14px 32px",
									borderRadius: "8px",
									fontSize: "16px",
									fontWeight: "600",
									border: "none",
									cursor: canProceed ? "pointer" : "not-allowed",
									transition: "all 0.2s ease",
									boxShadow: canProceed ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
								}}
								onMouseEnter={(e) => {
									if (canProceed) {
										e.target.style.backgroundColor = "#E61E4D";
										e.target.style.transform = "translateY(-1px)";
										e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
									}
								}}
								onMouseLeave={(e) => {
									if (canProceed) {
										e.target.style.backgroundColor = "#FF385C";
										e.target.style.transform = "translateY(0)";
										e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
									}
								}}
							>
								{getTranslation(displayLanguage, "listings.suivant")}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Step1Location;

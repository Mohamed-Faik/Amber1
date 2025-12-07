"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info, Upload, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";
import { toast } from "react-hot-toast";

const Step3Photos = ({ formData, updateFormData, onNext, onBack }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const router = useRouter();
	const [photos, setPhotos] = useState(formData.photos || []);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRefs = useRef([]);

	const handleFileSelect = (index, e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const newPhotos = [...photos];
				newPhotos[index] = {
					file: file,
					preview: event.target.result,
				};
				setPhotos(newPhotos);
				updateFormData({ photos: newPhotos });
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemovePhoto = (index) => {
		const newPhotos = [...photos];
		newPhotos[index] = null;
		setPhotos(newPhotos);
		updateFormData({ photos: newPhotos });
		if (fileInputRefs.current[index]) {
			fileInputRefs.current[index].value = "";
		}
	};

	// Upload photos to server
	const uploadPhotos = async () => {
		const uploadedUrls = [];
		
		// Filter out null/undefined photos and only upload valid ones
		const validPhotos = photos.filter(p => p && p.file);
		
		if (validPhotos.length === 0) {
			throw new Error("No photos to upload");
		}
		
		for (let i = 0; i < validPhotos.length; i++) {
			try {
				const formData = new FormData();
				formData.append("file", validPhotos[i].file);
				formData.append("type", "listings");
				
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});
				
				if (!response.ok) {
					const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
					throw new Error(errorData.error || "Upload failed");
				}
				
				const data = await response.json();
				if (data.url) {
					uploadedUrls.push(data.url);
				}
			} catch (error) {
				console.error(`Error uploading photo ${i + 1}:`, error);
				throw error;
			}
		}
		
		return uploadedUrls;
	};

	// Generate title from form data
	const generateTitle = () => {
		const category = formData.category || "";
		const area = formData.area ? `${formData.area} m²` : "";
		const location = formData.address || "";
		
		const parts = [category, area, location].filter(Boolean);
		return parts.join(" - ") || "Property Listing";
	};

	// Generate description from form data
	const generateDescription = () => {
		const parts = [];
		
		if (formData.category) {
			parts.push(`${formData.category}`);
		}
		
		if (formData.area) {
			parts.push(`Area: ${formData.area} m²`);
		}
		
		if (formData.bedrooms) {
			parts.push(`Bedrooms: ${formData.bedrooms}`);
		}
		
		if (formData.bathrooms) {
			parts.push(`Bathrooms: ${formData.bathrooms}`);
		}
		
		if (formData.propertyAge) {
			parts.push(`Property Age: ${formData.propertyAge}`);
		}
		
		// Add features
		const features = [];
		if (formData.elevator) features.push("Elevator");
		if (formData.gatedCommunity) features.push("Gated Community");
		if (formData.securitySystem) features.push("Security System");
		if (formData.heating) features.push("Heating");
		if (formData.airConditioning) features.push("Air Conditioning");
		if (formData.equippedKitchen) features.push("Equipped Kitchen");
		if (formData.balcony) features.push("Balcony");
		if (formData.terrace) features.push("Terrace");
		if (formData.privateGarden) features.push("Private Garden");
		if (formData.swimmingPool) features.push("Swimming Pool");
		if (formData.garageBox) features.push("Garage/Box");
		if (formData.parkingSpaces) features.push("Parking Spaces");
		
		if (features.length > 0) {
			parts.push(`Features: ${features.join(", ")}`);
		}
		
		if (formData.address) {
			parts.push(`Location: ${formData.address}`);
		}
		
		return parts.join("\n") || "Property listing";
	};

	// Generate features string
	const generateFeatures = () => {
		const features = [];
		
		if (formData.elevator) features.push("Elevator");
		if (formData.gatedCommunity) features.push("Gated Community");
		if (formData.securitySystem) features.push("Security System");
		if (formData.heating) features.push("Heating");
		if (formData.airConditioning) features.push("Air Conditioning");
		if (formData.equippedKitchen) features.push("Equipped Kitchen");
		if (formData.balcony) features.push("Balcony");
		if (formData.terrace) features.push("Terrace");
		if (formData.privateGarden) features.push("Private Garden");
		if (formData.swimmingPool) features.push("Swimming Pool");
		if (formData.garageBox) features.push("Garage/Box");
		if (formData.parkingSpaces) features.push("Parking Spaces");
		
		return features.join(", ") || "";
	};

	const handleNextClick = async () => {
		// Validate that at least one photo is uploaded
		const validPhotos = photos.filter(p => p && p.file);
		if (validPhotos.length === 0) {
			toast.error(getTranslation(displayLanguage, "listings.uploadAtLeastOnePhoto") || "Please upload at least one photo");
			return;
		}

		// Validate required fields
		if (!formData.address || !formData.location) {
			toast.error(getTranslation(displayLanguage, "listings.addressRequired") || "Address is required");
			return;
		}

		if (!formData.category) {
			toast.error(getTranslation(displayLanguage, "listings.categoryRequired") || "Category is required");
			return;
		}

		if (!formData.price || parseFloat(formData.price) <= 0) {
			toast.error(getTranslation(displayLanguage, "listings.priceRequired") || "Price is required");
			return;
		}

		setIsLoading(true);
		updateFormData({ photos });

		try {
			// Upload photos first
			const uploadedUrls = await uploadPhotos();
			
			if (uploadedUrls.length === 0) {
				throw new Error("No photos were uploaded successfully");
			}

			// Prepare location data
			const locationData = {
				label: formData.address || "",
				value: formData.address || "",
				latlng: formData.location ? [formData.location.lat, formData.location.lng] : [31.6295, -7.9811],
			};

			// Generate title, description, and features
			const title = generateTitle();
			const description = generateDescription();
			const features = generateFeatures();

			// Prepare listing data
			const listingData = {
				title,
				description,
				imageSrc: uploadedUrls, // Array of URLs
				address: formData.address,
				features,
				category: formData.category,
				listingType: "SALE", // Default to SALE
				featureType: "HOMES",
				location: locationData,
				price: formData.price,
				area: formData.area ? parseInt(formData.area, 10) : null,
				bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
				bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
			};

			// Create listing
			const response = await fetch("/api/listings/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(listingData),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: "Failed to create listing" }));
				throw new Error(errorData.message || "Failed to create listing");
			}

			const listing = await response.json();
			
			toast.success(
				getTranslation(displayLanguage, "listings.listingCreatedSuccess") || 
				"Listing created! It is pending admin approval and will be visible once approved."
			);
			
			// Redirect to my listings page
			router.push("/listings/my-listings");
			router.refresh();
		} catch (error) {
			console.error("Error creating listing:", error);
			toast.error(error.message || "Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<style jsx>{`
				.step3-photos-container {
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
				.info-box {
					background-color: #E3F2FD;
					border-radius: 5px;
					padding: 16px;
					margin-top: 10px;
					margin-bottom: 24px;
					display: none;
					align-items: flex-start;
					justify-content: center;
					gap: 8px;
				}
				.info-icon-wrapper {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					background-color: #2196F3;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;
					margin-top: 2px;
				}
				.info-icon {
					color: #FFFFFF;
					width: 16px;
					height: 16px;
				}
				.info-text {
					flex: 1;
					font-size: 14px;
					color: #222222;
					line-height: 1.5;
				}
				.info-text strong {
					font-weight: 600;
				}
				.photos-heading {
					font-size: clamp(24px, 4vw, 32px);
					font-weight: 300;
					font-family: var(--font-canela), serif;
					color: #222222;
					margin-bottom: 12px;
					line-height: 1.2;
					text-align: center;
				}
				.photos-description {
					font-size: 14px;
					color: #717171;
					margin-bottom: 32px;
					line-height: 1.5;
					text-align: center;
					max-width: 600px;
					margin-left: auto;
					margin-right: auto;
				}
				.photos-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 16px;
					margin-bottom: 32px;
					max-width: 480px;
					margin-left: auto;
					margin-right: auto;
				}
				.photo-upload-box {
					width: 150px;
					height: 150px;
					border: 2px dashed #FF385C;
					border-radius: 8px;
					background-color: #FFFFFF;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					transition: all 0.2s ease;
					position: relative;
					overflow: hidden;
					flex-shrink: 0;
				}
				.photo-upload-box:hover {
					border-color: #E61E4D;
					background-color: #FFF5F7;
				}
				.photo-upload-box.has-photo {
					border: 2px solid #E0E0E0;
					padding: 0;
				}
				.photo-upload-box.has-photo:hover {
					border-color: #E0E0E0;
					background-color: #FFFFFF;
				}
				.upload-icon {
					color: #FF385C;
					margin-bottom: 8px;
				}
				.upload-text {
					font-size: 14px;
					color: #717171;
					text-align: center;
				}
				.photo-preview {
					width: 100%;
					height: 100%;
					object-fit: cover;
					display: block;
				}
				.remove-photo-button {
					position: absolute;
					top: 8px;
					right: 8px;
					width: 32px;
					height: 32px;
					border-radius: 50%;
					background-color: rgba(0, 0, 0, 0.6);
					border: none;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					transition: all 0.2s ease;
					z-index: 10;
				}
				.remove-photo-button:hover {
					background-color: rgba(0, 0, 0, 0.8);
				}
				.remove-photo-button svg {
					color: #FFFFFF;
					width: 18px;
					height: 18px;
				}
				.hidden-input {
					display: none;
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
					justify-content: space-between;
					gap: 24px;
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
				.content-wrapper {
					padding-bottom: 120px;
				}
				.left-buttons {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					flex-shrink: 0;
				}
				.right-buttons {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					gap: 16px;
					flex-shrink: 0;
				}
				@media (max-width: 767px) {
					.step3-photos-container {
						padding-top: 32px;
						padding-bottom: 32px;
					}
					.photos-grid {
						gap: 12px;
					}
				}
			`}</style>
			<div className="step3-photos-container">
				<div className="content-wrapper">
					{/* Information Box */}
					<div className="info-box">
						<div className="info-icon-wrapper">
							<Info className="info-icon" />
						</div>
						<div className="info-text">
							{getTranslation(displayLanguage, "listings.photosInfoTitle")}{" "}
							<strong>10 {getTranslation(displayLanguage, "listings.photosInfoTimes")}</strong>,{" "}
							{getTranslation(displayLanguage, "listings.photosInfoLeading")}{" "}
							<strong>3 {getTranslation(displayLanguage, "listings.photosInfoTimes")}</strong>{" "}
							{getTranslation(displayLanguage, "listings.photosInfoMoreVisits")}
						</div>
					</div>

					{/* Photos Heading */}
					<h1 className="photos-heading">
						{getTranslation(displayLanguage, "listings.photosHeading")}
					</h1>

					{/* Photos Description */}
					<p className="photos-description">
						{getTranslation(displayLanguage, "listings.photosDescription")}
					</p>

					{/* Photo Upload Grid */}
					<div className="photos-grid">
						{[0, 1, 2, 3].map((index) => (
							<div
								key={index}
								className={`photo-upload-box ${photos[index] ? "has-photo" : ""}`}
								onClick={() => {
									if (!photos[index] && fileInputRefs.current[index]) {
										fileInputRefs.current[index].click();
									}
								}}
							>
								{photos[index] ? (
									<>
										<img
											src={photos[index].preview}
											alt={`Photo ${index + 1}`}
											className="photo-preview"
										/>
										<button
											type="button"
											className="remove-photo-button"
											onClick={(e) => {
												e.stopPropagation();
												handleRemovePhoto(index);
											}}
										>
											<X size={18} />
										</button>
									</>
								) : (
									<>
										<Upload className="upload-icon" size={32} />
										<span className="upload-text">
											{getTranslation(displayLanguage, "listings.uploadPhotos")}
										</span>
									</>
								)}
								<input
									ref={(el) => (fileInputRefs.current[index] = el)}
									type="file"
									accept="image/*"
									className="hidden-input"
									onChange={(e) => handleFileSelect(index, e)}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Fixed Footer with Progress Bar and Buttons */}
				<div className="footer-navigation">
					{/* Progress Bar */}
					<div className="progress-bar-container">
						<div 
							className="progress-bar-fill"
							style={{ width: "100%" }}
						/>
					</div>
					<div className="footer-content">
						{/* Back Button */}
						<div className="left-buttons">
							<button
								type="button"
								onClick={onBack}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "48px",
									height: "48px",
									borderRadius: "50%",
									border: "1px solid #E0E0E0",
									backgroundColor: "#FFFFFF",
									color: "#222222",
									cursor: "pointer",
									transition: "all 0.2s ease",
									flexShrink: 0,
								}}
								onMouseEnter={(e) => {
									e.target.style.backgroundColor = "#F7F7F7";
									e.target.style.borderColor = "#FF385C";
								}}
								onMouseLeave={(e) => {
									e.target.style.backgroundColor = "#FFFFFF";
									e.target.style.borderColor = "#E0E0E0";
								}}
							>
								<ChevronLeft size={20} />
							</button>
						</div>

						{/* Publish Button */}
						<div className="right-buttons">
							<button
								type="button"
								onClick={handleNextClick}
								disabled={isLoading}
								style={{
									padding: "14px 32px",
									fontSize: "16px",
									fontWeight: "600",
									color: "#FFFFFF",
									backgroundColor: isLoading ? "#CCCCCC" : "#FF385C",
									border: "none",
									borderRadius: "8px",
									cursor: isLoading ? "not-allowed" : "pointer",
									transition: "all 0.2s ease",
									boxShadow: isLoading ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
								}}
								onMouseEnter={(e) => {
									if (!isLoading) {
										e.target.style.backgroundColor = "#E61E4D";
										e.target.style.transform = "translateY(-1px)";
										e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
									}
								}}
								onMouseLeave={(e) => {
									if (!isLoading) {
										e.target.style.backgroundColor = "#FF385C";
										e.target.style.transform = "translateY(0)";
										e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
									}
								}}
							>
								{isLoading 
									? (getTranslation(displayLanguage, "listings.publishing") || "Publishing...")
									: getTranslation(displayLanguage, "listings.publish")
								}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Step3Photos;


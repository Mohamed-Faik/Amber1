"use client";

import React, { useState } from "react";
import { categories } from "@/libs/Categories";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

// Property type values (labels will be translated)
const propertyTypes = [
	{ value: "Apartment", translationKey: "listings.apartment" },
	{ value: "Villa", translationKey: "listings.villa" },
	{ value: "Land", translationKey: "listings.landForVilla" },
	{ value: "Commercial", translationKey: "listings.commercialProperty" },
	{ value: "Riad", translationKey: "listings.riad" },
];

const Step1PropertyType = ({ formData, updateFormData, onNext, onBack }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [selectedCategory, setSelectedCategory] = useState(formData.category || "");

	const handleCategorySelect = (category) => {
		setSelectedCategory(category);
		updateFormData({ category });
	};

	const handleNextClick = () => {
		if (selectedCategory) {
			updateFormData({ category: selectedCategory });
			onNext();
		}
	};

	const canProceed = selectedCategory.length > 0;

	return (
		<>
			<style jsx>{`
			.step1-property-container {
				display: flex;
				flex-direction: column;
				height: 100%;
				overflow: hidden;
			}
			.content-wrapper {
				max-width: 600px;
				width: 100%;
				margin: 0 auto;
			}
				.property-options-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 16px;
					margin-bottom: 32px;
				}
				.property-option {
					width: 100%;
					padding: 20px;
					border: 2px solid #E0E0E0;
					border-radius: 12px;
					background-color: #FFFFFF;
					cursor: pointer;
					transition: all 0.2s ease;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
				.property-option:hover {
					border-color: #FF385C;
					box-shadow: 0 2px 8px rgba(255, 56, 92, 0.1);
				}
				.property-option.selected {
					border-color: #FF385C;
					background-color: #FFF5F7;
				}
				.radio-button {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					border: 2px solid #E0E0E0;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;
					transition: all 0.2s ease;
				}
				.property-option.selected .radio-button {
					border-color: #FF385C;
					background-color: #FF385C;
				}
				.radio-button-inner {
					width: 10px;
					height: 10px;
					border-radius: 50%;
					background-color: #FFFFFF;
				}
				.navigation-buttons {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 32px;
					gap: 16px;
					flex-shrink: 0;
				}
				@media (max-width: 767px) {
					.step1-property-container {
						padding-top: 32px;
						padding-bottom: 32px;
					}
					.property-options-grid {
						grid-template-columns: 1fr;
					}
					.property-option {
						padding: 16px;
					}
				}
			`}</style>
			<div className="step1-property-container">
				<div className="content-wrapper"
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						minHeight: 0,
						overflow: "hidden",
					}}
				>
					<h1
						style={{
							fontSize: "clamp(24px, 4vw, 32px)",
							fontWeight: "300",
							fontFamily: "var(--font-canela), serif",
							color: "#222222",
							paddingTop: "20px",
							marginBottom: "32px",
							lineHeight: "1.2",
						}}
					>
						{getTranslation(displayLanguage, "listings.whatTypeToSell")}
					</h1>

					<div className="property-options-grid">
						{propertyTypes.map((type) => (
							<div
								key={type.value}
								className={`property-option ${selectedCategory === type.value ? "selected" : ""}`}
								onClick={() => handleCategorySelect(type.value)}
							>
								<span
									style={{
										fontSize: "16px",
										fontWeight: "500",
										color: "#222222",
									}}
								>
									{getTranslation(displayLanguage, type.translationKey)}
								</span>
								<div className="radio-button">
									{selectedCategory === type.value && (
										<div className="radio-button-inner" />
									)}
								</div>
							</div>
						))}
					</div>

					{/* Navigation Buttons */}
					<div className="navigation-buttons">
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
						<button
							type="button"
							onClick={handleNextClick}
							disabled={!canProceed}
							style={{
								flex: 1,
								maxWidth: "200px",
								padding: "16px 32px",
								fontSize: "16px",
								fontWeight: "600",
								color: "#FFFFFF",
								backgroundColor: canProceed ? "#FF385C" : "#CCCCCC",
								border: "none",
								borderRadius: "8px",
								cursor: canProceed ? "pointer" : "not-allowed",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								if (canProceed) {
									e.target.style.backgroundColor = "#E61E4D";
									e.target.style.transform = "translateY(-2px)";
								}
							}}
							onMouseLeave={(e) => {
								if (canProceed) {
									e.target.style.backgroundColor = "#FF385C";
									e.target.style.transform = "translateY(0)";
								}
							}}
						>
							{getTranslation(displayLanguage, "listings.suivant")}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Step1PropertyType;


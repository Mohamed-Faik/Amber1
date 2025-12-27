"use client";

import React, { useState } from "react";
import { categories } from "@/libs/Categories";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const Step1PropertyType = ({ formData, updateFormData, onNext, onBack, currentSubStep = 2 }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [selectedCategory, setSelectedCategory] = useState(formData.category || "");
	const totalSteps = 7;
	const progressPercentage = (currentSubStep / totalSteps) * 100;

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
				height: 2px;
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
				inset-inline-start: 0;
				width: 65%;
				background-color: #FFFFFF;
				border-top: 1px solid #E0E0E0;
				padding: 0;
				z-index: 100;
				box-shadow: 0 -2px 4px rgba(0,0,0,0.02);
			}
			@media (max-width: 1024px) {
				.footer-navigation {
					width: 100%;
				}
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
			@media (max-width: 1024px) {
				.footer-content {
					padding: 16px 32px;
				}
			}
			@media (max-width: 767px) {
				.footer-content {
					padding: 16px 20px;
				}
			}
			.progress-bar-container {
				width: 100%;
				margin: 0;
			}
			.content-wrapper {
				padding-bottom: 120px;
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
								{language === 'ar' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
							</button>
						</div>

						{/* Next Button */}
						<div className="right-buttons">
							<button
								type="button"
								onClick={handleNextClick}
								disabled={!canProceed}
								style={{
									padding: "14px 32px",
									fontSize: "16px",
									fontWeight: "600",
									color: "#FFFFFF",
									backgroundColor: canProceed ? "#FF385C" : "#DDDDDD",
									border: "none",
									borderRadius: "8px",
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

export default Step1PropertyType;


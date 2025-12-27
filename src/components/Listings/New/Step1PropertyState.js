"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const Step1PropertyState = ({ formData, updateFormData, onNext, onBack, currentSubStep = 7 }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [propertyAge, setPropertyAge] = useState(formData.propertyAge || "");
	const totalSteps = 7;
	const progressPercentage = (currentSubStep / totalSteps) * 100;

	const ageOptions = [
		{ value: "new", translationKey: "listings.propertyAgeNew15" },
		{ value: "old", translationKey: "listings.propertyAgeOld520" },
	];

	const handleAgeChange = (e) => {
		const value = e.target.value;
		setPropertyAge(value);
		updateFormData({ propertyAge: value });
	};

	const handleNextClick = () => {
		if (propertyAge) {
			updateFormData({ propertyAge });
			onNext();
		}
	};

	const canProceed = propertyAge.length > 0;

	return (
		<>
			<style jsx>{`
				.step1-property-state-container {
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
				.content-wrapper {
					padding-bottom: 120px;
				}
				.form-field {
					margin-bottom: 32px;
				}
				.field-label {
					font-size: 16px;
					font-weight: 600;
					color: #222222;
					margin-bottom: 12px;
					display: block;
				}
				.select-wrapper {
					position: relative;
				}
				.select-input {
					width: 100%;
					padding: 16px;
					font-size: 16px;
					border: 2px solid #E0E0E0;
					border-radius: 8px;
					background-color: #FFFFFF;
					color: #222222;
					cursor: pointer;
					appearance: none;
					background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23222222' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 16px center;
					background-size: 12px 8px;
					transition: all 0.2s ease;
				}
				.select-input:hover {
					border-color: #FF385C;
				}
				.select-input:focus {
					outline: none;
					border-color: #FF385C;
					box-shadow: 0 0 0 3px rgba(255, 56, 92, 0.1);
				}
				.select-input:disabled {
					background-color: #F7F7F7;
					cursor: not-allowed;
					color: #717171;
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
					.step1-property-state-container {
						padding-top: 32px;
						padding-bottom: 32px;
					}
				}
			`}</style>
			<div className="step1-property-state-container">
				<div className="content-wrapper">
					<h1
						style={{
							fontSize: "clamp(24px, 4vw, 32px)",
							fontWeight: "300",
							fontFamily: "var(--font-canela), serif",
							color: "#222222",
							paddingTop: "20px",
							marginBottom: "12px",
							lineHeight: "1.2",
						}}
					>
						{getTranslation(displayLanguage, "listings.propertyState")}
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							marginBottom: "32px",
							lineHeight: "1.5",
						}}
					>
						{getTranslation(displayLanguage, "listings.propertyStateSubtitle")}
					</p>

					{/* Select Field */}
					<div className="form-field">
						<label className="field-label">
							{getTranslation(displayLanguage, "listings.propertyAge")}
						</label>
						<div className="select-wrapper">
							<select
								className="select-input"
								value={propertyAge}
								onChange={handleAgeChange}
							>
								<option value="">{getTranslation(displayLanguage, "listings.propertyAge")}</option>
								{ageOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{getTranslation(displayLanguage, option.translationKey)}
									</option>
								))}
							</select>
						</div>
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
									backgroundColor: canProceed ? "#FF385C" : "#CCCCCC",
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

export default Step1PropertyState;


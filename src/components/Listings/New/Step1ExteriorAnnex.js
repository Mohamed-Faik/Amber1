"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const Step1ExteriorAnnex = ({ formData, updateFormData, onNext, onBack, onSkip, currentSubStep = 6 }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [privateGarden, setPrivateGarden] = useState(formData.privateGarden || false);
	const [swimmingPool, setSwimmingPool] = useState(formData.swimmingPool || false);
	const [greenSpaces, setGreenSpaces] = useState(formData.greenSpaces || false);
	const [garageBox, setGarageBox] = useState(formData.garageBox || false);
	const [parkingSpaces, setParkingSpaces] = useState(formData.parkingSpaces || false);
	const totalSteps = 7;
	const progressPercentage = (currentSubStep / totalSteps) * 100;

	const handleCheckboxChange = (field, value, setter) => {
		setter(value);
		updateFormData({ [field]: value });
	};

	const handleNextClick = () => {
		updateFormData({
			privateGarden,
			swimmingPool,
			greenSpaces,
			garageBox,
			parkingSpaces,
		});
		onNext();
	};

	return (
		<>
			<style jsx>{`
				.step1-exterior-annex-container {
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
					border-radius: 2px;
					overflow: hidden;
					margin-bottom: 24px;
				}
				.progress-bar-fill {
					height: 100%;
					background-color: #222222;
					border-radius: 2px;
					transition: width 0.3s ease;
				}
				.footer-navigation {
					position: fixed;
					bottom: 0;
					left: 0;
					right: 0;
					background-color: #FFFFFF;
					border-top: 1px solid #E0E0E0;
					padding: 24px 80px;
					z-index: 100;
					max-width: 65%;
					box-shadow: 0 -2px 4px rgba(0,0,0,0.02);
				}
				.footer-content {
					max-width: 600px;
					width: 100%;
					margin: 0 auto;
				}
				.content-wrapper {
					padding-bottom: 120px;
				}
				.checkbox-container {
					border: 2px solid #E0E0E0;
					border-radius: 8px;
					background-color: #FFFFFF;
					padding: 16px;
				}
				.checkbox-field {
					display: flex;
					align-items: center;
					gap: 12px;
					margin-bottom: 16px;
				}
				.checkbox-field:last-child {
					margin-bottom: 0;
				}
				.checkbox-input {
					width: 24px;
					height: 24px;
					border: 2px solid #E0E0E0;
					border-radius: 4px;
					background-color: #FFFFFF;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.2s ease;
					flex-shrink: 0;
				}
				.checkbox-input.checked {
					background-color: #FF385C;
					border-color: #FF385C;
				}
				.checkbox-label {
					font-size: 16px;
					color: #222222;
					cursor: pointer;
				}
				.progress-bar-container {
					width: 100%;
					height: 4px;
					background-color: #E0E0E0;
					border-radius: 2px;
					overflow: hidden;
					margin-bottom: 24px;
				}
				.progress-bar-fill {
					height: 100%;
					background-color: #222222;
					border-radius: 2px;
					transition: width 0.3s ease;
				}
				.navigation-buttons {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 0;
					padding-top: 0;
					gap: 16px;
					flex-shrink: 0;
				}
				.left-buttons {
					display: flex;
					align-items: center;
					gap: 16px;
				}
				@media (max-width: 767px) {
					.step1-exterior-annex-container {
						padding-top: 32px;
						padding-bottom: 32px;
					}
				}
			`}</style>
			<div className="step1-exterior-annex-container">
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
						{getTranslation(displayLanguage, "listings.exteriorAnnex")}
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							marginBottom: "32px",
							lineHeight: "1.5",
						}}
					>
						{getTranslation(displayLanguage, "listings.exteriorAnnexSubtitle")}
					</p>

					{/* Checkboxes */}
					<div className="checkbox-container">
						<div className="checkbox-field">
							<div
								className={`checkbox-input ${privateGarden ? "checked" : ""}`}
								onClick={() => handleCheckboxChange("privateGarden", !privateGarden, setPrivateGarden)}
							>
								{privateGarden && (
									<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</div>
							<label
								className="checkbox-label"
								onClick={() => handleCheckboxChange("privateGarden", !privateGarden, setPrivateGarden)}
							>
								{getTranslation(displayLanguage, "listings.privateGarden")}
							</label>
						</div>

						<div className="checkbox-field">
							<div
								className={`checkbox-input ${swimmingPool ? "checked" : ""}`}
								onClick={() => handleCheckboxChange("swimmingPool", !swimmingPool, setSwimmingPool)}
							>
								{swimmingPool && (
									<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</div>
							<label
								className="checkbox-label"
								onClick={() => handleCheckboxChange("swimmingPool", !swimmingPool, setSwimmingPool)}
							>
								{getTranslation(displayLanguage, "listings.swimmingPool")}
							</label>
						</div>

						<div className="checkbox-field">
							<div
								className={`checkbox-input ${greenSpaces ? "checked" : ""}`}
								onClick={() => handleCheckboxChange("greenSpaces", !greenSpaces, setGreenSpaces)}
							>
								{greenSpaces && (
									<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</div>
							<label
								className="checkbox-label"
								onClick={() => handleCheckboxChange("greenSpaces", !greenSpaces, setGreenSpaces)}
							>
								{getTranslation(displayLanguage, "listings.greenSpaces")}
							</label>
						</div>

						<div className="checkbox-field">
							<div
								className={`checkbox-input ${garageBox ? "checked" : ""}`}
								onClick={() => handleCheckboxChange("garageBox", !garageBox, setGarageBox)}
							>
								{garageBox && (
									<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</div>
							<label
								className="checkbox-label"
								onClick={() => handleCheckboxChange("garageBox", !garageBox, setGarageBox)}
							>
								{getTranslation(displayLanguage, "listings.garageBox")}
							</label>
						</div>

						<div className="checkbox-field">
							<div
								className={`checkbox-input ${parkingSpaces ? "checked" : ""}`}
								onClick={() => handleCheckboxChange("parkingSpaces", !parkingSpaces, setParkingSpaces)}
							>
								{parkingSpaces && (
									<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</div>
							<label
								className="checkbox-label"
								onClick={() => handleCheckboxChange("parkingSpaces", !parkingSpaces, setParkingSpaces)}
							>
								{getTranslation(displayLanguage, "listings.parkingSpaces")}
							</label>
						</div>
					</div>

				</div>

				{/* Fixed Footer with Progress Bar and Buttons */}
				<div className="footer-navigation">
					<div className="footer-content">
						{/* Progress Bar */}
						<div className="progress-bar-container">
							<div 
								className="progress-bar-fill"
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>

						{/* Navigation Buttons */}
						<div className="navigation-buttons">
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
									onClick={onSkip}
									style={{
										padding: "16px 48px",
										fontSize: "16px",
										fontWeight: "600",
										color: "#FFFFFF",
										backgroundColor: "#717171",
										border: "none",
										borderRadius: "8px",
										cursor: "pointer",
										transition: "all 0.2s ease",
									}}
									onMouseEnter={(e) => {
										e.target.style.backgroundColor = "#5A5A5A";
										e.target.style.transform = "translateY(-2px)";
									}}
									onMouseLeave={(e) => {
										e.target.style.backgroundColor = "#717171";
										e.target.style.transform = "translateY(0)";
									}}
								>
									{getTranslation(displayLanguage, "listings.skipStep")}
								</button>
							</div>
							<button
								type="button"
								onClick={handleNextClick}
								style={{
									padding: "16px 48px",
									fontSize: "16px",
									fontWeight: "600",
									color: "#FFFFFF",
									backgroundColor: "#FF385C",
									border: "none",
									borderRadius: "8px",
									cursor: "pointer",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.target.style.backgroundColor = "#E61E4D";
									e.target.style.transform = "translateY(-2px)";
								}}
								onMouseLeave={(e) => {
									e.target.style.backgroundColor = "#FF385C";
									e.target.style.transform = "translateY(0)";
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

export default Step1ExteriorAnnex;


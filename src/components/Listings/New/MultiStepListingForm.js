"use client";

import React, { useState } from "react";
import Step1Location from "./Step1Location";
import Step1PropertyType from "./Step1PropertyType";
import Step1GeneralCharacteristics from "./Step1GeneralCharacteristics";
import Step1InteriorEquipment from "./Step1InteriorEquipment";
import Step1InteriorAnnex from "./Step1InteriorAnnex";
import Step1ExteriorAnnex from "./Step1ExteriorAnnex";
import Step1PropertyState from "./Step1PropertyState";
import Step2Price from "./Step2Price";
import Step3Photos from "./Step3Photos";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const MultiStepListingForm = ({ currentUser }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [currentStep, setCurrentStep] = useState(1);
	const [subStep, setSubStep] = useState(1); // Sub-steps within step 1
	const [formData, setFormData] = useState({
		address: "",
		location: null, // { lat, lng }
		category: "",
		area: "",
		floors: 1,
		propertyFloor: 1,
		bedrooms: 1,
		bathrooms: 1,
		gatedCommunity: false,
		elevator: false,
		securitySystem: false,
		heating: false,
		airConditioning: false,
		equippedKitchen: false,
		balcony: false,
		terrace: false,
		privateGarden: false,
		swimmingPool: false,
		greenSpaces: false,
		garageBox: false,
		parkingSpaces: false,
		propertyAge: "",
		price: "",
		photos: [],
	});

	const steps = [
		{ number: 1, title: getTranslation(displayLanguage, "listings.step1Title") },
		{ number: 2, title: getTranslation(displayLanguage, "listings.step2Title") },
		{ number: 3, title: getTranslation(displayLanguage, "listings.step3Title") },
	];

	const handleNext = () => {
		// If we're in step 1, handle sub-steps
		if (currentStep === 1) {
			if (subStep === 1) {
				// Move from location to property type
				setSubStep(2);
			} else if (subStep === 2) {
				// Move from property type to general characteristics
				setSubStep(3);
			} else if (subStep === 3) {
				// Move from general characteristics to interior equipment
				setSubStep(4);
			} else if (subStep === 4) {
				// Move from interior equipment to interior annex
				setSubStep(5);
			} else if (subStep === 5) {
				// Move from interior annex to exterior annex
				setSubStep(6);
			} else if (subStep === 6) {
				// Move from exterior annex to property state
				setSubStep(7);
			} else if (subStep === 7) {
				// Move to actual step 2 (Price)
				setCurrentStep(2);
				setSubStep(1);
			}
		} else if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		// If we're in step 1, handle sub-steps
		if (currentStep === 1) {
			if (subStep === 7) {
				setSubStep(6);
			} else if (subStep === 6) {
				setSubStep(5);
			} else if (subStep === 5) {
				setSubStep(4);
			} else if (subStep === 4) {
				setSubStep(3);
			} else if (subStep === 3) {
				setSubStep(2);
			} else if (subStep === 2) {
				setSubStep(1);
			}
		} else if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSkip = () => {
		// Skip the current sub-step and move to next
		if (currentStep === 1) {
			if (subStep === 4) {
				// Skip interior equipment and move to interior annex
				setSubStep(5);
			} else if (subStep === 5) {
				// Skip interior annex and move to exterior annex
				setSubStep(6);
			} else if (subStep === 6) {
				// Skip exterior annex and move to property state
				setSubStep(7);
			}
			// Note: subStep 7 (property state) cannot be skipped - it's required
		} else if (currentStep === 3) {
			// For step 3 (Photos), skip means proceed to next step (if there is one)
			// For now, just proceed - you can add more steps later
			handleNext();
		}
	};

	const updateFormData = (data) => {
		setFormData((prev) => ({ ...prev, ...data }));
	};

	const renderStepContent = () => {
		if (currentStep === 1) {
			if (subStep === 1) {
				return (
					<Step1Location
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						showMap={false}
						currentSubStep={subStep}
					/>
				);
			} else if (subStep === 2) {
				return (
					<Step1PropertyType
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
						currentSubStep={subStep}
					/>
				);
			} else if (subStep === 3) {
				return (
					<Step1GeneralCharacteristics
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
						currentSubStep={subStep}
					/>
				);
			} else if (subStep === 4) {
				return (
					<Step1InteriorEquipment
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
						onSkip={handleSkip}
						currentSubStep={subStep}
					/>
				);
			} else if (subStep === 5) {
				return (
					<Step1InteriorAnnex
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
						onSkip={handleSkip}
						currentSubStep={subStep}
					/>
				);
			} else if (subStep === 6) {
				return (
					<Step1ExteriorAnnex
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
						onSkip={handleSkip}
						currentSubStep={subStep}
					/>
				);
			} else if (subStep === 7) {
				return (
					<Step1PropertyState
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
						currentSubStep={subStep}
					/>
				);
			}
		}

		switch (currentStep) {
			case 2:
				return (
					<Step2Price
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				);
			case 3:
				return (
					<Step3Photos
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				);
			default:
				return null;
		}
	};

	const renderMap = () => {
		if (currentStep === 1) {
			return (
				<Step1Location
					formData={formData}
					updateFormData={updateFormData}
					onNext={handleNext}
					showMap={true}
				/>
			);
		}
		return null;
	};

	return (
		<div
			style={{
				display: "flex",
				minHeight: "calc(100vh - 80px)",
				height: "calc(100vh - 80px)",
				backgroundColor: "#FAFAFA",
			}}
		>
			<style jsx>{`
				.main-container {
					display: flex;
					min-height: calc(100vh - 80px);
					height: calc(100vh - 80px);
					width: 100%;
					overflow: hidden;
				}
				.left-column {
					flex: 0 0 50%;
					display: flex;
					flex-direction: column;
					background-color: #FFFFFF;
					overflow: hidden;
					padding: 0 80px;
					box-sizing: border-box;
					height: calc(100vh - 80px);
					transition: flex 0.3s ease;
				}
				.left-column.wider {
					flex: 0 0 65%;
				}
				.right-column {
					flex: 0 0 50%;
					position: relative;
					background: linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%);
					height: calc(100vh - 80px);
					overflow: hidden;
					box-sizing: border-box;
					flex-shrink: 0;
					transition: flex 0.3s ease;
				}
				.right-column.narrower {
					flex: 0 0 35%;
				}
				.right-column.hidden-mobile {
					display: block;
				}
				@media (max-width: 1024px) {
					.right-column.hidden-mobile {
						display: block; /* Show map on mobile/tablet */
						width: 100%;
						height: 400px; /* Fixed height for map on mobile */
						min-height: 400px;
					}
					.left-column.wider {
						flex: 0 0 100%;
					}
				}
				.right-column::before {
					content: "";
					position: absolute;
					top: -100px;
					right: -100px;
					width: 300px;
					height: 300px;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.1);
					z-index: 0;
				}
				.right-column::after {
					content: "";
					position: absolute;
					bottom: -150px;
					right: -150px;
					width: 400px;
					height: 400px;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.08);
					z-index: 0;
				}
				.progress-container {
					background-color: #FFFFFF;
					border-bottom: 1px solid #E0E0E0;
					padding: 24px 0;
					position: sticky;
					top: 0;
					z-index: 100;
					box-shadow: 0 2px 4px rgba(0,0,0,0.02);
					margin: 0 -80px;
					padding-left: 80px;
					padding-right: 80px;
				}
				.progress-wrapper {
					padding: 0;
					display: flex;
					justify-content: center;
				}
				.progress-steps {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					max-width: 100%;
					gap: 0;
				}
				.progress-step {
					display: flex;
					flex-direction: column;
					align-items: center;
					flex: 0 0 auto;
				}
				.progress-step-top {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
				}
				.progress-step-content {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 0;
				}
				.progress-step-circle {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 12px;
					font-weight: 600;
					transition: all 0.3s ease;
					flex-shrink: 0;
				}
				.progress-step-circle svg {
					width: 12px;
					height: 12px;
				}
				.progress-step-title {
					font-size: 12px;
					font-weight: 500;
					text-align: center;
					white-space: nowrap;
					margin-top: 6px;
					padding: 0 8px;
				}
				.progress-connector {
					width: 60px;
					height: 2px;
					margin: 0 8px;
					transition: all 0.3s ease;
					flex-shrink: 0;
					align-self: center;
				}
				/* Tablet: 768px - 991px */
				@media (max-width: 991px) {
					.main-container {
						flex-direction: column;
					}
					.left-column {
						flex: 0 0 auto;
						padding: 0 32px;
						max-width: 100%;
					}
					.right-column {
						flex: 0 0 400px;
						min-height: 400px;
					}
					.progress-container {
						padding: 20px 0;
						margin: 0 -32px;
						padding-left: 32px;
						padding-right: 32px;
					}
					.progress-wrapper {
						padding: 0;
					}
					.progress-steps {
						width: 100%;
						max-width: 100%;
					}
					.progress-step-content {
						gap: 5px;
					}
					.progress-step-circle {
						width: 22px;
						height: 22px;
					}
					.progress-step-circle svg {
						width: 11px;
						height: 11px;
					}
					.progress-step-title {
						font-size: 11px;
						white-space: normal;
						line-height: 1.3;
					}
					.progress-connector {
						width: 40px;
						margin: 0 6px;
					}
				}
				/* Mobile: < 768px */
				@media (max-width: 767px) {
					.left-column {
						padding: 0 20px;
					}
					.right-column {
						flex: 0 0 350px;
						min-height: 350px;
					}
					.progress-container {
						padding: 16px 0;
						margin: 0 -20px;
						padding-left: 20px;
						padding-right: 20px;
					}
					.progress-wrapper {
						padding: 0;
					}
					.progress-steps {
						width: 100%;
						max-width: 100%;
						padding: 0 4px;
					}
					.progress-step {
						padding: 0 2px;
					}
					.progress-step-content {
						gap: 5px;
						padding: 0 1px;
					}
					.progress-step-circle {
						width: 18px;
						height: 18px;
					}
					.progress-step-circle svg {
						width: 9px;
						height: 9px;
					}
					.progress-step-title {
						font-size: 9px;
						white-space: normal;
						line-height: 1.2;
						padding: 0 1px;
					}
					.progress-connector {
						width: 20px;
						margin: 0 4px;
						height: 1.5px;
					}
				}
				/* Small Mobile: < 480px */
				@media (max-width: 480px) {
					.progress-wrapper {
						padding: 0 16px;
					}
					.progress-steps {
						padding: 0 4px;
					}
					.progress-step {
						padding: 0 2px;
					}
					.progress-step-content {
						padding: 0 1px;
					}
					.progress-step-title {
						font-size: 9px;
						padding: 0 1px;
					}
					.progress-connector {
						width: 20px;
						margin: 0 4px;
					}
				}
			`}</style>
			{/* Left Column - Progress Bar + Form */}
			<div className="left-column wider">
				{/* Progress Indicator - Yakee Style */}
				<div className="progress-container">
					<div className="progress-wrapper">
						<div className="progress-steps" style={{ position: "relative", justifyContent: "space-between", maxWidth: "600px", margin: "0 auto" }}>
							{/* Background Line */}
							<div style={{ position: "absolute", top: "12px", left: "0", right: "0", height: "2px", backgroundColor: "#E0E0E0", zIndex: 0 }}></div>

							{steps.map((step, index) => {
								const isActive = currentStep >= step.number;
								const isCurrent = currentStep === step.number;
								return (
									<div key={step.number} className="progress-step" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
										<div
											className="progress-step-circle"
											style={{
												width: "24px",
												height: "24px",
												borderRadius: "50%",
												backgroundColor: isActive ? "#FF385C" : "#E0E0E0",
												border: "4px solid white",
												boxShadow: isActive ? "0 0 0 2px #FF385C" : "none",
												marginBottom: "12px",
												transition: "all 0.3s ease",
												display: "flex",
												alignItems: "center",
												justifyContent: "center"
											}}
										/>
										<span
											className="progress-step-title"
											style={{
												fontSize: "14px",
												color: isActive ? "#222222" : "#717171",
												fontWeight: isActive ? "600" : "400",
												textAlign: "center"
											}}
										>
											{step.title}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Step Content */}
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						paddingTop: currentStep === 1 && subStep === 1 ? "48px" : "0",
						paddingBottom: "48px",
						minHeight: "100%"
					}}
				>
					{renderStepContent()}
				</div>
			</div>

			{/* Right Column - Map or Gradient Background */}
			<div className="right-column narrower hidden-mobile">
				{currentStep === 1 && subStep === 1 ? renderMap() : null}
			</div>
		</div>
	);
};

export default MultiStepListingForm;

"use client";

import React, { useState } from "react";
import Step1Location from "./Step1Location";
import Step1PropertyType from "./Step1PropertyType";
import Step1GeneralCharacteristics from "./Step1GeneralCharacteristics";
import Step1InteriorEquipment from "./Step1InteriorEquipment";
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
			if (subStep === 4) {
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
		if (currentStep === 1 && subStep === 4) {
			// Skip interior equipment and move to step 2
			setCurrentStep(2);
			setSubStep(1);
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
					/>
				);
			} else if (subStep === 2) {
				return (
					<Step1PropertyType
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
					/>
				);
			} else if (subStep === 3) {
				return (
					<Step1GeneralCharacteristics
						formData={formData}
						updateFormData={updateFormData}
						onNext={handleNext}
						onBack={handleBack}
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
					/>
				);
			}
		}
		
		switch (currentStep) {
			case 2:
				return <div>Step 2 - Price (Coming soon)</div>;
			case 3:
				return <div>Step 3 - Photos (Coming soon)</div>;
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
						display: none;
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
				{/* Progress Indicator */}
				<div className="progress-container">
					<div className="progress-wrapper">
						<div className="progress-steps">
							{steps.map((step, index) => (
								<React.Fragment key={step.number}>
									<div className="progress-step">
										<div className="progress-step-top">
											<div
												className="progress-step-circle"
												style={{
													backgroundColor:
														currentStep >= step.number
															? "#FF385C"
															: "#E0E0E0",
													color:
														currentStep >= step.number
															? "#FFFFFF"
															: "#717171",
												}}
											>
												{currentStep > step.number && (
													<svg
														viewBox="0 0 20 20"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M16.6667 5L7.50004 14.1667L3.33337 10"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												)}
											</div>
											{index < steps.length - 1 && (
												<div
													className="progress-connector"
													style={{
														backgroundColor:
															currentStep > step.number
																? "#FF385C"
																: "#E0E0E0",
													}}
												/>
											)}
										</div>
										<span
											className="progress-step-title"
											style={{
												color:
													currentStep >= step.number
														? "#222222"
														: "#717171",
											}}
										>
											{step.title}
										</span>
									</div>
								</React.Fragment>
							))}
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


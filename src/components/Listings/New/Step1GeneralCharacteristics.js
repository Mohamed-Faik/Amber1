"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import Select from "react-select";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const Step1GeneralCharacteristics = ({ formData, updateFormData, onNext, onBack, currentSubStep = 3 }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const isVilla = formData.category === "Villa" || formData.category === "Riad";
	const isLand = formData.category === "Land";
	const isCommercial = formData.category === "Commercial";

	// Levels above ground options (defined early for use in state initialization)
	const levelsOptions = [
		{ value: "plain-pied", label: getTranslation(displayLanguage, "listings.plainPied") },
		{ value: "1", label: getTranslation(displayLanguage, "listings.oneLevel") },
		{ value: "2", label: getTranslation(displayLanguage, "listings.twoLevels") },
		{ value: "3", label: getTranslation(displayLanguage, "listings.threeLevels") },
		{ value: "4", label: getTranslation(displayLanguage, "listings.fourLevels") },
		{ value: "5", label: getTranslation(displayLanguage, "listings.fiveLevels") },
	];

	// Villa type options (for Land category)
	const villaTypeOptions = [
		{ value: "semi-detached", label: getTranslation(displayLanguage, "listings.semiDetached") },
		{ value: "terraced", label: getTranslation(displayLanguage, "listings.terraced") },
		{ value: "detached", label: getTranslation(displayLanguage, "listings.detached") },
	];

	// Regular fields
	const [area, setArea] = useState(formData.area || "");
	const [floors, setFloors] = useState(formData.floors || 1);
	const [propertyFloor, setPropertyFloor] = useState(formData.propertyFloor || 1);
	const [bedrooms, setBedrooms] = useState(formData.bedrooms || 1);
	const [bathrooms, setBathrooms] = useState(formData.bathrooms || 1);
	const [gatedCommunity, setGatedCommunity] = useState(formData.gatedCommunity || false);
	const [elevator, setElevator] = useState(formData.elevator || false);
	const [securitySystem, setSecuritySystem] = useState(formData.securitySystem || false);

	// Villa-specific fields
	const [landArea, setLandArea] = useState(formData.landArea || "");
	const [basement, setBasement] = useState(formData.basement || false);
	const [levelsAboveGround, setLevelsAboveGround] = useState(
		formData.levelsAboveGround
			? levelsOptions.find(opt => opt.value === formData.levelsAboveGround) || null
			: null
	);

	// Land-specific fields
	const [landAreaForLand, setLandAreaForLand] = useState(formData.area || "");
	const [villaType, setVillaType] = useState(() => {
		if (formData.villaType) {
			return villaTypeOptions.find(opt => opt.value === formData.villaType) || null;
		}
		return null;
	});

	// Commercial-specific fields
	const [commercialType, setCommercialType] = useState(formData.commercialType || "");

	const totalSteps = 7;
	const progressPercentage = (currentSubStep / totalSteps) * 100;

	const handleStepperChange = (field, value, setter) => {
		const newValue = Math.max(0, value);
		setter(newValue);
		updateFormData({ [field]: newValue });
	};

	const handleCheckboxChange = (field, value, setter) => {
		setter(value);
		updateFormData({ [field]: value });
	};

	const handleAreaChange = (e) => {
		const value = e.target.value;
		setArea(value);
		updateFormData({ area: value });
	};

	const handleLandAreaChange = (e) => {
		const value = e.target.value;
		setLandArea(value);
		updateFormData({ landArea: value });
	};

	const handleLevelsChange = (selectedOption) => {
		setLevelsAboveGround(selectedOption);
		updateFormData({ levelsAboveGround: selectedOption ? selectedOption.value : null });
	};

	const handleLandAreaForLandChange = (e) => {
		const value = e.target.value;
		setLandAreaForLand(value);
		updateFormData({ area: value });
	};

	const handleVillaTypeChange = (selectedOption) => {
		setVillaType(selectedOption);
		updateFormData({ villaType: selectedOption ? selectedOption.value : null });
	};

	const handleCommercialTypeChange = (type) => {
		setCommercialType(type);
		updateFormData({ commercialType: type });
	};

	const handleNextClick = () => {
		if (isVilla) {
			updateFormData({
				landArea,
				basement,
				levelsAboveGround: levelsAboveGround ? levelsAboveGround.value : null,
				bedrooms,
				bathrooms,
				gatedCommunity,
			});
		} else if (isLand) {
			updateFormData({
				area: landAreaForLand,
				villaType: villaType ? villaType.value : null,
			});
		} else if (isCommercial) {
			updateFormData({
				commercialType,
			});
		} else {
			updateFormData({
				area,
				floors,
				propertyFloor,
				bedrooms,
				bathrooms,
				gatedCommunity,
				elevator,
				securitySystem,
			});
		}
		onNext();
	};

	const canProceed = isVilla
		? landArea.trim().length > 0 && levelsAboveGround !== null
		: isLand
			? landAreaForLand.trim().length > 0 && villaType !== null
			: isCommercial
				? commercialType.trim().length > 0
				: area.trim().length > 0;

	return (
		<>
			<style jsx>{`
			.step1-char-container {
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
			.form-field {
				margin-bottom: 24px;
			}
			.field-label-wrapper {
				display: flex;
				align-items: center;
				gap: 8px;
				margin-bottom: 12px;
			}
			.field-label {
				font-size: 16px;
				font-weight: 600;
				color: #222222;
			}
			.field-label .required {
				color: #FF385C;
			}
			.info-icon {
				color: #00A859;
				cursor: help;
				flex-shrink: 0;
			}
			.input-wrapper {
				position: relative;
				display: flex;
				align-items: center;
			}
			.input-field {
				width: 100%;
				padding: 16px 60px 16px 16px;
				font-size: 16px;
				border: 2px solid #E0E0E0;
				border-radius: 8px;
				outline: none;
				transition: all 0.2s ease;
				box-sizing: border-box;
			}
			.input-field:focus {
				border-color: #FF385C;
			}
			.unit-text {
				position: absolute;
				right: 16px;
				font-size: 16px;
				color: #717171;
				font-weight: 500;
				pointer-events: none;
			}
			.stepper-field-wrapper {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
			}
			.stepper-label-wrapper {
				display: flex;
				align-items: center;
				gap: 8px;
			}
			.stepper-container {
				display: flex;
				align-items: center;
				gap: 8px;
			}
			.stepper-button {
				width: 40px;
				height: 40px;
				border: 2px solid #E0E0E0;
				border-radius: 50%;
				background-color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: all 0.2s ease;
				font-size: 20px;
				color: #222222;
				font-weight: 600;
				padding: 0;
			}
			.stepper-button:hover {
				border-color: #FF385C;
				background-color: #FFF5F7;
			}
			.stepper-button:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
			.stepper-value {
				min-width: 60px;
				text-align: center;
				font-size: 18px;
				font-weight: 600;
				color: #222222;
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
			.select-wrapper {
				width: 100%;
			}
			.select-wrapper :global(.select__control) {
				border: 2px solid #E0E0E0;
				border-radius: 8px;
				min-height: 56px;
				transition: all 0.2s ease;
			}
			.select-wrapper :global(.select__control:hover) {
				border-color: #FF385C;
			}
			.select-wrapper :global(.select__control--is-focused) {
				border-color: #FF385C;
				box-shadow: 0 0 0 3px rgba(255, 56, 92, 0.1);
			}
			.select-wrapper :global(.select__placeholder) {
				color: #717171;
				font-size: 16px;
			}
			.select-wrapper :global(.select__single-value) {
				color: #222222;
				font-size: 16px;
			}
			.select-wrapper :global(.select__menu) {
				border-radius: 8px;
				box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
				border: 1px solid #e0e0e0;
			}
			.select-wrapper :global(.select__option--is-focused) {
				background-color: #FFF5F7;
			}
			.select-wrapper :global(.select__option--is-selected) {
				background-color: #FF385C;
				color: white;
			}
			.radio-options-container {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			.radio-option {
				width: 100%;
				padding: 16px 20px;
				border: 2px solid #E0E0E0;
				border-radius: 8px;
				background-color: #FFFFFF;
				cursor: pointer;
				transition: all 0.2s ease;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.radio-option:hover {
				border-color: #FF385C;
				box-shadow: 0 2px 8px rgba(255, 56, 92, 0.1);
			}
			.radio-option.selected {
				border-color: #FF385C;
				background-color: #FFF5F7;
			}
			.radio-button-circle {
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
			.radio-option.selected .radio-button-circle {
				border-color: #FF385C;
				background-color: #FF385C;
			}
			.radio-button-inner {
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background-color: #FFFFFF;
			}
			.radio-option-label {
				font-size: 16px;
				font-weight: 500;
				color: #222222;
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
				.content-wrapper {
					padding-bottom: 120px;
				}
				@media (max-width: 767px) {
					.step1-char-container {
						padding-top: 32px;
						padding-bottom: 32px;
					}
					.form-field {
						margin-bottom: 20px;
					}
				}
			`}</style>
			<div className="step1-char-container">
				<div className="content-wrapper">
					<h1
						style={{
							fontSize: "clamp(24px, 4vw, 32px)",
							fontWeight: "300",
							fontFamily: "var(--font-canela), serif",
							color: "#222222",
							paddingTop: "0px",
							marginBottom: "12px",
							lineHeight: "1.2",
						}}
					>
						{getTranslation(displayLanguage, "listings.generalCharacteristics")}
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							marginBottom: "32px",
							lineHeight: "1.5",
						}}
					>
						{getTranslation(displayLanguage, "listings.generalCharacteristicsSubtitle")}
					</p>

					{isVilla ? (
						<>
							{/* Surface totale du terrain - Villa */}
							<div className="form-field">
								<div className="field-label-wrapper">
									<label className="field-label">
										{getTranslation(displayLanguage, "listings.totalLandArea")} <span className="required">*</span>
									</label>
								</div>
								<div className="input-wrapper">
									<input
										type="number"
										value={landArea}
										onChange={handleLandAreaChange}
										placeholder={`${getTranslation(displayLanguage, "listings.totalLandArea")} *`}
										className="input-field"
									/>
									<span className="unit-text">m²</span>
								</div>
							</div>

							{/* Sous-sol - Villa */}
							<div className="form-field">
								<div className="checkbox-container">
									<div className="checkbox-field">
										<div
											className={`checkbox-input ${basement ? "checked" : ""}`}
											onClick={() => handleCheckboxChange("basement", !basement, setBasement)}
										>
											{basement && (
												<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											)}
										</div>
										<label
											className="checkbox-label"
											onClick={() => handleCheckboxChange("basement", !basement, setBasement)}
										>
											{getTranslation(displayLanguage, "listings.basement")}
										</label>
									</div>
								</div>
							</div>

							{/* Nombre de niveaux hors sous-sol - Villa */}
							<div className="form-field">
								<div className="field-label-wrapper">
									<label className="field-label">
										{getTranslation(displayLanguage, "listings.numberOfLevelsAboveGround")} <span className="required">*</span>
									</label>
								</div>
								<div className="select-wrapper">
									<Select
										value={levelsAboveGround}
										onChange={handleLevelsChange}
										options={levelsOptions}
										placeholder={getTranslation(displayLanguage, "listings.numberOfLevelsAboveGround")}
										isSearchable={false}
										menuPortalTarget={typeof document !== "undefined" ? document.body : null}
										menuPosition="fixed"
										styles={{
											control: (base, state) => ({
												...base,
												border: state.isFocused ? "2px solid #FF385C" : "2px solid #E0E0E0",
												borderRadius: "8px",
												boxShadow: state.isFocused ? "0 0 0 3px rgba(255, 56, 92, 0.1)" : "none",
												minHeight: "56px",
												"&:hover": {
													borderColor: state.isFocused ? "#FF385C" : "#FF385C",
												},
											}),
											placeholder: (base) => ({
												...base,
												color: "#717171",
												fontSize: "16px",
											}),
											singleValue: (base) => ({
												...base,
												color: "#222222",
												fontSize: "16px",
											}),
											menu: (base) => ({
												...base,
												borderRadius: "8px",
												boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
												border: "1px solid #e0e0e0",
												zIndex: 9999,
											}),
											menuPortal: (base) => ({
												...base,
												zIndex: 9999,
											}),
											option: (base, state) => ({
												...base,
												backgroundColor: state.isSelected
													? "#FF385C"
													: state.isFocused
														? "#FFF5F7"
														: "white",
												color: state.isSelected ? "white" : "#222222",
												"&:hover": {
													backgroundColor: state.isSelected ? "#FF385C" : "#FFF5F7",
												},
											}),
										}}
									/>
								</div>
							</div>

							{/* Nombre de chambres - Villa */}
							<div className="form-field">
								<div className="stepper-field-wrapper">
									<label className="field-label">
										{getTranslation(displayLanguage, "listings.numberOfBedrooms")} <span className="required">*</span>
									</label>
									<div className="stepper-container">
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("bedrooms", bedrooms - 1, setBedrooms)}
											disabled={bedrooms <= 0}
										>
											-
										</button>
										<span className="stepper-value">{bedrooms}</span>
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("bedrooms", bedrooms + 1, setBedrooms)}
										>
											+
										</button>
									</div>
								</div>
							</div>

							{/* Nombre de salles d'eau - Villa */}
							<div className="form-field">
								<div className="stepper-field-wrapper">
									<div className="stepper-label-wrapper">
										<label className="field-label">
											{getTranslation(displayLanguage, "listings.numberOfBathrooms")} <span className="required">*</span>
										</label>
										<Info className="info-icon" size={18} />
									</div>
									<div className="stepper-container">
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("bathrooms", bathrooms - 1, setBathrooms)}
											disabled={bathrooms <= 0}
										>
											-
										</button>
										<span className="stepper-value">{bathrooms}</span>
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("bathrooms", bathrooms + 1, setBathrooms)}
										>
											+
										</button>
									</div>
								</div>
							</div>

							{/* Résidence fermée - Villa */}
							<div className="form-field">
								<div className="checkbox-container">
									<div className="checkbox-field">
										<div
											className={`checkbox-input ${gatedCommunity ? "checked" : ""}`}
											onClick={() => handleCheckboxChange("gatedCommunity", !gatedCommunity, setGatedCommunity)}
										>
											{gatedCommunity && (
												<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											)}
										</div>
										<label
											className="checkbox-label"
											onClick={() => handleCheckboxChange("gatedCommunity", !gatedCommunity, setGatedCommunity)}
										>
											{getTranslation(displayLanguage, "listings.gatedCommunity")}
										</label>
									</div>
								</div>
							</div>
						</>
					) : isLand ? (
						<>
							{/* Surface totale du bien - Land */}
							<div className="form-field">
								<div className="field-label-wrapper">
									<label className="field-label">
										{getTranslation(displayLanguage, "listings.totalSurface")} <span className="required">*</span>
									</label>
								</div>
								<div className="input-wrapper">
									<input
										type="number"
										value={landAreaForLand}
										onChange={handleLandAreaForLandChange}
										placeholder={`${getTranslation(displayLanguage, "listings.totalSurface")} *`}
										className="input-field"
									/>
									<span className="unit-text">m²</span>
								</div>
							</div>

							{/* Type de villa - Land */}
							<div className="form-field">
								<div className="field-label-wrapper">
									<label className="field-label">
										{getTranslation(displayLanguage, "listings.villaType")} <span className="required">*</span>
									</label>
								</div>
								<div className="select-wrapper">
									<Select
										value={villaType}
										onChange={handleVillaTypeChange}
										options={villaTypeOptions}
										placeholder={getTranslation(displayLanguage, "listings.villaType")}
										isSearchable={false}
										menuPortalTarget={typeof document !== "undefined" ? document.body : null}
										menuPosition="fixed"
										styles={{
											control: (base, state) => ({
												...base,
												border: state.isFocused ? "2px solid #FF385C" : "2px solid #E0E0E0",
												borderRadius: "8px",
												boxShadow: state.isFocused ? "0 0 0 3px rgba(255, 56, 92, 0.1)" : "none",
												minHeight: "56px",
												"&:hover": {
													borderColor: state.isFocused ? "#FF385C" : "#FF385C",
												},
											}),
											placeholder: (base) => ({
												...base,
												color: "#717171",
												fontSize: "16px",
											}),
											singleValue: (base) => ({
												...base,
												color: "#222222",
												fontSize: "16px",
											}),
											menu: (base) => ({
												...base,
												borderRadius: "8px",
												boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
												border: "1px solid #e0e0e0",
												zIndex: 9999,
											}),
											menuPortal: (base) => ({
												...base,
												zIndex: 9999,
											}),
											option: (base, state) => ({
												...base,
												backgroundColor: state.isSelected
													? "#FF385C"
													: state.isFocused
														? "#FFF5F7"
														: "white",
												color: state.isSelected ? "white" : "#222222",
												"&:hover": {
													backgroundColor: state.isSelected ? "#FF385C" : "#FFF5F7",
												},
											}),
										}}
									/>
								</div>
							</div>
						</>
					) : isCommercial ? (
						<>
							{/* Commercial type selection - Commercial */}
							<div className="form-field">
								<div className="radio-options-container">
									<div
										className={`radio-option ${commercialType === "commercial-premises" ? "selected" : ""}`}
										onClick={() => handleCommercialTypeChange("commercial-premises")}
									>
										<span className="radio-option-label">
											{getTranslation(displayLanguage, "listings.commercialPremises")}
										</span>
										<div className="radio-button-circle">
											{commercialType === "commercial-premises" && (
												<div className="radio-button-inner" />
											)}
										</div>
									</div>
									<div
										className={`radio-option ${commercialType === "offices" ? "selected" : ""}`}
										onClick={() => handleCommercialTypeChange("offices")}
									>
										<span className="radio-option-label">
											{getTranslation(displayLanguage, "listings.offices")}
										</span>
										<div className="radio-button-circle">
											{commercialType === "offices" && (
												<div className="radio-button-inner" />
											)}
										</div>
									</div>
								</div>
							</div>
						</>
					) : (
						<>
							{/* Surface totale */}
							<div className="form-field">
								<div className="field-label-wrapper">
									<label className="field-label">
										{getTranslation(displayLanguage, "listings.totalSurface")} <span className="required">*</span>
									</label>
								</div>
								<div className="input-wrapper">
									<input
										type="number"
										value={area}
										onChange={handleAreaChange}
										placeholder={`${getTranslation(displayLanguage, "listings.totalSurface")} *`}
										className="input-field"
									/>
									<span className="unit-text">m²</span>
								</div>
							</div>

							{/* Nombre d'étages */}
							<div className="form-field">
								<div className="stepper-field-wrapper">
									<label className="field-label">
										{getTranslation(displayLanguage, "listings.numberOfFloors")} <span className="required">*</span>
									</label>
									<div className="stepper-container">
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("floors", floors - 1, setFloors)}
											disabled={floors <= 0}
										>
											-
										</button>
										<span className="stepper-value">{floors}</span>
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("floors", floors + 1, setFloors)}
										>
											+
										</button>
									</div>
								</div>
							</div>

							{/* Étage du bien */}
							<div className="form-field">
								<div className="stepper-field-wrapper">
									<label className="field-label">
										{getTranslation(displayLanguage, "listings.propertyFloor")} <span className="required">*</span>
									</label>
									<div className="stepper-container">
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("propertyFloor", propertyFloor - 1, setPropertyFloor)}
											disabled={propertyFloor <= 0}
										>
											-
										</button>
										<span className="stepper-value">{propertyFloor}</span>
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("propertyFloor", propertyFloor + 1, setPropertyFloor)}
										>
											+
										</button>
									</div>
								</div>
							</div>

							{/* Nombre de chambres */}
							<div className="form-field">
								<div className="stepper-field-wrapper">
									<label className="field-label">
										{getTranslation(displayLanguage, "listings.numberOfBedrooms")} <span className="required">*</span>
									</label>
									<div className="stepper-container">
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("bedrooms", bedrooms - 1, setBedrooms)}
											disabled={bedrooms <= 0}
										>
											-
										</button>
										<span className="stepper-value">{bedrooms}</span>
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("bedrooms", bedrooms + 1, setBedrooms)}
										>
											+
										</button>
									</div>
								</div>
							</div>

							{/* Nombre de salles d'eau */}
							<div className="form-field">
								<div className="stepper-field-wrapper">
									<div className="stepper-label-wrapper">
										<label className="field-label">
											{getTranslation(displayLanguage, "listings.numberOfBathrooms")} <span className="required">*</span>
										</label>
									</div>
									<div className="stepper-container">
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("bathrooms", bathrooms - 1, setBathrooms)}
											disabled={bathrooms <= 0}
										>
											-
										</button>
										<span className="stepper-value">{bathrooms}</span>
										<button
											type="button"
											className="stepper-button"
											onClick={() => handleStepperChange("bathrooms", bathrooms + 1, setBathrooms)}
										>
											+
										</button>
									</div>
								</div>
							</div>

							{/* Checkboxes */}
							<div className="form-field">
								<div className="checkbox-container">
									<div className="checkbox-field">
										<div
											className={`checkbox-input ${gatedCommunity ? "checked" : ""}`}
											onClick={() => handleCheckboxChange("gatedCommunity", !gatedCommunity, setGatedCommunity)}
										>
											{gatedCommunity && (
												<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											)}
										</div>
										<label
											className="checkbox-label"
											onClick={() => handleCheckboxChange("gatedCommunity", !gatedCommunity, setGatedCommunity)}
										>
											{getTranslation(displayLanguage, "listings.gatedCommunity")}
										</label>
									</div>

									<div className="checkbox-field">
										<div
											className={`checkbox-input ${elevator ? "checked" : ""}`}
											onClick={() => handleCheckboxChange("elevator", !elevator, setElevator)}
										>
											{elevator && (
												<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											)}
										</div>
										<label
											className="checkbox-label"
											onClick={() => handleCheckboxChange("elevator", !elevator, setElevator)}
										>
											{getTranslation(displayLanguage, "listings.elevator")}
										</label>
									</div>

									<div className="checkbox-field">
										<div
											className={`checkbox-input ${securitySystem ? "checked" : ""}`}
											onClick={() => handleCheckboxChange("securitySystem", !securitySystem, setSecuritySystem)}
										>
											{securitySystem && (
												<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											)}
										</div>
										<label
											className="checkbox-label"
											onClick={() => handleCheckboxChange("securitySystem", !securitySystem, setSecuritySystem)}
										>
											{getTranslation(displayLanguage, "listings.securitySystem")}
										</label>
									</div>
								</div>
							</div>
						</>
					)}

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

export default Step1GeneralCharacteristics;


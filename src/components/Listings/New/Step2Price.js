"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const Step2Price = ({ formData, updateFormData, onNext, onBack }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const [price, setPrice] = useState(formData.price || "");

	// Calculate 2% commission and net price
	const { commission, salePrice, netPrice } = useMemo(() => {
		if (price && !isNaN(price) && parseFloat(price) > 0) {
			const priceValue = parseFloat(price);
			const commissionAmount = priceValue * 0.02;
			const netPriceValue = priceValue - commissionAmount;

			return {
				commission: commissionAmount.toLocaleString('fr-FR', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				}),
				salePrice: priceValue.toLocaleString('fr-FR', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				}),
				netPrice: netPriceValue.toLocaleString('fr-FR', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				})
			};
		}
		return { commission: "0", salePrice: "0", netPrice: "0" };
	}, [price]);

	const handlePriceChange = (e) => {
		const value = e.target.value;
		// Only allow numbers
		if (value === "" || /^\d+$/.test(value)) {
			setPrice(value);
			updateFormData({ price: value });
		}
	};

	const handleNextClick = () => {
		if (price && parseFloat(price) > 0) {
			updateFormData({ price });
			onNext();
		}
	};

	const canProceed = price && parseFloat(price) > 0;

	return (
		<>
			<style jsx>{`
				.step2-price-container {
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
				.field-label {
					font-size: 16px;
					font-weight: 600;
					color: #222222;
					margin-bottom: 12px;
					display: block;
				}
				.input-wrapper {
					position: relative;
					display: flex;
					align-items: center;
				}
				.price-input {
					width: 100%;
					padding: 16px 60px 16px 16px;
					font-size: 16px;
					border: 2px solid #E0E0E0;
					border-radius: 8px;
					background-color: #FFFFFF;
					color: #222222;
					outline: none;
					transition: all 0.2s ease;
					box-sizing: border-box;
				}
				.price-input:focus {
					border-color: #FF385C;
					box-shadow: 0 0 0 3px rgba(255, 56, 92, 0.1);
				}
				.currency-suffix {
					position: absolute;
					right: 16px;
					font-size: 16px;
					color: #717171;
					font-weight: 500;
					pointer-events: none;
				}
				.price-breakdown {
					margin-top: 24px;
					background-color: #FFFFFF;
					border: 1px solid #E0E0E0;
					border-radius: 8px;
					padding: 20px;
				}
				.price-row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 16px;
				}
				.price-row:last-child {
					margin-bottom: 0;
				}
				.price-label {
					display: flex;
					align-items: center;
					gap: 8px;
					font-size: 16px;
					color: #222222;
				}
				.price-label.bold {
					font-weight: 600;
				}
				.price-value {
					font-size: 16px;
					font-weight: 500;
				}
				.price-value.green {
					color: #00A859;
				}
				.price-value.red {
					color: #FF385C;
				}
				.price-value.bold {
					font-weight: 600;
				}
				.price-value.dash {
					color: #717171;
				}
				.info-icon-small {
					width: 18px;
					height: 18px;
					border-radius: 50%;
					background-color: #00A859;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;
				}
				.info-icon-small svg {
					color: #FFFFFF;
					width: 12px;
					height: 12px;
				}
				.price-divider {
					height: 1px;
					background-color: #E0E0E0;
					margin: 16px 0;
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
				.right-buttons {
					display: flex;
					align-items: center;
					gap: 16px;
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
				@media (max-width: 767px) {
					.step2-price-container {
						padding-top: 32px;
						padding-bottom: 32px;
					}
				}
			`}</style>
			<div className="step2-price-container">
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
						{getTranslation(displayLanguage, "listings.chooseYourPrice")}
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							marginBottom: "32px",
							lineHeight: "1.5",
						}}
					>
						{getTranslation(displayLanguage, "listings.choosePriceSubtitle")}
					</p>

					{/* Price Input Field */}
					<div className="form-field">
						<label className="field-label">
							{getTranslation(displayLanguage, "listings.desiredPrice")} <span style={{ color: "#FF385C" }}>*</span>
						</label>
						<div className="input-wrapper">
							<input
								type="text"
								className="price-input"
								value={price}
								onChange={handlePriceChange}
								placeholder={getTranslation(displayLanguage, "listings.desiredPricePlaceholder")}
							/>
							<span className="currency-suffix">DH</span>
						</div>

						{/* Price Breakdown - Always visible */}
						<div className="price-breakdown">
							{/* Sale Price */}
							<div className="price-row">
								<span className="price-label">
									{getTranslation(displayLanguage, "listings.salePrice")}
								</span>
								<span className={`price-value ${price && parseFloat(price) > 0 ? 'green' : 'dash'}`}>
									{price && parseFloat(price) > 0 ? `${salePrice} DH` : '—'}
								</span>
							</div>

							{/* Service Fees */}
							<div className="price-row">
								<span className="price-label">
									{getTranslation(displayLanguage, "listings.commissionAlert")}
								</span>
								<span className={`price-value ${price && parseFloat(price) > 0 ? 'red' : 'dash'}`}>
									{price && parseFloat(price) > 0 ? `${commission} DH` : '—'}
								</span>
							</div>

							{/* Divider */}
							<div className="price-divider"></div>

							{/* Net Seller Price */}
							<div className="price-row">
								<span className="price-label bold">
									{getTranslation(displayLanguage, "listings.netSellerPrice")}
								</span>
								<span className={`price-value ${price && parseFloat(price) > 0 ? 'green bold' : 'dash'}`}>
									{price && parseFloat(price) > 0 ? `${netPrice} DH` : '—'}
								</span>
							</div>
						</div>
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
								{language === 'ar' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
							</button>
						</div>

						{/* Confirm Button */}
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
								{getTranslation(displayLanguage, "listings.confirmPrice")}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Step2Price;


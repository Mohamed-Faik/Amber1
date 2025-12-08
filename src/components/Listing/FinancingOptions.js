"use client";
import React, { useState, useMemo } from "react";
import { formattedPrice } from "@/utils/formattedPrice";
import { getTranslation } from "@/utils/translations";
import { MessageCircle } from "lucide-react";

const FinancingOptions = ({ listing, displayLanguage, monthlyPayment }) => {
	const [desiredAmount, setDesiredAmount] = useState(listing.price);
	const [selectedTerm, setSelectedTerm] = useState(25);
	const [customTerm, setCustomTerm] = useState(20);
	
	const interestRate = 0.05; // 5% annual interest rate
	
	// Calculate monthly payment for a given amount and term
	const calculatePayment = (amount, years) => {
		const monthlyRate = interestRate / 12;
		const numPayments = years * 12;
		if (numPayments === 0) return 0;
		const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
		return Math.round(payment);
	};
	
	const financingOptions = [
		{ years: 25, recommended: true },
		{ years: 7 },
		{ years: 15 },
		{ years: 30 },
	];
	
	const customPayment = useMemo(() => {
		return calculatePayment(desiredAmount, customTerm);
	}, [desiredAmount, customTerm]);
	
	const whatsappNumber = "212638204811";
	const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
		`Bonjour, je souhaite obtenir plus d'informations sur les options de financement pour cette propriété.`
	)}`;
	
	return (
		<div
			id="financing"
			style={{
				marginBottom: "48px",
				paddingBottom: "48px",
				borderBottom: "1px solid #E0E0E0",
			}}
		>
			<h2
				style={{
					fontSize: "24px",
					fontWeight: "700",
					color: "#222222",
					marginBottom: "32px",
				}}
			>
				{getTranslation(displayLanguage, "listings.financingOptions")}
			</h2>
			
			<div
				style={{
					backgroundColor: "#FAFAFA",
					padding: "32px",
					borderRadius: "16px",
					marginBottom: "32px",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						fontSize: "14px",
						color: "#717171",
						marginBottom: "24px",
					}}
				>
					<span style={{ color: "#00A859" }}>✓</span>
					<span>{getTranslation(displayLanguage, "listings.trustedBankingPartner")}</span>
				</div>
				
				{/* Desired Amount Slider */}
				<div style={{ marginBottom: "32px" }}>
					<label
						style={{
							fontSize: "14px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
							display: "block",
						}}
					>
						{getTranslation(displayLanguage, "listings.desiredAmount")}
					</label>
					<input
						type="range"
						min="20000"
						max="20000000"
						step="1000"
						value={desiredAmount}
						onChange={(e) => setDesiredAmount(Number(e.target.value))}
						style={{
							width: "100%",
							height: "8px",
							borderRadius: "4px",
							background: "#E0E0E0",
							outline: "none",
							appearance: "none",
						}}
					/>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: "8px",
							fontSize: "12px",
							color: "#717171",
						}}
					>
						<span>20 000 DH</span>
						<span style={{ fontSize: "16px", fontWeight: "600", color: "#222222" }}>
							{desiredAmount.toLocaleString("fr-FR")} DH
						</span>
						<span>20 000 000 DH</span>
					</div>
				</div>
				
				{/* Financing Options */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						gap: "16px",
						marginBottom: "32px",
					}}
				>
					{financingOptions.map((option) => {
						const payment = calculatePayment(desiredAmount, option.years);
						return (
							<label
								key={option.years}
								style={{
									display: "flex",
									alignItems: "center",
									gap: "12px",
									padding: "16px",
									backgroundColor: selectedTerm === option.years ? "#FFF5F7" : "#FFFFFF",
									border: `2px solid ${selectedTerm === option.years ? "#FF385C" : "#E0E0E0"}`,
									borderRadius: "8px",
									cursor: "pointer",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									if (selectedTerm !== option.years) {
										e.currentTarget.style.borderColor = "#FF385C";
									}
								}}
								onMouseLeave={(e) => {
									if (selectedTerm !== option.years) {
										e.currentTarget.style.borderColor = "#E0E0E0";
									}
								}}
							>
								<input
									type="radio"
									name="financing-term"
									value={option.years}
									checked={selectedTerm === option.years}
									onChange={() => setSelectedTerm(option.years)}
									style={{
										width: "20px",
										height: "20px",
										cursor: "pointer",
									}}
								/>
								<div style={{ flex: 1 }}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
											marginBottom: "4px",
										}}
									>
										<span
											style={{
												fontSize: "16px",
												fontWeight: "600",
												color: "#222222",
											}}
										>
											{getTranslation(displayLanguage, "listings.over")} {option.years} {getTranslation(displayLanguage, "listings.years")}
										</span>
										{option.recommended && (
											<span
												style={{
													fontSize: "12px",
													padding: "2px 8px",
													backgroundColor: "#FF385C",
													color: "#FFFFFF",
													borderRadius: "4px",
												}}
											>
												{getTranslation(displayLanguage, "listings.recommended")}
											</span>
										)}
									</div>
									<div
										style={{
											fontSize: "18px",
											fontWeight: "600",
											color: "#FF385C",
										}}
									>
										{payment.toLocaleString("fr-FR")} DH {getTranslation(displayLanguage, "listings.perMonth")}
									</div>
								</div>
							</label>
						);
					})}
				</div>
				
				{/* Personalized Offer */}
				<div
					style={{
						backgroundColor: "#FFFFFF",
						padding: "24px",
						borderRadius: "12px",
						marginBottom: "24px",
						border: "2px solid #E0E0E0",
					}}
				>
					<div
						style={{
							fontSize: "14px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
						}}
					>
						{getTranslation(displayLanguage, "listings.personalizedOffer")}
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
						}}
					>
						<input
							type="number"
							value={customTerm}
							onChange={(e) => setCustomTerm(Number(e.target.value))}
							style={{
								padding: "12px",
								border: "1px solid #E0E0E0",
								borderRadius: "8px",
								fontSize: "16px",
								width: "120px",
							}}
							min="1"
							max="30"
						/>
						<span style={{ fontSize: "14px", color: "#717171" }}>{getTranslation(displayLanguage, "listings.years")}</span>
						<div style={{ flex: 1, textAlign: "right" }}>
							<div
								style={{
									fontSize: "14px",
									color: "#717171",
									marginBottom: "4px",
								}}
							>
								{getTranslation(displayLanguage, "listings.monthlyPaymentToPay")}
							</div>
							<div
								style={{
									fontSize: "20px",
									fontWeight: "600",
									color: "#222222",
								}}
							>
								{customPayment.toLocaleString("fr-FR")} DH{getTranslation(displayLanguage, "listings.perMonth")}
							</div>
						</div>
						<button
							style={{
								padding: "12px 24px",
								backgroundColor: "#FF385C",
								color: "#FFFFFF",
								border: "none",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "600",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#E61E4D";
								e.currentTarget.style.transform = "translateY(-2px)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#FF385C";
								e.currentTarget.style.transform = "translateY(0)";
							}}
						>
							{getTranslation(displayLanguage, "listings.getThisOffer")}
						</button>
					</div>
				</div>
				
				{/* Help Section */}
				<div
					style={{
						backgroundColor: "#FFFFFF",
						padding: "24px",
						borderRadius: "12px",
						marginBottom: "16px",
						border: "1px solid #E0E0E0",
					}}
				>
					<div
						style={{
							fontSize: "14px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
						}}
					>
						{getTranslation(displayLanguage, "listings.needHelpChoosing")}
					</div>
					<p
						style={{
							fontSize: "14px",
							color: "#717171",
							marginBottom: "16px",
							lineHeight: "1.5",
						}}
					>
						{getTranslation(displayLanguage, "listings.ourExpertsHelp")}
					</p>
					<a
						href={whatsappLink}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							padding: "12px 24px",
							backgroundColor: "#25D366",
							color: "#FFFFFF",
							borderRadius: "8px",
							textDecoration: "none",
							fontSize: "14px",
							fontWeight: "600",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#20BA5A";
							e.currentTarget.style.transform = "translateY(-2px)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#25D366";
							e.currentTarget.style.transform = "translateY(0)";
						}}
					>
						<MessageCircle size={18} />
						{getTranslation(displayLanguage, "listings.contactExpert")}
					</a>
				</div>
				
				{/* Disclaimer */}
				<div
					style={{
						fontSize: "12px",
						color: "#717171",
						lineHeight: "1.5",
						marginBottom: "12px",
					}}
				>
					* {getTranslation(displayLanguage, "listings.amountsIndicative")}
				</div>
				<a
					href="#"
					style={{
						fontSize: "12px",
						color: "#FF385C",
						textDecoration: "underline",
					}}
				>
					{getTranslation(displayLanguage, "listings.moreFinancingInfo")}
				</a>
			</div>
		</div>
	);
};

export default FinancingOptions;


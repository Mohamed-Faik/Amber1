"use client";
import React, { useState, useEffect } from "react";
import { X, Settings, Check } from "lucide-react";
import Link from "next/link";

const CookieConsent = () => {
	const [showBanner, setShowBanner] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [cookiePreferences, setCookiePreferences] = useState({
		necessary: true, // Always true, cannot be disabled
		analytics: false,
		marketing: false,
	});

	useEffect(() => {
		// Check if user has already set preferences
		const savedPreferences = localStorage.getItem("cookiePreferences");
		const consentGiven = localStorage.getItem("cookieConsent");

		if (consentGiven === "true" && savedPreferences) {
			const prefs = JSON.parse(savedPreferences);
			setCookiePreferences(prefs);
			setShowBanner(false);
		} else {
			setShowBanner(true);
		}
	}, []);

	const handleAcceptAll = () => {
		const allAccepted = {
			necessary: true,
			analytics: true,
			marketing: true,
		};
		setCookiePreferences(allAccepted);
		localStorage.setItem("cookiePreferences", JSON.stringify(allAccepted));
		localStorage.setItem("cookieConsent", "true");
		setShowBanner(false);
	};

	const handleRejectAll = () => {
		const onlyNecessary = {
			necessary: true,
			analytics: false,
			marketing: false,
		};
		setCookiePreferences(onlyNecessary);
		localStorage.setItem("cookiePreferences", JSON.stringify(onlyNecessary));
		localStorage.setItem("cookieConsent", "true");
		setShowBanner(false);
	};

	const handleSavePreferences = () => {
		localStorage.setItem("cookiePreferences", JSON.stringify(cookiePreferences));
		localStorage.setItem("cookieConsent", "true");
		setShowBanner(false);
		setShowSettings(false);
	};

	const handleOpenSettings = () => {
		setShowSettings(true);
	};

	if (!showBanner && !showSettings) {
		// Show settings button in footer or header
		return (
			<button
				onClick={handleOpenSettings}
				style={{
					position: "fixed",
					bottom: "20px",
					right: "20px",
					backgroundColor: "#222222",
					color: "#FFFFFF",
					border: "none",
					borderRadius: "50px",
					padding: "12px 20px",
					fontSize: "14px",
					fontWeight: "500",
					cursor: "pointer",
					boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
					display: "flex",
					alignItems: "center",
					gap: "8px",
					zIndex: 9998,
					transition: "all 0.2s ease",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = "#FF385C";
					e.currentTarget.style.transform = "translateY(-2px)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = "#222222";
					e.currentTarget.style.transform = "translateY(0)";
				}}
				aria-label="Cookie settings"
			>
				<Settings size={16} />
				Cookies
			</button>
		);
	}

	return (
		<>
			{/* Cookie Consent Banner */}
			{showBanner && (
				<div
					style={{
						position: "fixed",
						bottom: 0,
						left: 0,
						right: 0,
						backgroundColor: "#FFFFFF",
						borderTop: "1px solid #E0E0E0",
						boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
						padding: "24px",
						zIndex: 10000,
						maxWidth: "100%",
					}}
					role="dialog"
					aria-label="Cookie consent"
					aria-modal="true"
				>
					<div
						style={{
							maxWidth: "1200px",
							margin: "0 auto",
							display: "flex",
							flexDirection: "column",
							gap: "16px",
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
							<div style={{ flex: 1 }}>
								<h3
									style={{
										fontSize: "18px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
									}}
								>
									We use cookies
								</h3>
								<p
									style={{
										fontSize: "14px",
										color: "#717171",
										lineHeight: "1.6",
										margin: 0,
									}}
								>
									We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.{" "}
									<Link
										href="/privacy-policy"
										style={{
											color: "#FF385C",
											textDecoration: "underline",
										}}
									>
										Learn more
									</Link>
								</p>
							</div>
							<button
								onClick={() => setShowBanner(false)}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									padding: "4px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#717171",
								}}
								aria-label="Close cookie banner"
							>
								<X size={20} />
							</button>
						</div>

						<div
							style={{
								display: "flex",
								gap: "12px",
								flexWrap: "wrap",
							}}
						>
							<button
								onClick={handleRejectAll}
								style={{
									padding: "12px 24px",
									border: "1px solid #E0E0E0",
									borderRadius: "8px",
									backgroundColor: "#FFFFFF",
									color: "#222222",
									fontSize: "14px",
									fontWeight: "600",
									cursor: "pointer",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = "#222222";
									e.currentTarget.style.backgroundColor = "#F7F7F7";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = "#E0E0E0";
									e.currentTarget.style.backgroundColor = "#FFFFFF";
								}}
							>
								Reject All
							</button>
							<button
								onClick={handleOpenSettings}
								style={{
									padding: "12px 24px",
									border: "1px solid #E0E0E0",
									borderRadius: "8px",
									backgroundColor: "#FFFFFF",
									color: "#222222",
									fontSize: "14px",
									fontWeight: "600",
									cursor: "pointer",
									transition: "all 0.2s ease",
									display: "flex",
									alignItems: "center",
									gap: "8px",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = "#222222";
									e.currentTarget.style.backgroundColor = "#F7F7F7";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = "#E0E0E0";
									e.currentTarget.style.backgroundColor = "#FFFFFF";
								}}
							>
								<Settings size={16} />
								Customize
							</button>
							<button
								onClick={handleAcceptAll}
								style={{
									padding: "12px 24px",
									border: "none",
									borderRadius: "8px",
									backgroundColor: "#FF385C",
									color: "#FFFFFF",
									fontSize: "14px",
									fontWeight: "600",
									cursor: "pointer",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "#E61E4D";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "#FF385C";
								}}
							>
								Accept All
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Cookie Settings Modal */}
			{showSettings && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 10001,
						padding: "20px",
					}}
					onClick={() => setShowSettings(false)}
					role="dialog"
					aria-label="Cookie settings"
					aria-modal="true"
				>
					<div
						style={{
							backgroundColor: "#FFFFFF",
							borderRadius: "16px",
							padding: "32px",
							maxWidth: "600px",
							width: "100%",
							maxHeight: "90vh",
							overflow: "auto",
							boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
							<h2
								style={{
									fontSize: "24px",
									fontWeight: "700",
									color: "#222222",
									margin: 0,
								}}
							>
								Cookie Settings
							</h2>
							<button
								onClick={() => setShowSettings(false)}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									padding: "4px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#717171",
								}}
								aria-label="Close settings"
							>
								<X size={24} />
							</button>
						</div>

						<p
							style={{
								fontSize: "14px",
								color: "#717171",
								lineHeight: "1.6",
								marginBottom: "24px",
							}}
						>
							Manage your cookie preferences. You can enable or disable different types of cookies below.
						</p>

						<div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
							{/* Necessary Cookies */}
							<div
								style={{
									padding: "20px",
									border: "1px solid #E0E0E0",
									borderRadius: "12px",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
									<div style={{ flex: 1 }}>
										<h3
											style={{
												fontSize: "16px",
												fontWeight: "600",
												color: "#222222",
												marginBottom: "4px",
											}}
										>
											Necessary Cookies
										</h3>
										<p
											style={{
												fontSize: "13px",
												color: "#717171",
												margin: 0,
												lineHeight: "1.5",
											}}
										>
											These cookies are essential for the website to function properly. They cannot be disabled.
										</p>
									</div>
									<div
										style={{
											width: "48px",
											height: "28px",
											backgroundColor: "#10B981",
											borderRadius: "14px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
											marginLeft: "16px",
										}}
									>
										<Check size={16} color="#FFFFFF" />
									</div>
								</div>
							</div>

							{/* Analytics Cookies */}
							<div
								style={{
									padding: "20px",
									border: "1px solid #E0E0E0",
									borderRadius: "12px",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
									<div style={{ flex: 1 }}>
										<h3
											style={{
												fontSize: "16px",
												fontWeight: "600",
												color: "#222222",
												marginBottom: "4px",
											}}
										>
											Analytics Cookies
										</h3>
										<p
											style={{
												fontSize: "13px",
												color: "#717171",
												margin: 0,
												lineHeight: "1.5",
											}}
										>
											These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
										</p>
									</div>
									<button
										onClick={() =>
											setCookiePreferences({
												...cookiePreferences,
												analytics: !cookiePreferences.analytics,
											})
										}
										style={{
											width: "48px",
											height: "28px",
											backgroundColor: cookiePreferences.analytics ? "#10B981" : "#E0E0E0",
											border: "none",
											borderRadius: "14px",
											cursor: "pointer",
											position: "relative",
											transition: "background-color 0.2s ease",
											marginLeft: "16px",
											flexShrink: 0,
										}}
										aria-label={`${cookiePreferences.analytics ? "Disable" : "Enable"} analytics cookies`}
									>
										<div
											style={{
												position: "absolute",
												top: "2px",
												left: cookiePreferences.analytics ? "22px" : "2px",
												width: "24px",
												height: "24px",
												backgroundColor: "#FFFFFF",
												borderRadius: "50%",
												transition: "left 0.2s ease",
												boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
											}}
										/>
									</button>
								</div>
							</div>

							{/* Marketing Cookies */}
							<div
								style={{
									padding: "20px",
									border: "1px solid #E0E0E0",
									borderRadius: "12px",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
									<div style={{ flex: 1 }}>
										<h3
											style={{
												fontSize: "16px",
												fontWeight: "600",
												color: "#222222",
												marginBottom: "4px",
											}}
										>
											Marketing Cookies
										</h3>
										<p
											style={{
												fontSize: "13px",
												color: "#717171",
												margin: 0,
												lineHeight: "1.5",
											}}
										>
											These cookies are used to deliver advertisements and track campaign performance.
										</p>
									</div>
									<button
										onClick={() =>
											setCookiePreferences({
												...cookiePreferences,
												marketing: !cookiePreferences.marketing,
											})
										}
										style={{
											width: "48px",
											height: "28px",
											backgroundColor: cookiePreferences.marketing ? "#10B981" : "#E0E0E0",
											border: "none",
											borderRadius: "14px",
											cursor: "pointer",
											position: "relative",
											transition: "background-color 0.2s ease",
											marginLeft: "16px",
											flexShrink: 0,
										}}
										aria-label={`${cookiePreferences.marketing ? "Disable" : "Enable"} marketing cookies`}
									>
										<div
											style={{
												position: "absolute",
												top: "2px",
												left: cookiePreferences.marketing ? "22px" : "2px",
												width: "24px",
												height: "24px",
												backgroundColor: "#FFFFFF",
												borderRadius: "50%",
												transition: "left 0.2s ease",
												boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
											}}
										/>
									</button>
								</div>
							</div>
						</div>

						<div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
							<button
								onClick={() => setShowSettings(false)}
								style={{
									padding: "12px 24px",
									border: "1px solid #E0E0E0",
									borderRadius: "8px",
									backgroundColor: "#FFFFFF",
									color: "#222222",
									fontSize: "14px",
									fontWeight: "600",
									cursor: "pointer",
								}}
							>
								Cancel
							</button>
							<button
								onClick={handleSavePreferences}
								style={{
									padding: "12px 24px",
									border: "none",
									borderRadius: "8px",
									backgroundColor: "#FF385C",
									color: "#FFFFFF",
									fontSize: "14px",
									fontWeight: "600",
									cursor: "pointer",
								}}
							>
								Save Preferences
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CookieConsent;


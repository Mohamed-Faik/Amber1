"use client";
import React, { useState } from "react";
import { getTranslation } from "@/utils/translations";

const PropertyCharacteristics = ({ listing, displayLanguage }) => {
	const [showAll, setShowAll] = useState(false);
	
	const parseFeatures = (featuresString) => {
		if (!featuresString) return [];
		const features = featuresString.split(",").map(f => f.trim()).filter(f => f);
		return features;
	};
	
	const features = parseFeatures(listing.features);
	
	const featureIcons = {
		"Interphone": "📞",
		"Espaces verts": "🌳",
		"Balcon": "🏠",
		"Terrasse": "🏡",
		"Jardin privatif": "🌿",
		"Piscine privative": "🏊",
		"Sous-sol": "⬇️",
		"Climatisation split": "❄️",
		"Cheminée": "🔥",
		"Chauffe-eau électrique": "💧",
		"Buanderie": "🧺",
		"Elevator": "🛗",
		"Gated Community": "🚪",
		"Security System": "🔒",
		"Heating": "🔥",
		"Air Conditioning": "❄️",
		"Equipped Kitchen": "🍳",
		"Private Garden": "🌿",
		"Swimming Pool": "🏊",
		"Garage/Box": "🚗",
		"Parking Spaces": "🅿️",
	};
	
	const displayedFeatures = showAll ? features : features.slice(0, 8);
	
	if (features.length === 0) {
		return null;
	}
	
	return (
		<div
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
				{getTranslation(displayLanguage, "listings.propertyCharacteristics")}
			</h2>
			
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
					gap: "16px",
				}}
			>
				{displayedFeatures.map((feature, index) => (
					<div
						key={index}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							padding: "16px",
							backgroundColor: "#FAFAFA",
							borderRadius: "12px",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#FFF5F7";
							e.currentTarget.style.transform = "translateY(-2px)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#FAFAFA";
							e.currentTarget.style.transform = "translateY(0)";
						}}
					>
						<span style={{ fontSize: "24px", flexShrink: 0 }}>
							{featureIcons[feature] || "✓"}
						</span>
						<span
							style={{
								fontSize: "15px",
								color: "#222222",
								fontWeight: "500",
							}}
						>
							{feature}
						</span>
					</div>
				))}
			</div>
			
			{features.length > 8 && (
				<button
					onClick={() => setShowAll(!showAll)}
					style={{
						marginTop: "32px",
						padding: "14px 28px",
						backgroundColor: "transparent",
						border: "2px solid #E0E0E0",
						borderRadius: "12px",
						fontSize: "15px",
						fontWeight: "600",
						color: "#222222",
						cursor: "pointer",
						transition: "all 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.borderColor = "#FF385C";
						e.currentTarget.style.color = "#FF385C";
						e.currentTarget.style.backgroundColor = "#FFF5F7";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.borderColor = "#E0E0E0";
						e.currentTarget.style.color = "#222222";
						e.currentTarget.style.backgroundColor = "transparent";
					}}
				>
					{showAll ? getTranslation(displayLanguage, "listings.hideAllCharacteristics") : getTranslation(displayLanguage, "listings.showAllCharacteristics")}
				</button>
			)}
		</div>
	);
};

export default PropertyCharacteristics;

"use client";
import React from "react";
import { getTranslation } from "@/utils/translations";

const Features = ({ features, displayLanguage = "en" }) => {
	if (!features || features.trim() === "") {
		return null;
	}

	return (
		<div>
		<h2
			style={{
				fontSize: "22px",
				fontWeight: "600",
				color: "#222222",
				marginBottom: "24px",
			}}
		>
			{getTranslation(displayLanguage, "listings.whatThisPlaceOffers")}
		</h2>
			<div
				dangerouslySetInnerHTML={{
					__html: features,
				}}
				style={{
					fontSize: "16px",
					lineHeight: "1.6",
					color: "#222222",
				}}
			/>
		</div>
	);
};

export default Features;

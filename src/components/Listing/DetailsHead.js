"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formattedPrice } from "@/utils/formattedPrice";
import SahreAndSave from "./SahreAndSave";
import rulerIcon from "../../../public/images/icon/ruler.svg";
import bedIcon from "../../../public/images/icon/bed.svg";
import bathroomIcon from "../../../public/images/icon/bathroom.svg";

const DetailsHead = ({
	title,
	location_value,
	price,
	category,
	currentUser,
	listingId,
	area,
	bedrooms,
	bathrooms,
	listingType,
}) => {
	// Default to SALE if listingType is not provided (for backward compatibility)
	const displayListingType = listingType || "SALE";
	
	return (
		<div style={{ marginBottom: "24px" }}>
			{/* Title and Location */}
			<div style={{ marginBottom: "16px" }}>
				<h1
					style={{
						fontSize: "26px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "8px",
						lineHeight: "1.3",
					}}
				>
					{title}
				</h1>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						flexWrap: "wrap",
						marginBottom: "16px",
					}}
				>
					<Link
						href={`/listings/?category=${category}`}
						style={{
							textDecoration: "underline",
							color: "#222222",
							fontSize: "14px",
							fontWeight: "500",
						}}
					>
						{category}
					</Link>
					<span style={{ color: "#717171" }}>·</span>
					<span
						style={{
							color: "#222222",
							fontSize: "14px",
							display: "flex",
							alignItems: "center",
							gap: "4px",
						}}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
							<circle cx="12" cy="10" r="3"></circle>
						</svg>
						{location_value}
					</span>
				</div>

				{/* Property Details: Area, Bedrooms, Bathrooms */}
				{(area || bedrooms || bathrooms) && (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "24px",
							flexWrap: "wrap",
							marginTop: "12px",
						}}
					>
						{/* Area - Ruler Icon */}
						{area && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									fontSize: "14px",
									color: "#222222",
								}}
							>
								<Image
									src={rulerIcon}
									alt="Area"
									width={20}
									height={20}
									style={{ flexShrink: 0 }}
								/>
								<span style={{ fontWeight: "500" }}>{area} m²</span>
							</div>
						)}

						{/* Bedrooms - Bed Icon */}
						{bedrooms && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									fontSize: "14px",
									color: "#222222",
								}}
							>
								<Image
									src={bedIcon}
									alt="Bedrooms"
									width={20}
									height={20}
									style={{ flexShrink: 0 }}
								/>
								<span style={{ fontWeight: "500" }}>
									{bedrooms} {bedrooms === 1 ? "Chambre" : "Chambres"}
								</span>
							</div>
						)}

						{/* Bathrooms - Bathroom Icon */}
						{bathrooms && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									fontSize: "14px",
									color: "#222222",
								}}
							>
								<Image
									src={bathroomIcon}
									alt="Bathrooms"
									width={20}
									height={20}
									style={{ flexShrink: 0 }}
								/>
								<span style={{ fontWeight: "500" }}>
									{bathrooms} {bathrooms === 1 ? "Salle de bain" : "Salles de bain"}
								</span>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Listing Type Badge and Price */}
			<div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
				<span
					style={{
						display: "inline-block",
						padding: "6px 14px",
						backgroundColor: displayListingType === "RENT" ? "#E8F5E9" : "#FFF5F7",
						color: displayListingType === "RENT" ? "#2E7D32" : "#FF385C",
						borderRadius: "8px",
						fontSize: "14px",
						fontWeight: "700",
						letterSpacing: "0.5px",
					}}
				>
					{displayListingType === "RENT" ? "FOR RENT" : "FOR SALE"}
				</span>
				<span
					style={{
						fontSize: "24px",
						fontWeight: "700",
						color: "#222222",
					}}
				>
					{formattedPrice(price)}
					{displayListingType === "RENT" && (
						<span
							style={{
								fontSize: "18px",
								fontWeight: "500",
								color: "#717171",
								marginLeft: "4px",
							}}
						>
							/month
						</span>
					)}
				</span>
			</div>

			{/* Share and Save buttons */}
			<div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
				<SahreAndSave currentUser={currentUser} listingId={listingId} />
			</div>
		</div>
	);
};

export default DetailsHead;

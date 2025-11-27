"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getListingImage } from "@/utils/getListingImage";
import { formatDate } from "@/utils/formatDate";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import { getTranslation } from "@/utils/translations";

const TranslatedListingCard = ({ 
	listing, 
	displayLanguage,
	getStatusBadge,
	handleStatusChange,
	handleDelete,
	handlePremiumToggle 
}) => {
	const { translatedContent: translatedTitle } = useTranslatedContent(
		listing.title, 
		displayLanguage, 
		false
	);

	return (
		<div
			key={listing.id}
			style={{
				border: "1px solid #E0E0E0",
				borderRadius: "12px",
				overflow: "hidden",
				backgroundColor: "#FFFFFF",
				transition: "all 0.2s ease",
			}}
		>
			{/* Image */}
			{getListingImage(listing.imageSrc) && (
				<div style={{ position: "relative", width: "100%", height: "200px" }}>
					<Image
						src={getListingImage(listing.imageSrc)}
						alt={listing.title}
						fill
						style={{ objectFit: "cover" }}
						unoptimized
					/>
					<div
						style={{
							position: "absolute",
							top: "12px",
							right: "12px",
						}}
					>
						{getStatusBadge(listing.status)}
					</div>
				</div>
			)}

			{/* Content */}
			<div style={{ padding: "16px" }}>
				<h3
					style={{
						fontSize: "16px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "8px",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{translatedTitle}
				</h3>

				<div
					style={{
						fontSize: "14px",
						color: "#717171",
						marginBottom: "12px",
					}}
				>
					<div>{getTranslation(displayLanguage, "admin.category")}: {listing.category}</div>
					<div>{getTranslation(displayLanguage, "admin.location")}: {listing.location_value}</div>
					<div>{getTranslation(displayLanguage, "admin.date")}: {formatDate(listing.created_at)}</div>
				</div>

				{/* Actions */}
				<div
					style={{
						display: "flex",
						gap: "8px",
						flexWrap: "wrap",
					}}
				>
					<Link
						href={`/listing/${listing.id}/${listing.slug}`}
						style={{
							flex: 1,
							padding: "8px 16px",
							backgroundColor: "#222222",
							color: "#FFFFFF",
							border: "none",
							borderRadius: "8px",
							fontSize: "14px",
							fontWeight: "500",
							textDecoration: "none",
							textAlign: "center",
							cursor: "pointer",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#000000";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#222222";
						}}
					>
						{getTranslation(displayLanguage, "admin.view")}
					</Link>

					{listing.status === "Pending" && (
						<button
							onClick={() =>
								handleStatusChange(listing.id, "Approved")
							}
							style={{
								flex: 1,
								padding: "8px 16px",
								backgroundColor: "#FF385C",
								color: "#FFFFFF",
								border: "none",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "500",
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
							{getTranslation(displayLanguage, "admin.approve")}
						</button>
					)}

					{listing.status === "Approved" && listing.featureType !== "EXPERIENCES" && (
						<button
							onClick={() =>
								handleStatusChange(listing.id, "Sold")
							}
							style={{
								flex: 1,
								padding: "8px 16px",
								backgroundColor: "#10B981",
								color: "#FFFFFF",
								border: "none",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "500",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#059669";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#10B981";
							}}
						>
							{getTranslation(displayLanguage, "admin.markAsSold")}
						</button>
					)}

					{listing.status === "Sold" && listing.featureType !== "EXPERIENCES" && (
						<button
							onClick={() =>
								handleStatusChange(listing.id, "Approved")
							}
							style={{
								flex: 1,
								padding: "8px 16px",
								backgroundColor: "#3B82F6",
								color: "#FFFFFF",
								border: "none",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "500",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#2563EB";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#3B82F6";
							}}
						>
							{getTranslation(displayLanguage, "admin.unmarkAsSold")}
						</button>
				)}

				{/* Premium Toggle Button */}
				<button
					onClick={() => handlePremiumToggle(listing.id, listing.isPremium)}
					style={{
						flex: 1,
						padding: "8px 16px",
						backgroundColor: listing.isPremium ? "#F59E0B" : "#FFFFFF",
						color: listing.isPremium ? "#FFFFFF" : "#F59E0B",
						border: `2px solid #F59E0B`,
						borderRadius: "8px",
						fontSize: "14px",
						fontWeight: "600",
						cursor: "pointer",
						transition: "all 0.2s ease",
					}}
					onMouseEnter={(e) => {
						if (listing.isPremium) {
							e.currentTarget.style.backgroundColor = "#D97706";
						} else {
							e.currentTarget.style.backgroundColor = "#FEF3C7";
						}
					}}
					onMouseLeave={(e) => {
						if (listing.isPremium) {
							e.currentTarget.style.backgroundColor = "#F59E0B";
						} else {
							e.currentTarget.style.backgroundColor = "#FFFFFF";
						}
					}}
				>
					{listing.isPremium ? "⭐ Premium" : "Mark Premium"}
				</button>

				<button
					onClick={() => handleDelete(listing.id)}
					style={{
						padding: "8px 16px",
						backgroundColor: "#FFFFFF",
						color: "#FF385C",
						border: "1px solid #FF385C",
						borderRadius: "8px",
						fontSize: "14px",
						fontWeight: "500",
						cursor: "pointer",
						transition: "all 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#FF385C";
						e.currentTarget.style.color = "#FFFFFF";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "#FFFFFF";
						e.currentTarget.style.color = "#FF385C";
					}}
				>
					{getTranslation(displayLanguage, "admin.delete")}
				</button>
			</div>
			</div>
		</div>
	);
};

export default TranslatedListingCard;


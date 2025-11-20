"use client";
import React from "react";
import Link from "next/link";
import { formattedPrice } from "@/utils/formattedPrice";
import SahreAndSave from "./SahreAndSave";

const DetailsHead = ({
	title,
	location_value,
	price,
	category,
	currentUser,
	listingId,
}) => {
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
			</div>

			{/* Share and Save buttons */}
			<div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
				<SahreAndSave currentUser={currentUser} listingId={listingId} />
			</div>
		</div>
	);
};

export default DetailsHead;

"use client";
import React from "react";
import useFavourite from "@/hooks/useFavorite";

const HeartButton = ({ currentUser, listingId }) => {
	const { hasFauvorited, toggleFavourite } = useFavourite({
		listingId,
		currentUser,
	});

	return (
		<button
			type="button"
			onClick={toggleFavourite}
			style={{
				width: "48px",
				height: "48px",
				borderRadius: "50%",
				backgroundColor: "#ffffff",
				border: "1px solid #E0E0E0",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				cursor: "pointer",
				boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
				transition: "all 0.15s ease",
				padding: 0,
				margin: 0,
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = "scale(1.1)";
				e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = "scale(1)";
				e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
			}}
		>
			{hasFauvorited ? (
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="#FF385C"
					stroke="#FF385C"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
				</svg>
			) : (
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#222222"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
				</svg>
			)}
		</button>
	);
};

export default HeartButton;

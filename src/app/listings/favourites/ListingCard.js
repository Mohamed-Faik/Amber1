"use client";
import React from "react";
import ListingItem from "./ListingItem";

const ListingCard = ({ currentUser, favourites }) => {
	return (
		<div
			style={{
				paddingTop: "40px",
				paddingBottom: "80px",
				width: "100%",
			}}
		>
			<div className="container" style={{ maxWidth: "1400px", margin: "0 auto", paddingLeft: "24px", paddingRight: "24px", boxSizing: "border-box" }}>
				{/* Header */}
				<div style={{ marginBottom: "48px", width: "100%" }}>
					<h1
						style={{
							fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
							marginTop: 0,
							lineHeight: "1.3",
						}}
					>
						My Favourites
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							margin: 0,
							lineHeight: "1.5",
						}}
					>
						{favourites.length > 0
							? `You have ${favourites.length} ${favourites.length === 1 ? "favourite property" : "favourite properties"}`
							: "Your saved properties will appear here"}
					</p>
				</div>

				<style jsx>{`
					.favourites-grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
						gap: 32px;
					}
					@media only screen and (max-width: 991px) {
						.favourites-grid {
							grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
							gap: 24px;
						}
					}
					@media only screen and (max-width: 767px) {
						.favourites-grid {
							grid-template-columns: 1fr;
							gap: 20px;
						}
					}
				`}</style>
				{/* Listings Grid */}
				{favourites.length > 0 ? (
					<div className="favourites-grid">
						{favourites.map((fav) => (
							<ListingItem
								currentUser={currentUser}
								key={fav.id}
								listing={fav.listing}
							/>
						))}
					</div>
				) : (
					<div
						style={{
							backgroundColor: "#ffffff",
							borderRadius: "16px",
							padding: "80px 32px",
							textAlign: "center",
							boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
						}}
					>
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#dddddd"
							strokeWidth="1.5"
							style={{ margin: "0 auto 24px" }}
						>
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
						</svg>
						<h3
							style={{
								fontSize: "20px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "12px",
							}}
						>
							No favourites yet
						</h3>
						<p
							style={{
								fontSize: "16px",
								color: "#717171",
								margin: 0,
							}}
						>
							Start saving properties you love by clicking the heart icon
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ListingCard;

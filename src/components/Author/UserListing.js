"use client";
import React from "react";
import ListingItem from "./ListingItem";

const UserListing = ({ listings, user, currentUser }) => {
	return (
		<div style={{
			paddingTop: "40px",
			paddingBottom: "80px",
			width: "100%",
		}}>
			<div style={{ maxWidth: "1400px", margin: "0 auto", paddingLeft: "24px", paddingRight: "24px", boxSizing: "border-box" }}>
				{/* Header */}
				<div style={{ 
					marginBottom: "48px", 
					width: "100%",
				}}>
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
						{user}'s Listings
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							margin: 0,
							lineHeight: "1.5",
						}}
					>
						{listings.length > 0
							? `${user} has ${listings.length} ${listings.length === 1 ? "listing" : "listings"}`
							: `${user} hasn't created any listings yet`}
					</p>
				</div>

				<style jsx>{`
					.listings-grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
						gap: 32px;
					}
					@media only screen and (max-width: 991px) {
						.listings-grid {
							grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
							gap: 24px;
						}
					}
					@media only screen and (max-width: 767px) {
						.listings-grid {
							grid-template-columns: 1fr;
							gap: 20px;
						}
					}
				`}</style>

				{/* Listings Grid */}
				{listings.length > 0 ? (
					<div className="listings-grid">
						{listings.map((list) => (
							<ListingItem
								key={list.id}
								{...list}
								user={user}
								currentUser={currentUser}
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
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
							<circle cx="8.5" cy="8.5" r="1.5"></circle>
							<polyline points="21 15 16 10 5 21"></polyline>
						</svg>
						<h3
							style={{
								fontSize: "20px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "12px",
							}}
						>
							No listings yet
						</h3>
						<p
							style={{
								fontSize: "16px",
								color: "#717171",
								margin: 0,
							}}
						>
							This author hasn't created any listings yet
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserListing;

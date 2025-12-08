"use client";
import React from "react";
import Link from "next/link";
import ListingItem from "./ListingItem";

const ListingCard = ({ currentUser, listings }) => {
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
				<div style={{ 
					marginBottom: "48px", 
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
					flexWrap: "wrap",
					gap: "24px",
				}}>
					<div>
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
							My Listings
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
								? `You have ${listings.length} ${listings.length === 1 ? "active listing" : "active listings"}`
								: "Create your first listing to get started"}
						</p>
					</div>
					<Link
						href="/listings/new"
						style={{
							padding: "12px 24px",
							backgroundColor: "#FF385C",
							color: "#ffffff",
							borderRadius: "8px",
							fontSize: "16px",
							fontWeight: "600",
							textDecoration: "none",
							transition: "all 0.3s ease",
							boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
						}}
						onMouseEnter={(e) => {
							e.target.style.backgroundColor = "#E61E4D";
							e.target.style.transform = "translateY(-2px)";
							e.target.style.boxShadow = "0 6px 16px rgba(255, 56, 92, 0.4)";
						}}
						onMouseLeave={(e) => {
							e.target.style.backgroundColor = "#FF385C";
							e.target.style.transform = "translateY(0)";
							e.target.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.3)";
						}}
					>
						<i className="ri-menu-add-line"></i>
						Create New Listing
					</Link>
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
								currentUser={currentUser}
								key={list.id}
								{...list}
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
								marginBottom: "24px",
							}}
						>
							Start by creating your first property listing
						</p>
						<Link
							href="/listings/new"
							style={{
								padding: "12px 32px",
								backgroundColor: "#FF385C",
								color: "#ffffff",
								borderRadius: "8px",
								fontSize: "16px",
								fontWeight: "600",
								textDecoration: "none",
								transition: "all 0.3s ease",
								boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
								display: "inline-block",
							}}
							onMouseEnter={(e) => {
								e.target.style.backgroundColor = "#E61E4D";
								e.target.style.transform = "translateY(-2px)";
								e.target.style.boxShadow = "0 6px 16px rgba(255, 56, 92, 0.4)";
							}}
							onMouseLeave={(e) => {
								e.target.style.backgroundColor = "#FF385C";
								e.target.style.transform = "translateY(0)";
								e.target.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.3)";
							}}
						>
							Create Your First Listing
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default ListingCard;

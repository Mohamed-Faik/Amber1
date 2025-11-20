"use client";
import React, { useState } from "react";
import Link from "next/link";

const Footer = () => {
	const [selectedCategory, setSelectedCategory] = useState("Popular");
	const [showMoreDestinations, setShowMoreDestinations] = useState(false);

	const categories = [
		"Popular",
		"Arts & culture",
		"Beach",
		"Mountains",
		"Outdoors",
		"Things to do",
		"Travel tips & inspiration",
		"Airbnb-friendly apartments",
	];

	const destinations = [
		[
			{ name: "San Juan", type: "Condo rentals" },
			{ name: "San Diego", type: "Vacation rentals" },
			{ name: "Honolulu", type: "Condo rentals" },
		],
		[
			{ name: "Brooklyn", type: "Vacation rentals" },
			{ name: "Broken Bow", type: "Cottage rentals" },
			{ name: "Kaua'i County", type: "Apartment rentals" },
		],
		[
			{ name: "Memphis", type: "Condo rentals" },
			{ name: "Wilmington", type: "Monthly Rentals" },
			{ name: "Whistler", type: "House rentals" },
		],
		[
			{ name: "Playa del Carmen", type: "Vacation rentals" },
			{ name: "Key West", type: "Villa rentals" },
			{ name: "Mount Pocono", type: "Villa rentals" },
		],
		[
			{ name: "Richmond City", type: "Apartment rentals" },
			{ name: "Kyoto", type: "Monthly Rentals" },
			{ name: "London", type: "Condo rentals" },
		],
		[
			{ name: "San Antonio", type: "Condo rentals" },
			{ name: "Charleston", type: "Villa rentals" },
		],
	];

	const supportLinks = [
		{ label: "Help Center", href: "/help" },
		{ label: "Get help with a safety issue", href: "/safety" },
		{ label: "AirCover", href: "/aircover" },
		{ label: "Anti-discrimination", href: "/anti-discrimination" },
		{ label: "Disability support", href: "/disability-support" },
		{ label: "Cancellation options", href: "/cancellation" },
		{ label: "Report neighborhood concern", href: "/report" },
	];

	const hostingLinks = [
		{ label: "Airbnb your home", href: "/listings/new" },
		{ label: "Airbnb your experience", href: "/experiences" },
		{ label: "Airbnb your service", href: "/services" },
		{ label: "AirCover for Hosts", href: "/host-aircover" },
		{ label: "Hosting resources", href: "/hosting-resources" },
		{ label: "Community forum", href: "/community" },
		{ label: "Hosting responsibly", href: "/hosting-responsibly" },
		{ label: "Airbnb-friendly apartments", href: "/airbnb-friendly" },
		{ label: "Join a free Hosting class", href: "/hosting-class" },
		{ label: "Find a co-host", href: "/co-host" },
		{ label: "Refer a host", href: "/refer-host" },
	];

	const companyLinks = [
		{ label: "2025 Summer Release", href: "/summer-release" },
		{ label: "Newsroom", href: "/newsroom" },
		{ label: "Careers", href: "/careers" },
		{ label: "Investors", href: "/investors" },
		{ label: "Gift cards", href: "/gift-cards" },
		{ label: "Airbnb.org emergency stays", href: "/airbnb-org" },
	];

	return (
		<footer
			style={{
				backgroundColor: "#F7F7F7",
				paddingTop: "48px",
				paddingBottom: "24px",
			}}
		>
			<div
				style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: "0 80px",
				}}
				className="footer-container"
			>
				{/* Inspiration Section */}
				<div style={{ marginBottom: "48px" }}>
					<h2
						style={{
							fontSize: "22px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "24px",
						}}
					>
						Inspiration for future getaways
					</h2>

					{/* Category Tabs */}
					<div
						style={{
							display: "flex",
							gap: "32px",
							marginBottom: "24px",
							flexWrap: "wrap",
							borderBottom: "1px solid #DDDDDD",
							paddingBottom: "16px",
						}}
					>
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setSelectedCategory(category)}
								style={{
									backgroundColor: "transparent",
									border: "none",
									fontSize: "14px",
									fontWeight: selectedCategory === category ? "600" : "400",
									color: "#222222",
									cursor: "pointer",
									padding: "0",
									paddingBottom: "8px",
									borderBottom:
										selectedCategory === category
											? "2px solid #222222"
											: "2px solid transparent",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									if (selectedCategory !== category) {
										e.currentTarget.style.opacity = "0.7";
									}
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.opacity = "1";
								}}
							>
								{category}
							</button>
						))}
					</div>

					{/* Destinations Grid */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(6, 1fr)",
							gap: "24px",
							marginBottom: "16px",
						}}
						className="destinations-grid"
					>
						{destinations.map((column, colIndex) => (
							<div key={colIndex}>
								{column.map((destination, index) => (
									<div
										key={index}
										style={{
											marginBottom: "16px",
										}}
									>
										<Link
											href={`/listings?location_value=${encodeURIComponent(
												destination.name
											)}`}
											style={{
												textDecoration: "none",
												color: "#222222",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.textDecoration = "underline";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.textDecoration = "none";
											}}
										>
											<div
												style={{
													fontSize: "14px",
													fontWeight: "600",
													marginBottom: "4px",
												}}
											>
												{destination.name}
											</div>
											<div
												style={{
													fontSize: "14px",
													color: "#717171",
												}}
											>
												{destination.type}
											</div>
										</Link>
									</div>
								))}
							</div>
						))}
					</div>

					{/* Show More Button */}
					<button
						onClick={() => setShowMoreDestinations(!showMoreDestinations)}
						style={{
							backgroundColor: "transparent",
							border: "none",
							fontSize: "14px",
							fontWeight: "600",
							color: "#222222",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "4px",
							padding: "0",
							marginTop: "8px",
						}}
					>
						Show more
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							style={{
								transform: showMoreDestinations
									? "rotate(180deg)"
									: "rotate(0deg)",
								transition: "transform 0.2s ease",
							}}
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</button>
				</div>

				{/* Support, Hosting, Company Links */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "48px",
						marginBottom: "48px",
						paddingTop: "32px",
						borderTop: "1px solid #DDDDDD",
					}}
					className="footer-links-grid"
				>
					{/* Support Column */}
					<div>
						<h3
							style={{
								fontSize: "14px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "16px",
							}}
						>
							Support
						</h3>
						<ul
							style={{
								listStyle: "none",
								padding: 0,
								margin: 0,
							}}
						>
							{supportLinks.map((link, index) => (
								<li
									key={index}
									style={{
										marginBottom: "12px",
									}}
								>
									<Link
										href={link.href}
										style={{
											fontSize: "14px",
											color: "#222222",
											textDecoration: "none",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.textDecoration = "underline";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.textDecoration = "none";
										}}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Hosting Column */}
					<div>
						<h3
							style={{
								fontSize: "14px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "16px",
							}}
						>
							Hosting
						</h3>
						<ul
							style={{
								listStyle: "none",
								padding: 0,
								margin: 0,
							}}
						>
							{hostingLinks.map((link, index) => (
								<li
									key={index}
									style={{
										marginBottom: "12px",
									}}
								>
									<Link
										href={link.href}
										style={{
											fontSize: "14px",
											color: "#222222",
											textDecoration: "none",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.textDecoration = "underline";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.textDecoration = "none";
										}}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company Column */}
					<div>
						<h3
							style={{
								fontSize: "14px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "16px",
							}}
						>
							Airbnb
						</h3>
						<ul
							style={{
								listStyle: "none",
								padding: 0,
								margin: 0,
							}}
						>
							{companyLinks.map((link, index) => (
								<li
									key={index}
									style={{
										marginBottom: "12px",
									}}
								>
									<Link
										href={link.href}
										style={{
											fontSize: "14px",
											color: "#222222",
											textDecoration: "none",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.textDecoration = "underline";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.textDecoration = "none";
										}}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Footer Bar */}
				<div
					style={{
						borderTop: "1px solid #DDDDDD",
						paddingTop: "24px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: "16px",
					}}
				>
					{/* Left Side - Copyright and Legal */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							flexWrap: "wrap",
						}}
					>
						<span
							style={{
								fontSize: "14px",
								color: "#222222",
							}}
						>
							© 2025 Airbnb, Inc.
						</span>
						<Link
							href="/terms-condition"
							style={{
								fontSize: "14px",
								color: "#222222",
								textDecoration: "none",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.textDecoration = "underline";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.textDecoration = "none";
							}}
						>
							Terms
						</Link>
						<Link
							href="/privacy-policy"
							style={{
								fontSize: "14px",
								color: "#222222",
								textDecoration: "none",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.textDecoration = "underline";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.textDecoration = "none";
							}}
						>
							Privacy
						</Link>
						<Link
							href="/privacy-policy"
							style={{
								fontSize: "14px",
								color: "#222222",
								textDecoration: "none",
								display: "flex",
								alignItems: "center",
								gap: "4px",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.textDecoration = "underline";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.textDecoration = "none";
							}}
						>
							Your Privacy Choices
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<path d="M9 9l6 6M15 9l-6 6" />
							</svg>
						</Link>
					</div>

					{/* Right Side - Language, Currency, Social */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							flexWrap: "wrap",
						}}
					>
						<button
							style={{
								backgroundColor: "transparent",
								border: "none",
								fontSize: "14px",
								color: "#222222",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "4px",
								padding: "0",
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
								<circle cx="12" cy="12" r="10" />
								<line x1="2" y1="12" x2="22" y2="12" />
								<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
							</svg>
							English (US)
						</button>
						<span
							style={{
								fontSize: "14px",
								color: "#222222",
							}}
						>
							MAD
						</span>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "16px",
							}}
						>
							<a
								href="https://www.facebook.com/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "#222222",
									textDecoration: "none",
								}}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
								</svg>
							</a>
							<a
								href="https://www.twitter.com/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "#222222",
									textDecoration: "none",
								}}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
								</svg>
							</a>
							<a
								href="https://www.instagram.com/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "#222222",
									textDecoration: "none",
								}}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>

			<style dangerouslySetInnerHTML={{
				__html: `
					@media (max-width: 1200px) {
						.footer-container {
							padding: 0 40px !important;
						}
						.destinations-grid {
							grid-template-columns: repeat(4, 1fr) !important;
						}
						.footer-links-grid {
							grid-template-columns: repeat(2, 1fr) !important;
						}
					}

					@media (max-width: 768px) {
						.footer-container {
							padding: 0 24px !important;
						}
						.destinations-grid {
							grid-template-columns: repeat(2, 1fr) !important;
							gap: 16px !important;
						}
						.footer-links-grid {
							grid-template-columns: 1fr !important;
							gap: 32px !important;
						}
					}

					@media (max-width: 480px) {
						.destinations-grid {
							grid-template-columns: 1fr !important;
						}
					}
				`
			}} />
		</footer>
	);
};

export default Footer;

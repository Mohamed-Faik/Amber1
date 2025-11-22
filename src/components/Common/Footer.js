"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
	const footerRef = useRef(null);
	
	// Prevent duplicate rendering
	useEffect(() => {
		if (footerRef.current) {
			const existingFooters = document.querySelectorAll('footer#main-footer');
			if (existingFooters.length > 1) {
				// Remove duplicate footers, keep only the first one
				for (let i = 1; i < existingFooters.length; i++) {
					existingFooters[i].remove();
				}
			}
		}
	}, []);

	const quickLinks = [
		{ label: "About Us", href: "/about-us" },
		{ label: "Contact", href: "/contact-us" },
		{ label: "Blog", href: "/blog" },
		{ label: "FAQ", href: "/faq" },
	];

	const legalLinks = [
		{ label: "Terms & Conditions", href: "/terms-condition" },
		{ label: "Privacy Policy", href: "/privacy-policy" },
	];

	const listingLinks = [
		{ label: "Browse Listings", href: "/listings" },
		{ label: "Create Listing", href: "/listings/new" },
		{ label: "My Listings", href: "/listings/my-listings" },
	];

	return (
		<footer
			ref={footerRef}
			id="main-footer"
			role="contentinfo"
			aria-label="Site footer"
			style={{
				backgroundColor: "#1a1a1a",
				color: "#ffffff",
				paddingTop: "64px",
				paddingBottom: "32px",
			}}
		>
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
					padding: "0 40px",
				}}
				className="footer-container"
			>
				{/* Main Footer Content */}
				<div
					className="footer-content-grid"
					style={{
						display: "grid",
						gridTemplateColumns: "2fr 1fr 1fr 1fr",
						gap: "48px",
						marginBottom: "48px",
					}}
				>
					{/* Brand Section */}
					<div>
						<Link
							href="/"
							style={{
								display: "inline-block",
								marginBottom: "16px",
								textDecoration: "none",
							}}
						>
							<Image
								src="/images/amberhomes png.png"
								alt="AmberHomes Logo"
								width={180}
								height={50}
								style={{
									height: "auto",
									width: "auto",
									maxHeight: "50px",
									objectFit: "contain",
									filter: "brightness(0) invert(1)", // Makes logo white for dark footer
								}}
							/>
						</Link>
						<p
							style={{
								fontSize: "14px",
								color: "#b0b0b0",
								lineHeight: "1.6",
								marginBottom: "24px",
								maxWidth: "280px",
							}}
						>
							Find your perfect property. Discover amazing places to stay, work, and live.
						</p>
						{/* Social Media */}
						<div
							style={{
								display: "flex",
								gap: "16px",
								alignItems: "center",
							}}
						>
							<a
								href="https://www.facebook.com/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									width: "40px",
									height: "40px",
									borderRadius: "50%",
									backgroundColor: "#2a2a2a",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#ffffff",
									textDecoration: "none",
									transition: "all 0.3s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "#FF385C";
									e.currentTarget.style.transform = "translateY(-2px)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "#2a2a2a";
									e.currentTarget.style.transform = "translateY(0)";
								}}
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
								</svg>
							</a>
							<a
								href="https://www.twitter.com/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									width: "40px",
									height: "40px",
									borderRadius: "50%",
									backgroundColor: "#2a2a2a",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#ffffff",
									textDecoration: "none",
									transition: "all 0.3s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "#FF385C";
									e.currentTarget.style.transform = "translateY(-2px)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "#2a2a2a";
									e.currentTarget.style.transform = "translateY(0)";
								}}
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
									<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
								</svg>
							</a>
							<a
								href="https://www.instagram.com/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									width: "40px",
									height: "40px",
									borderRadius: "50%",
									backgroundColor: "#2a2a2a",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#ffffff",
									textDecoration: "none",
									transition: "all 0.3s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "#FF385C";
									e.currentTarget.style.transform = "translateY(-2px)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "#2a2a2a";
									e.currentTarget.style.transform = "translateY(0)";
								}}
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
								</svg>
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3
							style={{
								fontSize: "16px",
								fontWeight: "600",
								color: "#ffffff",
								marginBottom: "20px",
							}}
						>
							Quick Links
						</h3>
						<ul
							style={{
								listStyle: "none",
								padding: 0,
								margin: 0,
							}}
						>
							{quickLinks.map((link, index) => (
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
											color: "#b0b0b0",
											textDecoration: "none",
											transition: "color 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.color = "#FF385C";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.color = "#b0b0b0";
										}}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Listings */}
					<div>
						<h3
							style={{
								fontSize: "16px",
								fontWeight: "600",
								color: "#ffffff",
								marginBottom: "20px",
							}}
						>
							Listings
						</h3>
						<ul
							style={{
								listStyle: "none",
								padding: 0,
								margin: 0,
							}}
						>
							{listingLinks.map((link, index) => (
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
											color: "#b0b0b0",
											textDecoration: "none",
											transition: "color 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.color = "#FF385C";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.color = "#b0b0b0";
										}}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3
							style={{
								fontSize: "16px",
								fontWeight: "600",
								color: "#ffffff",
								marginBottom: "20px",
							}}
						>
							Legal
						</h3>
						<ul
							style={{
								listStyle: "none",
								padding: 0,
								margin: 0,
							}}
						>
							{legalLinks.map((link, index) => (
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
											color: "#b0b0b0",
											textDecoration: "none",
											transition: "color 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.color = "#FF385C";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.color = "#b0b0b0";
										}}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div
					style={{
						borderTop: "1px solid #333333",
						paddingTop: "32px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: "16px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "24px",
							flexWrap: "wrap",
						}}
					>
						<span
							style={{
								fontSize: "14px",
								color: "#b0b0b0",
							}}
						>
							© {new Date().getFullYear()} AmberHomes. All rights reserved.
						</span>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							fontSize: "14px",
							color: "#b0b0b0",
						}}
					>
						Made with
						<span style={{ color: "#FF385C", margin: "0 4px" }}>❤️</span>
						for property seekers
					</div>
				</div>
			</div>

			<style dangerouslySetInnerHTML={{
				__html: `
					/* Tablet: 768px - 991px */
					@media (max-width: 991px) {
						.footer-container {
							padding: 0 24px !important;
						}
						.footer-content-grid {
							grid-template-columns: repeat(2, 1fr) !important;
							gap: 32px !important;
						}
					}

					/* Mobile: < 768px */
					@media (max-width: 767px) {
						.footer-container {
							padding: 0 16px !important;
						}
						.footer-content-grid {
							grid-template-columns: 1fr !important;
							gap: 32px !important;
						}
						footer[style*="paddingTop: \"64px\""] {
							padding-top: 48px !important;
							padding-bottom: 24px !important;
						}
					}

					/* Small Mobile: < 480px */
					@media (max-width: 480px) {
						.footer-container {
							padding: 0 12px !important;
						}
						footer[style*="paddingTop: \"64px\""] {
							padding-top: 40px !important;
							padding-bottom: 20px !important;
						}
						.footer-content-grid {
							gap: 24px !important;
						}
					}
				`
			}} />
		</footer>
	);
};

export default Footer;

"use client";
import React from "react";
import { LayoutGrid } from "lucide-react";
import Listings from "@/components/Listings/Index";
import SearchForm from "@/components/Listings/SearchForm";
import FilterPanel from "@/components/Listings/FilterPanel";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const HomesPageClient = ({
	listings,
	premiumListings,
	regularListings,
	totalPages,
	startListingNumber,
	endListingNumber,
	totalCount,
	currentUser,
	searchParams
}) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	
	const hasPremiumListings = premiumListings && premiumListings.length > 0;
	const hasRegularListings = regularListings && regularListings.length > 0;

	return (
		<div className="homes-page-container" style={{
			backgroundColor: "#FAFAFA",
			minHeight: "100vh",
			position: "relative",
			overflow: "hidden",
		}}>
			{/* Decorative Background Elements */}
			<div style={{
				position: "absolute",
				top: "-200px",
				right: "-200px",
				width: "600px",
				height: "600px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(255, 56, 92, 0.05) 0%, rgba(230, 30, 77, 0.08) 100%)",
				zIndex: 0,
			}} />
			<div style={{
				position: "absolute",
				bottom: "-250px",
				left: "-250px",
				width: "700px",
				height: "700px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(215, 4, 102, 0.05) 0%, rgba(255, 56, 92, 0.08) 100%)",
				zIndex: 0,
			}} />
			
			<div style={{ height: "80px" }} />
			
		{/* Compact Search Bar Section - Airbnb Style */}
		<div className="homes-search-section" style={{
			position: "relative",
			zIndex: 100,
			marginBottom: "32px",
		}}>
			<div className="homes-search-wrapper" style={{
				maxWidth: "850px",
				margin: "0 auto",
				padding: "0 24px",
			}}>
				<div style={{
					textAlign: "center",
					marginBottom: "24px",
				}}>
					<h1 style={{
						fontSize: "32px",
						fontWeight: "600",
						color: "#222222",
						margin: "0 0 8px 0",
						letterSpacing: "-0.5px",
					}}>
						{getTranslation(displayLanguage, "listings.findYourPerfectHome")}
					</h1>
					<p style={{
						fontSize: "16px",
						color: "#717171",
						margin: "0",
					}}>
						{getTranslation(displayLanguage, "listings.searchAndExploreProperties")}
					</p>
				</div>
				<SearchForm searchParams={searchParams} featureType="HOMES" />
			</div>
		</div>
		
	{/* Mobile Styles */}
	<style jsx global>{`
		@keyframes pulse {
			0%, 100% {
				opacity: 1;
				transform: scale(1);
			}
			50% {
				opacity: 0.5;
				transform: scale(0.8);
			}
		}

		/* Desktop - Filter on Right */
		.sticky-filter-wrapper {
			margin-left: auto;
			flex-shrink: 0;
			position: relative;
			z-index: 1;
		}

		@media (max-width: 768px) {
			/* Search Section */
			.homes-search-section {
				z-index: 1 !important;
			}
			
			.homes-search-wrapper,
			.homes-search-section form,
			.homes-search-section > div {
				position: static !important;
				top: auto !important;
				position: relative !important;
				z-index: 1 !important;
			}
			
			/* Lower search section when filter is open */
			body:has(.filter-backdrop) .homes-search-section,
			.filter-backdrop ~ * .homes-search-section {
				z-index: 1 !important;
			}

			.homes-results-section {
				position: static !important;
				z-index: auto !important;
			}

			/* Results Wrapper - Better Mobile Spacing */
			.homes-results-wrapper {
				padding: 0 16px !important;
			}

			/* Listings Grid - Bigger Cards on Mobile */
			.homes-results-section .row {
				margin: 0 -8px !important;
			}

			.homes-results-section .col-lg-4,
			.homes-results-section .col-md-6 {
				padding: 0 8px !important;
				margin-bottom: 24px !important;
			}

			/* Listing Cards - Enhanced Mobile View */
			.homes-results-section .col-lg-4 > div,
			.homes-results-section .col-md-6 > div {
				border-radius: 16px !important;
				box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
			}

			/* Profile Images - Keep Circular */
			.homes-results-section img[style*="border-radius: 50%"] {
				border-radius: 50% !important;
			}

			.homes-results-section div[style*="border-radius: 50%"] {
				border-radius: 50% !important;
			}

			/* Header Section - Better Mobile Layout */
			.homes-page-container h2 {
				font-size: 22px !important;
			}

			.homes-page-container h3 {
				font-size: 20px !important;
			}

			/* Icon Container - Slightly Smaller on Mobile */
			.homes-page-container > div > div > div > div:first-child {
				width: 38px !important;
				height: 38px !important;
			}

			/* Section Titles - Better Spacing */
			.section-title {
				padding: 0 8px !important;
				margin-bottom: 20px !important;
				font-size: 20px !important;
			}

			.section-title span:first-child {
				font-size: 20px !important;
			}

			/* Divider - Better Mobile Appearance */
			.homes-results-section > div > div > div[style*="margin: 60px 0"] {
				margin: 40px 0 !important;
			}

			.homes-results-section > div > div > div[style*="margin: 60px 0"] > div:last-child {
				padding: 10px 24px !important;
				font-size: 13px !important;
			}

			/* Filter Panel - Enhanced Mobile */
			.sticky-filter-wrapper > div > button {
				padding: 10px 16px !important;
				font-size: 14px !important;
				min-height: 44px !important;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
				background: white !important;
				border-radius: 12px !important;
			}

			/* Header Row - Force Filter to Far Right */
			.homes-header {
				gap: 8px !important;
				padding-bottom: 20px !important;
				margin-bottom: 28px !important;
				align-items: flex-start !important;
				flex-wrap: nowrap !important;
				justify-content: space-between !important;
				background-color: #FFFFFF !important;
				padding-top: 8px !important;
			}

			.homes-header > div:first-child {
				flex: 0 1 auto !important;
				max-width: calc(100% - 120px) !important;
				gap: 10px !important;
			}

			.homes-header h2 {
				font-size: 18px !important;
				line-height: 1.3 !important;
			}

			/* Sticky Filter Button - Far Right on Mobile */
			.sticky-filter-wrapper {
				position: sticky !important;
				top: 70px !important;
				z-index: 10 !important;
				align-self: flex-start !important;
				margin-left: auto !important;
				flex-shrink: 0 !important;
				background-color: #FFFFFF !important;
				padding: 8px 8px 8px 16px !important;
				border-radius: 12px !important;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
			}
			
			/* Make header background white when sticky */
			.homes-header {
				background-color: #FFFFFF !important;
				position: relative !important;
			}
			
			.homes-results-section {
				z-index: 0 !important;
			}

			/* Keep profile images as designed */

			/* Price Text - More Prominent on Mobile */
			.homes-results-section span[style*="fontSize"][style*="24px"] {
				font-size: 26px !important;
			}

			/* Category/Location Text - Better Readability */
			.homes-results-section div[style*="fontSize: 14px"] {
				font-size: 15px !important;
				line-height: 1.5 !important;
			}

			/* Premium Badge - Slightly Larger on Mobile */
			.homes-results-section span[style*="backgroundColor: #FFF4E6"] {
				padding: 6px 12px !important;
				font-size: 13px !important;
			}

			/* Container Padding */
			.container {
				padding: 0 !important;
			}

			/* Smooth Transitions */
			.homes-results-section * {
				transition: all 0.2s ease !important;
			}
		}

		/* Extra Small Devices - Portrait Phones */
		@media (max-width: 480px) {
			/* Even Better Mobile Experience */
			.homes-results-wrapper {
				padding: 0 12px !important;
			}

			.homes-results-section .row {
				margin: 0 -6px !important;
			}

			.homes-results-section .col-lg-4,
			.homes-results-section .col-md-6 {
				padding: 0 6px !important;
				margin-bottom: 20px !important;
			}

			/* Listing Cards - Full Width on Small Phones */
			.homes-results-section .col-lg-4 > div,
			.homes-results-section .col-md-6 > div {
				border-radius: 20px !important;
				overflow: hidden !important;
			}

			/* Card Content - Better Padding */
			.homes-results-section .col-lg-4 > div > div,
			.homes-results-section .col-md-6 > div > div {
				padding: 16px !important;
			}

			/* Header - Even Smaller on Tiny Screens */
			.homes-header h2 {
				font-size: 18px !important;
			}

			.homes-header > div:first-child {
				padding-top: 2px !important;
			}

			.homes-header > div:first-child > div:first-child {
				width: 36px !important;
				height: 36px !important;
			}

			/* Sticky Filter - Far Right on Small Screens */
			.sticky-filter-wrapper {
				top: 60px !important;
				margin-left: auto !important;
				flex-shrink: 0 !important;
			}

			/* Header - Force Filter to Far Right on Small Phones */
			.homes-header {
				flex-wrap: nowrap !important;
				justify-content: space-between !important;
				gap: 8px !important;
			}

			.homes-header > div:first-child {
				max-width: calc(100% - 100px) !important;
			}

			/* Section Titles */
			.section-title {
				font-size: 18px !important;
				padding: 0 6px !important;
			}

			.section-title span:first-child {
				font-size: 18px !important;
			}

			/* Divider - Compact on Small Screens */
			.homes-results-section > div > div > div[style*="margin: 60px 0"] {
				margin: 32px 0 !important;
			}

			.homes-results-section > div > div > div[style*="margin: 60px 0"] > div:last-child {
				padding: 8px 20px !important;
				font-size: 12px !important;
			}

			.homes-results-section > div > div > div[style*="margin: 60px 0"] > div:last-child > div {
				width: 6px !important;
				height: 6px !important;
			}

			/* Filter Button - Stay on Right on Small Phones */
			.homes-header > div:last-child {
				flex-shrink: 0 !important;
				margin-left: auto !important;
			}
		}
	`}</style>

		{/* Listings Section */}
		<div className="homes-results-section" style={{
			position: "relative",
			zIndex: 0,
			paddingBottom: "48px",
		}}>
				<div className="homes-results-wrapper" style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: "0 10px",
				}}>
					<div className="homes-results-card" style={{
						backgroundColor: "#FFFFFF",
						borderRadius: "16px",
						padding: "40px",
						boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
						border: "1px solid #E0E0E0",
					}}>
			{/* Header */}
			<div className="homes-header" style={{
				display: "flex",
				alignItems: "flex-start",
				justifyContent: "space-between",
				gap: "16px",
				marginBottom: "32px",
				paddingBottom: "24px",
				borderBottom: "1px solid #E0E0E0",
				flexWrap: "wrap",
			}}>
				<div style={{ 
					display: "flex", 
					alignItems: "center", 
					gap: "16px",
					flex: "1 1 auto",
					minWidth: "200px",
					paddingTop: "4px"
				}}>
						<div style={{
							width: "44px",
							height: "44px",
							borderRadius: "12px",
							background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0
						}}>
							<LayoutGrid size={22} color="#FFFFFF" strokeWidth={2.5} />
						</div>
						<h2 style={{
							fontSize: "28px",
							fontWeight: "700",
							color: "#222222",
							margin: "0",
							letterSpacing: "-0.5px",
							lineHeight: "1.2"
						}}>
							{getTranslation(displayLanguage, "listings.availableHomes")}
						</h2>
					</div>
				<div className="sticky-filter-wrapper">
					<FilterPanel featureType="HOMES" />
				</div>
				</div>

					{/* Premium Listings Section */}
					{hasPremiumListings && (
						<>
						<div style={{
							marginBottom: "32px",
							paddingBottom: "16px",
							borderBottom: "2px solid #FF385C20"
						}}>
							<h3 className="section-title" style={{
								fontSize: "24px",
								fontWeight: "700",
								color: "#FF385C",
								margin: "0 0 24px 0",
								letterSpacing: "-0.3px",
								display: "flex",
								alignItems: "center",
								gap: "10px",
								flexWrap: "wrap",
								lineHeight: "1.3"
							}}>
								<span style={{ fontSize: "24px" }}>⭐</span>
								<span>{getTranslation(displayLanguage, "listings.premiumProperties")}</span>
							</h3>
								<Listings
									currentUser={currentUser}
									totalPages={1}
									listings={premiumListings}
									searchParams={searchParams}
									totalCount={premiumListings.length}
									startListingNumber={1}
									endListingNumber={premiumListings.length}
								/>
							</div>

							{/* Elegant Divider */}
							{hasRegularListings && (
								<div style={{ 
									margin: "60px 0", 
									position: "relative",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}>
									{/* Gradient Line */}
									<div style={{
										position: "absolute",
										width: "100%",
										height: "2px",
										background: "linear-gradient(to right, transparent 0%, #E0E0E0 20%, #FF385C 50%, #E0E0E0 80%, transparent 100%)",
										opacity: 0.6
									}} />
									
									{/* Center Decoration */}
									<div style={{
										position: "relative",
										backgroundColor: "#FFFFFF",
										padding: "12px 32px",
										borderRadius: "40px",
										border: "2px solid #FF385C",
										boxShadow: "0 4px 12px rgba(255, 56, 92, 0.15)",
										display: "flex",
										alignItems: "center",
										gap: "12px"
									}}>
										<div style={{
											width: "8px",
											height: "8px",
											borderRadius: "50%",
											backgroundColor: "#FF385C",
											animation: "pulse 2s infinite"
										}} />
										<span style={{
											fontSize: "14px",
											fontWeight: "600",
											color: "#FF385C",
											letterSpacing: "1px",
											textTransform: "uppercase"
										}}>
											{getTranslation(displayLanguage, "listings.exploreMore")}
										</span>
										<div style={{
											width: "8px",
											height: "8px",
											borderRadius: "50%",
											backgroundColor: "#FF385C",
											animation: "pulse 2s infinite 1s"
										}} />
									</div>
								</div>
							)}
						</>
					)}

					{/* Regular Listings Section */}
					{hasRegularListings && (
						<div>
							<h3 className="section-title" style={{
								fontSize: "24px",
								fontWeight: "700",
								color: "#222222",
								margin: "0 0 24px 0",
								letterSpacing: "-0.3px",
								lineHeight: "1.3"
							}}>
								{hasPremiumListings ? getTranslation(displayLanguage, "listings.allProperties") : getTranslation(displayLanguage, "listings.availableHomes")}
							</h3>
							<Listings
								currentUser={currentUser}
								totalPages={totalPages}
								listings={hasRegularListings ? regularListings : listings}
								searchParams={searchParams}
								totalCount={totalCount}
								startListingNumber={startListingNumber}
								endListingNumber={endListingNumber}
							/>
						</div>
					)}

					{/* If no premium and using default listings */}
					{!hasPremiumListings && !hasRegularListings && (
						<Listings
							currentUser={currentUser}
							totalPages={totalPages}
							listings={listings}
							searchParams={searchParams}
							totalCount={totalCount}
							startListingNumber={startListingNumber}
							endListingNumber={endListingNumber}
						/>
					)}
				</div>
				</div>
			</div>
		</div>
	);
};

export default HomesPageClient;


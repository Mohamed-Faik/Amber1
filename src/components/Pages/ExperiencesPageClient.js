"use client";
import React from "react";
import { LayoutGrid } from "lucide-react";
import Listings from "@/components/Listings/Index";
import SearchForm from "@/components/Listings/SearchForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const ExperiencesPageClient = ({
	listings,
	totalPages,
	startListingNumber,
	endListingNumber,
	totalCount,
	currentUser,
	searchParams
}) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;

	return (
		<div className="experiences-page-container" style={{
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
		<div className="experiences-search-section" style={{
			position: "relative",
			zIndex: 100,
			marginBottom: "32px",
		}}>
			<div className="experiences-search-wrapper" style={{
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
						{getTranslation(displayLanguage, "listings.discoverAmazingExperiences")}
					</h1>
					<p style={{
						fontSize: "16px",
						color: "#717171",
						margin: "0",
					}}>
						{getTranslation(displayLanguage, "listings.findUniqueActivities")}
					</p>
				</div>
				<SearchForm searchParams={searchParams} featureType="EXPERIENCES" />
			</div>
		</div>
		
		{/* Mobile Styles */}
		<style jsx global>{`
			@media (max-width: 768px) {
				.experiences-search-section {
					z-index: 1 !important;
				}
				
				.experiences-search-wrapper,
				.experiences-search-section form,
				.experiences-search-section > div {
					position: static !important;
					top: auto !important;
					position: relative !important;
					z-index: 1 !important;
				}
				
				/* Lower search section when filter is open */
				body:has(.filter-backdrop) .experiences-search-section,
				.filter-backdrop ~ * .experiences-search-section {
					z-index: 1 !important;
				}

				.experiences-results-section {
					position: static !important;
					z-index: auto !important;
				}

				.experiences-results-wrapper {
					padding: 0 16px !important;
				}

				/* Header Row - Force Filter to Far Right */
				.experiences-header {
					gap: 8px !important;
					padding-bottom: 20px !important;
					margin-bottom: 28px !important;
					align-items: flex-start !important;
					flex-wrap: nowrap !important;
					justify-content: space-between !important;
					background-color: #FFFFFF !important;
					padding-top: 8px !important;
				}

				.experiences-header > div:first-child {
					flex: 0 1 auto !important;
					max-width: calc(100% - 120px) !important;
					gap: 10px !important;
				}

				.experiences-header h2 {
					font-size: 18px !important;
					line-height: 1.3 !important;
				}

				/* Sticky Filter Button - Responsive on Mobile */
				.experiences-page-container .sticky-filter-wrapper {
					position: sticky !important;
					top: 70px !important;
					z-index: 10 !important;
					align-self: flex-start !important;
					margin-left: auto !important;
					flex-shrink: 0 !important;
					background-color: #FFFFFF !important;
					padding: 8px !important;
					border-radius: 12px !important;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
				}
				
				/* Make header background white when sticky */
				.experiences-page-container .experiences-header {
					background-color: #FFFFFF !important;
					position: relative !important;
				}
				
				.experiences-results-section {
					z-index: 0 !important;
				}
			}

			@media (max-width: 480px) {
				.experiences-header h2 {
					font-size: 18px !important;
				}

				.experiences-header > div:first-child {
					max-width: calc(100% - 100px) !important;
				}

				.experiences-page-container .sticky-filter-wrapper {
					top: 60px !important;
				}
			}
		`}</style>

			{/* Listings Section */}
			<div className="experiences-results-section" style={{
				position: "relative",
				zIndex: 0,
				paddingBottom: "48px",
			}}>
				<div className="experiences-results-wrapper" style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: "0 10px",
				}}>
					<div className="experiences-results-card" style={{
						backgroundColor: "#FFFFFF",
						borderRadius: "16px",
						padding: "40px",
						boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
						border: "1px solid #E0E0E0",
					}}>
						{/* Header */}
						<div className="experiences-header" style={{
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
									{getTranslation(displayLanguage, "listings.availableExperiences")}
								</h2>
							</div>
						</div>

						<Listings
							currentUser={currentUser}
							totalPages={totalPages}
							listings={listings}
							searchParams={searchParams}
							totalCount={totalCount}
							startListingNumber={startListingNumber}
							endListingNumber={endListingNumber}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExperiencesPageClient;


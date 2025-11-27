"use client";
import React from "react";
import DetailsHead from "./DetailsHead";
import RightSidebar from "./RightSidebar";
import dynamic from "next/dynamic";
const MapWithNoSSR = dynamic(() => import("../Map"), {
	ssr: false,
});
import Features from "./Features";
import DetailsImages from "./DetailsImages";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";

const Index = ({ currentUser, listing, reviews }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	
	// Translate listing title and description
	const { translatedContent: translatedTitle } = useTranslatedContent(listing.title, displayLanguage, false);
	const { translatedContent: translatedDescription } = useTranslatedContent(listing.description, displayLanguage, true);
	return (
		<div
			style={{
				backgroundColor: "#ffffff",
				minHeight: "100vh",
				paddingTop: "24px",
				paddingBottom: "80px",
			}}
		>
			<div
				style={{
					maxWidth: "1120px",
					margin: "0 auto",
					padding: "0 40px",
				}}
				className="listing-container"
			>
			{/* Header Section */}
			<DetailsHead
				{...listing}
				title={translatedTitle}
				currentUser={currentUser}
				listingId={listing.id}
			/>

				{/* Image Gallery */}
				<DetailsImages imageSrc={listing.imageSrc} />

				{/* Mobile Booking Box - Shows only on mobile, after images */}
			<div className="mobile-booking-box" style={{ display: "none" }}>
				<RightSidebar listing={{...listing, title: translatedTitle}} user={listing.user} currentUser={currentUser} displayLanguage={displayLanguage} />
			</div>

				{/* Main Content Layout */}
				<div
					className="listing-content-grid"
					style={{
						display: "grid",
						gridTemplateColumns: "minmax(0, 1fr) 400px",
						gap: "80px",
						marginTop: "48px",
					}}
				>
					{/* Left Column - Main Content */}
					<div>
						{/* Description */}
						<div
							style={{
								marginBottom: "48px",
								paddingBottom: "48px",
								borderBottom: "1px solid #ebebeb",
							}}
						>
					<h2
						style={{
							fontSize: "22px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "24px",
						}}
					>
						{getTranslation(displayLanguage, "listings.aboutThisPlace")}
					</h2>
					<div
						dangerouslySetInnerHTML={{
							__html: translatedDescription,
						}}
						style={{
							fontSize: "16px",
							lineHeight: "1.6",
							color: "#222222",
						}}
					/>
						</div>

						{/* Features */}
						<div
							style={{
								marginBottom: "48px",
								paddingBottom: "48px",
								borderBottom: "1px solid #ebebeb",
							}}
						>
							<Features {...listing} displayLanguage={displayLanguage} />
						</div>

						{/* Map */}
						{listing && (
							<div
								style={{
									marginBottom: "48px",
									paddingBottom: "48px",
									borderBottom: "1px solid #ebebeb",
								}}
							>
							<h2
								style={{
									fontSize: "22px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "24px",
								}}
							>
								{getTranslation(displayLanguage, "listings.whereYoullBe")}
							</h2>
								<div
									style={{
										borderRadius: "12px",
										overflow: "hidden",
										height: "400px",
									}}
								>
									<MapWithNoSSR
										latitude={listing.latitude}
										longitude={listing.longitude}
									/>
								</div>
								<p
									style={{
										marginTop: "16px",
										fontSize: "14px",
										color: "#222222",
										fontWeight: "500",
									}}
								>
									{listing.address}
								</p>
							</div>
						)}
					</div>

					{/* Right Column - Sticky Sidebar (Desktop only) */}
			<div className="desktop-booking-box">
				<RightSidebar listing={{...listing, title: translatedTitle}} user={listing.user} currentUser={currentUser} displayLanguage={displayLanguage} />
			</div>
				</div>
			</div>

			<style jsx>{`
				/* Mobile: Show mobile booking box, hide desktop sidebar */
				@media (max-width: 767px) {
					.mobile-booking-box {
						display: block !important;
						margin-top: 32px;
						margin-bottom: 32px;
					}
					.desktop-booking-box {
						display: none !important;
					}
					.listing-content-grid {
						grid-template-columns: 1fr !important;
						gap: 32px !important;
					}
				}

				/* Desktop: Hide mobile booking box, show desktop sidebar */
				@media (min-width: 768px) {
					.mobile-booking-box {
						display: none !important;
					}
					.desktop-booking-box {
						display: block !important;
					}
				}
			`}</style>
		</div>
	);
};

export default Index;

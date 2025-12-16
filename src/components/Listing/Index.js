"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
const MapWithNoSSR = dynamic(() => import("../Map"), {
	ssr: false,
});
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import { getTranslation } from "@/utils/translations";
import { formattedPrice } from "@/utils/formattedPrice";
import { getAllListingImages, getListingImage } from "@/utils/getListingImage";
import { Phone, MessageCircle, Heart, Share2, MapPin, Home, Bed, Bath, Square, ChevronRight } from "lucide-react";
import SimilarListings from "./SimilarListings";
import GeneralInformation from "./GeneralInformation";
import HeartButton from "../HeartButton";

const Index = ({ currentUser, listing, reviews }) => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;

	const { translatedContent: translatedTitle } = useTranslatedContent(listing.title, displayLanguage, false);
	const { translatedContent: translatedDescription } = useTranslatedContent(listing.description, displayLanguage, true);

	const [images, setImages] = useState([]);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showImageModal, setShowImageModal] = useState(false);

	const phoneNumber = "+212638204811";
	const whatsappNumber = "212638204811";

	useEffect(() => {
		const allImages = getAllListingImages(listing.imageSrc);
		setImages(allImages);
	}, [listing.imageSrc]);

	const calculateMonthlyPayment = (price) => {
		const interestRate = 0.05;
		const years = 20;
		const monthlyRate = interestRate / 12;
		const numPayments = years * 12;
		const monthlyPayment = (price * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
		return Math.round(monthlyPayment);
	};

	const monthlyPayment = calculateMonthlyPayment(listing.price);

	const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
		`${getTranslation(displayLanguage, "listings.interestedMessage")}\n\n${getTranslation(displayLanguage, "listings.propertyLabel")} ${translatedTitle}\n${getTranslation(displayLanguage, "listings.location")}: ${listing.location_value}\n${getTranslation(displayLanguage, "listings.price")}: ${formattedPrice(listing.price, displayLanguage)}`
	)}`;

	const locationParts = listing.location_value?.split(",") || [];
	const city = locationParts[locationParts.length - 1]?.trim() || listing.location_value;
	const neighborhood = locationParts.length > 1 ? locationParts[0]?.trim() : "";
	const referenceNumber = `C${String(listing.id).padStart(7, "0")}`;

	return (
		<div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
			{/* Hero Image Section */}
			<div style={{ maxWidth: "1200px", margin: "80px auto 0", padding: "0 24px" }}>
				<div
					className="hero-image-container"
					style={{
						position: "relative",
						width: "100%",
						height: "70vh",
						minHeight: "500px",
						maxHeight: "800px",
						borderRadius: "24px",
						overflow: "hidden",
						boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)",
					}}
				>
					{images.length > 0 && (
						<>
							<Image
								src={images[currentImageIndex]}
								alt={translatedTitle}
								fill
								style={{ objectFit: "cover" }}
								unoptimized
								priority
							/>

							{/* Image Navigation */}
							{images.length > 1 && (
								<>
									<button
										onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
										style={{
											position: "absolute",
											left: "24px",
											top: "50%",
											transform: "translateY(-50%)",
											width: "48px",
											height: "48px",
											borderRadius: "50%",
											backgroundColor: "rgba(255, 255, 255, 0.9)",
											border: "none",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#FFFFFF";
											e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
											e.currentTarget.style.transform = "translateY(-50%)";
										}}
									>
										<ChevronRight size={24} style={{ transform: "rotate(180deg)", color: "#222222" }} />
									</button>
									<button
										onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
										style={{
											position: "absolute",
											right: "24px",
											top: "50%",
											transform: "translateY(-50%)",
											width: "48px",
											height: "48px",
											borderRadius: "50%",
											backgroundColor: "rgba(255, 255, 255, 0.9)",
											border: "none",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#FFFFFF";
											e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
											e.currentTarget.style.transform = "translateY(-50%)";
										}}
									>
										<ChevronRight size={24} style={{ color: "#222222" }} />
									</button>
								</>
							)}

							{/* Image Thumbnails */}
							{images.length > 1 && (
								<div
									style={{
										position: "absolute",
										bottom: "24px",
										left: "50%",
										transform: "translateX(-50%)",
										display: "flex",
										gap: "8px",
										backgroundColor: "rgba(0, 0, 0, 0.5)",
										padding: "8px 16px",
										borderRadius: "24px",
										backdropFilter: "blur(10px)",
									}}
								>
									{images.slice(0, 5).map((img, index) => (
										<button
											key={index}
											onClick={() => setCurrentImageIndex(index)}
											style={{
												width: "60px",
												height: "60px",
												borderRadius: "8px",
												overflow: "hidden",
												border: currentImageIndex === index ? "3px solid #FFFFFF" : "3px solid transparent",
												cursor: "pointer",
												opacity: currentImageIndex === index ? 1 : 0.7,
												transition: "all 0.2s ease",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.opacity = "1";
											}}
											onMouseLeave={(e) => {
												if (currentImageIndex !== index) {
													e.currentTarget.style.opacity = "0.7";
												}
											}}
										>
											<Image
												src={img}
												alt={`Thumbnail ${index + 1}`}
												width={60}
												height={60}
												style={{ objectFit: "cover", width: "100%", height: "100%" }}
												unoptimized
											/>
										</button>
									))}
									{images.length > 5 && (
										<button
											onClick={() => setShowImageModal(true)}
											style={{
												width: "60px",
												height: "60px",
												borderRadius: "8px",
												backgroundColor: "rgba(255, 255, 255, 0.2)",
												border: "2px solid rgba(255, 255, 255, 0.5)",
												color: "#FFFFFF",
												fontSize: "14px",
												fontWeight: "600",
												cursor: "pointer",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												transition: "all 0.2s ease",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
											}}
										>
											+{images.length - 5}
										</button>
									)}
								</div>
							)}
						</>
					)}

					{/* Gradient Overlay */}
					<div
						style={{
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0,
							height: "200px",
							background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
						}}
					/>
				</div>
			</div>

			{/* Main Content */}
			<div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
				{/* Title and Header Info */}
				<div style={{ marginBottom: "32px" }}>
					<div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
						<div style={{ flex: 1, minWidth: "300px" }}>
							<h1
								className="listing-title"
								style={{
									fontSize: "32px",
									fontWeight: "700",
									color: "#222222",
									lineHeight: "1.2",
									margin: 0,
									marginBottom: "12px",
								}}
							>
								{translatedTitle}
							</h1>
							<div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", flexWrap: "nowrap" }}>
								<div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#717171", fontSize: "14px", whiteSpace: "nowrap" }}>
									<MapPin size={16} />
									<span>{listing.location_value}</span>
								</div>
								<span style={{ color: "#E0E0E0", flexShrink: 0 }}>·</span>
								<span style={{ color: "#717171", fontSize: "14px", whiteSpace: "nowrap" }}>
									{getTranslation(displayLanguage, "listings.reference")}: <strong style={{ color: "#222222" }}>{referenceNumber}</strong>
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
							<HeartButton currentUser={currentUser} listingId={listing.id} />
							<button
								onClick={() => {
									if (navigator.share) {
										navigator.share({
											title: translatedTitle,
											text: listing.description?.substring(0, 100),
											url: window.location.href,
										});
									}
								}}
								style={{
									width: "48px",
									height: "48px",
									borderRadius: "50%",
									border: "1px solid #E0E0E0",
									backgroundColor: "#FFFFFF",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = "#FF385C";
									e.currentTarget.style.backgroundColor = "#FFF5F7";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = "#E0E0E0";
									e.currentTarget.style.backgroundColor = "#FFFFFF";
								}}
							>
								<Share2 size={20} style={{ color: "#222222" }} />
							</button>
						</div>
					</div>

					{/* Key Stats */}
					<div
						style={{
							display: "flex",
							gap: "32px",
							padding: "24px",
							backgroundColor: "#FAFAFA",
							borderRadius: "12px",
							flexWrap: "wrap",
						}}
					>
						{listing.area && (
							<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
								<div
									style={{
										width: "48px",
										height: "48px",
										borderRadius: "12px",
										backgroundColor: "#FFF5F7",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Square size={24} style={{ color: "#FF385C" }} />
								</div>
								<div>
									<div style={{ fontSize: "20px", fontWeight: "700", color: "#222222" }}>
										{listing.area} m²
									</div>
									<div style={{ fontSize: "14px", color: "#717171" }}>{getTranslation(displayLanguage, "listings.area")}</div>
								</div>
							</div>
						)}
						{listing.bedrooms && (
							<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
								<div
									style={{
										width: "48px",
										height: "48px",
										borderRadius: "12px",
										backgroundColor: "#FFF5F7",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Bed size={24} style={{ color: "#FF385C" }} />
								</div>
								<div>
									<div style={{ fontSize: "20px", fontWeight: "700", color: "#222222" }}>
										{listing.bedrooms}
									</div>
									<div style={{ fontSize: "14px", color: "#717171" }}>
										{listing.bedrooms > 1 ? getTranslation(displayLanguage, "listings.bedrooms") : getTranslation(displayLanguage, "listings.bedroom")}
									</div>
								</div>
							</div>
						)}
						{listing.bathrooms && (
							<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
								<div
									style={{
										width: "48px",
										height: "48px",
										borderRadius: "12px",
										backgroundColor: "#FFF5F7",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Bath size={24} style={{ color: "#FF385C" }} />
								</div>
								<div>
									<div style={{ fontSize: "20px", fontWeight: "700", color: "#222222" }}>
										{listing.bathrooms}
									</div>
									<div style={{ fontSize: "14px", color: "#717171" }}>
										{listing.bathrooms > 1 ? getTranslation(displayLanguage, "listings.bathrooms") : getTranslation(displayLanguage, "listings.bathroom")}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Main Content Grid */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 400px",
						gap: "48px",
						marginBottom: "48px",
					}}
				>
					{/* Left Column - Main Content */}
					<div>
						{/* Price Section */}
						<div
							style={{
								padding: "32px",
								backgroundColor: "#FAFAFA",
								borderRadius: "16px",
								marginBottom: "32px",
							}}
						>
							<div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "12px" }}>
								<div style={{ fontSize: "48px", fontWeight: "700", color: "#222222" }}>
									{formattedPrice(listing.price, displayLanguage)}
								</div>
							</div>

						</div>

						{/* Description */}
						{translatedDescription && (
							<div style={{ marginBottom: "48px" }}>
								<h2
									style={{
										fontSize: "24px",
										fontWeight: "700",
										color: "#222222",
										marginBottom: "16px",
									}}
								>
									{getTranslation(displayLanguage, "listings.aboutThisProperty")}
								</h2>
								<div
									dangerouslySetInnerHTML={{ __html: translatedDescription }}
									style={{
										fontSize: "16px",
										lineHeight: "1.8",
										color: "#222222",
									}}
								/>
							</div>
						)}

						{/* General Information */}
						<GeneralInformation listing={listing} displayLanguage={displayLanguage} />

						{/* Address and Map */}
						<div style={{ marginBottom: "48px" }}>
							<h2
								style={{
									fontSize: "24px",
									fontWeight: "700",
									color: "#222222",
									marginBottom: "24px",
								}}
							>
								{getTranslation(displayLanguage, "listings.location")}
							</h2>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 2fr",
									gap: "24px",
									marginBottom: "24px",
								}}
							>
								<div>
									<div style={{ marginBottom: "20px" }}>
										<div style={{ fontSize: "12px", color: "#717171", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
											{getTranslation(displayLanguage, "listings.city")}
										</div>
										<div style={{ fontSize: "18px", fontWeight: "600", color: "#222222" }}>
											{city}
										</div>
									</div>
									<div>
										<div style={{ fontSize: "12px", color: "#717171", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
											{getTranslation(displayLanguage, "listings.neighborhood")}
										</div>
										<div style={{ fontSize: "18px", fontWeight: "600", color: "#222222" }}>
											{neighborhood || city}
										</div>
									</div>
								</div>
								<div
									style={{
										borderRadius: "16px",
										overflow: "hidden",
										height: "300px",
										boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
									}}
								>
									<MapWithNoSSR
										latitude={listing.latitude}
										longitude={listing.longitude}
									/>
								</div>
							</div>
						</div>

						{/* Similar Properties */}
						<SimilarListings
							currentListingId={listing.id}
							category={listing.category}
							location_value={listing.location_value}
							displayLanguage={displayLanguage}
							currentUser={currentUser}
						/>
					</div>

					{/* Right Column - Sticky Sidebar */}
					<div style={{ position: "sticky", top: "100px", height: "fit-content" }}>
						<div
							style={{
								border: "1px solid #E0E0E0",
								borderRadius: "16px",
								padding: "32px",
								backgroundColor: "#FFFFFF",
								boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
							}}
						>
							<div style={{ marginBottom: "24px" }}>
								<div style={{ fontSize: "36px", fontWeight: "700", color: "#222222", marginBottom: "8px" }}>
									{formattedPrice(listing.price, displayLanguage)}
								</div>

							</div>

							<div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
								<a
									href={whatsappLink}
									target="_blank"
									rel="noopener noreferrer"
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										gap: "8px",
										padding: "16px 24px",
										backgroundColor: "#25D366",
										color: "#FFFFFF",
										borderRadius: "12px",
										textDecoration: "none",
										fontSize: "16px",
										fontWeight: "600",
										transition: "all 0.2s ease",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = "#20BA5A";
										e.currentTarget.style.transform = "translateY(-2px)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = "#25D366";
										e.currentTarget.style.transform = "translateY(0)";
									}}
								>
									<MessageCircle size={20} />
									{getTranslation(displayLanguage, "listings.contactViaWhatsApp")}
								</a>
								<a
									href={`tel:${phoneNumber}`}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										gap: "8px",
										padding: "16px 24px",
										backgroundColor: "#FFFFFF",
										color: "#222222",
										border: "2px solid #E0E0E0",
										borderRadius: "12px",
										textDecoration: "none",
										fontSize: "16px",
										fontWeight: "600",
										transition: "all 0.2s ease",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = "#FF385C";
										e.currentTarget.style.backgroundColor = "#FFF5F7";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = "#E0E0E0";
										e.currentTarget.style.backgroundColor = "#FFFFFF";
									}}
								>
									<Phone size={20} />
									{getTranslation(displayLanguage, "listings.call")}
								</a>
							</div>

							<div
								style={{
									paddingTop: "24px",
									borderTop: "1px solid #E0E0E0",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
									<span style={{ fontSize: "14px", color: "#717171" }}>{getTranslation(displayLanguage, "listings.type")}</span>
									<span style={{ fontSize: "14px", fontWeight: "600", color: "#222222" }}>
										{listing.category}
									</span>
								</div>
								<div style={{ display: "flex", justifyContent: "space-between" }}>
									<span style={{ fontSize: "14px", color: "#717171" }}>{getTranslation(displayLanguage, "listings.location")}</span>
									<span style={{ fontSize: "14px", fontWeight: "600", color: "#222222" }}>
										{listing.location_value}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Image Modal */}
			{showImageModal && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						backgroundColor: "rgba(0, 0, 0, 0.95)",
						zIndex: 9999,
						display: "flex",
						flexDirection: "column",
						padding: "24px",
					}}
					onClick={() => setShowImageModal(false)}
				>
					<button
						onClick={() => setShowImageModal(false)}
						style={{
							position: "absolute",
							top: "24px",
							right: "24px",
							width: "48px",
							height: "48px",
							borderRadius: "50%",
							backgroundColor: "rgba(255, 255, 255, 0.2)",
							border: "none",
							cursor: "pointer",
							fontSize: "24px",
							color: "#FFFFFF",
							zIndex: 10000,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						×
					</button>
					<div
						style={{
							flex: 1,
							overflowY: "auto",
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
							gap: "16px",
							padding: "40px",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{images.map((img, index) => (
							<div
								key={index}
								style={{
									position: "relative",
									width: "100%",
									height: "400px",
									borderRadius: "8px",
									overflow: "hidden",
								}}
							>
								<Image
									src={img}
									alt={`Property image ${index + 1}`}
									fill
									style={{ objectFit: "cover" }}
									unoptimized
								/>
							</div>
						))}
					</div>
				</div>
			)}

			<style jsx>{`
				@media (max-width: 968px) {
					div[style*="grid-template-columns: 1fr 400px"] {
						grid-template-columns: 1fr !important;
					}
					div[style*="position: sticky"] {
						position: relative !important;
						top: 0 !important;
					}
				}
				@media (max-width: 767px) {
					.listing-title {
						font-size: 24px !important;
					}
					.hero-image-container {
						border-radius: 16px !important;
					}
				}
				@media (min-width: 768px) {
					.hero-image-container {
						transition: transform 0.3s ease, box-shadow 0.3s ease;
					}
					.hero-image-container:hover {
						transform: translateY(-4px);
						box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2), 0 12px 32px rgba(0, 0, 0, 0.15) !important;
					}
				}
			`}</style>
		</div>
	);
};

export default Index;

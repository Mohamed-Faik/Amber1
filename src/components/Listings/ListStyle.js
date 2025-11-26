"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formattedPrice } from "@/utils/formattedPrice";
import { getListingImage } from "@/utils/getListingImage";
import HeartButton from "../HeartButton";
import ContactButtons from "../Listing/ContactButtons";
import ListingImageCarousel from "../Listing/ListingImageCarousel";
import rulerIcon from "../../../public/images/icon/ruler.svg";
import bedIcon from "../../../public/images/icon/bed.svg";
import bathroomIcon from "../../../public/images/icon/bathroom.svg";

const ListStyle = ({
	id,
	title,
	slug,
	imageSrc,
	user,
	location_value,
	category,
	price,
	created_at,
	currentUser,
	area,
	bedrooms,
	bathrooms,
	listingType,
	featureType,
}) => {
	const router = useRouter();
	const mainImage = getListingImage(imageSrc);
	// Default to SALE if listingType is not provided (for backward compatibility)
	const displayListingType = listingType || "SALE";
	
	const handleCategoryClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		router.push(`/listings/?category=${category}`);
	};

	return (
		<div className="col-lg-6" style={{ marginBottom: "32px" }}>
			<div
				className="listing-card-list-style"
				style={{
					display: "flex",
					flexDirection: "column",
					backgroundColor: "#ffffff",
					borderRadius: "12px",
					overflow: "hidden",
					boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					transition: "all 0.3s ease",
					height: "100%",
					width: "100%",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.transform = "translateY(-4px)";
					e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform = "translateY(0)";
					e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
				}}
			>
				<Link
					href={`/listing/${id}/${slug}`}
					style={{
						display: "flex",
						width: "100%",
						textDecoration: "none",
						color: "inherit",
						flex: 1,
					}}
				>
					<div
						className="listing-card-content-wrapper"
						style={{
							display: "flex",
							width: "100%",
							flex: 1,
						}}
					>
						{/* Image with Carousel */}
					<div
						className="listing-card-image-container"
						style={{
							position: "relative",
							width: "40%",
							minWidth: "200px",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								position: "relative",
								width: "100%",
								height: "100%",
								minHeight: "250px",
							}}
						>
							<ListingImageCarousel 
								imageSrc={imageSrc} 
								title={title}
								listing={{ id, slug, title, location_value, price }}
							/>
						</div>
						<div
							style={{
								position: "absolute",
								top: "12px",
								right: "12px",
								zIndex: 10,
							}}
							onClick={(e) => e.stopPropagation()}
						>
							<HeartButton currentUser={currentUser} listingId={id} />
						</div>
					</div>

					{/* Content */}
					<div
						style={{
							flex: 1,
							padding: "20px",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
						}}
					>
						<div>
							{/* FOR SALE / FOR RENT / FOR RENT (DAILY) Badge */}
							<div style={{ marginBottom: "8px" }}>
								<span
									style={{
										display: "inline-block",
										padding: "4px 10px",
										backgroundColor: displayListingType === "RENT" ? "#E8F5E9" : displayListingType === "DAILY_RENT" ? "#E3F2FD" : "#FFF5F7",
										color: displayListingType === "RENT" ? "#2E7D32" : displayListingType === "DAILY_RENT" ? "#1976D2" : "#FF385C",
										borderRadius: "6px",
										fontSize: "12px",
										fontWeight: "700",
										letterSpacing: "0.5px",
									}}
								>
									{displayListingType === "RENT" ? "FOR RENT" : displayListingType === "DAILY_RENT" ? "FOR RENT (DAILY)" : "FOR SALE"}
								</span>
							</div>

							{/* Location */}
							<div
								style={{
									fontSize: "14px",
									color: "#717171",
									marginBottom: "8px",
									display: "flex",
									alignItems: "center",
									gap: "4px",
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
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
									<circle cx="12" cy="10" r="3"></circle>
								</svg>
								{location_value}
							</div>

							{/* Title */}
							<h3
								style={{
									fontSize: "18px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "12px",
									lineHeight: "1.4",
								}}
							>
								{title}
							</h3>

							{/* Category Badge */}
							<div style={{ marginBottom: "12px" }}>
								<button
									onClick={handleCategoryClick}
									style={{
										display: "inline-block",
										padding: "4px 12px",
										backgroundColor: "#f7f7f7",
										borderRadius: "6px",
										fontSize: "12px",
										fontWeight: "500",
										color: "#222222",
										border: "none",
										cursor: "pointer",
										transition: "background-color 0.2s ease",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = "#e8e8e8";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = "#f7f7f7";
									}}
								>
									{category}
								</button>
							</div>

						{/* Property Details */}
						{(area || bedrooms || bathrooms) && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "16px",
									marginTop: "8px",
									fontSize: "13px",
									color: "#222222",
									flexWrap: "wrap",
								}}
							>
								{/* EXPERIENCES - Show Duration and Group Size */}
								{featureType === "EXPERIENCES" && (
									<>
										{/* Duration - Clock Icon */}
										{area && (
											<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.7 }}>
													<circle cx="12" cy="12" r="10"></circle>
													<polyline points="12 6 12 12 16 14"></polyline>
												</svg>
												<span style={{ fontWeight: "500" }}>{area} {area === 1 ? "hour" : "hours"}</span>
											</div>
										)}

										{/* Group Size - People Icon */}
										{bedrooms && (
											<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.7 }}>
													<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
													<circle cx="9" cy="7" r="4"></circle>
													<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
													<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
												</svg>
												<span style={{ fontWeight: "500" }}>{bedrooms} {bedrooms === 1 ? "person" : "people"}</span>
											</div>
										)}
									</>
								)}

								{/* SERVICES - Show Service Details */}
								{featureType === "SERVICES" && (
									<>
										{/* Service Duration */}
										{area && (
											<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.7 }}>
													<circle cx="12" cy="12" r="10"></circle>
													<polyline points="12 6 12 12 16 14"></polyline>
												</svg>
												<span style={{ fontWeight: "500" }}>{area}</span>
											</div>
										)}
									</>
								)}

								{/* HOMES - Show Area, Bedrooms, Bathrooms */}
								{(!featureType || featureType === "HOMES") && (
									<>
										{/* Area - Ruler Icon */}
										{area && (
											<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
												<Image
													src={rulerIcon}
													alt="Area"
													width={16}
													height={16}
													style={{ flexShrink: 0, opacity: 0.7 }}
												/>
												<span style={{ fontWeight: "500" }}>{area} m²</span>
											</div>
										)}

										{/* Bedrooms - Bed Icon */}
										{bedrooms && (
											<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
												<Image
													src={bedIcon}
													alt="Bedrooms"
													width={16}
													height={16}
													style={{ flexShrink: 0, opacity: 0.7 }}
												/>
												<span style={{ fontWeight: "500" }}>
													{bedrooms} {bedrooms === 1 ? "Chambre" : "Chambres"}
												</span>
											</div>
										)}

										{/* Bathrooms - Bathroom Icon */}
										{bathrooms && (
											<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
												<Image
													src={bathroomIcon}
													alt="Bathrooms"
													width={16}
													height={16}
													style={{ flexShrink: 0, opacity: 0.7 }}
												/>
												<span style={{ fontWeight: "500" }}>
													{bathrooms} {bathrooms === 1 ? "Salle de bain" : "Salles de bain"}
												</span>
											</div>
										)}
									</>
								)}
							</div>
						)}
						</div>

						{/* Price */}
						<div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
							<span
								style={{
									fontSize: "20px",
									fontWeight: "600",
									color: "#222222",
								}}
							>
								{formattedPrice(price)}
							</span>
							{displayListingType === "RENT" && (
								<span
									style={{
										fontSize: "16px",
										fontWeight: "500",
										color: "#717171",
									}}
								>
									/month
								</span>
							)}
							{displayListingType === "DAILY_RENT" && (
								<span
									style={{
										fontSize: "16px",
										fontWeight: "500",
										color: "#717171",
									}}
								>
									/day
								</span>
							)}
						</div>
					</div>
					</div>
				</Link>
			
			{/* Contact Buttons - Outside Link */}
			<div style={{ padding: "12px 20px 20px 20px", borderTop: "1px solid #f7f7f7" }}>
				<ContactButtons listing={{ id, slug, title, location_value, price }} />
			</div>
		</div>
		</div>
	);
};

export default ListStyle;

// Add mobile responsive styles
if (typeof document !== 'undefined') {
	const style = document.createElement('style');
	style.textContent = `
		/* Mobile: < 768px - Stack listing cards vertically */
		@media (max-width: 767px) {
			.listing-card-list-style {
				flex-direction: column !important;
			}
			
			.listing-card-content-wrapper {
				flex-direction: column !important;
			}
			
			.listing-card-image-container {
				width: 100% !important;
				min-width: 100% !important;
				aspect-ratio: 4 / 3 !important;
			}
			
			.listing-card-image-container > div {
				min-height: 100% !important;
			}
		}
		
		/* Small Mobile: < 480px - Better image sizing */
		@media (max-width: 480px) {
			.listing-card-image-container {
				aspect-ratio: 1 / 1 !important;
			}
		}
	`;
	document.head.appendChild(style);
}

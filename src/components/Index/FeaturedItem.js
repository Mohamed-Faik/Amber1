import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formattedPrice } from "@/utils/formattedPrice";
import { getListingImage } from "@/utils/getListingImage";
import HeartButton from "../HeartButton";
import ContactButtons from "../Listing/ContactButtons";
import rulerIcon from "../../../public/images/icon/ruler.svg";
import bedIcon from "../../../public/images/icon/bed.svg";
import bathroomIcon from "../../../public/images/icon/bathroom.svg";

const FeaturedItem = ({
	id,
	title,
	slug,
	imageSrc,
	category,
	user,
	price,
	location_value,
	created_at,
	currentUser,
	rating,
	area,
	bedrooms,
	bathrooms,
}) => {
	const mainImage = getListingImage(imageSrc);
	const displayPrice = formattedPrice(price);
	const displayRating = rating || "4.8"; // Default rating if not available
	const [imageError, setImageError] = useState(false);

	// Debug logging
	React.useEffect(() => {
		if (!mainImage) {
			console.warn(`[FeaturedItem] No image for listing ${id}:`, {
				imageSrc,
				mainImage,
			});
		} else {
			console.log(`[FeaturedItem] Image path for listing ${id}:`, mainImage);
		}
	}, [id, imageSrc, mainImage]);

	// Check if listing is new (created within last 30 days)
	const isNew = created_at ? (new Date() - new Date(created_at)) / (1000 * 60 * 60 * 24) < 30 : false;

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
			}}
		>
			<Link href={`/listing/${id}/${slug}`} style={{ textDecoration: "none", color: "inherit" }}>
				<div
					style={{
						position: "relative",
						width: "100%",
						backgroundColor: "#FFFFFF",
						borderRadius: "12px",
						overflow: "hidden",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
						transition: "all 0.3s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "translateY(-4px)";
						e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "translateY(0)";
						e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
					}}
				>
					{/* Image Container */}
					<div
						style={{
							position: "relative",
							width: "100%",
							paddingTop: "75%",
							overflow: "hidden",
							backgroundColor: "#f0f0f0",
						}}
					>
						{mainImage && !imageError ? (
							<Image
								src={mainImage}
								alt={title || "Property image"}
								fill
								style={{
									objectFit: "cover",
								}}
								sizes="300px"
								unoptimized
								priority={false}
							/>
						) : (
							<div
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									backgroundColor: "#f0f0f0",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#999",
									fontSize: "14px",
								}}
							>
								No Image Available
							</div>
						)}

						{/* NEW Badge - Pink rounded rectangle overlay */}
						{isNew && (
							<div
								style={{
									position: "absolute",
									bottom: "16px",
									left: "16px",
									backgroundColor: "#FF385C",
									color: "#FFFFFF",
									padding: "6px 14px",
									borderRadius: "20px",
									fontSize: "13px",
									fontWeight: "700",
									letterSpacing: "0.5px",
									zIndex: 5,
									boxShadow: "0 2px 8px rgba(255, 56, 92, 0.4)",
								}}
							>
								NEW
							</div>
						)}

						{/* Heart Button - Top Right */}
						<div
							style={{
								position: "absolute",
								top: "12px",
								right: "12px",
								zIndex: 10,
							}}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							<HeartButton currentUser={currentUser} listingId={id} />
						</div>
					</div>

					{/* Content Section */}
					<div style={{ padding: "16px" }}>
						{/* FOR SALE and Price Row */}
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "12px",
							}}
						>
							<span
								style={{
									fontSize: "16px",
									fontWeight: "700",
									color: "#222222",
									letterSpacing: "0.3px",
								}}
							>
								FOR SALE
							</span>
							<span
								style={{
									fontSize: "18px",
									fontWeight: "700",
									color: "#FF385C",
								}}
							>
								{displayPrice}
							</span>
						</div>

						{/* Property Type */}
						<div
							style={{
								fontSize: "15px",
								fontWeight: "500",
								color: "#222222",
								marginBottom: "8px",
							}}
						>
							{category || "Property"}
						</div>

						{/* Location with Pin Icon */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "6px",
								marginBottom: "12px",
								fontSize: "14px",
								color: "#717171",
							}}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#717171"
								strokeWidth="2"
							>
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
							<span>{location_value || "Location"}</span>
						</div>

						{/* Property Metrics */}
						{(area || bedrooms || bathrooms) && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "16px",
									paddingTop: "12px",
									borderTop: "1px solid #E0E0E0",
									fontSize: "13px",
									color: "#222222",
									flexWrap: "wrap",
								}}
							>
								{/* Area - Ruler Icon */}
								{area && (
									<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
										<Image
											src={rulerIcon}
											alt="Area"
											width={18}
											height={18}
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
											width={18}
											height={18}
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
											width={18}
											height={18}
											style={{ flexShrink: 0, opacity: 0.7 }}
										/>
										<span style={{ fontWeight: "500" }}>
											{bathrooms} {bathrooms === 1 ? "Salle de bain" : "Salles de bain"}
										</span>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</Link>
			
			{/* Contact Buttons - Outside Link to prevent navigation */}
			<div style={{ padding: "12px 16px 16px 16px", backgroundColor: "#FFFFFF", borderRadius: "0 0 12px 12px" }}>
				<ContactButtons listing={{ id, slug, title, location_value, price }} />
			</div>
		</div>
	);
};

export default FeaturedItem;

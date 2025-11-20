import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formattedPrice } from "@/utils/formattedPrice";
import { getListingImage } from "@/utils/getListingImage";
import HeartButton from "../HeartButton";

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

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				cursor: "pointer",
			}}
		>
			<Link href={`/listing/${id}/${slug}`}>
				<div
					style={{
						position: "relative",
						width: "100%",
						transition: "transform 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "scale(1.02)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
				>
					{/* Image Container */}
					<div
						style={{
							position: "relative",
							width: "100%",
							paddingTop: "75%",
							borderRadius: "12px",
							overflow: "hidden",
							marginBottom: "12px",
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

						{/* Guest Favorite Badge (optional - can be based on rating) */}
						{parseFloat(displayRating) >= 4.9 && (
							<div
								style={{
									position: "absolute",
									top: "12px",
									left: "12px",
									backgroundColor: "#FFFFFF",
									padding: "6px 10px",
									borderRadius: "6px",
									display: "flex",
									alignItems: "center",
									gap: "4px",
									fontSize: "12px",
									fontWeight: "600",
									color: "#222222",
									zIndex: 5,
									boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
								}}
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="#FF385C"
									stroke="none"
								>
									<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
								</svg>
								Guest favorite
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

					{/* Content */}
					<div>
						{/* Property Type and Location */}
						<div style={{ marginBottom: "6px" }}>
							<div
								style={{
									fontSize: "15px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "4px",
									lineHeight: "1.3",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{category || "Property"} in {location_value || "Location"}
							</div>
							<div
								style={{
									fontSize: "15px",
									color: "#717171",
									marginBottom: "4px",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{title}
							</div>
						</div>

						{/* Price */}
						<div
							style={{
								fontSize: "15px",
								color: "#222222",
								marginBottom: "6px",
								fontWeight: "500",
							}}
						>
							{displayPrice} <span style={{ fontWeight: "400" }}>night</span>
						</div>

						{/* Rating */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "4px",
							}}
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="#222222"
								stroke="none"
							>
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
							</svg>
							<span
								style={{
									fontSize: "14px",
									fontWeight: "600",
									color: "#222222",
								}}
							>
								{displayRating}
							</span>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default FeaturedItem;

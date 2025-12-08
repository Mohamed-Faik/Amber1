"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formattedPrice } from "@/utils/formattedPrice";
import { getListingImage } from "@/utils/getListingImage";
import ContactButtons from "../Listing/ContactButtons";
import ListingImageCarousel from "../Listing/ListingImageCarousel";
import { getTranslation } from "@/utils/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedContent } from "@/hooks/useTranslatedContent";
import rulerIcon from "../../../public/images/icon/ruler.svg";
import bedIcon from "../../../public/images/icon/bed.svg";
import bathroomIcon from "../../../public/images/icon/bathroom.svg";

const GridStyle = ({
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
	displayLanguage = "en",
	status,
	isPremium,
}) => {
	const router = useRouter();
	const mainImage = getListingImage(imageSrc);
	// Default to SALE if listingType is not provided (for backward compatibility)
	const displayListingType = listingType || "SALE";

	// Translate the title dynamically
	const { translatedContent: translatedTitle } = useTranslatedContent(title, displayLanguage, false);

	const handleCategoryClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		router.push(`/listings/?category=${category}`);
	};

	return (
		<div className="col-lg-4 col-md-6" style={{ marginBottom: "32px" }}>
			<div
				style={{
					position: "relative",
					width: "100%",
					borderRadius: "12px",
					overflow: "hidden",
					backgroundColor: "#ffffff",
					boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					transition: "all 0.3s ease",
					display: "flex",
					flexDirection: "column",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.transform = "translateY(-4px)";
					e.currentTarget.style.boxShadow =
						"0 8px 24px rgba(0,0,0,0.15)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform = "translateY(0)";
					e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
				}}
			>
				<Link href={`/listing/${id}/${slug}`} style={{ textDecoration: "none", color: "inherit", flex: 1, display: "flex", flexDirection: "column" }}>
					<div
						style={{
							position: "relative",
							width: "100%",
							flex: 1,
						}}
					>
						{/* Image Container with Carousel */}
						<div
							style={{
								position: "relative",
								width: "100%",
								paddingTop: "75%",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
								}}
							>
								<ListingImageCarousel
									imageSrc={imageSrc}
									title={title}
									listing={{ id, slug, title, location_value, price }}
								/>
							</div>
							{/* SOLD Badge Overlay - Diagonal from edge to edge */}
							{status === "Sold" && featureType !== "EXPERIENCES" && (
								<div
									style={{
										position: "absolute",
										top: "50%",
										left: "50%",
										transform: "translate(-50%, -50%) rotate(-45deg)",
										backgroundColor: "rgba(16, 185, 129, 0.5)",
										color: "#FFFFFF",
										padding: "20px 0",
										fontSize: "32px",
										fontWeight: "900",
										textTransform: "uppercase",
										zIndex: 15,
										letterSpacing: "4px",
										width: "150%",
										textAlign: "center",
										boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
									}}
								>
									SOLD
								</div>
							)}
						</div>

						{/* Content */}
						<div style={{ padding: "16px" }}>
							{/* Owner Profile */}
							{user && (
								<div style={{
									display: "flex",
									alignItems: "center",
									gap: "10px",
									marginBottom: "12px",
									paddingBottom: "12px",
									borderBottom: "1px solid #f0f0f0"
								}}>
									{user.image ? (
										<Image
											src={user.image}
											alt="AmberHomes User"
											width={40}
											height={40}
											style={{
												borderRadius: "50%",
												objectFit: "cover",
												border: "2px solid #FF385C"
											}}
										/>
									) : (
										<div style={{
											width: "40px",
											height: "40px",
											borderRadius: "50%",
											backgroundColor: "#FF385C",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#FFFFFF",
											fontWeight: "600",
											fontSize: "16px"
										}}>
											A
										</div>
									)}
									<div style={{ flex: 1 }}>
										<div style={{
											fontSize: "14px",
											fontWeight: "600",
											color: "#222222",
											lineHeight: "1.3",
											display: "flex",
											alignItems: "center",
											gap: "6px"
										}}>
											<span>{getTranslation(displayLanguage, "listings.amberHomesUser")}</span>
											{isPremium && (
												<svg
													width="16"
													height="16"
													viewBox="0 0 22 22"
													fill="none"
													style={{ flexShrink: 0 }}
												>
													<path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1D9BF0" />
												</svg>
											)}
										</div>
										<div style={{
											fontSize: "12px",
											color: "#717171",
											lineHeight: "1.3"
										}}>
											{getTranslation(displayLanguage, "listings.listedByOwner")}
										</div>
									</div>
								</div>
							)}

							{/* FOR SALE / FOR RENT / DAILY RENT Badge */}
							<div style={{ marginBottom: "8px", display: "flex", gap: "8px", alignItems: "center", justifyContent: "space-between" }}>
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
									{displayListingType === "RENT"
										? getTranslation(displayLanguage, "listings.forRent")
										: displayListingType === "DAILY_RENT"
											? getTranslation(displayLanguage, "listings.forRentDaily")
											: getTranslation(displayLanguage, "listings.forSale")}
								</span>

								{isPremium && (
									<span
										style={{
											display: "inline-flex",
											alignItems: "center",
											gap: "4px",
											padding: "4px 10px",
											backgroundColor: "#FFF4E6",
											color: "#FF9800",
											borderRadius: "6px",
											fontSize: "12px",
											fontWeight: "700",
											letterSpacing: "0.5px",
										}}
									>
										<Image
											src="https://img.icons8.com/?size=100&id=dqdDZqdX7Mb3&format=png&color=000000"
											alt="Premium"
											width={14}
											height={14}
											style={{ display: "block" }}
										/>
										{getTranslation(displayLanguage, "listings.premium")}
									</span>
								)}
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
									fontSize: "16px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "8px",
									lineHeight: "1.4",
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
								}}
							>
								{translatedTitle}
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
										gap: "12px",
										marginBottom: "12px",
										fontSize: "12px",
										color: "#222222",
										flexWrap: "wrap",
									}}
								>
									{/* EXPERIENCES - Show Duration and Group Size */}
									{featureType === "EXPERIENCES" && (
										<>
											{/* Duration - Clock Icon */}
											{area && (
												<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
													<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.7 }}>
														<circle cx="12" cy="12" r="10"></circle>
														<polyline points="12 6 12 12 16 14"></polyline>
													</svg>
													<span style={{ fontWeight: "500" }}>{area} {area === 1 ? "hour" : "hours"}</span>
												</div>
											)}

											{/* Group Size - People Icon */}
											{bedrooms && (
												<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
													<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.7 }}>
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
												<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
													<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.7 }}>
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
												<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
													<Image
														src={rulerIcon}
														alt="Area"
														width={14}
														height={14}
														style={{ flexShrink: 0, opacity: 0.7 }}
													/>
													<span style={{ fontWeight: "500" }}>{area} m²</span>
												</div>
											)}

											{/* Bedrooms - Bed Icon */}
											{bedrooms && (
												<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
													<Image
														src={bedIcon}
														alt="Bedrooms"
														width={14}
														height={14}
														style={{ flexShrink: 0, opacity: 0.7 }}
													/>
													<span style={{ fontWeight: "500" }}>
														{bedrooms} {bedrooms === 1
															? getTranslation(displayLanguage, "listings.bedroom")
															: getTranslation(displayLanguage, "listings.bedrooms")}
													</span>
												</div>
											)}

											{/* Bathrooms - Bathroom Icon */}
											{bathrooms && (
												<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
													<Image
														src={bathroomIcon}
														alt="Bathrooms"
														width={14}
														height={14}
														style={{ flexShrink: 0, opacity: 0.7 }}
													/>
													<span style={{ fontWeight: "500" }}>
														{bathrooms} {bathrooms === 1
															? getTranslation(displayLanguage, "listings.bathroom")
															: getTranslation(displayLanguage, "listings.bathrooms")}
													</span>
												</div>
											)}
										</>
									)}
								</div>
							)}

							{/* Price */}
							<div
								style={{
									display: "flex",
									alignItems: "baseline",
									gap: "4px",
								}}
							>
								<span
									style={{
										fontSize: "18px",
										fontWeight: "600",
										color: "#222222",
									}}
								>
									{formattedPrice(price, displayLanguage)}
								</span>
								{displayListingType === "RENT" && (
									<span
										style={{
											fontSize: "14px",
											fontWeight: "500",
											color: "#717171",
										}}
									>
										{getTranslation(displayLanguage, "listings.perMonth")}
									</span>
								)}
								{displayListingType === "DAILY_RENT" && (
									<span
										style={{
											fontSize: "14px",
											fontWeight: "500",
											color: "#717171",
										}}
									>
										{getTranslation(displayLanguage, "listings.perNight")}
									</span>
								)}
							</div>
						</div>
					</div>
				</Link>

				{/* Contact Buttons or SOLD message - Outside Link */}
				{status === "Sold" && featureType !== "EXPERIENCES" ? (
					<div style={{
						padding: "12px 16px 16px 16px",
						borderTop: "1px solid #f7f7f7",
						textAlign: "center",
					}}>
						<div style={{
							backgroundColor: "#D1FAE5",
							color: "#065F46",
							padding: "10px 16px",
							borderRadius: "8px",
							fontWeight: "600",
							fontSize: "14px",
							border: "1px solid #A7F3D0",
						}}>
							This property has been sold
						</div>
					</div>
				) : (
					<div style={{ padding: "12px 16px 16px 16px", borderTop: "1px solid #f7f7f7" }}>
						<ContactButtons listing={{ id, slug, title, location_value, price }} />
					</div>
				)}
			</div>
		</div>
	);
};

export default GridStyle;

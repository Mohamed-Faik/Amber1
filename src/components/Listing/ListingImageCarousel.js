"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { getAllListingImages } from "@/utils/getListingImage";
import { formattedPrice } from "@/utils/formattedPrice";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ListingImageCarousel = ({ imageSrc, title, onImageClick, listing }) => {
	const [images, setImages] = useState([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const swiperRef = useRef(null);
	const isSwiping = useRef(false);
	const [baseUrl, setBaseUrl] = useState("");

	// Get the base URL on client side
	useEffect(() => {
		if (typeof window !== "undefined") {
			setBaseUrl(window.location.origin);
		}
	}, []);

	React.useEffect(() => {
		const parsedImages = getAllListingImages(imageSrc);
		setImages(parsedImages);
	}, [imageSrc]);

	// Create WhatsApp link with listing details
	const whatsappLink = useMemo(() => {
		if (!listing) return null;
		
		const whatsappNumber = "212638204811"; // Without + for WhatsApp link
		const listingUrl = baseUrl ? `${baseUrl}/listing/${listing.id}/${listing.slug}` : "";
		
		const message = `Hello, I'm interested in this property:

Property: ${listing.title || title}
Location: ${listing.location_value || ""}
Price: ${listing.price ? formattedPrice(listing.price) : ""}
${listingUrl ? `Link: ${listingUrl}` : ""}

Please provide more information.`;
		
		return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
	}, [baseUrl, listing, title]);

	// Check if we're on the blurred duplicate slide (last slide is the duplicate)
	const isLastSlide = activeIndex === images.length;

	if (images.length === 0) {
		return (
			<div
				style={{
					position: "relative",
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
		);
	}

	// If only one image, show it with WhatsApp overlay
	if (images.length === 1 && whatsappLink) {
		return (
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
				}}
			>
				<Image
					src={images[0]}
					alt={title || "Property image"}
					fill
					style={{
						objectFit: "cover",
						filter: "blur(8px)",
						transition: "filter 0.3s ease",
					}}
					unoptimized
				/>
				{/* WhatsApp Overlay */}
				<div
					className="whatsapp-overlay"
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(0, 0, 0, 0.3)",
						zIndex: 10,
					}}
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						window.open(whatsappLink, "_blank", "noopener,noreferrer");
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "12px",
							cursor: "pointer",
							transition: "transform 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "scale(1.1)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "scale(1)";
						}}
					>
						<div
							style={{
								width: "80px",
								height: "80px",
								backgroundColor: "#25D366",
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								boxShadow: "0 4px 20px rgba(37, 211, 102, 0.5)",
							}}
						>
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="white"
							>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
							</svg>
						</div>
						<span
							style={{
								color: "#ffffff",
								fontSize: "16px",
								fontWeight: "600",
								textShadow: "0 2px 4px rgba(0,0,0,0.3)",
							}}
						>
							Contact on WhatsApp
						</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
			}}
		>
			<Swiper
				ref={swiperRef}
				modules={[Navigation, Pagination]}
				spaceBetween={0}
				slidesPerView={1}
				navigation={true}
				pagination={{
					clickable: true,
					dynamicBullets: true,
				}}
				style={{
					width: "100%",
					height: "100%",
				}}
				onSlideChange={(swiper) => {
					setActiveIndex(swiper.activeIndex);
				}}
				onTouchStart={(swiper, event) => {
					isSwiping.current = false;
					event.stopPropagation();
				}}
				onTouchMove={(swiper, event) => {
					isSwiping.current = true;
					event.stopPropagation();
				}}
				onTouchEnd={(swiper, event) => {
					// If user was swiping, prevent navigation
					if (isSwiping.current) {
						event.stopPropagation();
						event.preventDefault();
					}
					setTimeout(() => {
						isSwiping.current = false;
					}, 100);
				}}
				onClick={(swiper, event) => {
					const target = event.target;
					// Prevent navigation if clicking on navigation buttons, pagination, or WhatsApp button
					if (
						target.closest('.swiper-button-next') ||
						target.closest('.swiper-button-prev') ||
						target.closest('.swiper-pagination') ||
						target.closest('.whatsapp-overlay')
					) {
						event.stopPropagation();
						event.preventDefault();
					} else if (isSwiping.current) {
						// If user was swiping, don't navigate
						event.stopPropagation();
						event.preventDefault();
					}
					// Otherwise, allow click to navigate (handled by parent Link)
				}}
			>
				{images.map((img, index) => (
					<SwiperSlide key={index}>
						<div
							style={{
								position: "relative",
								width: "100%",
								height: "100%",
							}}
						>
							<Image
								src={img}
								alt={`${title || "Property"} - Image ${index + 1}`}
								fill
								style={{
									objectFit: "cover",
								}}
								unoptimized
							/>
						</div>
					</SwiperSlide>
				))}
				
				{/* Blurred duplicate of final image with WhatsApp overlay */}
				{images.length > 0 && whatsappLink && (
					<SwiperSlide>
						<div
							style={{
								position: "relative",
								width: "100%",
								height: "100%",
							}}
						>
							<Image
								src={images[images.length - 1]}
								alt={`${title || "Property"} - Contact`}
								fill
								style={{
									objectFit: "cover",
									filter: "blur(8px)",
									transition: "filter 0.3s ease",
								}}
								unoptimized
							/>
							
							{/* WhatsApp Overlay */}
							<div
								className="whatsapp-overlay"
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "rgba(0, 0, 0, 0.3)",
									zIndex: 10,
								}}
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
									window.open(whatsappLink, "_blank", "noopener,noreferrer");
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: "12px",
										cursor: "pointer",
										transition: "transform 0.2s ease",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = "scale(1.1)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = "scale(1)";
									}}
								>
									<div
										style={{
											width: "80px",
											height: "80px",
											backgroundColor: "#25D366",
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											boxShadow: "0 4px 20px rgba(37, 211, 102, 0.5)",
										}}
									>
										<svg
											width="48"
											height="48"
											viewBox="0 0 24 24"
											fill="white"
										>
											<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
										</svg>
									</div>
									<span
										style={{
											color: "#ffffff",
											fontSize: "16px",
											fontWeight: "600",
											textShadow: "0 2px 4px rgba(0,0,0,0.3)",
										}}
									>
										Contact on WhatsApp
									</span>
								</div>
							</div>
						</div>
					</SwiperSlide>
				)}
			</Swiper>
			
			{/* Custom styles for navigation arrows */}
			<style jsx global>{`
				.swiper-button-next,
				.swiper-button-prev {
					color: #ffffff;
					background: rgba(0, 0, 0, 0.5);
					width: 32px;
					height: 32px;
					border-radius: 50%;
					margin-top: 0;
					top: 50%;
					transform: translateY(-50%);
				}
				.swiper-button-next:after,
				.swiper-button-prev:after {
					font-size: 16px;
					font-weight: bold;
				}
				.swiper-button-next:hover,
				.swiper-button-prev:hover {
					background: rgba(0, 0, 0, 0.7);
				}
				.swiper-pagination {
					bottom: 12px;
				}
				.swiper-pagination-bullet {
					background: #ffffff;
					opacity: 0.7;
					width: 8px;
					height: 8px;
				}
				.swiper-pagination-bullet-active {
					opacity: 1;
					background: #FF385C;
				}
				
				/* Mobile: < 768px - Larger touch targets and better visibility */
				@media (max-width: 767px) {
					.swiper-button-next,
					.swiper-button-prev {
						width: 40px !important;
						height: 40px !important;
					}
					.swiper-button-next:after,
					.swiper-button-prev:after {
						font-size: 18px !important;
					}
					.swiper-pagination-bullet {
						width: 10px !important;
						height: 10px !important;
					}
					.featured-item-image-container {
						paddingTop: "100%" !important;
					}
				}
				
				/* Small Mobile: < 480px - Even larger touch targets */
				@media (max-width: 480px) {
					.swiper-button-next,
					.swiper-button-prev {
						width: 44px !important;
						height: 44px !important;
					}
					.swiper-pagination {
						bottom: 8px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default ListingImageCarousel;


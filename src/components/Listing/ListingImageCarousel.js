"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { getAllListingImages } from "@/utils/getListingImage";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ListingImageCarousel = ({ imageSrc, title, onImageClick }) => {
	const [images, setImages] = useState([]);
	const swiperRef = useRef(null);
	const isSwiping = useRef(false);

	React.useEffect(() => {
		const parsedImages = getAllListingImages(imageSrc);
		setImages(parsedImages);
	}, [imageSrc]);

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

	// If only one image, show it without carousel
	if (images.length === 1) {
		return (
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
				}}
				onClick={onImageClick}
			>
				<Image
					src={images[0]}
					alt={title || "Property image"}
					fill
					style={{
						objectFit: "cover",
					}}
					unoptimized
				/>
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
					// Prevent navigation if clicking on navigation buttons or pagination
					if (
						target.closest('.swiper-button-next') ||
						target.closest('.swiper-button-prev') ||
						target.closest('.swiper-pagination')
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
			`}</style>
		</div>
	);
};

export default ListingImageCarousel;


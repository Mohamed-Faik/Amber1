"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAllListingImages } from "@/utils/getListingImage";

const DetailsImages = ({ imageSrc }) => {
	const [images, setImages] = useState([]);
	const [showAllImages, setShowAllImages] = useState(false);

	useEffect(() => {
		console.log("[DetailsImages] imageSrc received:", typeof imageSrc, imageSrc);
		const parsedImages = getAllListingImages(imageSrc);
		console.log("[DetailsImages] Parsed images:", parsedImages);
		setImages(parsedImages);
		
		// Debug logging
		if (parsedImages.length === 0) {
			console.warn("[DetailsImages] No images found. imageSrc:", imageSrc);
		} else {
			console.log("[DetailsImages] Images loaded successfully:", parsedImages.length, parsedImages);
		}
	}, [imageSrc]);

	if (images.length === 0) {
		return (
			<div style={{ width: "100%", height: "500px", backgroundColor: "#f0f0f0", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
				<p style={{ color: "#999", fontSize: "16px" }}>No images available</p>
				<p style={{ color: "#ccc", fontSize: "12px" }}>Debug: imageSrc = {String(imageSrc || "undefined").substring(0, 100)}</p>
			</div>
		);
	}

	// Airbnb-style grid: main large image + 4 smaller images
	const mainImage = images[0];
	const gridImages = images.slice(1, 5); // Get next 4 images (indices 1-4)
	const remainingCount = images.length > 5 ? images.length - 5 : 0;

	return (
		<div style={{ marginBottom: "48px" }}>
			{images.length === 1 ? (
				// Single image
				<div style={{ width: "100%", height: "500px", position: "relative", borderRadius: "12px", overflow: "hidden" }}>
					<Image
						src={mainImage}
						alt="Property image"
						fill
						style={{ objectFit: "cover" }}
						unoptimized
						priority
					/>
				</div>
			) : images.length <= 5 ? (
				// Grid layout for 2-5 images
				<div
					style={{
						display: "grid",
						gridTemplateColumns: images.length === 2 ? "1fr 1fr" : "1fr 1fr",
						gridTemplateRows: images.length === 2 ? "500px" : images.length === 3 ? "500px 250px" : "500px 250px",
						gap: "8px",
						borderRadius: "12px",
						overflow: "hidden",
					}}
				>
					{/* Main large image */}
					<div
						style={{
							gridRow: images.length === 2 ? "1" : "1 / 3",
							position: "relative",
							cursor: "pointer",
						}}
						onClick={() => setShowAllImages(true)}
					>
						<Image
							src={mainImage}
							alt="Property main image"
							fill
							style={{ objectFit: "cover" }}
							unoptimized
							priority
						/>
					</div>

					{/* Grid images */}
					{gridImages.map((img, index) => (
						<div
							key={index}
							style={{
								position: "relative",
								cursor: "pointer",
							}}
							onClick={() => setShowAllImages(true)}
						>
							<Image
								src={img}
								alt={`Property image ${index + 2}`}
								fill
								style={{ objectFit: "cover" }}
								unoptimized
							/>
							{index === gridImages.length - 1 && remainingCount > 0 && (
								<div
									style={{
										position: "absolute",
										inset: 0,
										backgroundColor: "rgba(0, 0, 0, 0.4)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#ffffff",
										fontSize: "24px",
										fontWeight: "600",
										cursor: "pointer",
									}}
									onClick={() => setShowAllImages(true)}
								>
									+{remainingCount} more
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				// Full grid for 5+ images (Airbnb style: 1 large + 4 small)
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gridTemplateRows: "500px 250px",
						gap: "8px",
						borderRadius: "12px",
						overflow: "hidden",
					}}
				>
					{/* Main large image - spans both rows */}
					<div
						style={{
							gridRow: "1 / 3",
							position: "relative",
							cursor: "pointer",
							minHeight: "500px",
						}}
						onClick={() => setShowAllImages(true)}
					>
						{mainImage && (
							<Image
								src={mainImage}
								alt="Property main image"
								fill
								style={{ objectFit: "cover" }}
								unoptimized
								priority
							/>
						)}
					</div>

					{/* Top right image */}
					{gridImages[0] && (
						<div
							style={{
								gridRow: "1",
								gridColumn: "2",
								position: "relative",
								cursor: "pointer",
								minHeight: "250px",
							}}
							onClick={() => setShowAllImages(true)}
						>
							<Image
								src={gridImages[0]}
								alt="Property image 2"
								fill
								style={{ objectFit: "cover" }}
								unoptimized
							/>
						</div>
					)}

					{/* Bottom right - nested grid for 2 images side by side */}
					<div
						style={{
							gridRow: "2",
							gridColumn: "2",
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "8px",
						}}
					>
						{/* Bottom left image */}
						{gridImages[1] && (
							<div
								style={{
									position: "relative",
									cursor: "pointer",
									minHeight: "250px",
								}}
								onClick={() => setShowAllImages(true)}
							>
								<Image
									src={gridImages[1]}
									alt="Property image 3"
									fill
									style={{ objectFit: "cover" }}
									unoptimized
								/>
							</div>
						)}

						{/* Bottom right image - with overlay if more images */}
						{gridImages[2] && (
							<div
								style={{
									position: "relative",
									cursor: "pointer",
									minHeight: "250px",
								}}
								onClick={() => setShowAllImages(true)}
							>
								<Image
									src={gridImages[2]}
									alt="Property image 4"
									fill
									style={{ objectFit: "cover" }}
									unoptimized
								/>
								{remainingCount > 0 && (
									<div
										style={{
											position: "absolute",
											inset: 0,
											backgroundColor: "rgba(0, 0, 0, 0.5)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#ffffff",
											fontSize: "18px",
											fontWeight: "600",
											cursor: "pointer",
										}}
										onClick={(e) => {
											e.stopPropagation();
											setShowAllImages(true);
										}}
									>
										Show all {images.length} photos
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Full image gallery modal */}
			{showAllImages && (
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
					onClick={() => setShowAllImages(false)}
				>
					<button
						onClick={() => setShowAllImages(false)}
						style={{
							position: "absolute",
							top: "24px",
							right: "24px",
							width: "48px",
							height: "48px",
							borderRadius: "50%",
							backgroundColor: "rgba(255, 255, 255, 0.9)",
							border: "none",
							cursor: "pointer",
							fontSize: "24px",
							zIndex: 10000,
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
		</div>
	);
};

export default DetailsImages;

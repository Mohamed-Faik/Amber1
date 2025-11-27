"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import locationSvg from "../../../../public/images/icon/location-pin.svg";
import clockSvg from "../../../../public/images/icon/clock.svg";
import profileSvg from "../../../../public/images/icon/profile.svg";
import { formatDate } from "@/utils/formatDate";
import { formattedPrice } from "@/utils/formattedPrice";
import { getListingImage } from "@/utils/getListingImage";
import ContactButtons from "@/components/Listing/ContactButtons";
import ListingImageCarousel from "@/components/Listing/ListingImageCarousel";

const ListingItem = ({
	id,
	title,
	slug,
	imageSrc,
	location_value,
	price,
	category,
	created_at,
	user,
	currentUser,
	status,
	listingType,
}) => {
	// Default to SALE if listingType is not provided (for backward compatibility)
	const displayListingType = listingType || "SALE";
	
	// Map status to display text
	const getStatusDisplay = () => {
		if (status === "Approved") {
			return { text: "Published", className: "bg-success" };
		} else if (status === "Sold") {
			return { text: "Sold", className: "bg-success" };
		} else if (status === "Pending") {
			return { text: "Pending", className: "bg-warning text-dark" };
		} else if (status === "Canceled") {
			return { text: "Canceled", className: "bg-danger" };
		}
		return { text: "Unknown", className: "bg-secondary" };
	};

	const statusDisplay = getStatusDisplay();
	const router = useRouter();
	const mainImage = getListingImage(imageSrc);

	const handleCancel = async () => {
		if (!window.confirm("Are you sure you want to cancel this listing?")) {
			return;
		}

		try {
			await axios.patch(`/api/listings/${id}/cancel`);
			toast.success("Listing canceled successfully!");
			router.refresh();
		} catch (error) {
			toast.error("Failed to cancel listing");
		}
	};

	return (
		<div
			style={{
				backgroundColor: "#ffffff",
				borderRadius: "16px",
				overflow: "hidden",
				boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
				transition: "all 0.2s ease",
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
				e.currentTarget.style.transform = "translateY(-4px)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
				e.currentTarget.style.transform = "translateY(0)";
			}}
		>
			<Link 
				href={`/listing/${id}/${slug}`} 
				style={{ 
					position: "relative",
					width: "100%",
					height: "240px",
					overflow: "hidden",
					display: "block",
				}}
			>
				<div
					style={{
						position: "relative",
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
				{/* Status Badge */}
				<div style={{
					position: "absolute",
					top: "12px",
					left: "12px",
					zIndex: 10,
				}}>
					<span
						style={{
							padding: "6px 12px",
							borderRadius: "6px",
							fontSize: "12px",
							fontWeight: "600",
							backgroundColor:
								status === "Sold"
									? "#059669"
									: status === "Approved"
									? "#10b981"
									: status === "Pending"
									? "#f59e0b"
									: status === "Canceled"
									? "#ef4444"
									: "#6b7280",
							color: "#ffffff",
						}}
					>
						{statusDisplay.text}
					</span>
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
			</Link>

			<div style={{
				padding: "20px",
				display: "flex",
				flexDirection: "column",
				gap: "16px",
				flex: 1,
			}}>
				<div>
					{/* FOR SALE / FOR RENT / DAILY RENT Badge */}
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

					<h3 style={{
						fontSize: "18px",
						fontWeight: "600",
						color: "#222222",
						margin: "0 0 12px 0",
						lineHeight: "1.4",
					}}>
						<Link 
							href={`/listing/${id}/${slug}`}
							style={{
								color: "#222222",
								textDecoration: "none",
								transition: "color 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.target.style.color = "#FF385C";
							}}
							onMouseLeave={(e) => {
								e.target.style.color = "#222222";
							}}
						>
							{title}
						</Link>
					</h3>
				</div>

				<div style={{
					display: "flex",
					flexDirection: "column",
					gap: "8px",
				}}>
					<div style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						fontSize: "14px",
						color: "#717171",
					}}>
						<Image
							src={locationSvg}
							width="16"
							height="16"
							alt="location"
						/>
						<span>{location_value || "Location not specified"}</span>
					</div>
					<div style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						fontSize: "14px",
						color: "#717171",
					}}>
						<Image
							src={clockSvg}
							width="16"
							height="16"
							alt="date"
						/>
						<span>{formatDate(created_at)}</span>
					</div>
					{user && user.name && (
						<div style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							fontSize: "14px",
							color: "#717171",
						}}>
							<Image
								src={profileSvg}
								width="16"
								height="16"
								alt="user"
							/>
							<span>AmberHomes-User</span>
						</div>
					)}
				</div>

				<div style={{
					marginTop: "auto",
					paddingTop: "16px",
					borderTop: "1px solid #f7f7f7",
					display: "flex",
					flexDirection: "column",
					gap: "12px",
				}}>
					<div style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
						<Link 
							href="/search" 
							style={{
								padding: "6px 12px",
								backgroundColor: "#f7f7f7",
								borderRadius: "6px",
								fontSize: "12px",
								fontWeight: "600",
								color: "#222222",
								textDecoration: "none",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.target.style.backgroundColor = "#FF385C";
								e.target.style.color = "#ffffff";
							}}
							onMouseLeave={(e) => {
								e.target.style.backgroundColor = "#f7f7f7";
								e.target.style.color = "#222222";
							}}
						>
							{category}
						</Link>
						<div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
							<span style={{
								fontSize: "18px",
								fontWeight: "600",
								color: "#FF385C",
							}}>
								{formattedPrice(price)}
							</span>
							{displayListingType === "RENT" && (
								<span
									style={{
										fontSize: "14px",
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
										fontSize: "14px",
										fontWeight: "500",
										color: "#717171",
									}}
								>
									/day
								</span>
							)}
						</div>
					</div>

					{/* Contact Buttons */}
					<ContactButtons listing={{ id, slug, title, location_value, price }} />

					<Link
						href={`/listings/${id}/edit`}
						style={{
							width: "100%",
							padding: "10px 16px",
							borderRadius: "8px",
							border: "1px solid #222222",
							backgroundColor: "#ffffff",
							color: "#222222",
							fontSize: "14px",
							fontWeight: "600",
							textAlign: "center",
							textDecoration: "none",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.target.style.backgroundColor = "#222222";
							e.target.style.color = "#ffffff";
						}}
						onMouseLeave={(e) => {
							e.target.style.backgroundColor = "#ffffff";
							e.target.style.color = "#222222";
						}}
					>
						Edit Listing
					</Link>

					{/* Cancel button - only show if not already canceled */}
					{status !== "Canceled" && (
						<button
							onClick={handleCancel}
							style={{
								width: "100%",
								padding: "10px 16px",
								borderRadius: "8px",
								border: "1px solid #ef4444",
								backgroundColor: "#ffffff",
								color: "#ef4444",
								fontSize: "14px",
								fontWeight: "600",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.target.style.backgroundColor = "#ef4444";
								e.target.style.color = "#ffffff";
							}}
							onMouseLeave={(e) => {
								e.target.style.backgroundColor = "#ffffff";
								e.target.style.color = "#ef4444";
							}}
						>
							Cancel Listing
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ListingItem;

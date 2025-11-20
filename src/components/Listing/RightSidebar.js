"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { formattedPrice } from "@/utils/formattedPrice";
import userImg from "../../../public/images/listing-details-img/user.jpg";
import HeartButton from "../HeartButton";

const RightSidebar = ({ listing, user, currentUser }) => {
	const phoneNumber = "+212638204811";
	const whatsappNumber = "212638204811"; // Without + for WhatsApp link
	const [baseUrl, setBaseUrl] = useState("");
	
	// Get the base URL on client side
	useEffect(() => {
		if (typeof window !== "undefined") {
			setBaseUrl(window.location.origin);
		}
	}, []);
	
	// Create WhatsApp message with listing details
	const whatsappLink = useMemo(() => {
		const listingUrl = baseUrl ? `${baseUrl}/listing/${listing.id}/${listing.slug}` : "";
		
		const message = `Hello, I'm interested in this property:

Property: ${listing.title}
Location: ${listing.location_value}
Price: ${formattedPrice(listing.price)}
${listingUrl ? `Link: ${listingUrl}` : ""}

Please provide more information.`;
		
		return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
	}, [baseUrl, listing, whatsappNumber]);
	return (
		<div
			style={{
				position: "sticky",
				top: "100px",
				height: "fit-content",
			}}
		>
			{/* Booking Card - Airbnb Style */}
			<div
				style={{
					border: "1px solid #dddddd",
					borderRadius: "12px",
					padding: "24px",
					boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
					marginBottom: "24px",
				}}
			>
				{/* User Information - At the top */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
						marginBottom: "24px",
						paddingBottom: "24px",
						borderBottom: "1px solid #ebebeb",
					}}
				>
					<div
						style={{
							position: "relative",
							width: "64px",
							height: "64px",
							borderRadius: "50%",
							overflow: "hidden",
							flexShrink: 0,
							backgroundColor: "#f0f0f0",
						}}
					>
						{user?.image ? (
							<Image
								src={user.image}
								alt="AdverIQ User"
								fill
								style={{ objectFit: "cover" }}
								unoptimized
							/>
						) : (
							<Image
								src={userImg}
								alt="AdverIQ User"
								fill
								style={{ objectFit: "cover" }}
								unoptimized
							/>
						)}
					</div>
					<div style={{ flex: 1 }}>
						<h3
							style={{
								fontSize: "18px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "4px",
							}}
						>
							AdverIQ User
						</h3>
						{user?.profile?.bio && (
							<p
								style={{
									fontSize: "14px",
									color: "#717171",
									margin: 0,
									lineHeight: "1.4",
								}}
							>
								{user.profile.bio.length > 60
									? `${user.profile.bio.substring(0, 60)}...`
									: user.profile.bio}
							</p>
						)}
					</div>
				</div>

				{/* Price and Save */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						marginBottom: "24px",
					}}
				>
					<div>
						<div
							style={{
								fontSize: "22px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "4px",
							}}
						>
							{formattedPrice(listing.price)}
						</div>
					</div>
					<HeartButton currentUser={currentUser} listingId={listing.id} />
				</div>

				{/* WhatsApp Button */}
				<a
					href={whatsappLink}
					target="_blank"
					rel="noopener noreferrer"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "8px",
						width: "100%",
						padding: "14px 24px",
						backgroundColor: "#25D366",
						color: "#ffffff",
						textAlign: "center",
						borderRadius: "8px",
						textDecoration: "none",
						fontSize: "16px",
						fontWeight: "600",
						marginBottom: "16px",
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
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
					</svg>
					WhatsApp Message
				</a>

				{/* Info */}
				<div
					style={{
						paddingTop: "16px",
						borderTop: "1px solid #ebebeb",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "12px",
						}}
					>
						<span style={{ fontSize: "14px", color: "#222222" }}>Category</span>
						<span style={{ fontSize: "14px", fontWeight: "500", color: "#222222" }}>
							{listing.category}
						</span>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<span style={{ fontSize: "14px", color: "#222222" }}>Location</span>
						<span style={{ fontSize: "14px", fontWeight: "500", color: "#222222" }}>
							{listing.location_value}
						</span>
					</div>
				</div>
			</div>

			{/* Contact Information */}
			<div
				style={{
					border: "1px solid #dddddd",
					borderRadius: "12px",
					padding: "24px",
					marginBottom: "24px",
				}}
			>
				<h4
					style={{
						fontSize: "14px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "16px",
					}}
				>
					Contact Us
				</h4>

				{/* Phone Number */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "12px",
						padding: "12px",
						backgroundColor: "#f9f9f9",
						borderRadius: "8px",
					}}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						style={{ color: "#222222", flexShrink: 0 }}
					>
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
					</svg>
					<a
						href={`tel:${phoneNumber}`}
						style={{
							fontSize: "15px",
							fontWeight: "500",
							color: "#222222",
							textDecoration: "none",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.color = "#FF385C";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = "#222222";
						}}
					>
						{phoneNumber}
					</a>
				</div>
			</div>
		</div>
	);
};

export default RightSidebar;

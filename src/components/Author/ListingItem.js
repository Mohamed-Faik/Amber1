import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import { formattedPrice } from "@/utils/formattedPrice";
import { getListingImage } from "@/utils/getListingImage";
import HeartButton from "@/components/HeartButton";
import ContactButtons from "@/components/Listing/ContactButtons";
import ListingImageCarousel from "@/components/Listing/ListingImageCarousel";
import locationSvg from "../../../public/images/icon/location-pin.svg";
import clockSvg from "../../../public/images/icon/clock.svg";
import profileSvg from "../../../public/images/icon/profile.svg";

const ListingItem = ({
	id,
	title,
	slug,
	price,
	category,
	created_at,
	imageSrc,
	user,
	location_value,
	currentUser,
}) => {
	const mainImage = getListingImage(imageSrc);
	
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
				<div style={{
					position: "absolute",
					top: "12px",
					right: "12px",
				}}>
					<HeartButton currentUser={currentUser} listingId={id} />
				</div>
			</Link>

			<div style={{
				padding: "20px",
				display: "flex",
				flexDirection: "column",
				gap: "16px",
				flex: 1,
			}}>
				<div>
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
					{user && (
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
					justifyContent: "space-between",
					alignItems: "center",
				}}>
					<Link 
						href={`/listings/?category=${category}`}
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
					<span style={{
						fontSize: "18px",
						fontWeight: "600",
						color: "#FF385C",
					}}>
						{formattedPrice(price)}
					</span>
				</div>
				
				{/* Contact Buttons */}
				<ContactButtons listing={{ id, slug, title, location_value, price }} />
			</div>
		</div>
	);
};

export default ListingItem;

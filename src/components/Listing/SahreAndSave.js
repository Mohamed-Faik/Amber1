"use client";
import React, { useState } from "react";
import {
	FacebookShareButton,
	TwitterShareButton,
	LinkedinShareButton,
	WhatsappShareButton,
	FacebookIcon,
	TwitterIcon,
	LinkedinIcon,
	WhatsappIcon,
} from "react-share";
import HeartButton from "../HeartButton";

const SahreAndSave = ({ currentUser, listingId }) => {
	const [showShareMenu, setShowShareMenu] = useState(false);
	const shareUrl = typeof window !== "undefined" ? window.location.href : "";
	const title = "Check out this property listing";

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
			{/* Share Button */}
			<div style={{ position: "relative" }}>
				<button
					onClick={() => setShowShareMenu(!showShareMenu)}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						padding: "8px 16px",
						border: "1px solid #b0b0b0",
						borderRadius: "22px",
						backgroundColor: "transparent",
						cursor: "pointer",
						fontSize: "14px",
						fontWeight: "500",
						color: "#222222",
						transition: "all 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.borderColor = "#222222";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.borderColor = "#b0b0b0";
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
						<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
						<polyline points="16 6 12 2 8 6"></polyline>
						<line x1="12" y1="2" x2="12" y2="15"></line>
					</svg>
					Share
				</button>

				{/* Share Menu */}
				{showShareMenu && (
					<div
						style={{
							position: "absolute",
							top: "100%",
							left: 0,
							marginTop: "8px",
							backgroundColor: "#ffffff",
							border: "1px solid #dddddd",
							borderRadius: "12px",
							padding: "16px",
							boxShadow: "0 2px 16px rgba(0, 0, 0, 0.18)",
							zIndex: 100,
							minWidth: "200px",
						}}
						onMouseLeave={() => setShowShareMenu(false)}
					>
						<div
							style={{
								display: "flex",
								gap: "16px",
								justifyContent: "center",
							}}
						>
							<FacebookShareButton url={shareUrl} quote={title}>
								<FacebookIcon size={40} round />
							</FacebookShareButton>
							<TwitterShareButton url={shareUrl} title={title}>
								<TwitterIcon size={40} round />
							</TwitterShareButton>
							<LinkedinShareButton url={shareUrl} title={title}>
								<LinkedinIcon size={40} round />
							</LinkedinShareButton>
							<WhatsappShareButton url={shareUrl} title={title}>
								<WhatsappIcon size={40} round />
							</WhatsappShareButton>
						</div>
					</div>
				)}
			</div>

			{/* Save Button */}
			<HeartButton currentUser={currentUser} listingId={listingId} />
		</div>
	);
};

export default SahreAndSave;

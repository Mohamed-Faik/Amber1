"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";
import LanguageSwitcher from "@/components/Common/LanguageSwitcher";

const ListingHeader = () => {
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	return (
		<header
			style={{
				position: "sticky",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				backgroundColor: "#FFFFFF",
				borderBottom: "1px solid #E0E0E0",
				boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
			}}
		>
			<div
				style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: "0 24px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					height: "55px",
				}}
			>
				{/* Logo */}
				<Link
					href="/"
					style={{
						display: "flex",
						alignItems: "center",
						textDecoration: "none",
					}}
				>
					<Image
						src="/images/amberhomes png.png"
						alt="AmberHomes Logo"
						width={200}
						height={52}
						style={{
							height: "auto",
							width: "135px",
							maxHeight: "52px",
							maxWidth: "200px",
							objectFit: "contain",
						}}
						priority
						sizes="(max-width: 767px) 85px, (max-width: 991px) 110px, 200px"
					/>
				</Link>

				{/* Right Side - Language Switcher + Quick Submission Button */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
					}}
				>
					<LanguageSwitcher />

				</div>
			</div>
			<style jsx>{`
				.quick-submission-text-mobile {
					display: none;
				}
				@media (max-width: 767px) {
					.quick-submission-btn {
						font-weight: 600 !important;
					}
					.quick-submission-text-desktop {
						display: none;
					}
					.quick-submission-text-mobile {
						display: inline;
					}
				}
			`}</style>
		</header>
	);
};

export default ListingHeader;


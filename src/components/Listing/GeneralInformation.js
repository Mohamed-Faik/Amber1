"use client";
import React from "react";
import { Home, Building2, Layers, Eye } from "lucide-react";
import { getTranslation } from "@/utils/translations";

const GeneralInformation = ({ listing, displayLanguage }) => {
	return (
		<div
			style={{
				marginBottom: "48px",
				paddingBottom: "48px",
				borderBottom: "1px solid #E0E0E0",
			}}
		>
			<h2
				style={{
					fontSize: "24px",
					fontWeight: "700",
					color: "#222222",
					marginBottom: "32px",
				}}
			>
				{getTranslation(displayLanguage, "listings.generalInformation")}
			</h2>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
					gap: "24px",
				}}
			>
				{/* Pièces (Rooms) */}
				<div
					style={{
						padding: "24px",
						backgroundColor: "#FAFAFA",
						borderRadius: "12px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginBottom: "20px",
						}}
					>
						<div
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "10px",
								backgroundColor: "#FFF5F7",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Home size={20} style={{ color: "#FF385C" }} />
						</div>
						<h3
							style={{
								fontSize: "18px",
								fontWeight: "600",
								color: "#222222",
								margin: 0,
							}}
						>
							{getTranslation(displayLanguage, "listings.rooms")}
						</h3>
					</div>
					<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
						{listing.bedrooms && (
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<span style={{ fontSize: "14px", color: "#717171" }}>
									{getTranslation(displayLanguage, "listings.numberOfBedrooms")}
								</span>
								<span
									style={{
										fontSize: "16px",
										fontWeight: "600",
										color: "#222222",
										backgroundColor: "#FFFFFF",
										padding: "4px 12px",
										borderRadius: "6px",
									}}
								>
									{listing.bedrooms}
								</span>
							</div>
						)}
						{listing.bathrooms && (
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<span style={{ fontSize: "14px", color: "#717171" }}>
									{getTranslation(displayLanguage, "listings.numberOfBathrooms")}
								</span>
								<span
									style={{
										fontSize: "16px",
										fontWeight: "600",
										color: "#222222",
										backgroundColor: "#FFFFFF",
										padding: "4px 12px",
										borderRadius: "6px",
									}}
								>
									{listing.bathrooms}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Surfaces */}
				<div
					style={{
						padding: "24px",
						backgroundColor: "#FAFAFA",
						borderRadius: "12px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginBottom: "20px",
						}}
					>
						<div
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "10px",
								backgroundColor: "#FFF5F7",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Layers size={20} style={{ color: "#FF385C" }} />
						</div>
						<h3
							style={{
								fontSize: "18px",
								fontWeight: "600",
								color: "#222222",
								margin: 0,
							}}
						>
							{getTranslation(displayLanguage, "listings.surfaces")}
						</h3>
					</div>
					<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
						{listing.area && (
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<span style={{ fontSize: "14px", color: "#717171" }}>
									{getTranslation(displayLanguage, "listings.builtArea")}
								</span>
								<span
									style={{
										fontSize: "16px",
										fontWeight: "600",
										color: "#222222",
										backgroundColor: "#FFFFFF",
										padding: "4px 12px",
										borderRadius: "6px",
									}}
								>
									{listing.area} m²
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Construction */}
				<div
					style={{
						padding: "24px",
						backgroundColor: "#FAFAFA",
						borderRadius: "12px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginBottom: "20px",
						}}
					>
						<div
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "10px",
								backgroundColor: "#FFF5F7",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Building2 size={20} style={{ color: "#FF385C" }} />
						</div>
						<h3
							style={{
								fontSize: "18px",
								fontWeight: "600",
								color: "#222222",
								margin: 0,
							}}
						>
							{getTranslation(displayLanguage, "listings.construction")}
						</h3>
					</div>
					<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<span style={{ fontSize: "14px", color: "#717171" }}>
								{getTranslation(displayLanguage, "listings.propertyType")}
							</span>
							<span
								style={{
									fontSize: "16px",
									fontWeight: "600",
									color: "#222222",
									backgroundColor: "#FFFFFF",
									padding: "4px 12px",
									borderRadius: "6px",
								}}
							>
								{listing.category}
							</span>
						</div>
					</div>
				</div>

				{/* Cadre et situation */}
				<div
					style={{
						padding: "24px",
						backgroundColor: "#FAFAFA",
						borderRadius: "12px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginBottom: "20px",
						}}
					>
						<div
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "10px",
								backgroundColor: "#FFF5F7",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Eye size={20} style={{ color: "#FF385C" }} />
						</div>
						<h3
							style={{
								fontSize: "18px",
								fontWeight: "600",
								color: "#222222",
								margin: 0,
							}}
						>
							{getTranslation(displayLanguage, "listings.settingAndSituation")}
						</h3>
					</div>
					<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<span style={{ fontSize: "14px", color: "#717171" }}>
								{getTranslation(displayLanguage, "listings.view")}
							</span>
							<span
								style={{
									fontSize: "16px",
									fontWeight: "600",
									color: "#222222",
									backgroundColor: "#FFFFFF",
									padding: "4px 12px",
									borderRadius: "6px",
								}}
							>
								{getTranslation(displayLanguage, "listings.unobstructedView")}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GeneralInformation;

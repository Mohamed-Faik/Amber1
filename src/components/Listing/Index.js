"use client";
import React from "react";
import DetailsHead from "./DetailsHead";
import RightSidebar from "./RightSidebar";
import dynamic from "next/dynamic";
const MapWithNoSSR = dynamic(() => import("../Map"), {
	ssr: false,
});
import Features from "./Features";
import DetailsImages from "./DetailsImages";

const Index = ({ currentUser, listing, reviews }) => {
	return (
		<div
			style={{
				backgroundColor: "#ffffff",
				minHeight: "100vh",
				paddingTop: "24px",
				paddingBottom: "80px",
			}}
		>
			<div
				style={{
					maxWidth: "1120px",
					margin: "0 auto",
					padding: "0 40px",
				}}
				className="listing-container"
			>
				{/* Header Section */}
				<DetailsHead
					{...listing}
					currentUser={currentUser}
					listingId={listing.id}
				/>

				{/* Image Gallery */}
				<DetailsImages imageSrc={listing.imageSrc} />

				{/* Main Content Layout */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "minmax(0, 1fr) 400px",
						gap: "80px",
						marginTop: "48px",
					}}
					className="listing-content-grid"
				>
					{/* Left Column - Main Content */}
					<div>
						{/* Description */}
						<div
							style={{
								marginBottom: "48px",
								paddingBottom: "48px",
								borderBottom: "1px solid #ebebeb",
							}}
						>
							<h2
								style={{
									fontSize: "22px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "24px",
								}}
							>
								About this place
							</h2>
							<div
								dangerouslySetInnerHTML={{
									__html: listing.description,
								}}
								style={{
									fontSize: "16px",
									lineHeight: "1.6",
									color: "#222222",
								}}
							/>
						</div>

						{/* Features */}
						<div
							style={{
								marginBottom: "48px",
								paddingBottom: "48px",
								borderBottom: "1px solid #ebebeb",
							}}
						>
							<Features {...listing} />
						</div>

						{/* Map */}
						{listing && (
							<div
								style={{
									marginBottom: "48px",
									paddingBottom: "48px",
									borderBottom: "1px solid #ebebeb",
								}}
							>
								<h2
									style={{
										fontSize: "22px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "24px",
									}}
								>
									Where you'll be
								</h2>
								<div
									style={{
										borderRadius: "12px",
										overflow: "hidden",
										height: "400px",
									}}
								>
									<MapWithNoSSR
										latitude={listing.latitude}
										longitude={listing.longitude}
									/>
								</div>
								<p
									style={{
										marginTop: "16px",
										fontSize: "14px",
										color: "#222222",
										fontWeight: "500",
									}}
								>
									{listing.address}
								</p>
							</div>
						)}
					</div>

					{/* Right Column - Sticky Sidebar */}
					<div>
						<RightSidebar listing={listing} user={listing.user} currentUser={currentUser} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;

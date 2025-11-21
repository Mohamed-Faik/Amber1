import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import getMyFavourites from "@/actions/getFavourites";
import { getCurrentUser } from "@/actions/getCurrentUser";
import ListingCard from "./ListingCard";

export const dynamic = "force-dynamic";

const page = async () => {
	const currentUser = await getCurrentUser();
	
	// Only redirect if user is NOT authenticated
	if (!currentUser) {
		redirect("/auth/signin");
	}
	
	const favourites = await getMyFavourites();

	return (
		<div style={{
			backgroundColor: "#FAFAFA",
			minHeight: "100vh",
			position: "relative",
			overflow: "hidden",
		}}>
			{/* Decorative Background Elements */}
			<div style={{
				position: "absolute",
				top: "-200px",
				right: "-200px",
				width: "600px",
				height: "600px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(255, 56, 92, 0.05) 0%, rgba(230, 30, 77, 0.08) 100%)",
				zIndex: 0,
			}} />
			<div style={{
				position: "absolute",
				bottom: "-250px",
				left: "-250px",
				width: "700px",
				height: "700px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(215, 4, 102, 0.05) 0%, rgba(255, 56, 92, 0.08) 100%)",
				zIndex: 0,
			}} />
			
			<div style={{ height: "80px" }} />
			<Suspense fallback={
				<div style={{ 
					padding: "64px 32px", 
					textAlign: "center",
					position: "relative",
					zIndex: 1,
				}}>
					<div style={{
						display: "inline-block",
						width: "40px",
						height: "40px",
						border: "3px solid #FF385C",
						borderTopColor: "transparent",
						borderRadius: "50%",
						animation: "spin 0.8s linear infinite",
					}} />
					<style jsx>{`
						@keyframes spin {
							from { transform: rotate(0deg); }
							to { transform: rotate(360deg); }
						}
					`}</style>
				</div>
			}>
				<div style={{ position: "relative", zIndex: 1 }}>
					<ListingCard currentUser={currentUser} favourites={favourites || []} />
				</div>
			</Suspense>
		</div>
	);
};

export default page;

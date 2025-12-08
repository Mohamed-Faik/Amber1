import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import MultiStepListingForm from "@/components/Listings/New/MultiStepListingForm";
import ListingHeader from "@/components/Listings/New/ListingHeader";
import { getCurrentUser } from "@/actions/getCurrentUser";

const page = async () => {
	const currentUser = await getCurrentUser();
	
	// Only redirect if user is NOT authenticated
	if (!currentUser) {
		redirect("/auth/signin");
	}
	return (
		<div style={{
			backgroundColor: "#FAFAFA",
			minHeight: "100vh",
			position: "relative",
			overflow: "hidden",
		}}>
			<ListingHeader />
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
					<MultiStepListingForm currentUser={currentUser} />
				</div>
			</Suspense>
		</div>
	);
};

export default page;

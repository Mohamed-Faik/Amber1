import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import ListingForm from "@/components/Listings/New/ListingForm";

export const dynamic = "force-dynamic";

const EditListingPage = async ({ params }) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect("/auth/signin");
	}

	const listing = await getListingById(params?.listingId);
	const isOwner = listing && Number(listing.userId) === Number(currentUser.id);
	const isAdmin = currentUser.role === "ADMIN";

	if (!listing || (!isOwner && !isAdmin)) {
		redirect("/listings/my-listings");
	}

	return (
		<div
			style={{
				backgroundColor: "#FAFAFA",
				minHeight: "100vh",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "-200px",
					right: "-200px",
					width: "600px",
					height: "600px",
					borderRadius: "50%",
					background: "linear-gradient(135deg, rgba(255, 56, 92, 0.05) 0%, rgba(230, 30, 77, 0.08) 100%)",
					zIndex: 0,
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "-250px",
					left: "-250px",
					width: "700px",
					height: "700px",
					borderRadius: "50%",
					background: "linear-gradient(135deg, rgba(215, 4, 102, 0.05) 0%, rgba(255, 56, 92, 0.08) 100%)",
					zIndex: 0,
				}}
			/>

			<div style={{ height: "80px" }} />
			<Suspense
				fallback={
					<div
						style={{
							padding: "64px 32px",
							textAlign: "center",
							position: "relative",
							zIndex: 1,
						}}
					>
						<div
							style={{
								display: "inline-block",
								width: "40px",
								height: "40px",
								border: "3px solid #FF385C",
								borderTopColor: "transparent",
								borderRadius: "50%",
								animation: "spin 0.8s linear infinite",
							}}
						/>
						<style jsx>{`
							@keyframes spin {
								from {
									transform: rotate(0deg);
								}
								to {
									transform: rotate(360deg);
								}
							}
						`}</style>
					</div>
				}
			>
				<div style={{ position: "relative", zIndex: 1 }}>
					<ListingForm initialData={listing} />
				</div>
			</Suspense>
		</div>
	);
};

export default EditListingPage;


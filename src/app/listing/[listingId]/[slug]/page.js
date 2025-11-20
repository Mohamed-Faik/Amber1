import React from "react";
import PageBanner from "@/components/Common/PageBanner";
import getListingBySlug from "@/actions/getListingBySlug";
import Listing from "@/components/Listing/Index";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getReviewByListingId from "@/actions/getReviewsByListingId";

export const generateMetadata = ({ params }) => {
	return {
		title: `Listing - ${params.slug}`,
	};
};

const page = async ({ params }) => {
	const listing = await getListingBySlug(params);
	const currentUser = await getCurrentUser();
	const reviews = await getReviewByListingId(params);

	// Check if listing exists
	if (!listing) {
		return (
			<>
				<PageBanner pageTitle="Listing Not Found" />
				<div className="container ptb-100">
					<div className="alert alert-danger text-center">
						<h4>Listing not found</h4>
						<p>The listing you are looking for does not exist.</p>
					</div>
				</div>
			</>
		);
	}

	// Only show approved listings to public, or if user is the owner or admin
	const isOwner = currentUser?.id === listing.userId;
	const isAdmin = currentUser?.role === "ADMIN";
	
	if (listing.status !== "Approved" && !isOwner && !isAdmin) {
		return (
			<>
				<PageBanner pageTitle="Listing Pending Approval" />
				<div className="container ptb-100">
					<div className="alert alert-warning text-center">
						<h4>Listing Pending Approval</h4>
						<p>This listing is currently pending approval and is not available for viewing.</p>
					</div>
				</div>
			</>
		);
	}

	return (
		<Listing
			currentUser={currentUser}
			listing={listing}
			reviews={reviews}
		/>
	);
};

export default page;

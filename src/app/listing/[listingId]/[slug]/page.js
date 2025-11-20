import React from "react";
import PageBanner from "@/components/Common/PageBanner";
import getListingBySlug from "@/actions/getListingBySlug";
import Listing from "@/components/Listing/Index";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getReviewByListingId from "@/actions/getReviewsByListingId";
import { getListingImage } from "@/utils/getListingImage";
import StructuredData from "@/components/SEO/StructuredData";

export async function generateMetadata({ params }) {
	const listing = await getListingBySlug(params);
	
	if (!listing) {
		return {
			title: "Listing Not Found",
			description: "The listing you are looking for does not exist.",
		};
	}

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
	const listingUrl = `${siteUrl}/listing/${listing.id}/${listing.slug}`;
	const imageUrl = getListingImage(listing.imageSrc) 
		? `${siteUrl}${getListingImage(listing.imageSrc)}`
		: `${siteUrl}/images/default-listing.jpg`;
	
	const description = listing.description 
		? listing.description.substring(0, 160).replace(/<[^>]*>/g, "") + "..."
		: `Property listing: ${listing.title} in ${listing.location_value}`;

	return {
		title: listing.title,
		description,
		keywords: [listing.category, listing.location_value, "property", "real estate", "Morocco"],
		alternates: {
			canonical: listingUrl,
		},
		openGraph: {
			title: listing.title,
			description,
			url: listingUrl,
			siteName: "AmberHomes",
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: listing.title,
				},
			],
			locale: "en_US",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: listing.title,
			description,
			images: [imageUrl],
		},
	};
}

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
	const { hasAdminAccess } = await import("@/utils/checkRole");
	const userHasAdminAccess = hasAdminAccess(currentUser);
	
	if (listing.status !== "Approved" && !isOwner && !userHasAdminAccess) {
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
		<>
			<StructuredData listing={listing} reviews={reviews} />
			<Listing
				currentUser={currentUser}
				listing={listing}
				reviews={reviews}
			/>
		</>
	);
};

export default page;

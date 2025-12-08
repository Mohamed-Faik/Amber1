import { getListingImage } from "@/utils/getListingImage";
import { getAverageRating } from "@/utils/getAverageRating";

export default function StructuredData({ listing, reviews = [] }) {
	if (!listing) return null;

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amberhomes-liart.vercel.app/";
	const listingUrl = `${siteUrl}/listing/${listing.id}/${listing.slug}`;
	const imageUrl = getListingImage(listing.imageSrc) 
		? `${siteUrl}${getListingImage(listing.imageSrc)}`
		: `${siteUrl}/images/default-listing.jpg`;
	
	const averageRating = reviews.length > 0 ? getAverageRating(reviews) : null;
	const reviewCount = reviews.length;

	// Product/Place schema for property listings
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Product",
		"name": listing.title,
		"description": listing.description?.replace(/<[^>]*>/g, "").substring(0, 500) || listing.title,
		"image": imageUrl,
		"url": listingUrl,
		"offers": {
			"@type": "Offer",
			"price": listing.price,
			"priceCurrency": "MAD",
			"availability": listing.status === "Approved" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
		},
		"category": listing.category,
		"address": {
			"@type": "PostalAddress",
			"streetAddress": listing.address,
			"addressLocality": listing.location_value,
			"addressCountry": "MA",
		},
		...(listing.latitude && listing.longitude && {
			"geo": {
				"@type": "GeoCoordinates",
				"latitude": listing.latitude,
				"longitude": listing.longitude,
			},
		}),
		...(averageRating && reviewCount > 0 && {
			"aggregateRating": {
				"@type": "AggregateRating",
				"ratingValue": averageRating,
				"reviewCount": reviewCount,
				"bestRating": 5,
				"worstRating": 1,
			},
		}),
		...(reviews.length > 0 && {
			"review": reviews.slice(0, 5).map((review) => ({
				"@type": "Review",
				"author": {
					"@type": "Person",
					"name": review.user?.name || "Anonymous",
				},
				"reviewRating": {
					"@type": "Rating",
					"ratingValue": review.rating,
					"bestRating": 5,
					"worstRating": 1,
				},
				"reviewBody": review.comment || "",
			})),
		}),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}


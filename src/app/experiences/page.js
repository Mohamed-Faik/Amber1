import React from "react";
import ExperiencesPageClient from "@/components/Pages/ExperiencesPageClient";
import getListings from "@/actions/getListings";
import { getCurrentUser } from "@/actions/getCurrentUser";

export const dynamic = "force-dynamic";

const ExperiencesPage = async ({ searchParams }) => {
	const {
		listings,
		totalPages,
		startListingNumber,
		endListingNumber,
		totalListings: totalCount,
	} = await getListings({ ...searchParams, featureType: "EXPERIENCES" });
	const currentUser = await getCurrentUser();

	return (
		<ExperiencesPageClient
			listings={listings}
			totalPages={totalPages}
			startListingNumber={startListingNumber}
			endListingNumber={endListingNumber}
			totalCount={totalCount}
			currentUser={currentUser}
			searchParams={searchParams}
		/>
	);
};

export default ExperiencesPage;


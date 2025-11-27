import React from "react";
import HomesPageClient from "@/components/Pages/HomesPageClient";
import getListings from "@/actions/getListings";
import { getCurrentUser } from "@/actions/getCurrentUser";

export const dynamic = "force-dynamic";

const HomesPage = async ({ searchParams }) => {
	const {
		listings,
		totalPages,
		startListingNumber,
		endListingNumber,
		totalListings: totalCount,
	} = await getListings({ ...searchParams, featureType: "HOMES" });
	const currentUser = await getCurrentUser();

	return (
		<HomesPageClient
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

export default HomesPage;


"use client";
import React from "react";
import ListingItem from "./ListingItem";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ListingCard = ({ listings }) => {
	const router = useRouter();

	const deleteListing = async (listingId) => {
		const shouldDelete = window.confirm(
			"Are you sure you want to delete this listing?"
		);
		if (shouldDelete) {
			await axios
				.delete(`/api/listings/${listingId}`)
				.then((response) => {
					toast.success("Success");
					router.refresh();
				})
				.catch((error) => {
					toast.error("Something went wrong!");
				});
		}
	};
	return (
		<div className="row">
			{listings.length > 0 ? (
				listings.map((list) => (
					<ListingItem
						key={list.id}
						{...list}
						onDelete={() => deleteListing(list.id)}
					/>
				))
			) : (
				<div className="col-12">
					<div className="alert alert-info text-center">
						No listings found with the selected filter.
					</div>
				</div>
			)}
		</div>
	);
};

export default ListingCard;

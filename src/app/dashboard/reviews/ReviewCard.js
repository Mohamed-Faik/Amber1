"use client";
import React from "react";
import ReviewItem from "./ReviewItem";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ReviewCard = ({ reviews }) => {
	const router = useRouter();
	const deleteReview = async (reviewId) => {
		const shouldDelete = window.confirm(
			"Are you sure you want to delete this listing?"
		);

		if (shouldDelete) {
			await axios
				.delete(`/api/reviews/${reviewId}`)
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
			{reviews.map((review) => (
				<ReviewItem
					key={review.id}
					{...review}
					onDelete={() => deleteReview(review.id)}
				/>
			))}
		</div>
	);
};

export default ReviewCard;

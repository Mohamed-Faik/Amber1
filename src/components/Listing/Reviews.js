"use client";
import React from "react";

import cmtimg from "../../../public/images/blog/comment-1.jpg";
import cmtimg2 from "../../../public/images/blog/comment-2.jpg";
import ReviewItem from "./ReviewItem";

const Reviews = ({ reviews }) => {
	return (
		<div className="review-wrap">
			<h3>
				Reviews <span>({reviews.length})</span>
			</h3>
			<ul className="review-wrap-inner">
				{reviews.length > 0 &&
					reviews.map((review) => (
						<ReviewItem key={review.id} {...review} />
					))}
			</ul>
		</div>
	);
};

export default Reviews;

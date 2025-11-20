import React from "react";
import Image from "next/image";
import cmtimg from "../../../public/images/blog/comment-1.jpg";
import RatingStars from "./RatingStars";
import { formatDateWithMonth } from "@/utils/formatDate";

const ReviewItem = ({ id, rating, comment, created_at, user }) => {
	return (
		<li className="single-review-item">
			<RatingStars rating={rating} />
			<Image
				src={user?.image ? user.image : cmtimg}
				alt="Image"
				width={80}
				height={80}
			/>
			<h4>
				{user?.name} <span>{formatDateWithMonth(created_at)}</span>
			</h4>
			<p>{comment}</p>
		</li>
	);
};

export default ReviewItem;

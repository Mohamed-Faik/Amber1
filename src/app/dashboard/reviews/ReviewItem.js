"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDateWithMonth } from "@/utils/formatDate";

const ReviewItem = ({ comment, user, listing, created_at, onDelete }) => {
	return (
		<div className="col-md-6 col-lg-6 mb-4">
			<div className="review-card card">
				<div className="card-body p-4">
					<p className="card-title">{comment}</p>
					<ul>
						<li>Author: {user.name}</li>
						<li>Date: {formatDateWithMonth(created_at)}</li>
						<li>Listing: {listing.title}</li>
					</ul>

					<button
						className="btn btn-danger btn-delete btn-sm"
						onClick={onDelete}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default ReviewItem;

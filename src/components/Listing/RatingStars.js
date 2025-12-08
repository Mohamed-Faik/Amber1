"use client";
import React from "react";

const RatingStars = ({ rating }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating - fullStars >= 0.5;

	const stars = [];

	for (let i = 0; i < fullStars; i++) {
		stars.push(<i key={`full-star-${i}`} className="ri-star-fill"></i>);
	}

	if (hasHalfStar) {
		stars.push(<i key={`half-star`} className="ri-star-half-fill"></i>);
	}

	const emptyStars = 5 - stars.length;

	for (let i = 0; i < emptyStars; i++) {
		stars.push(<i key={`empty-star-${i}`} className="ri-star-line"></i>);
	}

	if (rating == 0) {
		return (
			<ul className="review">
				<li>
					<i className="ri-star-line"></i>
				</li>
				<li>
					<i className="ri-star-line"></i>
				</li>
				<li>
					<i className="ri-star-line"></i>
				</li>
				<li>
					<i className="ri-star-line"></i>
				</li>
				<li>
					<i className="ri-star-line"></i>
				</li>
			</ul>
		);
	}

	return (
		<ul className="review">
			{stars.map((star, index) => (
				<li key={index}>{star}</li>
			))}
		</ul>
	);
};

export default RatingStars;

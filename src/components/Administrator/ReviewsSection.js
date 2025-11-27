"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import { getTranslation } from "@/utils/translations";

const ReviewsSection = ({ reviews, displayLanguage = "en" }) => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");

	const filteredReviews = reviews?.filter(
		(review) =>
			review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			review.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = async (reviewId) => {
		if (!confirm("Are you sure you want to delete this review?")) {
			return;
		}

		try {
			await axios.delete(`/api/reviews/${reviewId}`);
			toast.success("Review deleted successfully!");
			if (typeof window !== "undefined") {
				router.refresh();
			}
		} catch (error) {
			toast.error("Failed to delete review");
		}
	};

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "24px",
					flexWrap: "wrap",
					gap: "16px",
				}}
			>
				<h2
					style={{
						fontSize: "24px",
						fontWeight: "600",
						color: "#222222",
						margin: 0,
				}}
			>
				{getTranslation(displayLanguage, "admin.allReviews")}
			</h2>

			{/* Search */}
			<input
				type="text"
				placeholder={getTranslation(displayLanguage, "admin.searchReviews")}
				value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					style={{
						padding: "10px 16px",
						border: "1px solid #DDDDDD",
						borderRadius: "8px",
						fontSize: "14px",
						width: "300px",
						outline: "none",
					}}
					className="reviews-search"
					onFocus={(e) => {
						e.currentTarget.style.borderColor = "#222222";
					}}
					onBlur={(e) => {
						e.currentTarget.style.borderColor = "#DDDDDD";
					}}
				/>
			</div>

			{/* Reviews List */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
					gap: "16px",
				}}
				className="reviews-grid"
			>
				{filteredReviews?.map((review) => (
					<div
						key={review.id}
						style={{
							border: "1px solid #DDDDDD",
							borderRadius: "12px",
							padding: "20px",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.boxShadow =
								"0 4px 12px rgba(0,0,0,0.1)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.boxShadow = "none";
						}}
					>
						{/* Rating */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								marginBottom: "12px",
							}}
						>
							{Array.from({ length: 5 }).map((_, i) => (
								<svg
									key={i}
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill={i < review.rating ? "#FF385C" : "#DDDDDD"}
									stroke="none"
								>
									<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
								</svg>
							))}
							<span
								style={{
									fontSize: "14px",
									fontWeight: "600",
									color: "#222222",
								}}
							>
								{review.rating}/5
							</span>
						</div>

						{/* Comment */}
						<p
							style={{
								fontSize: "14px",
								color: "#222222",
								marginBottom: "16px",
								lineHeight: "1.5",
							}}
						>
							{review.comment || "No comment"}
						</p>

						{/* Details */}
						<div
							style={{
								fontSize: "12px",
								color: "#717171",
								marginBottom: "16px",
								paddingTop: "16px",
								borderTop: "1px solid #F7F7F7",
							}}
						>
							<div style={{ marginBottom: "4px" }}>
								<strong>User:</strong> {review.user?.name || "Unknown"}
							</div>
							<div style={{ marginBottom: "4px" }}>
								<strong>Listing:</strong> {review.listing?.title || "Unknown"}
							</div>
							<div>
								<strong>Date:</strong> {formatDate(review.created_at)}
							</div>
						</div>

						{/* Actions */}
						<button
							onClick={() => handleDelete(review.id)}
							style={{
								width: "100%",
								padding: "8px 16px",
								backgroundColor: "#FFFFFF",
								color: "#FF385C",
								border: "1px solid #FF385C",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "500",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#FF385C";
								e.currentTarget.style.color = "#FFFFFF";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#FFFFFF";
								e.currentTarget.style.color = "#FF385C";
							}}
						>
							Delete Review
						</button>
					</div>
				))}
			</div>

			{filteredReviews?.length === 0 && (
				<div
					style={{
						textAlign: "center",
						padding: "64px 20px",
						color: "#717171",
					}}
				>
					<p style={{ fontSize: "16px", margin: 0 }}>
						{searchTerm
							? "No reviews found matching your search"
							: "No reviews found"}
					</p>
				</div>
			)}
			<style jsx>{`
				/* Tablet: 768px - 991px */
				@media (max-width: 991px) {
					.reviews-grid {
						grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
					}
					.reviews-search {
						width: 250px !important;
					}
				}

				/* Mobile: < 768px */
				@media (max-width: 767px) {
					.reviews-search {
						width: 100% !important;
					}
					.reviews-grid {
						grid-template-columns: 1fr !important;
					}
				}
			`}</style>
		</div>
	);
};

export default ReviewsSection;


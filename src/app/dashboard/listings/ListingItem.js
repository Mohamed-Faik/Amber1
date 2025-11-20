"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDateWithMonth } from "@/utils/formatDate";
import { getListingImage } from "@/utils/getListingImage";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ListingItem = ({
	id,
	title,
	slug,
	imageSrc,
	user,
	created_at,
	category,
	status,
	onDelete,
}) => {
	const router = useRouter();
	const mainImage = getListingImage(imageSrc);

	const handleStatusChange = async (newStatus) => {
		try {
			await axios.patch(`/api/listings/${id}/status`, {
				status: newStatus,
			});
			toast.success(`Listing ${newStatus.toLowerCase()} successfully!`);
			router.refresh();
		} catch (error) {
			toast.error("Failed to update listing status");
		}
	};

	const getStatusBadge = () => {
		if (status === "Pending") {
			return (
				<span className="badge bg-warning text-dark ms-2">Pending</span>
			);
		} else if (status === "Approved") {
			return <span className="badge bg-success ms-2">Approved</span>;
		} else if (status === "Canceled") {
			return <span className="badge bg-danger ms-2">Canceled</span>;
		}
		return null;
	};

	return (
		<div className="col-md-6 col-xl-4 mb-4">
			<div className="db-listing-card card">
				{mainImage ? (
					<Image
						src={mainImage}
						className="card-img-top"
						alt="Card Image"
						width={300}
						height={300}
						unoptimized
					/>
				) : (
					<div style={{ width: "100%", height: "200px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
						No Image Available
					</div>
				)}
				<div className="card-body">
					<h6 className="card-title">
						{title}
						{getStatusBadge()}
					</h6>

					<ul className="fs-14">
						<li>Author: {user.name}</li>
						<li>Date: {formatDateWithMonth(created_at)}</li>
						<li>Category: {category}</li>
						<li>Status: {status}</li>
					</ul>

					<div className="d-flex flex-wrap gap-2 mt-3">
						<Link
							href={`/listing/${id}/${slug}`}
							className="btn btn-primary btn-sm"
						>
							View Details
						</Link>

						{status === "Pending" && (
							<>
								<button
									className="btn btn-success btn-sm"
									onClick={() => handleStatusChange("Approved")}
								>
									Approve
								</button>
							</>
						)}

						{status === "Approved" && (
							<button
								className="btn btn-warning btn-sm"
								onClick={() => handleStatusChange("Pending")}
							>
								Set Pending
							</button>
						)}

						<button
							className="btn btn-danger btn-delete btn-sm"
							onClick={onDelete}
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ListingItem;

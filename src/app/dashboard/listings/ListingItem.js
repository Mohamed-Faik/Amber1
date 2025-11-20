"use client";
import React, { useState, useRef, useEffect } from "react";
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
	const [showStatusDropdown, setShowStatusDropdown] = useState(false);
	const dropdownRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowStatusDropdown(false);
			}
		};

		if (showStatusDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showStatusDropdown]);

	const handleStatusChange = async (newStatus) => {
		try {
			await axios.patch(`/api/listings/${id}/status`, {
				status: newStatus,
			});
			toast.success(`Listing ${newStatus.toLowerCase()} successfully!`);
			setShowStatusDropdown(false);
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

	const statusOptions = [
		{ value: "Pending", label: "Pending", color: "#F59E0B" },
		{ value: "Approved", label: "Approved", color: "#10B981" },
		{ value: "Canceled", label: "Canceled", color: "#EF4444" },
	];

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

						{/* Status Dropdown */}
						<div style={{ position: "relative" }} ref={dropdownRef}>
							<button
								className="btn btn-secondary btn-sm"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setShowStatusDropdown(!showStatusDropdown);
								}}
								style={{
									display: "flex",
									alignItems: "center",
									gap: "6px",
									position: "relative",
									zIndex: 1,
								}}
							>
								Change Status
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									style={{
										transform: showStatusDropdown
											? "rotate(180deg)"
											: "rotate(0deg)",
										transition: "transform 0.2s ease",
									}}
								>
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</button>

							{showStatusDropdown && (
								<div
									style={{
										position: "absolute",
										top: "100%",
										left: 0,
										marginTop: "4px",
										backgroundColor: "#ffffff",
										border: "1px solid #e5e7eb",
										borderRadius: "8px",
										boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
										minWidth: "160px",
										zIndex: 1000,
										overflow: "hidden",
									}}
								>
									{statusOptions.map((option) => (
										<button
											key={option.value}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												if (option.value !== status) {
													handleStatusChange(option.value);
												}
											}}
											style={{
												width: "100%",
												padding: "10px 16px",
												border: "none",
												backgroundColor:
													option.value === status
														? "#F3F4F6"
														: "transparent",
												color: "#111827",
												fontSize: "14px",
												textAlign: "left",
												cursor:
													option.value === status
														? "default"
														: "pointer",
												display: "flex",
												alignItems: "center",
												gap: "8px",
												transition: "background-color 0.2s ease",
											}}
											onMouseEnter={(e) => {
												if (option.value !== status) {
													e.currentTarget.style.backgroundColor =
														"#F9FAFB";
												}
											}}
											onMouseLeave={(e) => {
												if (option.value !== status) {
													e.currentTarget.style.backgroundColor =
														"transparent";
												}
											}}
											disabled={option.value === status}
										>
											<div
												style={{
													width: "8px",
													height: "8px",
													borderRadius: "50%",
													backgroundColor: option.color,
												}}
											/>
											{option.label}
											{option.value === status && (
												<span
													style={{
														marginLeft: "auto",
														fontSize: "12px",
														color: "#6B7280",
													}}
												>
													✓
												</span>
											)}
										</button>
									))}
								</div>
							)}
						</div>

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

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getListingImage } from "@/utils/getListingImage";
import { formatDate } from "@/utils/formatDate";

const ListingsSection = ({ listings: initialListings }) => {
	const router = useRouter();
	const [filterStatus, setFilterStatus] = useState("all");
	const [listings, setListings] = useState(initialListings || []);

	useEffect(() => {
		setListings(initialListings || []);
	}, [initialListings]);

	const filteredListings =
		filterStatus === "all"
			? listings
			: listings.filter((listing) => listing.status === filterStatus);

	const handleStatusChange = async (listingId, newStatus) => {
		try {
			await axios.patch(`/api/listings/${listingId}/status`, {
				status: newStatus,
			});
			toast.success(`Listing ${newStatus.toLowerCase()} successfully!`);
			// Update local state
			setListings((prev) =>
				prev.map((listing) =>
					listing.id === listingId
						? { ...listing, status: newStatus }
						: listing
				)
			);
			// Refresh server data
			setTimeout(() => {
				router.refresh();
			}, 100);
		} catch (error) {
			toast.error("Failed to update listing status");
		}
	};

	const handleDelete = async (listingId) => {
		if (!confirm("Are you sure you want to delete this listing?")) {
			return;
		}

		try {
			await axios.delete(`/api/listings/${listingId}`);
			toast.success("Listing deleted successfully!");
			// Update local state
			setListings((prev) => prev.filter((listing) => listing.id !== listingId));
			// Refresh server data
			setTimeout(() => {
				router.refresh();
			}, 100);
		} catch (error) {
			toast.error("Failed to delete listing");
		}
	};

	const getStatusBadge = (status) => {
		const styles = {
			Pending: {
				backgroundColor: "#FFF3CD",
				color: "#856404",
				border: "1px solid #FFE69C",
			},
			Approved: {
				backgroundColor: "#D1E7DD",
				color: "#0F5132",
				border: "1px solid #BADBCC",
			},
			Sold: {
				backgroundColor: "#D1FAE5",
				color: "#065F46",
				border: "1px solid #A7F3D0",
			},
			Canceled: {
				backgroundColor: "#F8D7DA",
				color: "#842029",
				border: "1px solid #F5C2C7",
			},
		};

		return (
			<span
				style={{
					padding: "4px 12px",
					borderRadius: "20px",
					fontSize: "12px",
					fontWeight: "600",
					...styles[status] || styles.Pending,
				}}
			>
				{status}
			</span>
		);
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
				className="listings-header"
			>
				<h2
					style={{
						fontSize: "24px",
						fontWeight: "600",
						color: "#222222",
						margin: 0,
					}}
					className="listings-title"
				>
					Manage Listings
				</h2>

			{/* Status Filter */}
			<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }} className="listings-filters">
				{["all", "Pending", "Approved", "Sold", "Canceled"].map((status) => (
						<button
							key={status}
							onClick={() => setFilterStatus(status)}
							style={{
								backgroundColor:
									filterStatus === status ? "#222222" : "#FFFFFF",
								color: filterStatus === status ? "#FFFFFF" : "#222222",
								border: "1px solid #DDDDDD",
								padding: "8px 16px",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "500",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								if (filterStatus !== status) {
									e.currentTarget.style.borderColor = "#222222";
								}
							}}
							onMouseLeave={(e) => {
								if (filterStatus !== status) {
									e.currentTarget.style.borderColor = "#DDDDDD";
								}
							}}
						>
							{status === "all" ? "All" : status}
						</button>
					))}
				</div>
			</div>

			{/* Listings Grid */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
					gap: "24px",
				}}
				className="listings-grid"
			>
				{filteredListings?.map((listing) => {
					const mainImage = getListingImage(listing.imageSrc);
					return (
						<div
							key={listing.id}
							style={{
								border: "1px solid #DDDDDD",
								borderRadius: "12px",
								overflow: "hidden",
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
							{/* Image */}
							<div
								style={{
									position: "relative",
									width: "100%",
									paddingTop: "60%",
									backgroundColor: "#F7F7F7",
								}}
							>
								{mainImage ? (
									<Image
										src={mainImage}
										alt={listing.title}
										fill
										style={{ objectFit: "cover" }}
										unoptimized
									/>
								) : (
									<div
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: "100%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#999",
										}}
									>
										No Image
									</div>
								)}
								<div
									style={{
										position: "absolute",
										top: "12px",
										right: "12px",
									}}
								>
									{getStatusBadge(listing.status)}
								</div>
							</div>

							{/* Content */}
							<div style={{ padding: "16px" }}>
								<h3
									style={{
										fontSize: "16px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
									}}
								>
									{listing.title}
								</h3>

								<div
									style={{
										fontSize: "14px",
										color: "#717171",
										marginBottom: "12px",
									}}
								>
									<div>Category: {listing.category}</div>
									<div>Location: {listing.location_value}</div>
									<div>Created: {formatDate(listing.created_at)}</div>
								</div>

								{/* Actions */}
								<div
									style={{
										display: "flex",
										gap: "8px",
										flexWrap: "wrap",
									}}
								>
									<Link
										href={`/listing/${listing.id}/${listing.slug}`}
										style={{
											flex: 1,
											padding: "8px 16px",
											backgroundColor: "#222222",
											color: "#FFFFFF",
											border: "none",
											borderRadius: "8px",
											fontSize: "14px",
											fontWeight: "500",
											textDecoration: "none",
											textAlign: "center",
											cursor: "pointer",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#000000";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = "#222222";
										}}
									>
										View
									</Link>

									{listing.status === "Pending" && (
										<button
											onClick={() =>
												handleStatusChange(listing.id, "Approved")
											}
											style={{
												flex: 1,
												padding: "8px 16px",
												backgroundColor: "#FF385C",
												color: "#FFFFFF",
												border: "none",
												borderRadius: "8px",
												fontSize: "14px",
												fontWeight: "500",
												cursor: "pointer",
												transition: "all 0.2s ease",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = "#E61E4D";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = "#FF385C";
											}}
										>
											Approve
										</button>
									)}

						{listing.status === "Approved" && listing.featureType !== "EXPERIENCES" && (
							<button
								onClick={() =>
									handleStatusChange(listing.id, "Sold")
								}
								style={{
									flex: 1,
									padding: "8px 16px",
									backgroundColor: "#10B981",
									color: "#FFFFFF",
									border: "none",
									borderRadius: "8px",
									fontSize: "14px",
									fontWeight: "500",
									cursor: "pointer",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "#059669";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "#10B981";
								}}
							>
								Mark as Sold
							</button>
						)}

						{listing.status === "Sold" && listing.featureType !== "EXPERIENCES" && (
							<button
								onClick={() =>
									handleStatusChange(listing.id, "Approved")
								}
								style={{
									flex: 1,
									padding: "8px 16px",
									backgroundColor: "#3B82F6",
									color: "#FFFFFF",
									border: "none",
									borderRadius: "8px",
									fontSize: "14px",
									fontWeight: "500",
									cursor: "pointer",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "#2563EB";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "#3B82F6";
								}}
							>
								Unmark as Sold
							</button>
						)}

							<button
								onClick={() => handleDelete(listing.id)}
										style={{
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
										Delete
									</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{filteredListings?.length === 0 && (
				<div
					style={{
						textAlign: "center",
						padding: "64px 20px",
						color: "#717171",
					}}
				>
					<p style={{ fontSize: "16px", margin: 0 }}>
						No listings found with status: {filterStatus}
					</p>
				</div>
			)}
			<style jsx>{`
				/* Tablet: 768px - 991px */
				@media (max-width: 991px) {
					.listings-grid {
						grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
						gap: 20px !important;
					}
					.listings-title {
						font-size: 20px !important;
					}
				}

				/* Mobile: < 768px */
				@media (max-width: 767px) {
					.listings-header {
						flex-direction: column !important;
						align-items: flex-start !important;
					}
					.listings-title {
						font-size: 18px !important;
					}
					.listings-filters {
						width: 100% !important;
					}
					.listings-filters button {
						flex: 1 !important;
						min-width: 80px !important;
					}
					.listings-grid {
						grid-template-columns: 1fr !important;
						gap: 16px !important;
					}
				}

				/* Small Mobile: < 480px */
				@media (max-width: 480px) {
					.listings-title {
						font-size: 16px !important;
					}
					.listings-filters button {
						font-size: 12px !important;
						padding: 6px 12px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default ListingsSection;


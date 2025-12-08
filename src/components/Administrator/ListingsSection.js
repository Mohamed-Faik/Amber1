"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getListingImage } from "@/utils/getListingImage";
import { formatDate } from "@/utils/formatDate";
import { getTranslation } from "@/utils/translations";
import TranslatedListingCard from "./TranslatedListingCard";

const ListingsSection = ({ listings: initialListings, displayLanguage = "en" }) => {
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

	const handlePremiumToggle = async (listingId, currentPremiumStatus) => {
		const newStatus = !currentPremiumStatus;
		try {
			await axios.patch(`/api/listings/${listingId}/premium`, {
				isPremium: newStatus,
			});
			toast.success(
				newStatus
					? "Listing marked as Premium!"
					: "Listing unmarked as Premium!"
			);
			// Update local state
			setListings((prev) =>
				prev.map((listing) =>
					listing.id === listingId
						? { ...listing, isPremium: newStatus }
						: listing
				)
			);
			// Refresh server data
			setTimeout(() => {
				router.refresh();
			}, 100);
		} catch (error) {
			toast.error("Failed to update premium status");
		}
	};

	const getStatusBadge = (status) => {
		const getStatusText = (s) => {
			if (s === "Pending") return getTranslation(displayLanguage, "admin.pending");
			if (s === "Approved") return getTranslation(displayLanguage, "admin.approved");
			if (s === "Sold") return getTranslation(displayLanguage, "admin.sold");
			if (s === "Canceled") return "Canceled";
			return s;
		};
		
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
			{getStatusText(status)}
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
				{getTranslation(displayLanguage, "admin.allListings")}
			</h2>

		{/* Status Filter */}
		<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }} className="listings-filters">
			{["all", "Pending", "Approved", "Sold", "Canceled"].map((status) => {
				const getStatusLabel = (s) => {
					if (s === "all") return getTranslation(displayLanguage, "admin.all");
					if (s === "Pending") return getTranslation(displayLanguage, "admin.pending");
					if (s === "Approved") return getTranslation(displayLanguage, "admin.approved");
					if (s === "Sold") return getTranslation(displayLanguage, "admin.sold");
					if (s === "Canceled") return "Canceled";
					return s;
				};
				
				return (
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
						{getStatusLabel(status)}
					</button>
				);
			})}
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
		{filteredListings?.map((listing) => (
			<TranslatedListingCard
				key={listing.id}
				listing={listing}
				displayLanguage={displayLanguage}
				getStatusBadge={getStatusBadge}
				handleStatusChange={handleStatusChange}
				handleDelete={handleDelete}
				handlePremiumToggle={handlePremiumToggle}
			/>
		))}
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
					{getTranslation(displayLanguage, "admin.noListingsFound")}
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


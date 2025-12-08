"use client";
import React from "react";
import Link from "next/link";

const StatusFilter = ({ currentStatus }) => {
	const filters = [
		{ status: "all", label: "All", color: "#6B7280" },
		{ status: "Pending", label: "Pending", color: "#F59E0B" },
		{ status: "Approved", label: "Approved", color: "#10B981" },
		{ status: "Sold", label: "Sold", color: "#059669" },
		{ status: "Canceled", label: "Canceled", color: "#EF4444" },
	];

	return (
		<div
			style={{
				backgroundColor: "#ffffff",
				borderRadius: "16px",
				padding: "20px",
				marginBottom: "24px",
				boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
				border: "1px solid #e5e7eb",
			}}
		>
			<div
				style={{
					display: "flex",
					gap: "12px",
					flexWrap: "wrap",
				}}
			>
				{filters.map((filter) => {
					const isActive = currentStatus === filter.status;
					return (
						<Link
							key={filter.status}
							href={`/dashboard/listings?status=${filter.status}`}
							style={{
								padding: "10px 20px",
								borderRadius: "8px",
								textDecoration: "none",
								fontWeight: "600",
								fontSize: "14px",
								backgroundColor: isActive ? filter.color : "#F9FAFB",
								color: isActive ? "#ffffff" : "#6B7280",
								border: `1px solid ${isActive ? filter.color : "#e5e7eb"}`,
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								if (!isActive) {
									e.currentTarget.style.backgroundColor = "#F3F4F6";
									e.currentTarget.style.borderColor = "#D1D5DB";
								}
							}}
							onMouseLeave={(e) => {
								if (!isActive) {
									e.currentTarget.style.backgroundColor = "#F9FAFB";
									e.currentTarget.style.borderColor = "#e5e7eb";
								}
							}}
						>
							{filter.label}
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default StatusFilter;


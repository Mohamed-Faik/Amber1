"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";

const UsersSection = ({ users }) => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");

	const filteredUsers = users?.filter(
		(user) =>
			user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = async (userId, userName) => {
		if (
			!confirm(
				`Are you sure you want to delete user "${userName}"? This action cannot be undone.`
			)
		) {
			return;
		}

		try {
			await axios.delete(`/api/users/${userId}`);
			toast.success("User deleted successfully!");
			if (typeof window !== "undefined") {
				router.refresh();
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to delete user"
			);
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
					Manage Users
				</h2>

				{/* Search */}
				<input
					type="text"
					placeholder="Search users by name or email..."
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
					onFocus={(e) => {
						e.currentTarget.style.borderColor = "#222222";
					}}
					onBlur={(e) => {
						e.currentTarget.style.borderColor = "#DDDDDD";
					}}
				/>
			</div>

			{/* Users List */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
					gap: "16px",
				}}
			>
				{filteredUsers?.map((user) => (
					<div
						key={user.id}
						style={{
							border: "1px solid #DDDDDD",
							borderRadius: "12px",
							padding: "20px",
							display: "flex",
							gap: "16px",
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
						{/* Avatar */}
						<div
							style={{
								width: "60px",
								height: "60px",
								borderRadius: "50%",
								overflow: "hidden",
								flexShrink: 0,
								backgroundColor: "#F7F7F7",
							}}
						>
							{user.image ? (
								<Image
									src={user.image}
									alt={user.name || "User"}
									width={60}
									height={60}
									style={{ objectFit: "cover" }}
									unoptimized
								/>
							) : (
								<div
									style={{
										width: "100%",
										height: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: "#DDDDDD",
										color: "#717171",
										fontSize: "24px",
										fontWeight: "600",
									}}
								>
									{(user.name || user.email || "U")[0].toUpperCase()}
								</div>
							)}
						</div>

						{/* User Info */}
						<div style={{ flex: 1, minWidth: 0 }}>
							<h3
								style={{
									fontSize: "16px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "4px",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{user.name || "No Name"}
							</h3>
							<p
								style={{
									fontSize: "14px",
									color: "#717171",
									marginBottom: "4px",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{user.email}
							</p>
							<p
								style={{
									fontSize: "12px",
									color: "#999",
									marginBottom: "12px",
								}}
							>
								Joined: {formatDate(user.created_at)}
							</p>

							{/* Role Badge */}
							<div
								style={{
									display: "inline-block",
									padding: "4px 12px",
									borderRadius: "20px",
									fontSize: "12px",
									fontWeight: "600",
									backgroundColor:
										user.role === "ADMIN"
											? "#FF385C"
											: "#222222",
									color: "#FFFFFF",
									marginBottom: "12px",
								}}
							>
								{user.role}
							</div>

							{/* Actions */}
							<div style={{ display: "flex", gap: "8px" }}>
								<button
									onClick={() => handleDelete(user.id, user.name || user.email)}
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
				))}
			</div>

			{filteredUsers?.length === 0 && (
				<div
					style={{
						textAlign: "center",
						padding: "64px 20px",
						color: "#717171",
					}}
				>
					<p style={{ fontSize: "16px", margin: 0 }}>
						{searchTerm
							? "No users found matching your search"
							: "No users found"}
					</p>
				</div>
			)}
		</div>
	);
};

export default UsersSection;


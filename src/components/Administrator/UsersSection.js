"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import { Phone, MessageCircle, MapPin, Mail, Calendar, X } from "lucide-react";
import { getTranslation } from "@/utils/translations";

const UsersSection = ({ users, displayLanguage = "en" }) => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);

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
			console.error("Error deleting user:", error);
			const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to delete user";
			toast.error(errorMessage);
		}
	};

	const handleStatusToggle = async (userId, currentStatus, userName) => {
		const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
		const action = newStatus === "Active" ? "activate" : "deactivate";
		
		if (!confirm(`Are you sure you want to ${action} user "${userName}"?`)) {
			return;
		}

		try {
			await axios.patch(`/api/users/${userId}`, {
				status: newStatus,
			});
			toast.success(`User ${action}d successfully!`);
			if (typeof window !== "undefined") {
				router.refresh();
			}
		} catch (error) {
			console.error("Error toggling user status:", error);
			const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || `Failed to ${action} user`;
			toast.error(errorMessage);
		}
	};

	const handleRoleChange = async (userId, newRole, userName) => {
		if (!confirm(`Change role of "${userName}" to ${newRole}?`)) {
			return;
		}

		try {
			await axios.patch(`/api/users/${userId}`, {
				role: newRole,
			});
			toast.success(`User role updated to ${newRole}!`);
			if (typeof window !== "undefined") {
				router.refresh();
			}
		} catch (error) {
			console.error("Error updating user role:", error);
			const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to update user role";
			toast.error(errorMessage);
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
				{getTranslation(displayLanguage, "admin.allUsers")}
			</h2>

			{/* Search */}
			<input
				type="text"
				placeholder={getTranslation(displayLanguage, "admin.searchUsers")}
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
					className="users-search"
					onFocus={(e) => {
						e.currentTarget.style.borderColor = "#222222";
					}}
					onBlur={(e) => {
						e.currentTarget.style.borderColor = "#DDDDDD";
					}}
				/>
			</div>

			{/* Users Grid */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
					gap: "16px",
				}}
				className="users-grid"
			>
				{filteredUsers?.map((user) => (
					<div
						key={user.id}
						onClick={() => setSelectedUser(user)}
						style={{
							border: "1px solid #DDDDDD",
							borderRadius: "12px",
							padding: "20px",
							display: "flex",
							gap: "16px",
							transition: "all 0.2s ease",
							cursor: "pointer",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.boxShadow =
								"0 4px 12px rgba(0,0,0,0.1)";
							e.currentTarget.style.transform = "translateY(-2px)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.boxShadow = "none";
							e.currentTarget.style.transform = "translateY(0)";
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
							{getTranslation(displayLanguage, "admin.joinedDate")}: {formatDate(user.created_at)}
						</p>

							{/* Role Badge */}
							<div style={{ display: "flex", gap: "8px", marginBottom: "0", flexWrap: "wrap" }}>
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
												: user.role === "MODERATOR"
												? "#8B5CF6"
												: user.role === "SUPPORT"
												? "#3B82F6"
												: "#222222",
										color: "#FFFFFF",
									}}
								>
									{user.role}
								</div>
								{/* Status Badge */}
								<div
									style={{
										display: "inline-block",
										padding: "4px 12px",
										borderRadius: "20px",
										fontSize: "12px",
										fontWeight: "600",
										backgroundColor:
											user.status === "Active"
												? "#10B981"
												: "#EF4444",
										color: "#FFFFFF",
									}}
								>
									{user.status || "Active"}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* User Details Modal */}
			{selectedUser && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 10000,
						padding: "20px",
					}}
					onClick={() => setSelectedUser(null)}
				>
					<div
						style={{
							backgroundColor: "#FFFFFF",
							borderRadius: "16px",
							maxWidth: "900px",
							width: "100%",
							maxHeight: "90vh",
							overflow: "auto",
							position: "relative",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close Button */}
						<button
							onClick={() => setSelectedUser(null)}
							style={{
								position: "sticky",
								top: "20px",
								left: "calc(100% - 60px)",
								width: "40px",
								height: "40px",
								borderRadius: "50%",
								backgroundColor: "#FFFFFF",
								border: "1px solid #DDDDDD",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								zIndex: 1,
								marginBottom: "-40px",
								boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#F7F7F7";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#FFFFFF";
							}}
						>
							<X size={20} color="#222222" />
						</button>

						{/* Modal Content */}
						<div style={{ padding: "40px" }}>
							{/* User Header */}
							<div style={{ display: "flex", gap: "20px", marginBottom: "32px", alignItems: "flex-start" }}>
								<div
									style={{
										width: "100px",
										height: "100px",
										borderRadius: "50%",
										overflow: "hidden",
										flexShrink: 0,
										backgroundColor: "#F7F7F7",
									}}
								>
									{selectedUser.image ? (
										<Image
											src={selectedUser.image}
											alt={selectedUser.name || "User"}
											width={100}
											height={100}
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
												fontSize: "40px",
												fontWeight: "600",
											}}
										>
											{(selectedUser.name || selectedUser.email || "U")[0].toUpperCase()}
										</div>
									)}
								</div>
								<div style={{ flex: 1 }}>
									<h2 style={{
										fontSize: "28px",
										fontWeight: "700",
										color: "#222222",
										marginBottom: "8px",
									}}>
										{selectedUser.name || "No Name"}
									</h2>
									<p style={{
										fontSize: "16px",
										color: "#717171",
										marginBottom: "12px",
									}}>
										{selectedUser.email}
									</p>
									<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
										<div
											style={{
												display: "inline-block",
												padding: "6px 16px",
												borderRadius: "20px",
												fontSize: "14px",
												fontWeight: "600",
												backgroundColor:
													selectedUser.role === "ADMIN"
														? "#FF385C"
														: selectedUser.role === "MODERATOR"
														? "#8B5CF6"
														: selectedUser.role === "SUPPORT"
														? "#3B82F6"
														: "#222222",
												color: "#FFFFFF",
											}}
										>
											{selectedUser.role}
										</div>
										<div
											style={{
												display: "inline-block",
												padding: "6px 16px",
												borderRadius: "20px",
												fontSize: "14px",
												fontWeight: "600",
												backgroundColor:
													selectedUser.status === "Active"
														? "#10B981"
														: "#EF4444",
												color: "#FFFFFF",
											}}
										>
											{selectedUser.status || "Active"}
										</div>
									</div>
								</div>
							</div>

							{/* User Details Grid */}
							<div style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
								gap: "24px",
								marginBottom: "32px",
							}}>
								{/* Contact Information */}
								<div>
									<h5 style={{
										fontSize: "14px",
										fontWeight: "600",
										color: "#FF385C",
										marginBottom: "16px",
										textTransform: "uppercase",
										letterSpacing: "0.5px",
									}}>
										{getTranslation(displayLanguage, "admin.contactInfo")}
									</h5>
									<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
										<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
											<Mail size={18} color="#717171" />
											<div>
												<p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{getTranslation(displayLanguage, "admin.email")}</p>
												<p style={{ fontSize: "14px", color: "#222", margin: 0, fontWeight: "500" }}>
													{selectedUser.email || "N/A"}
												</p>
											</div>
										</div>
										{selectedUser.profile?.phone && (
											<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
												<Phone size={18} color="#717171" />
												<div>
													<p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{getTranslation(displayLanguage, "admin.phoneNumber")}</p>
													<p style={{ fontSize: "14px", color: "#222", margin: 0, fontWeight: "500" }}>
														{selectedUser.profile.phone}
													</p>
												</div>
											</div>
										)}
										{selectedUser.profile?.whatsappNumber && (
											<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
												<MessageCircle size={18} color="#25D366" />
												<div>
													<p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{getTranslation(displayLanguage, "admin.whatsappNumber")}</p>
													<p style={{ fontSize: "14px", color: "#222", margin: 0, fontWeight: "500" }}>
														{selectedUser.profile.whatsappNumber}
													</p>
												</div>
											</div>
										)}
										{(!selectedUser.profile?.phone && !selectedUser.profile?.whatsappNumber) && (
											<p style={{ fontSize: "13px", color: "#999", fontStyle: "italic" }}>
												{getTranslation(displayLanguage, "admin.noContactNumbers")}
											</p>
										)}
									</div>
								</div>

								{/* Personal Information */}
								<div>
									<h5 style={{
										fontSize: "14px",
										fontWeight: "600",
										color: "#FF385C",
										marginBottom: "16px",
										textTransform: "uppercase",
										letterSpacing: "0.5px",
									}}>
										{getTranslation(displayLanguage, "admin.personalInfo")}
									</h5>
									<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
										<div>
											<p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{getTranslation(displayLanguage, "admin.fullName")}</p>
											<p style={{ fontSize: "14px", color: "#222", margin: 0, fontWeight: "500" }}>
												{selectedUser.name || "N/A"}
											</p>
										</div>
										{selectedUser.profile?.gender && (
											<div>
												<p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{getTranslation(displayLanguage, "admin.gender")}</p>
												<p style={{ fontSize: "14px", color: "#222", margin: 0, fontWeight: "500" }}>
													{selectedUser.profile.gender}
												</p>
											</div>
										)}
										{selectedUser.profile?.address && (
											<div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
												<MapPin size={18} color="#717171" style={{ marginTop: "2px", flexShrink: 0 }} />
												<div>
													<p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{getTranslation(displayLanguage, "admin.address")}</p>
													<p style={{ fontSize: "14px", color: "#222", margin: 0, fontWeight: "500" }}>
														{selectedUser.profile.address}
													</p>
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Account Information */}
								<div>
									<h5 style={{
										fontSize: "14px",
										fontWeight: "600",
										color: "#FF385C",
										marginBottom: "16px",
										textTransform: "uppercase",
										letterSpacing: "0.5px",
									}}>
										{getTranslation(displayLanguage, "admin.accountInfo")}
									</h5>
									<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
										<div>
											<p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{getTranslation(displayLanguage, "admin.userId")}</p>
											<p style={{ fontSize: "14px", color: "#222", margin: 0, fontWeight: "500" }}>
												#{selectedUser.id}
											</p>
										</div>
										<div>
											<p style={{ fontSize: "12px", color: "#999", margin: 0 }}>{getTranslation(displayLanguage, "admin.accountCreated")}</p>
											<p style={{ fontSize: "14px", color: "#222", margin: 0, fontWeight: "500" }}>
												{formatDate(selectedUser.created_at)}
											</p>
										</div>
									</div>
								</div>

								{/* Social Links (if any) */}
								{(selectedUser.profile?.website || selectedUser.profile?.twitter || selectedUser.profile?.facebook || selectedUser.profile?.linkedin || selectedUser.profile?.youtube) && (
									<div>
										<h5 style={{
											fontSize: "14px",
											fontWeight: "600",
											color: "#FF385C",
											marginBottom: "16px",
											textTransform: "uppercase",
											letterSpacing: "0.5px",
										}}>
											{getTranslation(displayLanguage, "admin.socialLinks")}
										</h5>
										<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
											{selectedUser.profile.website && (
												<a 
													href={selectedUser.profile.website} 
													target="_blank" 
													rel="noopener noreferrer"
													style={{
														fontSize: "14px",
														color: "#FF385C",
														textDecoration: "none",
													}}
												>
													🌐 {getTranslation(displayLanguage, "admin.website")}
												</a>
											)}
											{selectedUser.profile.twitter && (
												<a 
													href={`https://twitter.com/${selectedUser.profile.twitter}`} 
													target="_blank" 
													rel="noopener noreferrer"
													style={{
														fontSize: "14px",
														color: "#FF385C",
														textDecoration: "none",
													}}
												>
													🐦 Twitter
												</a>
											)}
											{selectedUser.profile.facebook && (
												<a 
													href={`https://facebook.com/${selectedUser.profile.facebook}`} 
													target="_blank" 
													rel="noopener noreferrer"
													style={{
														fontSize: "14px",
														color: "#FF385C",
														textDecoration: "none",
													}}
												>
													📘 Facebook
												</a>
											)}
											{selectedUser.profile.linkedin && (
												<a 
													href={`https://linkedin.com/in/${selectedUser.profile.linkedin}`} 
													target="_blank" 
													rel="noopener noreferrer"
													style={{
														fontSize: "14px",
														color: "#FF385C",
														textDecoration: "none",
													}}
												>
													💼 LinkedIn
												</a>
											)}
											{selectedUser.profile.youtube && (
												<a 
													href={`https://youtube.com/@${selectedUser.profile.youtube}`} 
													target="_blank" 
													rel="noopener noreferrer"
													style={{
														fontSize: "14px",
														color: "#FF385C",
														textDecoration: "none",
													}}
												>
													📺 YouTube
												</a>
											)}
										</div>
									</div>
								)}
							</div>

							{/* Bio (if any) */}
							{selectedUser.profile?.bio && (
								<div style={{ marginBottom: "32px" }}>
									<h5 style={{
										fontSize: "14px",
										fontWeight: "600",
										color: "#FF385C",
										marginBottom: "12px",
										textTransform: "uppercase",
										letterSpacing: "0.5px",
									}}>
										{getTranslation(displayLanguage, "admin.bio")}
									</h5>
									<p style={{
										fontSize: "14px",
										color: "#555",
										lineHeight: "1.6",
										margin: 0,
									}}>
										{selectedUser.profile.bio}
									</p>
								</div>
							)}

							{/* Admin Actions */}
							<div style={{
								paddingTop: "24px",
								borderTop: "2px solid #F0F0F0",
							}}>
								<h5 style={{
									fontSize: "16px",
									fontWeight: "600",
									color: "#222",
									marginBottom: "16px",
								}}>
									{getTranslation(displayLanguage, "admin.adminActions")}
								</h5>
								<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
									{/* Activate/Deactivate Button */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleStatusToggle(selectedUser.id, selectedUser.status || "Active", selectedUser.name || selectedUser.email);
											setSelectedUser(null);
										}}
										style={{
											padding: "10px 20px",
											backgroundColor: selectedUser.status === "Active" ? "#FFFFFF" : "#10B981",
											color: selectedUser.status === "Active" ? "#EF4444" : "#FFFFFF",
											border: `2px solid ${selectedUser.status === "Active" ? "#EF4444" : "#10B981"}`,
											borderRadius: "8px",
											fontSize: "14px",
											fontWeight: "600",
											cursor: "pointer",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											if (selectedUser.status === "Active") {
												e.currentTarget.style.backgroundColor = "#EF4444";
												e.currentTarget.style.color = "#FFFFFF";
											} else {
												e.currentTarget.style.backgroundColor = "#059669";
											}
										}}
										onMouseLeave={(e) => {
											if (selectedUser.status === "Active") {
												e.currentTarget.style.backgroundColor = "#FFFFFF";
												e.currentTarget.style.color = "#EF4444";
											} else {
												e.currentTarget.style.backgroundColor = "#10B981";
											}
									}}
								>
									{selectedUser.status === "Active" ? getTranslation(displayLanguage, "admin.deactivateUser") : getTranslation(displayLanguage, "admin.activateUser")}
								</button>

								{/* Role Change Dropdown */}
								<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
									<span style={{ fontSize: "14px", color: "#717171", fontWeight: "500" }}>{getTranslation(displayLanguage, "admin.changeRole")}:</span>
										<select
											value={selectedUser.role || "USER"}
											onChange={(e) => {
												handleRoleChange(selectedUser.id, e.target.value, selectedUser.name || selectedUser.email);
												setSelectedUser(null);
											}}
											onClick={(e) => e.stopPropagation()}
											style={{
												padding: "10px 16px",
												border: "2px solid #DDDDDD",
												borderRadius: "8px",
												fontSize: "14px",
												fontWeight: "600",
												cursor: "pointer",
												backgroundColor: "#FFFFFF",
												color: "#222222",
												outline: "none",
											}}
											onFocus={(e) => {
												e.currentTarget.style.borderColor = "#FF385C";
											}}
											onBlur={(e) => {
												e.currentTarget.style.borderColor = "#DDDDDD";
											}}
										>
											<option value="USER">USER</option>
											<option value="MODERATOR">MODERATOR</option>
											<option value="SUPPORT">SUPPORT</option>
											<option value="ADMIN">ADMIN</option>
										</select>
									</div>

									{/* Delete Button */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(selectedUser.id, selectedUser.name || selectedUser.email);
											setSelectedUser(null);
										}}
										style={{
											padding: "10px 20px",
											backgroundColor: "#FFFFFF",
											color: "#FF385C",
											border: "2px solid #FF385C",
											borderRadius: "8px",
											fontSize: "14px",
											fontWeight: "600",
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
										{getTranslation(displayLanguage, "admin.deleteUser")}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

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
			<style jsx>{`
				/* Tablet: 768px - 991px */
				@media (max-width: 991px) {
					.users-grid {
						grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
					}
					.users-search {
						width: 250px !important;
					}
				}

				/* Mobile: < 768px */
				@media (max-width: 767px) {
					.users-search {
						width: 100% !important;
					}
					.users-grid {
						grid-template-columns: 1fr !important;
					}
				}
			`}</style>
		</div>
	);
};

export default UsersSection;


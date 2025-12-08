"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Download, Trash2, Shield, FileText, AlertTriangle } from "lucide-react";

const PrivacySettings = ({ currentUser }) => {
	const router = useRouter();
	const [isExporting, setIsExporting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteEmail, setDeleteEmail] = useState("");
	const [deleteReason, setDeleteReason] = useState("");

	const handleDataExport = async () => {
		setIsExporting(true);
		try {
			const response = await axios.get("/api/user/data-export", {
				responseType: "blob",
			});

			// Create download link
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `amberhomes-data-export-${Date.now()}.json`);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);

			toast.success("Your data has been exported successfully!");
		} catch (error) {
			toast.error("Failed to export data. Please try again.");
			console.error("Export error:", error);
		} finally {
			setIsExporting(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (deleteEmail !== currentUser.email) {
			toast.error("Email confirmation does not match");
			return;
		}

		setIsDeleting(true);
		try {
			await axios.delete("/api/user/delete-account", {
				data: {
					confirmEmail: deleteEmail,
					reason: deleteReason,
				},
			});

			toast.success("Your account has been permanently deleted.");
			
			// Sign out and redirect
			setTimeout(() => {
				signOut({ callbackUrl: "/" });
			}, 2000);
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to delete account");
			setIsDeleting(false);
		}
	};

	return (
		<div>
			<div style={{ marginBottom: "32px" }}>
				<h1
					style={{
						fontSize: "32px",
						fontWeight: "700",
						color: "#111827",
						marginBottom: "8px",
					}}
				>
					Privacy Settings
				</h1>
				<p
					style={{
						fontSize: "16px",
						color: "#6B7280",
						margin: 0,
					}}
				>
					Manage your privacy and data according to GDPR regulations
				</p>
			</div>

			{/* Data Export Section */}
			<div
				style={{
					backgroundColor: "#FFFFFF",
					borderRadius: "16px",
					padding: "32px",
					marginBottom: "24px",
					border: "1px solid #E0E0E0",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
					<div
						style={{
							width: "48px",
							height: "48px",
							borderRadius: "12px",
							backgroundColor: "#F0F9FF",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Download size={24} color="#3B82F6" />
					</div>
					<div style={{ flex: 1 }}>
						<h2
							style={{
								fontSize: "20px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "4px",
							}}
						>
							Export Your Data
						</h2>
						<p
							style={{
								fontSize: "14px",
								color: "#717171",
								margin: 0,
							}}
						>
							Download all your personal data in a machine-readable format (GDPR Right to Data Portability)
						</p>
					</div>
				</div>

				<p
					style={{
						fontSize: "14px",
						color: "#717171",
						lineHeight: "1.6",
						marginBottom: "20px",
					}}
				>
					Your exported data will include: personal information, profile data, listings, reviews, and connected accounts.
				</p>

				<button
					onClick={handleDataExport}
					disabled={isExporting}
					style={{
						padding: "12px 24px",
						border: "none",
						borderRadius: "8px",
						backgroundColor: "#3B82F6",
						color: "#FFFFFF",
						fontSize: "14px",
						fontWeight: "600",
						cursor: isExporting ? "not-allowed" : "pointer",
						opacity: isExporting ? 0.6 : 1,
						display: "flex",
						alignItems: "center",
						gap: "8px",
					}}
				>
					<Download size={16} />
					{isExporting ? "Exporting..." : "Export My Data"}
				</button>
			</div>

			{/* Account Deletion Section */}
			<div
				style={{
					backgroundColor: "#FFFFFF",
					borderRadius: "16px",
					padding: "32px",
					border: "1px solid #E0E0E0",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
					<div
						style={{
							width: "48px",
							height: "48px",
							borderRadius: "12px",
							backgroundColor: "#FEF2F2",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Trash2 size={24} color="#EF4444" />
					</div>
					<div style={{ flex: 1 }}>
						<h2
							style={{
								fontSize: "20px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "4px",
							}}
						>
							Delete Your Account
						</h2>
						<p
							style={{
								fontSize: "14px",
								color: "#717171",
								margin: 0,
							}}
						>
							Permanently delete your account and all associated data (GDPR Right to Erasure)
						</p>
					</div>
				</div>

				{!showDeleteConfirm ? (
					<>
						<div
							style={{
								backgroundColor: "#FEF2F2",
								border: "1px solid #FECACA",
								borderRadius: "8px",
								padding: "16px",
								marginBottom: "20px",
								display: "flex",
								gap: "12px",
							}}
						>
							<AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: "2px" }} />
							<div>
								<p
									style={{
										fontSize: "14px",
										color: "#991B1B",
										fontWeight: "600",
										marginBottom: "4px",
									}}
								>
									Warning: This action cannot be undone
								</p>
								<p
									style={{
										fontSize: "13px",
										color: "#7F1D1D",
										margin: 0,
										lineHeight: "1.5",
									}}
								>
									Deleting your account will permanently remove all your data including listings, reviews, favorites, and profile information. This action is irreversible.
								</p>
							</div>
						</div>

						<button
							onClick={() => setShowDeleteConfirm(true)}
							style={{
								padding: "12px 24px",
								border: "1px solid #EF4444",
								borderRadius: "8px",
								backgroundColor: "#FFFFFF",
								color: "#EF4444",
								fontSize: "14px",
								fontWeight: "600",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "8px",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#FEF2F2";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#FFFFFF";
							}}
						>
							<Trash2 size={16} />
							Delete My Account
						</button>
					</>
				) : (
					<div>
						<div
							style={{
								backgroundColor: "#FEF2F2",
								border: "1px solid #FECACA",
								borderRadius: "8px",
								padding: "16px",
								marginBottom: "20px",
							}}
						>
							<p
								style={{
									fontSize: "14px",
									color: "#991B1B",
									fontWeight: "600",
									marginBottom: "12px",
								}}
							>
								Confirm Account Deletion
							</p>
							<p
								style={{
									fontSize: "13px",
									color: "#7F1D1D",
									marginBottom: "16px",
									lineHeight: "1.5",
								}}
							>
								To confirm deletion, please enter your email address: <strong>{currentUser.email}</strong>
							</p>

							<div style={{ marginBottom: "16px" }}>
								<label
									style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
									}}
								>
									Confirm Email
								</label>
								<input
									type="email"
									value={deleteEmail}
									onChange={(e) => setDeleteEmail(e.target.value)}
									placeholder="Enter your email to confirm"
									style={{
										width: "100%",
										padding: "12px 16px",
										border: "1px solid #E0E0E0",
										borderRadius: "8px",
										fontSize: "14px",
										outline: "none",
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = "#EF4444";
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = "#E0E0E0";
									}}
								/>
							</div>

							<div style={{ marginBottom: "20px" }}>
								<label
									style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
									}}
								>
									Reason (Optional)
								</label>
								<textarea
									value={deleteReason}
									onChange={(e) => setDeleteReason(e.target.value)}
									placeholder="Help us improve by telling us why you're leaving..."
									rows={3}
									style={{
										width: "100%",
										padding: "12px 16px",
										border: "1px solid #E0E0E0",
										borderRadius: "8px",
										fontSize: "14px",
										outline: "none",
										resize: "vertical",
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = "#EF4444";
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = "#E0E0E0";
									}}
								/>
							</div>

							<div style={{ display: "flex", gap: "12px" }}>
								<button
									onClick={() => {
										setShowDeleteConfirm(false);
										setDeleteEmail("");
										setDeleteReason("");
									}}
									disabled={isDeleting}
									style={{
										padding: "12px 24px",
										border: "1px solid #E0E0E0",
										borderRadius: "8px",
										backgroundColor: "#FFFFFF",
										color: "#222222",
										fontSize: "14px",
										fontWeight: "600",
										cursor: isDeleting ? "not-allowed" : "pointer",
									}}
								>
									Cancel
								</button>
								<button
									onClick={handleDeleteAccount}
									disabled={isDeleting || deleteEmail !== currentUser.email}
									style={{
										padding: "12px 24px",
										border: "none",
										borderRadius: "8px",
										backgroundColor: "#EF4444",
										color: "#FFFFFF",
										fontSize: "14px",
										fontWeight: "600",
										cursor: isDeleting || deleteEmail !== currentUser.email ? "not-allowed" : "pointer",
										opacity: isDeleting || deleteEmail !== currentUser.email ? 0.6 : 1,
										display: "flex",
										alignItems: "center",
										gap: "8px",
									}}
								>
									<Trash2 size={16} />
									{isDeleting ? "Deleting..." : "Permanently Delete Account"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* GDPR Rights Information */}
			<div
				style={{
					backgroundColor: "#F0F9FF",
					borderRadius: "16px",
					padding: "24px",
					marginTop: "24px",
					border: "1px solid #BAE6FD",
				}}
			>
				<div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
					<Shield size={20} color="#3B82F6" style={{ flexShrink: 0, marginTop: "2px" }} />
					<div style={{ flex: 1 }}>
						<h3
							style={{
								fontSize: "16px",
								fontWeight: "600",
								color: "#1E40AF",
								marginBottom: "8px",
							}}
						>
							Your GDPR Rights
						</h3>
						<ul
							style={{
								fontSize: "14px",
								color: "#1E3A8A",
								lineHeight: "1.8",
								margin: 0,
								paddingLeft: "20px",
							}}
						>
							<li><strong>Right to Access:</strong> Download your data using the export feature above</li>
							<li><strong>Right to Rectification:</strong> Update your information in profile settings</li>
							<li><strong>Right to Erasure:</strong> Delete your account and all data using the deletion feature above</li>
							<li><strong>Right to Data Portability:</strong> Export your data in a machine-readable format</li>
							<li><strong>Right to Object:</strong> Manage cookie preferences in the cookie settings</li>
						</ul>
					</div>
				</div>
				<Link
					href="/privacy-policy"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "6px",
						fontSize: "14px",
						color: "#3B82F6",
						textDecoration: "none",
						fontWeight: "500",
					}}
				>
					<FileText size={16} />
					Read our full Privacy Policy
				</Link>
			</div>
		</div>
	);
};

export default PrivacySettings;


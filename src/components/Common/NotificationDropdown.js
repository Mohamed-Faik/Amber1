"use client";
import React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Bell, User, FileText, X, Heart, CheckCircle } from "lucide-react";
import userImg from "../../../public/images/authors/author-1.jpg";

/**
 * Notification dropdown component that displays notifications in a dropdown menu
 */
const NotificationDropdown = ({ isOpen, position, onClose, notifications = [] }) => {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!isOpen || !mounted) {
		return null;
	}

	const getNotificationIcon = (type) => {
		switch (type) {
			case "new_user":
				return <User size={16} color="#3B82F6" />;
			case "new_listing":
				return <FileText size={16} color="#F59E0B" />;
			case "listing_favorited":
				return <Heart size={16} color="#EF4444" />;
			case "listing_approved":
				return <CheckCircle size={16} color="#10B981" />;
			default:
				return <Bell size={16} color="#6B7280" />;
		}
	};

	const getNotificationColor = (type) => {
		switch (type) {
			case "new_user":
				return "#EFF6FF";
			case "new_listing":
				return "#FFFBEB";
			case "listing_favorited":
				return "#FEF2F2";
			case "listing_approved":
				return "#ECFDF5";
			default:
				return "#F9FAFB";
		}
	};

	const formatTimeAgo = (dateString) => {
		if (!dateString) return "Just now";
		
		const now = new Date();
		const date = new Date(dateString);
		const diffInSeconds = Math.floor((now - date) / 1000);

		if (diffInSeconds < 60) return "Just now";
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
		return `${Math.floor(diffInSeconds / 86400)}d ago`;
	};

	const getNotificationHref = (notification) => {
		switch (notification.type) {
			case "new_user":
				// Link to administrator panel users section
				return `/administrator`;
			case "new_listing":
				// Link to administrator page for admin to easily approve listings
				return `/administrator`;
			case "listing_favorited":
			case "listing_approved":
				// Link to listing detail page
				if (notification.listingId && notification.listingSlug) {
					return `/listing/${notification.listingId}/${notification.listingSlug}`;
				}
				// Fallback to user's listings page
				return `/listings/my-listings`;
			default:
				return "/dashboard";
		}
	};

	const handleNotificationClick = (e) => {
		e.stopPropagation();
		onClose();
	};

	return createPortal(
		<>
			<style>{`
				[data-notification-dropdown="true"] {
					position: fixed !important;
				}
				@keyframes dropdownFadeIn {
					from {
						opacity: 0;
						transform: translateY(-8px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
			<div
				style={{
					position: "fixed",
					right: `${position.right || 16}px`,
					top: `${position.top || 70}px`,
					width: "360px",
					maxWidth: "calc(100vw - 32px)",
					backgroundColor: "#FFFFFF",
					borderRadius: "12px",
					boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)",
					border: "1px solid #E5E7EB",
					zIndex: 10001,
					animation: "dropdownFadeIn 0.2s ease",
					maxHeight: "calc(100vh - 100px)",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
					willChange: "transform",
					transform: "translateZ(0)",
					backfaceVisibility: "hidden",
				}}
				onClick={(e) => e.stopPropagation()}
				data-notification-dropdown="true"
			>

			{/* Header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "16px 20px",
					borderBottom: "1px solid #E5E7EB",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
					<Bell size={18} color="#111827" strokeWidth={2} />
					<h3
						style={{
							fontSize: "16px",
							fontWeight: "700",
							color: "#111827",
							margin: 0,
						}}
					>
						Notifications
					</h3>
					{notifications.filter(n => n.unread).length > 0 && (
						<span
							style={{
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								minWidth: "18px",
								height: "18px",
								padding: "0 6px",
								backgroundColor: "#EF4444",
								color: "#FFFFFF",
								borderRadius: "9px",
								fontSize: "11px",
								fontWeight: "700",
								lineHeight: "1",
							}}
						>
							{notifications.filter(n => n.unread).length > 99 
								? "99+" 
								: notifications.filter(n => n.unread).length}
						</span>
					)}
				</div>
				<button
					onClick={(e) => {
						e.stopPropagation();
						onClose();
					}}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: "4px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: "8px",
						transition: "background-color 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#F3F4F6";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "transparent";
					}}
				>
					<X size={18} color="#6B7280" />
				</button>
			</div>

			{/* Notifications List */}
			<div
				style={{
					maxHeight: "400px",
					overflowY: "auto",
					overflowX: "hidden",
				}}
			>
				{notifications.length === 0 ? (
					<div
						style={{
							padding: "40px 20px",
							textAlign: "center",
							color: "#6B7280",
						}}
					>
						<Bell size={48} color="#D1D5DB" style={{ marginBottom: "12px", opacity: 0.5 }} />
						<p style={{ fontSize: "14px", margin: 0 }}>No notifications</p>
						<p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "#9CA3AF" }}>
							You're all caught up!
						</p>
					</div>
				) : (
					notifications.map((notification, index) => (
						<Link
							key={notification.id || index}
							href={getNotificationHref(notification)}
							onClick={handleNotificationClick}
							style={{
								display: "flex",
								gap: "12px",
								padding: "16px 20px",
								textDecoration: "none",
								color: "inherit",
								borderBottom: index < notifications.length - 1 ? "1px solid #F3F4F6" : "none",
								transition: "background-color 0.2s ease",
								cursor: "pointer",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#F9FAFB";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							{/* Icon or Profile Picture */}
							{(notification.type === "new_user" || notification.type === "listing_favorited") && notification.userImage ? (
								<div
									style={{
										position: "relative",
										width: "40px",
										height: "40px",
										borderRadius: "10px",
										overflow: "hidden",
										flexShrink: 0,
										border: "2px solid #E5E7EB",
										backgroundColor: "#F9FAFB",
									}}
								>
									<Image
										src={notification.userImage}
										alt={notification.userName || "User"}
										fill
										style={{ objectFit: "cover" }}
										sizes="40px"
										unoptimized
									/>
								</div>
							) : (notification.type === "new_user" || notification.type === "listing_favorited") && !notification.userImage ? (
								<div
									style={{
										width: "40px",
										height: "40px",
										borderRadius: "10px",
										backgroundColor: getNotificationColor(notification.type),
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
										border: "2px solid #E5E7EB",
									}}
								>
									<span
										style={{
											fontSize: "16px",
											fontWeight: "700",
											color: notification.type === "listing_favorited" ? "#EF4444" : "#3B82F6",
										}}
									>
										{(notification.userName || notification.message || "U")[0].toUpperCase()}
									</span>
								</div>
							) : (
								<div
									style={{
										width: "40px",
										height: "40px",
										borderRadius: "10px",
										backgroundColor: getNotificationColor(notification.type),
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
									}}
								>
									{getNotificationIcon(notification.type)}
								</div>
							)}

							{/* Content */}
							<div style={{ flex: 1, minWidth: 0 }}>
								<p
									style={{
										fontSize: "14px",
										fontWeight: "600",
										color: "#111827",
										margin: "0 0 4px 0",
										lineHeight: "1.4",
									}}
								>
									{notification.title}
								</p>
								{notification.message && (
									<p
										style={{
											fontSize: "13px",
											color: "#6B7280",
											margin: "0 0 4px 0",
											lineHeight: "1.4",
											overflow: "hidden",
											textOverflow: "ellipsis",
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
										}}
									>
										{notification.message}
									</p>
								)}
								<p
									style={{
										fontSize: "11px",
										color: "#9CA3AF",
										margin: 0,
									}}
								>
									{formatTimeAgo(notification.createdAt)}
								</p>
							</div>

							{/* Unread indicator */}
							{notification.unread && (
								<div
									style={{
										width: "8px",
										height: "8px",
										borderRadius: "50%",
										backgroundColor: "#EF4444",
										flexShrink: 0,
										marginTop: "6px",
									}}
								/>
							)}
						</Link>
					))
				)}
			</div>

			{/* Footer */}
			{notifications.length > 0 && (
				<div
					style={{
						padding: "12px 20px",
						borderTop: "1px solid #E5E7EB",
						textAlign: "center",
					}}
				>
					<Link
						href="/dashboard"
						onClick={handleNotificationClick}
						style={{
							fontSize: "13px",
							fontWeight: "600",
							color: "#667eea",
							textDecoration: "none",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.textDecoration = "underline";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.textDecoration = "none";
						}}
					>
						View all notifications
					</Link>
				</div>
			)}
		</div>
		</>,
		document.body
	);
};

export default NotificationDropdown;


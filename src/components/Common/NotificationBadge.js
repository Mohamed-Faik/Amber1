"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

/**
 * Notification badge component that shows pending listings count for admin users
 * Opens a dropdown with notifications when clicked
 */
const NotificationBadge = ({ currentUser }) => {
	const [pendingCount, setPendingCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [dropdownPosition, setDropdownPosition] = useState({ right: 0, top: 0 });
	const buttonRef = useRef(null);

	// Check if user is admin
	const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "MODERATOR";

	// Fetch notifications and count
	const fetchNotifications = async () => {
		if (!currentUser) {
			setIsLoading(false);
			return;
		}

		try {
			// Fetch notifications based on user role
			const notificationsUrl = isAdmin 
				? "/api/notifications" 
				: "/api/notifications/user";
			
			const notificationsResponse = await fetch(notificationsUrl);
			if (notificationsResponse.ok) {
				const notificationsData = await notificationsResponse.json();
				const fetchedNotifications = notificationsData.notifications || [];
				setNotifications(fetchedNotifications);
				
				// Calculate total unread count
				const unreadCount = fetchedNotifications.filter(n => n.unread).length || 0;
				setPendingCount(unreadCount);
			} else {
				// For admin, fallback: fetch pending listings count only
				if (isAdmin) {
					const countResponse = await fetch("/api/notifications/pending-count");
					if (countResponse.ok) {
						const countData = await countResponse.json();
						setPendingCount(countData.count || 0);
					}
				}
			}
		} catch (error) {
			console.error("❌ Error fetching notifications:", error);
			// For admin, on error, still try to fetch pending count
			if (isAdmin) {
				try {
					const countResponse = await fetch("/api/notifications/pending-count");
					if (countResponse.ok) {
						const countData = await countResponse.json();
						setPendingCount(countData.count || 0);
					}
				} catch (err) {
					console.error("❌ Error fetching pending count:", err);
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!currentUser) {
			setIsLoading(false);
			return;
		}

		fetchNotifications();

		// Refresh every 30 seconds
		const interval = setInterval(fetchNotifications, 30000);

		return () => clearInterval(interval);
	}, [currentUser, isAdmin]);

	// Close dropdown when clicking outside
	useEffect(() => {
		if (!isDropdownOpen) return;

		const handleClickOutside = (event) => {
			// Check if click is outside both button and dropdown
			const clickedOutsideButton = buttonRef.current && !buttonRef.current.contains(event.target);
			const clickedOutsideDropdown = !event.target.closest('[data-notification-dropdown="true"]');
			
			if (clickedOutsideButton && clickedOutsideDropdown) {
				setIsDropdownOpen(false);
			}
		};

		// Use a small delay to ensure the portal is rendered
		const timeoutId = setTimeout(() => {
			document.addEventListener("click", handleClickOutside, true);
		}, 10);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [isDropdownOpen]);

	const toggleDropdown = (e) => {
		e.stopPropagation();
		e.preventDefault();

		if (!isDropdownOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const isMobile = window.innerWidth < 992;
			setDropdownPosition({
				right: isMobile ? 16 : window.innerWidth - rect.right,
				top: rect.bottom + (isMobile ? 8 : 10),
			});
			
			// Refresh notifications when opening
			fetchNotifications();
		}

		setIsDropdownOpen(!isDropdownOpen);
	};

	// Don't render if not logged in
	if (!currentUser) {
		return null;
	}

	// Always show bell icon for admins, show badge when count > 0
	return (
		<>
			<button
				ref={buttonRef}
				onClick={toggleDropdown}
				className="notification-bell-button"
				style={{
					position: "relative",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: "40px",
					height: "40px",
					borderRadius: "50%",
					backgroundColor: isDropdownOpen ? "#F7F7F7" : "transparent",
					border: "none",
					cursor: "pointer",
					transition: "all 0.2s ease",
					padding: 0,
					flexShrink: 0,
					marginLeft: "-14px",
				}}
				onMouseEnter={(e) => {
					if (!isDropdownOpen) {
						e.currentTarget.style.backgroundColor = "#F7F7F7";
					}
				}}
				onMouseLeave={(e) => {
					if (!isDropdownOpen) {
						e.currentTarget.style.backgroundColor = "transparent";
					}
				}}
				title={
					isLoading 
						? "Loading notifications..." 
						: pendingCount > 0 
							? `${pendingCount} new notification${pendingCount !== 1 ? 's' : ''}`
							: "No new notifications"
				}
				aria-label={
					isLoading 
						? "Loading notifications" 
						: `${pendingCount} new notifications`
				}
				aria-expanded={isDropdownOpen}
				aria-haspopup="true"
			>
					<Bell size={20} color="#222222" strokeWidth={2} />
				{pendingCount > 0 && (
					<span
						style={{
							position: "absolute",
							top: "4px",
							right: "4px",
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							minWidth: "16px",
							height: "16px",
							padding: pendingCount > 9 ? "0 4px" : "0",
							backgroundColor: "#EF4444",
							color: "#FFFFFF",
							borderRadius: "8px",
							fontSize: "10px",
							fontWeight: "700",
							lineHeight: "1",
							boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
							border: "1.5px solid #FFFFFF",
							animation: pendingCount > 0 ? "pulse 2s infinite" : "none",
							zIndex: 10,
						}}
					>
						{pendingCount > 99 ? "99+" : pendingCount}
					</span>
				)}
				<style jsx>{`
					@keyframes pulse {
						0%, 100% {
							opacity: 1;
							transform: scale(1);
						}
						50% {
							opacity: 0.8;
							transform: scale(1.1);
						}
					}
					
					/* Mobile responsive styles */
					@media (max-width: 991px) {
						.notification-bell-button {
							width: 40px !important;
							height: 40px !important;
							min-width: 40px !important;
							min-height: 40px !important;
						}
					}
					
					/* Small mobile adjustments */
					@media (max-width: 480px) {
						.notification-bell-button {
							width: 38px !important;
							height: 38px !important;
							min-width: 38px !important;
							min-height: 38px !important;
						}
					}
				`}</style>
			</button>

			{/* Notification Dropdown */}
			{isDropdownOpen && (
				<NotificationDropdown
					isOpen={isDropdownOpen}
					position={dropdownPosition}
					onClose={() => setIsDropdownOpen(false)}
					notifications={notifications}
				/>
			)}
		</>
	);
};

export default NotificationBadge;


"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, ListChecks, Plus, Heart, UserPen, Settings, Eye, LogOut } from "lucide-react";
import userImg from "../../../public/images/authors/author-1.jpg";

const UserMenu = ({ currentUser }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState({ right: 0, top: 0 });
	const [mounted, setMounted] = useState(false);
	const dropdownRef = useRef(null);
	const buttonRef = useRef(null);
	const isAdmin = currentUser?.role === "ADMIN";
	const currentRoute = usePathname();

	useEffect(() => {
		setMounted(true);
	}, []);

	// Close dropdown when clicking outside
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event) => {
			if (
				dropdownRef.current && 
				!dropdownRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setIsOpen(false);
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
	}, [isOpen]);

	const toggleDropdown = (e) => {
		e.stopPropagation();
		e.preventDefault();
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const isMobile = window.innerWidth < 992;
			setDropdownPosition({
				right: isMobile ? 16 : window.innerWidth - rect.right, // On mobile, align to right edge with padding
				top: rect.bottom + (isMobile ? 8 : 10),
			});
		}
		setIsOpen(!isOpen);
	};

	const handleLinkClick = (e) => {
		e.stopPropagation();
		setIsOpen(false);
	};

	return (
		<>
			<style>{`
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
				
				/* Mobile responsive: Hide menu icon, show only profile picture */
				@media (max-width: 991px) {
					.user-menu-icon-desktop {
						display: none !important;
					}
					.user-menu-dropdown {
						position: relative !important;
						margin-top: 0 !important;
						margin-bottom: 0 !important;
					}
					.user-menu-button {
						padding: 0 !important;
						border: 2px solid #E0E0E0 !important;
						border-radius: 50% !important;
						margin: 0 !important;
						width: 40px !important;
						height: 40px !important;
						min-width: 40px !important;
						min-height: 40px !important;
						max-width: 40px !important;
						max-height: 40px !important;
						display: flex !important;
						align-items: center !important;
						justify-content: center !important;
						background-color: #FFFFFF !important;
						gap: 0 !important;
						align-self: center !important;
						flex-shrink: 0 !important;
					}
					.user-profile-picture {
						width: 32px !important;
						height: 32px !important;
						border: none !important;
						margin: 0 !important;
					}
					.user-menu-button:hover,
					.user-menu-button:active,
					.user-menu-button.active {
						border-color: #FF385C !important;
						box-shadow: 0 2px 8px rgba(255, 56, 92, 0.2) !important;
						background-color: #FFF5F7 !important;
					}
				}
				
				/* Small mobile adjustments */
				@media (max-width: 480px) {
					.user-menu-button {
						width: 38px !important;
						height: 38px !important;
						min-width: 38px !important;
						min-height: 38px !important;
						max-width: 38px !important;
						max-height: 38px !important;
					}
					.user-profile-picture {
						width: 30px !important;
						height: 30px !important;
					}
				}
				
				/* Desktop: Show full button */
				@media (min-width: 992px) {
					.user-menu-dropdown {
						top: 0 !important;
						margin-top: 0 !important;
					}
					.user-menu-button {
						padding: 4px 10px 4px 13px !important;
						width: auto !important;
						height: 42px !important;
						margin-top: 0 !important;
					}
				}
				
				/* Mobile dropdown positioning */
				@media (max-width: 991px) {
					.user-menu-dropdown-content {
						right: 16px !important;
						width: calc(100vw - 32px) !important;
						max-width: 320px !important;
					}
					.signup-button {
						display: none !important;
					}
				}
			`}</style>
			{!currentUser ? (
				<div style={{ 
					display: "flex", 
					alignItems: "center", 
					gap: "12px",
				}}>
					<Link
						href="/auth/signin"
						style={{
							padding: "12px 16px",
							borderRadius: "22px",
							fontSize: "14px",
							fontWeight: "600",
							color: "#000000",
							textDecoration: "none",
							transition: "all 0.2s ease",
							display: "flex",
							alignItems: "center",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#F7F7F7";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "transparent";
						}}
					>
						Log in
					</Link>
					<Link
						href="/auth/signup"
						className="signup-button"
						style={{
							padding: "12px 16px",
							borderRadius: "22px",
							fontSize: "14px",
							fontWeight: "600",
							color: "#FFFFFF",
							backgroundColor: "#222222",
							textDecoration: "none",
							transition: "all 0.2s ease",
							display: "flex",
							alignItems: "center",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#000000";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#222222";
						}}
					>
						Sign up
					</Link>
				</div>
			) : (
				<>
					<div 
						className={`user-menu-dropdown ${isOpen ? "active" : ""}`}
						style={{ 
							position: "relative",
							top: 0,
							marginTop: 0,
						}}
					>
					<div 
						ref={buttonRef}
						className={`user-menu-button ${isOpen ? "active" : ""}`}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "15px",
							padding: "4px 10px 4px 13px",
							borderRadius: "21px",
							border: "1px solid #DDDDDD",
							cursor: "pointer",
							transition: "all 0.2s ease",
							backgroundColor: isOpen ? "#F7F7F7" : "transparent",
							height: "42px",
							marginTop: 0,
						}}
							onClick={toggleDropdown}
							onMouseDown={(e) => e.stopPropagation()}
							onMouseEnter={(e) => {
								if (!isOpen) {
									e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.12)";
								}
							}}
							onMouseLeave={(e) => {
								if (!isOpen) {
									e.currentTarget.style.boxShadow = "none";
								}
							}}
						>
							{/* Desktop: Show menu icon + profile */}
							<svg
								className="user-menu-icon-desktop"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#717171"
								strokeWidth="2"
								style={{ flexShrink: 0 }}
							>
								<rect x="3" y="11" width="18" height="11" rx="2" />
								<circle cx="12" cy="16" r="1" />
								<path d="M7 11V7a5 5 0 0 1 10 0v4" />
							</svg>
							{/* Mobile: Just profile picture */}
							<div
								className="user-profile-picture"
								style={{
									width: "30px",
									height: "30px",
									borderRadius: "50%",
									backgroundColor: "#717171",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									overflow: "hidden",
									flexShrink: 0,
									border: isOpen ? "2px solid #FF385C" : "2px solid transparent",
									transition: "all 0.2s ease",
								}}
							>
								{currentUser?.image ? (
									<Image
										src={currentUser.image}
										alt={currentUser.name || "User"}
										width={30}
										height={30}
										style={{ objectFit: "cover" }}
									/>
								) : (
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="white"
										strokeWidth="2"
									>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								)}
							</div>
						</div>

						{mounted && isOpen && typeof document !== 'undefined' && createPortal(
							<div 
								ref={dropdownRef}
								className="dropdown show user-menu-dropdown-content"
								style={{
									position: 'fixed',
									right: `${dropdownPosition.right}px`,
									top: `${dropdownPosition.top}px`,
									zIndex: 99999,
									opacity: 1,
									visibility: 'visible',
									pointerEvents: 'auto',
									backgroundColor: '#ffffff',
									borderRadius: '20px',
									boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
									padding: '16px',
									width: '300px',
									maxWidth: 'calc(100vw - 32px)',
									border: '1px solid rgba(0, 0, 0, 0.08)',
									animation: 'dropdownFadeIn 0.2s ease-out',
								}}
								onMouseDown={(e) => {
									e.stopPropagation();
								}}
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								{/* User Info Header */}
								<div style={{
									padding: '16px',
									borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
									marginBottom: '12px',
									borderRadius: '16px',
									background: 'linear-gradient(135deg, rgba(255, 56, 92, 0.05) 0%, rgba(230, 30, 77, 0.08) 100%)',
								}}>
									<div style={{
										display: 'flex',
										alignItems: 'center',
										gap: '14px',
									}}>
										<div
											style={{
												width: '52px',
												height: '52px',
												borderRadius: '50%',
												background: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												overflow: 'hidden',
												flexShrink: 0,
												border: '3px solid #FFFFFF',
												boxShadow: '0 2px 8px rgba(255, 56, 92, 0.3)',
											}}
										>
											{currentUser?.image ? (
												<Image
													src={currentUser.image}
													alt={currentUser.name || "User"}
													width={52}
													height={52}
													style={{ objectFit: 'cover' }}
												/>
											) : (
												<svg
													width="26"
													height="26"
													viewBox="0 0 24 24"
													fill="none"
													stroke="white"
													strokeWidth="2.5"
												>
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
													<circle cx="12" cy="7" r="4" />
												</svg>
											)}
										</div>
										<div style={{ flex: 1, minWidth: 0 }}>
											<div style={{
												fontSize: '16px',
												fontWeight: '700',
												color: '#222222',
												marginBottom: '4px',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}>
												{currentUser?.name || 'User'}
											</div>
											<div style={{
												fontSize: '13px',
												fontWeight: '500',
												color: '#717171',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}>
												{currentUser?.email || ''}
											</div>
										</div>
									</div>
								</div>

								<ul style={{ margin: 0, padding: '8px 0', listStyle: 'none' }}>
									{isAdmin && (
										<li>
											<Link 
												href="/administrator"
												className={`user-nav-link ${
													currentRoute === "/administrator"
														? "active"
														: "non-active"
												}`}
												onClick={handleLinkClick}
												onMouseDown={(e) => e.stopPropagation()}
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '14px',
													padding: '12px 12px',
													color: '#222222',
													textDecoration: 'none',
													fontSize: '15px',
													fontWeight: '500',
													borderRadius: '12px',
													transition: 'all 0.2s ease',
													backgroundColor: currentRoute === "/administrator" ? 'rgba(255, 56, 92, 0.08)' : 'transparent',
													margin: '4px 0',
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.backgroundColor = currentRoute === "/administrator" 
														? 'rgba(255, 56, 92, 0.12)' 
														: 'rgba(0, 0, 0, 0.04)';
													e.currentTarget.style.transform = 'translateX(4px)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.backgroundColor = currentRoute === "/administrator" 
														? 'rgba(255, 56, 92, 0.08)' 
														: 'transparent';
													e.currentTarget.style.transform = 'translateX(0)';
												}}
											>
											<div style={{
												width: '36px',
												height: '36px',
												borderRadius: '10px',
												background: currentRoute === "/administrator" 
													? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' 
													: 'rgba(0, 0, 0, 0.06)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0,
												transition: 'all 0.2s ease',
											}}>
												<LayoutDashboard 
													size={18}
													color={currentRoute === "/administrator" ? '#FFFFFF' : '#717171'}
													strokeWidth={2.5}
												/>
											</div>
												<span style={{ flex: 1 }}>Administrator</span>
												{currentRoute === "/administrator" && (
													<div style={{
														width: '6px',
														height: '6px',
														borderRadius: '50%',
														background: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
													}} />
												)}
											</Link>
										</li>
									)}
									<li>
										<Link 
											href="/listings/my-listings"
											className={`user-nav-link ${
												currentRoute === "/listings/my-listings"
													? "active"
													: "non-active"
											}`}
											onClick={handleLinkClick}
											onMouseDown={(e) => e.stopPropagation()}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '14px',
												padding: '12px 12px',
												color: '#222222',
												textDecoration: 'none',
												fontSize: '15px',
												fontWeight: '500',
												borderRadius: '12px',
												transition: 'all 0.2s ease',
												backgroundColor: currentRoute === "/listings/my-listings" ? 'rgba(255, 56, 92, 0.08)' : 'transparent',
												margin: '4px 0',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/listings/my-listings" 
													? 'rgba(255, 56, 92, 0.12)' 
													: 'rgba(0, 0, 0, 0.04)';
												e.currentTarget.style.transform = 'translateX(4px)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/listings/my-listings" 
													? 'rgba(255, 56, 92, 0.08)' 
													: 'transparent';
												e.currentTarget.style.transform = 'translateX(0)';
											}}
										>
										<div style={{
											width: '36px',
											height: '36px',
											borderRadius: '10px',
											background: currentRoute === "/listings/my-listings" 
												? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' 
												: 'rgba(0, 0, 0, 0.06)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											transition: 'all 0.2s ease',
										}}>
											<ListChecks 
												size={18}
												color={currentRoute === "/listings/my-listings" ? '#FFFFFF' : '#717171'}
												strokeWidth={2.5}
											/>
										</div>
											<span style={{ flex: 1 }}>My Listings</span>
											{currentRoute === "/listings/my-listings" && (
												<div style={{
													width: '6px',
													height: '6px',
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
												}} />
											)}
										</Link>
									</li>
									<li>
										<Link 
											href="/listings/new"
											className={`user-nav-link ${
												currentRoute === "/listings/new"
													? "active"
													: "non-active"
											}`}
											onClick={handleLinkClick}
											onMouseDown={(e) => e.stopPropagation()}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '14px',
												padding: '12px 12px',
												color: '#222222',
												textDecoration: 'none',
												fontSize: '15px',
												fontWeight: '500',
												borderRadius: '12px',
												transition: 'all 0.2s ease',
												backgroundColor: currentRoute === "/listings/new" ? 'rgba(255, 56, 92, 0.08)' : 'transparent',
												margin: '4px 0',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/listings/new" 
													? 'rgba(255, 56, 92, 0.12)' 
													: 'rgba(0, 0, 0, 0.04)';
												e.currentTarget.style.transform = 'translateX(4px)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/listings/new" 
													? 'rgba(255, 56, 92, 0.08)' 
													: 'transparent';
												e.currentTarget.style.transform = 'translateX(0)';
											}}
										>
										<div style={{
											width: '36px',
											height: '36px',
											borderRadius: '10px',
											background: currentRoute === "/listings/new" 
												? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' 
												: 'rgba(0, 0, 0, 0.06)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											transition: 'all 0.2s ease',
										}}>
											<Plus 
												size={20}
												color={currentRoute === "/listings/new" ? '#FFFFFF' : '#717171'}
												strokeWidth={2.5}
											/>
										</div>
											<span style={{ flex: 1 }}>Add Listings</span>
											{currentRoute === "/listings/new" && (
												<div style={{
													width: '6px',
													height: '6px',
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
												}} />
											)}
										</Link>
									</li>
									<li>
										<Link 
											href="/listings/favourites"
											className={`user-nav-link ${
												currentRoute === "/listings/favourites"
													? "active"
													: "non-active"
											}`}
											onClick={handleLinkClick}
											onMouseDown={(e) => e.stopPropagation()}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '14px',
												padding: '12px 12px',
												color: '#222222',
												textDecoration: 'none',
												fontSize: '15px',
												fontWeight: '500',
												borderRadius: '12px',
												transition: 'all 0.2s ease',
												backgroundColor: currentRoute === "/listings/favourites" ? 'rgba(255, 56, 92, 0.08)' : 'transparent',
												margin: '4px 0',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/listings/favourites" 
													? 'rgba(255, 56, 92, 0.12)' 
													: 'rgba(0, 0, 0, 0.04)';
												e.currentTarget.style.transform = 'translateX(4px)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/listings/favourites" 
													? 'rgba(255, 56, 92, 0.08)' 
													: 'transparent';
												e.currentTarget.style.transform = 'translateX(0)';
											}}
										>
										<div style={{
											width: '36px',
											height: '36px',
											borderRadius: '10px',
											background: currentRoute === "/listings/favourites" 
												? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' 
												: 'rgba(0, 0, 0, 0.06)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											transition: 'all 0.2s ease',
										}}>
											<Heart 
												size={18}
												color={currentRoute === "/listings/favourites" ? '#FFFFFF' : '#717171'}
												strokeWidth={2.5}
											/>
										</div>
											<span style={{ flex: 1 }}>Favourites</span>
											{currentRoute === "/listings/favourites" && (
												<div style={{
													width: '6px',
													height: '6px',
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
												}} />
											)}
										</Link>
									</li>
									<li>
										<Link 
											href="/profile/edit-my-info"
											className={`user-nav-link ${
											currentRoute === "/profile/edit-my-info"
												? "active"
												: "non-active"
											}`}
											onClick={handleLinkClick}
											onMouseDown={(e) => e.stopPropagation()}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '14px',
												padding: '12px 12px',
												color: '#222222',
												textDecoration: 'none',
												fontSize: '15px',
												fontWeight: '500',
												borderRadius: '12px',
												transition: 'all 0.2s ease',
												backgroundColor: currentRoute === "/profile/edit-my-info" ? 'rgba(255, 56, 92, 0.08)' : 'transparent',
												margin: '4px 0',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/profile/edit-my-info" 
													? 'rgba(255, 56, 92, 0.12)' 
													: 'rgba(0, 0, 0, 0.04)';
												e.currentTarget.style.transform = 'translateX(4px)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/profile/edit-my-info" 
													? 'rgba(255, 56, 92, 0.08)' 
													: 'transparent';
												e.currentTarget.style.transform = 'translateX(0)';
											}}
										>
										<div style={{
											width: '36px',
											height: '36px',
											borderRadius: '10px',
											background: currentRoute === "/profile/edit-my-info" 
												? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' 
												: 'rgba(0, 0, 0, 0.06)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											transition: 'all 0.2s ease',
										}}>
											<UserPen 
												size={18}
												color={currentRoute === "/profile/edit-my-info" ? '#FFFFFF' : '#717171'}
												strokeWidth={2.5}
											/>
										</div>
											<span style={{ flex: 1 }}>Update Profile Info</span>
											{currentRoute === "/profile/edit-my-info" && (
												<div style={{
													width: '6px',
													height: '6px',
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
												}} />
											)}
										</Link>
									</li>
									<li>
										<Link 
											href="/profile/settings"
											className={`user-nav-link ${
											currentRoute === "/profile/settings"
												? "active"
												: "non-active"
											}`}
											onClick={handleLinkClick}
											onMouseDown={(e) => e.stopPropagation()}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '14px',
												padding: '12px 12px',
												color: '#222222',
												textDecoration: 'none',
												fontSize: '15px',
												fontWeight: '500',
												borderRadius: '12px',
												transition: 'all 0.2s ease',
												backgroundColor: currentRoute === "/profile/settings" ? 'rgba(255, 56, 92, 0.08)' : 'transparent',
												margin: '4px 0',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/profile/settings" 
													? 'rgba(255, 56, 92, 0.12)' 
													: 'rgba(0, 0, 0, 0.04)';
												e.currentTarget.style.transform = 'translateX(4px)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === "/profile/settings" 
													? 'rgba(255, 56, 92, 0.08)' 
													: 'transparent';
												e.currentTarget.style.transform = 'translateX(0)';
											}}
										>
										<div style={{
											width: '36px',
											height: '36px',
											borderRadius: '10px',
											background: currentRoute === "/profile/settings" 
												? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' 
												: 'rgba(0, 0, 0, 0.06)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											transition: 'all 0.2s ease',
										}}>
											<Settings 
												size={18}
												color={currentRoute === "/profile/settings" ? '#FFFFFF' : '#717171'}
												strokeWidth={2.5}
											/>
										</div>
											<span style={{ flex: 1 }}>Settings</span>
											{currentRoute === "/profile/settings" && (
												<div style={{
													width: '6px',
													height: '6px',
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
												}} />
											)}
										</Link>
									</li>
									<li>
										<Link
											href={`/author/${currentUser.id}`}
											className={`user-nav-link ${
												currentRoute === `/author/${currentUser.id}`
													? "active"
													: "non-active"
												}`}
											onClick={handleLinkClick}
											onMouseDown={(e) => e.stopPropagation()}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '14px',
												padding: '12px 12px',
												color: '#222222',
												textDecoration: 'none',
												fontSize: '15px',
												fontWeight: '500',
												borderRadius: '12px',
												transition: 'all 0.2s ease',
												backgroundColor: currentRoute === `/author/${currentUser.id}` ? 'rgba(255, 56, 92, 0.08)' : 'transparent',
												margin: '4px 0',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === `/author/${currentUser.id}` 
													? 'rgba(255, 56, 92, 0.12)' 
													: 'rgba(0, 0, 0, 0.04)';
												e.currentTarget.style.transform = 'translateX(4px)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = currentRoute === `/author/${currentUser.id}` 
													? 'rgba(255, 56, 92, 0.08)' 
													: 'transparent';
												e.currentTarget.style.transform = 'translateX(0)';
											}}
										>
										<div style={{
											width: '36px',
											height: '36px',
											borderRadius: '10px',
											background: currentRoute === `/author/${currentUser.id}` 
												? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' 
												: 'rgba(0, 0, 0, 0.06)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											transition: 'all 0.2s ease',
										}}>
											<Eye 
												size={18}
												color={currentRoute === `/author/${currentUser.id}` ? '#FFFFFF' : '#717171'}
												strokeWidth={2.5}
											/>
										</div>
											<span style={{ flex: 1 }}>View My Profile</span>
											{currentRoute === `/author/${currentUser.id}` && (
												<div style={{
													width: '6px',
													height: '6px',
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
												}} />
											)}
										</Link>
									</li>
										
									<div style={{ 
										height: '1px', 
										backgroundColor: 'rgba(0, 0, 0, 0.06)', 
										margin: '12px 0' 
									}} />

									<li>
										<button
											onClick={(e) => {
												e.stopPropagation();
												setIsOpen(false);
												signOut();
											}}
											onMouseDown={(e) => e.stopPropagation()}
											className="read-more"
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '14px',
												width: '100%',
												padding: '12px 12px',
												color: '#222222',
												textDecoration: 'none',
												fontSize: '15px',
												fontWeight: '500',
												borderRadius: '12px',
												transition: 'all 0.2s ease',
												backgroundColor: 'transparent',
												border: 'none',
												textAlign: 'left',
												cursor: 'pointer',
												margin: '4px 0',
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
												e.currentTarget.style.transform = 'translateX(4px)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = 'transparent';
												e.currentTarget.style.transform = 'translateX(0)';
											}}
										>
										<div style={{
											width: '36px',
											height: '36px',
											borderRadius: '10px',
											background: 'rgba(220, 38, 38, 0.1)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											transition: 'all 0.2s ease',
										}}>
											<LogOut 
												size={18}
												color="#DC2626"
												strokeWidth={2.5}
											/>
										</div>
											<span style={{ flex: 1 }}>Logout</span>
										</button>
									</li>
									</ul>
								</div>,
								document.body
							)}
						</div>
					</>
			)}
		</>
	);
};

export default UserMenu;

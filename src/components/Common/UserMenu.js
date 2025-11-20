"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setDropdownPosition({
				right: window.innerWidth - rect.right,
				top: rect.bottom + 10,
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
			{!currentUser ? (
				<>
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
						style={{
							padding: "12px 16px",
							borderRadius: "22px",
							fontSize: "14px",
							fontWeight: "600",
							color: "#FFFFFF",
							backgroundColor: "#222222",
							textDecoration: "none",
							transition: "all 0.2s ease",
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
				</>
			) : (
				<>
					<div 
						className={`user-menu-dropdown ${isOpen ? "active" : ""}`}
						style={{ position: "relative" }}
					>
					<div 
						ref={buttonRef}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "15px",
							padding: "4px 10px 4px 13px",
							borderRadius: "21px",
							border: "1px solid #DDDDDD",
							cursor: "pointer",
							transition: "all 0.2s ease",
							backgroundColor: isOpen ? "#F7F7F7" : "transparent",
							height: "42px",
							marginTop: "-19px",
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
							<svg
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
							<div
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
									className="dropdown show"
									style={{
										position: 'fixed',
										right: `${dropdownPosition.right}px`,
										top: `${dropdownPosition.top}px`,
										zIndex: 99999,
										opacity: 1,
										visibility: 'visible',
										pointerEvents: 'auto',
										backgroundColor: '#ffffff',
										borderRadius: '12px',
										boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
										padding: '8px',
										width: '250px',
										border: '1px solid #f0f0f0',
									}}
									onMouseDown={(e) => {
										e.stopPropagation();
									}}
									onClick={(e) => {
										e.stopPropagation();
									}}
								>
									<ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
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
														display: 'block',
														padding: '12px 16px',
														color: currentRoute === "/administrator" ? '#FF385C' : '#222222',
														textDecoration: 'none',
														fontSize: '14px',
														borderRadius: '6px',
														transition: 'all 0.2s ease',
														backgroundColor: currentRoute === "/administrator" ? '#FFF5F7' : 'transparent',
													}}
													onMouseEnter={(e) => {
														if (currentRoute !== "/administrator") {
															e.target.style.backgroundColor = '#FFF5F7';
															e.target.style.color = '#FF385C';
														}
													}}
													onMouseLeave={(e) => {
														if (currentRoute !== "/administrator") {
															e.target.style.backgroundColor = 'transparent';
															e.target.style.color = '#222222';
														}
													}}
												>
													<i className="ri-dashboard-line"></i>{" "}
													Administrator
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
													display: 'block',
													padding: '12px 16px',
													color: currentRoute === "/listings/my-listings" ? '#FF385C' : '#222222',
													textDecoration: 'none',
													fontSize: '14px',
													borderRadius: '6px',
													transition: 'all 0.2s ease',
													backgroundColor: currentRoute === "/listings/my-listings" ? '#FFF5F7' : 'transparent',
												}}
												onMouseEnter={(e) => {
													if (currentRoute !== "/listings/my-listings") {
														e.target.style.backgroundColor = '#FFF5F7';
														e.target.style.color = '#FF385C';
													}
												}}
												onMouseLeave={(e) => {
													if (currentRoute !== "/listings/my-listings") {
														e.target.style.backgroundColor = 'transparent';
														e.target.style.color = '#222222';
													}
												}}
											>
												<i className="ri-list-check"></i> My
												Listings
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
													display: 'block',
													padding: '12px 16px',
													color: currentRoute === "/listings/new" ? '#FF385C' : '#222222',
													textDecoration: 'none',
													fontSize: '14px',
													borderRadius: '6px',
													transition: 'all 0.2s ease',
													backgroundColor: currentRoute === "/listings/new" ? '#FFF5F7' : 'transparent',
												}}
												onMouseEnter={(e) => {
													if (currentRoute !== "/listings/new") {
														e.target.style.backgroundColor = '#FFF5F7';
														e.target.style.color = '#FF385C';
													}
												}}
												onMouseLeave={(e) => {
													if (currentRoute !== "/listings/new") {
														e.target.style.backgroundColor = 'transparent';
														e.target.style.color = '#222222';
													}
												}}
											>
												<i className="ri-menu-add-line"></i>{" "}
												Add Listings
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
													display: 'block',
													padding: '12px 16px',
													color: currentRoute === "/listings/favourites" ? '#FF385C' : '#222222',
													textDecoration: 'none',
													fontSize: '14px',
													borderRadius: '6px',
													transition: 'all 0.2s ease',
													backgroundColor: currentRoute === "/listings/favourites" ? '#FFF5F7' : 'transparent',
												}}
												onMouseEnter={(e) => {
													if (currentRoute !== "/listings/favourites") {
														e.target.style.backgroundColor = '#FFF5F7';
														e.target.style.color = '#FF385C';
													}
												}}
												onMouseLeave={(e) => {
													if (currentRoute !== "/listings/favourites") {
														e.target.style.backgroundColor = 'transparent';
														e.target.style.color = '#222222';
													}
												}}
											>
												<i className="ri-bookmark-3-line"></i>{" "}
												Favourites
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
													display: 'block',
													padding: '12px 16px',
													color: currentRoute === "/profile/edit-my-info" ? '#FF385C' : '#222222',
													textDecoration: 'none',
													fontSize: '14px',
													borderRadius: '6px',
													transition: 'all 0.2s ease',
													backgroundColor: currentRoute === "/profile/edit-my-info" ? '#FFF5F7' : 'transparent',
												}}
												onMouseEnter={(e) => {
													if (currentRoute !== "/profile/edit-my-info") {
														e.target.style.backgroundColor = '#FFF5F7';
														e.target.style.color = '#FF385C';
													}
												}}
												onMouseLeave={(e) => {
													if (currentRoute !== "/profile/edit-my-info") {
														e.target.style.backgroundColor = 'transparent';
														e.target.style.color = '#222222';
													}
												}}
											>
												<i className="ri-user-add-line"></i>{" "}
												Update Profile Info
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
													display: 'block',
													padding: '12px 16px',
													color: currentRoute === "/profile/settings" ? '#FF385C' : '#222222',
													textDecoration: 'none',
													fontSize: '14px',
													borderRadius: '6px',
													transition: 'all 0.2s ease',
													backgroundColor: currentRoute === "/profile/settings" ? '#FFF5F7' : 'transparent',
												}}
												onMouseEnter={(e) => {
													if (currentRoute !== "/profile/settings") {
														e.target.style.backgroundColor = '#FFF5F7';
														e.target.style.color = '#FF385C';
													}
												}}
												onMouseLeave={(e) => {
													if (currentRoute !== "/profile/settings") {
														e.target.style.backgroundColor = 'transparent';
														e.target.style.color = '#222222';
													}
												}}
											>
												<i className="ri-settings-line"></i>{" "}
												Settings
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
													display: 'block',
													padding: '12px 16px',
													color: currentRoute === `/author/${currentUser.id}` ? '#FF385C' : '#222222',
													textDecoration: 'none',
													fontSize: '14px',
													borderRadius: '6px',
													transition: 'all 0.2s ease',
													backgroundColor: currentRoute === `/author/${currentUser.id}` ? '#FFF5F7' : 'transparent',
												}}
												onMouseEnter={(e) => {
													if (currentRoute !== `/author/${currentUser.id}`) {
														e.target.style.backgroundColor = '#FFF5F7';
														e.target.style.color = '#FF385C';
													}
												}}
												onMouseLeave={(e) => {
													if (currentRoute !== `/author/${currentUser.id}`) {
														e.target.style.backgroundColor = 'transparent';
														e.target.style.color = '#222222';
													}
												}}
											>
												<i className="ri-focus-3-line"></i>{" "}
												View My Profile
											</Link>
										</li>
										
										<hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #f0f0f0' }} />

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
													display: 'block',
													width: '100%',
													padding: '12px 16px',
													color: '#222222',
													textDecoration: 'none',
													fontSize: '14px',
													borderRadius: '6px',
													transition: 'all 0.2s ease',
													backgroundColor: 'transparent',
													border: 'none',
													textAlign: 'left',
													cursor: 'pointer',
												}}
												onMouseEnter={(e) => {
													e.target.style.backgroundColor = '#FFF5F7';
													e.target.style.color = '#FF385C';
												}}
												onMouseLeave={(e) => {
													e.target.style.backgroundColor = 'transparent';
													e.target.style.color = '#222222';
												}}
											>
												<i className="ri-logout-box-r-line"></i>{" "}
												Logout
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

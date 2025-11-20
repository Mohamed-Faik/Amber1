"use client";
import React from "react";
import messageImg from "../../../public/images/icon/messages-2.svg";
import callImg from "../../../public/images/icon/call-calling.svg";
import userImg from "../../../public/images/authors/author-1.jpg";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";

const AuthorDetails = ({ user }) => {
	if (!user) {
		return null;
	}

	return (
		<div style={{
			paddingTop: "40px",
			paddingBottom: "40px",
			width: "100%",
		}}>
			<div style={{ maxWidth: "1400px", margin: "0 auto", paddingLeft: "24px", paddingRight: "24px", boxSizing: "border-box" }}>
				<div style={{
					backgroundColor: "#ffffff",
					borderRadius: "16px",
					padding: "48px",
					boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
					transition: "all 0.2s ease",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
				}}
				>
					<div style={{
						display: "grid",
						gridTemplateColumns: "auto 1fr",
						gap: "48px",
						alignItems: "flex-start",
					}}>
						{/* Author Image */}
						<div style={{
							width: "240px",
							height: "240px",
							borderRadius: "16px",
							overflow: "hidden",
							position: "relative",
							flexShrink: 0,
							boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
						}}>
							<Image
								src={user?.image ? user.image : userImg}
								alt={user?.name || "Author"}
								fill
								style={{ objectFit: "cover", objectPosition: "center" }}
								sizes="240px"
								unoptimized
							/>
						</div>

						{/* Author Info */}
						<div style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							gap: "24px",
						}}>
							<div>
								<h2 style={{
									fontSize: "32px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "12px",
									marginTop: 0,
								}}>
									{user?.name || "Unknown User"}
								</h2>
								<div style={{
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}>
									<span style={{
										fontSize: "14px",
										color: "#717171",
										display: "flex",
										alignItems: "center",
										gap: "8px",
									}}>
										<i className="ri-calendar-line" style={{ fontSize: "16px" }}></i>
										Member Since {formatDate(user?.created_at)}
									</span>
									{user?.profile?.address && (
										<span style={{
											fontSize: "14px",
											color: "#717171",
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}>
											<i className="ri-map-pin-line" style={{ fontSize: "16px" }}></i>
											{user.profile.address}
										</span>
									)}
								</div>
							</div>

							{/* Social Links */}
							{(user?.profile?.facebook || user?.profile?.youtube || user?.profile?.twitter || user?.profile?.linkedin) && (
								<div>
									<div style={{
										display: "flex",
										gap: "12px",
										flexWrap: "wrap",
									}}>
										{user?.profile?.facebook && (
											<Link
												href={user.profile.facebook}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													width: "44px",
													height: "44px",
													borderRadius: "8px",
													backgroundColor: "#f7f7f7",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													textDecoration: "none",
													color: "#222222",
													fontSize: "20px",
													transition: "all 0.2s ease",
												}}
												onMouseEnter={(e) => {
													e.target.style.backgroundColor = "#1877F2";
													e.target.style.color = "#ffffff";
													e.target.style.transform = "translateY(-2px)";
												}}
												onMouseLeave={(e) => {
													e.target.style.backgroundColor = "#f7f7f7";
													e.target.style.color = "#222222";
													e.target.style.transform = "translateY(0)";
												}}
											>
												<i className="ri-facebook-fill"></i>
											</Link>
										)}
										{user?.profile?.youtube && (
											<Link
												href={user.profile.youtube}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													width: "44px",
													height: "44px",
													borderRadius: "8px",
													backgroundColor: "#f7f7f7",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													textDecoration: "none",
													color: "#222222",
													fontSize: "20px",
													transition: "all 0.2s ease",
												}}
												onMouseEnter={(e) => {
													e.target.style.backgroundColor = "#FF0000";
													e.target.style.color = "#ffffff";
													e.target.style.transform = "translateY(-2px)";
												}}
												onMouseLeave={(e) => {
													e.target.style.backgroundColor = "#f7f7f7";
													e.target.style.color = "#222222";
													e.target.style.transform = "translateY(0)";
												}}
											>
												<i className="ri-youtube-line"></i>
											</Link>
										)}
										{user?.profile?.twitter && (
											<Link
												href={user.profile.twitter}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													width: "44px",
													height: "44px",
													borderRadius: "8px",
													backgroundColor: "#f7f7f7",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													textDecoration: "none",
													color: "#222222",
													fontSize: "20px",
													transition: "all 0.2s ease",
												}}
												onMouseEnter={(e) => {
													e.target.style.backgroundColor = "#1DA1F2";
													e.target.style.color = "#ffffff";
													e.target.style.transform = "translateY(-2px)";
												}}
												onMouseLeave={(e) => {
													e.target.style.backgroundColor = "#f7f7f7";
													e.target.style.color = "#222222";
													e.target.style.transform = "translateY(0)";
												}}
											>
												<i className="ri-twitter-fill"></i>
											</Link>
										)}
										{user?.profile?.linkedin && (
											<Link
												href={user.profile.linkedin}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													width: "44px",
													height: "44px",
													borderRadius: "8px",
													backgroundColor: "#f7f7f7",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													textDecoration: "none",
													color: "#222222",
													fontSize: "20px",
													transition: "all 0.2s ease",
												}}
												onMouseEnter={(e) => {
													e.target.style.backgroundColor = "#0077B5";
													e.target.style.color = "#ffffff";
													e.target.style.transform = "translateY(-2px)";
												}}
												onMouseLeave={(e) => {
													e.target.style.backgroundColor = "#f7f7f7";
													e.target.style.color = "#222222";
													e.target.style.transform = "translateY(0)";
												}}
											>
												<i className="ri-linkedin-fill"></i>
											</Link>
										)}
									</div>
								</div>
							)}

							{/* Contact Buttons */}
							<div style={{
								display: "flex",
								gap: "16px",
								flexWrap: "wrap",
							}}>
								<a
									href="https://www.whatsapp.com/"
									target="_blank"
									rel="noopener noreferrer"
									style={{
										padding: "12px 24px",
										backgroundColor: "#25D366",
										color: "#ffffff",
										borderRadius: "8px",
										fontSize: "16px",
										fontWeight: "600",
										textDecoration: "none",
										transition: "all 0.3s ease",
										boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
										display: "inline-flex",
										alignItems: "center",
										gap: "8px",
									}}
									onMouseEnter={(e) => {
										e.target.style.backgroundColor = "#20BA5A";
										e.target.style.transform = "translateY(-2px)";
										e.target.style.boxShadow = "0 6px 16px rgba(37, 211, 102, 0.4)";
									}}
									onMouseLeave={(e) => {
										e.target.style.backgroundColor = "#25D366";
										e.target.style.transform = "translateY(0)";
										e.target.style.boxShadow = "0 4px 12px rgba(37, 211, 102, 0.3)";
									}}
								>
									<Image
										src={messageImg}
										alt="message"
										width="20"
										height="20"
									/>
									Chat Via Whatsapp
								</a>
								{user?.profile?.phone && (
									<a
										href={`tel:${user.profile.phone}`}
										style={{
											padding: "12px 24px",
											backgroundColor: "#ffffff",
											color: "#222222",
											border: "2px solid #e5e5e5",
											borderRadius: "8px",
											fontSize: "16px",
											fontWeight: "600",
											textDecoration: "none",
											transition: "all 0.3s ease",
											display: "inline-flex",
											alignItems: "center",
											gap: "8px",
										}}
										onMouseEnter={(e) => {
											e.target.style.borderColor = "#FF385C";
											e.target.style.color = "#FF385C";
											e.target.style.transform = "translateY(-2px)";
										}}
										onMouseLeave={(e) => {
											e.target.style.borderColor = "#e5e5e5";
											e.target.style.color = "#222222";
											e.target.style.transform = "translateY(0)";
										}}
									>
										<Image
											src={callImg}
											alt="call"
											width="20"
											height="20"
										/>
										Call: {user.profile.phone}
									</a>
								)}
							</div>

							{/* Bio */}
							{user?.profile?.bio && (
								<div>
									<p style={{
										fontSize: "16px",
										color: "#717171",
										lineHeight: "1.6",
										margin: 0,
									}}>
										{user.profile.bio}
									</p>
								</div>
							)}
						</div>
					</div>

					<style jsx>{`
						@media only screen and (max-width: 991px) {
							div[style*="gridTemplateColumns"] {
								grid-template-columns: 1fr !important;
								gap: 32px !important;
							}
							div[style*="width: 240px"] {
								width: 180px !important;
								height: 180px !important;
								margin: 0 auto !important;
							}
						}
					`}</style>
				</div>
			</div>
		</div>
	);
};

export default AuthorDetails;

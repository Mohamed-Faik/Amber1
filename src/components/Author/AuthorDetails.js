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
							borderRadius: "50%",
							overflow: "hidden",
							position: "relative",
							flexShrink: 0,
							boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
						}}>
							<Image
								src={user?.image ? user.image : userImg}
								alt="AmberHomes-User"
								fill
								style={{ 
									objectFit: "cover", 
									objectPosition: "center",
									borderRadius: "50%"
								}}
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
									AmberHomes-User
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
								</div>
							</div>


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
							</div>

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

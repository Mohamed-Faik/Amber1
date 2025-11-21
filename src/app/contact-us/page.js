"use client";

import React from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import ContactInfo from "@/components/Contact/ContactInfo";
import GoogleMap from "@/components/Contact/GoogleMap";

const page = () => {
	return (
		<div style={{
			backgroundColor: "#FAFAFA",
			minHeight: "100vh",
			position: "relative",
			overflow: "hidden",
		}}>
			{/* Decorative Background Elements */}
			<div style={{
				position: "absolute",
				top: "-200px",
				right: "-200px",
				width: "600px",
				height: "600px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(255, 56, 92, 0.05) 0%, rgba(230, 30, 77, 0.08) 100%)",
				zIndex: 0,
			}} />
			<div style={{
				position: "absolute",
				bottom: "-250px",
				left: "-250px",
				width: "700px",
				height: "700px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(215, 4, 102, 0.05) 0%, rgba(255, 56, 92, 0.08) 100%)",
				zIndex: 0,
			}} />
			
			<div style={{ height: "80px" }} />
			
			<div style={{
				minHeight: "calc(100vh - 80px)",
				padding: "48px 0",
				position: "relative",
				zIndex: 1,
			}}>
				<div style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: "0 80px",
				}}>
					{/* Header */}
					<div style={{ marginBottom: "48px" }}>
						<div style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							marginBottom: "20px",
						}}>
							<div style={{
								width: "56px",
								height: "56px",
								borderRadius: "16px",
								background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								boxShadow: "0 8px 24px rgba(255, 56, 92, 0.25)",
							}}>
								<Mail size={28} color="#FFFFFF" strokeWidth={2.5} />
							</div>
							<div>
								<h1 style={{
									fontSize: "36px",
									fontWeight: "700",
									color: "#222222",
									margin: "0 0 4px 0",
									lineHeight: "1.1",
									letterSpacing: "-0.5px",
								}}>
									Contact Us
								</h1>
								<p style={{
									fontSize: "15px",
									color: "#717171",
									margin: "0",
									fontWeight: "500",
								}}>
									Get in Touch
								</p>
							</div>
						</div>
						<p style={{
							fontSize: "16px",
							color: "#767676",
							lineHeight: "1.6",
							margin: "0",
						}}>
							Have questions or need assistance? We're here to help! Reach out to us anytime and we'll get back to you as soon as possible.
						</p>
					</div>

					{/* Contact Info Section */}
					<div style={{ marginBottom: "48px" }}>
						<ContactInfo />
					</div>

					{/* Contact Form Section */}
					<div style={{
						backgroundColor: "#FFFFFF",
						borderRadius: "16px",
						padding: "40px",
						boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
						border: "1px solid #E0E0E0",
						marginBottom: "48px",
					}}>
						<div style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginBottom: "32px",
						}}>
							<div style={{
								width: "44px",
								height: "44px",
								borderRadius: "12px",
								background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
								<MessageSquare size={22} color="#FFFFFF" strokeWidth={2.5} />
							</div>
							<h2 style={{
								fontSize: "28px",
								fontWeight: "700",
								color: "#222222",
								margin: "0",
								letterSpacing: "-0.5px",
							}}>
								Send us a Message
							</h2>
						</div>

						<form id="contactForm">
							<div style={{
								display: "grid",
								gridTemplateColumns: "repeat(2, 1fr)",
								gap: "24px",
								marginBottom: "24px",
							}}>
								<div>
									<label style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
									}}>
										Your Name *
									</label>
									<input
										type="text"
										name="name"
										id="name"
										required
										placeholder="John Doe"
										style={{
											width: "100%",
											padding: "14px 16px",
											border: "1px solid #E0E0E0",
											borderRadius: "12px",
											fontSize: "15px",
											fontFamily: "inherit",
											backgroundColor: "#FFFFFF",
											color: "#222222",
											transition: "all 0.2s ease",
											outline: "none",
										}}
										onFocus={(e) => {
											e.currentTarget.style.borderColor = "#FF385C";
											e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 56, 92, 0.1)";
										}}
										onBlur={(e) => {
											e.currentTarget.style.borderColor = "#E0E0E0";
											e.currentTarget.style.boxShadow = "none";
										}}
									/>
								</div>

								<div>
									<label style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
									}}>
										Your Email *
									</label>
									<input
										type="email"
										name="email"
										id="email"
										required
										placeholder="john@example.com"
										style={{
											width: "100%",
											padding: "14px 16px",
											border: "1px solid #E0E0E0",
											borderRadius: "12px",
											fontSize: "15px",
											fontFamily: "inherit",
											backgroundColor: "#FFFFFF",
											color: "#222222",
											transition: "all 0.2s ease",
											outline: "none",
										}}
										onFocus={(e) => {
											e.currentTarget.style.borderColor = "#FF385C";
											e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 56, 92, 0.1)";
										}}
										onBlur={(e) => {
											e.currentTarget.style.borderColor = "#E0E0E0";
											e.currentTarget.style.boxShadow = "none";
										}}
									/>
								</div>

								<div>
									<label style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
									}}>
										Phone Number
									</label>
									<input
										type="tel"
										name="phone_number"
										id="phone_number"
										placeholder="+1 (234) 567-8900"
										style={{
											width: "100%",
											padding: "14px 16px",
											border: "1px solid #E0E0E0",
											borderRadius: "12px",
											fontSize: "15px",
											fontFamily: "inherit",
											backgroundColor: "#FFFFFF",
											color: "#222222",
											transition: "all 0.2s ease",
											outline: "none",
										}}
										onFocus={(e) => {
											e.currentTarget.style.borderColor = "#FF385C";
											e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 56, 92, 0.1)";
										}}
										onBlur={(e) => {
											e.currentTarget.style.borderColor = "#E0E0E0";
											e.currentTarget.style.boxShadow = "none";
										}}
									/>
								</div>

								<div>
									<label style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
									}}>
										Subject *
									</label>
									<input
										type="text"
										name="msg_subject"
										id="msg_subject"
										required
										placeholder="How can we help?"
										style={{
											width: "100%",
											padding: "14px 16px",
											border: "1px solid #E0E0E0",
											borderRadius: "12px",
											fontSize: "15px",
											fontFamily: "inherit",
											backgroundColor: "#FFFFFF",
											color: "#222222",
											transition: "all 0.2s ease",
											outline: "none",
										}}
										onFocus={(e) => {
											e.currentTarget.style.borderColor = "#FF385C";
											e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 56, 92, 0.1)";
										}}
										onBlur={(e) => {
											e.currentTarget.style.borderColor = "#E0E0E0";
											e.currentTarget.style.boxShadow = "none";
										}}
									/>
								</div>
							</div>

							<div style={{ marginBottom: "24px" }}>
								<label style={{
									display: "block",
									fontSize: "14px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "8px",
								}}>
									Your Message *
								</label>
								<textarea
									name="message"
									id="message"
									required
									rows={6}
									placeholder="Tell us more about your inquiry..."
									style={{
										width: "100%",
										padding: "14px 16px",
										border: "1px solid #E0E0E0",
										borderRadius: "12px",
										fontSize: "15px",
										fontFamily: "inherit",
										backgroundColor: "#FFFFFF",
										color: "#222222",
										transition: "all 0.2s ease",
										outline: "none",
										resize: "vertical",
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = "#FF385C";
										e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 56, 92, 0.1)";
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = "#E0E0E0";
										e.currentTarget.style.boxShadow = "none";
									}}
								/>
							</div>

							<div style={{
								display: "flex",
								alignItems: "center",
								gap: "12px",
								marginBottom: "32px",
							}}>
								<input
									type="checkbox"
									name="gridCheck"
									id="gridCheck"
									required
									style={{
										width: "18px",
										height: "18px",
										cursor: "pointer",
										accentColor: "#FF385C",
									}}
								/>
								<label htmlFor="gridCheck" style={{
									fontSize: "14px",
									color: "#717171",
									cursor: "pointer",
									margin: "0",
								}}>
									I agree to save my information for future communications
								</label>
							</div>

							<button
								type="submit"
								style={{
									background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
									color: "#FFFFFF",
									border: "none",
									padding: "16px 32px",
									borderRadius: "12px",
									fontSize: "16px",
									fontWeight: "600",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									gap: "10px",
									transition: "all 0.2s ease",
									boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 56, 92, 0.4)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "translateY(0)";
									e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 56, 92, 0.3)";
								}}
							>
								<Send size={18} strokeWidth={2.5} />
								Send Message
							</button>
						</form>
					</div>

					{/* Google Map Section */}
					<div style={{
						backgroundColor: "#FFFFFF",
						borderRadius: "16px",
						padding: "40px",
						boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
						border: "1px solid #E0E0E0",
						overflow: "hidden",
					}}>
						<div style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							marginBottom: "24px",
						}}>
							<div style={{
								width: "44px",
								height: "44px",
								borderRadius: "12px",
								background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
								<MapPin size={22} color="#FFFFFF" strokeWidth={2.5} />
							</div>
							<h2 style={{
								fontSize: "28px",
								fontWeight: "700",
								color: "#222222",
								margin: "0",
								letterSpacing: "-0.5px",
							}}>
								Find Us on Map
							</h2>
						</div>
						<GoogleMap />
					</div>
				</div>
			</div>

			<style jsx>{`
				/* Tablet: 768px - 991px */
				@media (max-width: 991px) {
					div[style*="1760px"] {
						padding: 0 24px !important;
					}
					div[style*="gridTemplateColumns: \"repeat(2, 1fr)\""] {
						grid-template-columns: 1fr !important;
					}
					div[style*="padding: \"40px\""] {
						padding: 32px 24px !important;
					}
					h1[style*="fontSize: \"36px\""] {
						font-size: 28px !important;
					}
					h2[style*="fontSize: \"28px\""] {
						font-size: 24px !important;
					}
				}

				/* Mobile: < 768px */
				@media (max-width: 767px) {
					div[style*="1760px"] {
						padding: 0 16px !important;
					}
					div[style*="padding: \"48px 0\""] {
						padding: 32px 0 !important;
					}
					div[style*="marginBottom: \"48px\""] {
						margin-bottom: 32px !important;
					}
					div[style*="padding: \"40px\""] {
						padding: 20px !important;
					}
					h1[style*="fontSize: \"36px\""] {
						font-size: 24px !important;
					}
					h2[style*="fontSize: \"28px\""] {
						font-size: 20px !important;
					}
					p[style*="fontSize: \"16px\""] {
						font-size: 14px !important;
					}
					div[style*="width: \"56px\""] {
						width: 48px !important;
						height: 48px !important;
					}
					div[style*="width: \"44px\""] {
						width: 40px !important;
						height: 40px !important;
					}
					button[style*="padding: \"16px 32px\""] {
						width: 100% !important;
						justify-content: center !important;
					}
				}

				/* Small Mobile: < 480px */
				@media (max-width: 480px) {
					div[style*="1760px"] {
						padding: 0 12px !important;
					}
					div[style*="padding: \"48px 0\""] {
						padding: 24px 0 !important;
					}
					div[style*="padding: \"40px\""] {
						padding: 16px !important;
					}
					h1[style*="fontSize: \"36px\""] {
						font-size: 22px !important;
					}
					h2[style*="fontSize: \"28px\""] {
						font-size: 18px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default page;
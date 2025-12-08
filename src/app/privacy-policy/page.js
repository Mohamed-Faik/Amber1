import React from "react";
import { Shield, Lock, Eye, FileText, Database, Users, Mail, Globe, User } from "lucide-react";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Image from "next/image";

export const dynamic = 'force-dynamic';

const PrivacyPolicy = async () => {
	const currentUser = await getCurrentUser();
	const sections = [
		{
			icon: Shield,
			title: "Information We Collect",
			content: "We collect information that you provide directly to us when you create an account, make a booking, contact us, or use our services. This may include your name, email address, phone number, payment information, and any other information you choose to provide."
		},
		{
			icon: Database,
			title: "How We Use Your Information",
			content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, communicate with you about products and services, and monitor and analyze trends and usage."
		},
		{
			icon: Lock,
			title: "Data Security",
			content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure."
		},
		{
			icon: Eye,
			title: "Information Sharing",
			content: "We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances: with your consent, to comply with legal obligations, to protect our rights, or with service providers who assist us in operating our platform."
		},
		{
			icon: Users,
			title: "Your Rights",
			content: "You have the right to access, update, or delete your personal information at any time. You can also opt-out of certain communications from us. To exercise these rights, please contact us through the methods provided in our contact section."
		},
		{
			icon: Globe,
			title: "Cookies and Tracking",
			content: "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
		},
		{
			icon: Mail,
			title: "Contact Us",
			content: "If you have any questions about this Privacy Policy, please contact us at privacy@ambershomes.com. We are committed to addressing your concerns and ensuring your privacy is protected."
		},
		{
			icon: FileText,
			title: "Policy Updates",
			content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. You are advised to review this Privacy Policy periodically for any changes."
		}
	];

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

			{/* Content */}
			<div style={{
				minHeight: "calc(100vh - 80px)",
				padding: "80px 0 48px 0",
				position: "relative",
				zIndex: 1,
			}}>
				<div style={{
					maxWidth: "1200px",
					margin: "0 auto",
					padding: "0 10px",
				}}>
					{/* Header */}
					<div style={{ marginBottom: "56px" }}>
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
								<Shield size={28} color="#FFFFFF" strokeWidth={2.5} />
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
									Privacy Policy
								</h1>
								<p style={{
									fontSize: "15px",
									color: "#717171",
									margin: "0",
									fontWeight: "500",
								}}>
									Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
								</p>
							</div>
						</div>
						<p style={{
							fontSize: "16px",
							color: "#767676",
							lineHeight: "1.6",
							margin: "0",
							maxWidth: "800px",
						}}>
							At Amber's Homes, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
						</p>
					</div>

					{/* Main Content Card */}
					<div style={{
						backgroundColor: "#FFFFFF",
						borderRadius: "16px",
						padding: "48px",
						boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
						border: "1px solid #E0E0E0",
					}}>
						{/* Current User Information Section */}
						{currentUser && (
							<div style={{
								marginBottom: "48px",
								padding: "32px",
								borderRadius: "12px",
								backgroundColor: "linear-gradient(135deg, rgba(255, 56, 92, 0.05) 0%, rgba(230, 30, 77, 0.08) 100%)",
								border: "2px solid rgba(255, 56, 92, 0.2)",
								background: "linear-gradient(135deg, rgba(255, 56, 92, 0.03) 0%, rgba(230, 30, 77, 0.05) 100%)",
							}}>
								<div style={{
									display: "flex",
									alignItems: "center",
									gap: "16px",
									marginBottom: "20px",
								}}>
									<div style={{
										width: "48px",
										height: "48px",
										borderRadius: "12px",
										background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										boxShadow: "0 4px 12px rgba(255, 56, 92, 0.2)",
									}}>
										<User size={24} color="#FFFFFF" strokeWidth={2} />
									</div>
									<h2 style={{
										fontSize: "22px",
										fontWeight: "600",
										color: "#222222",
										margin: "0",
									}}>
										Your Account Information
									</h2>
								</div>
								<div style={{
									display: "flex",
									alignItems: "center",
									gap: "20px",
									padding: "20px",
									backgroundColor: "#FFFFFF",
									borderRadius: "12px",
									border: "1px solid #E0E0E0",
								}}>
									<div style={{
										position: "relative",
										width: "80px",
										height: "80px",
										borderRadius: "50%",
										overflow: "hidden",
										flexShrink: 0,
										backgroundColor: "#F7F7F7",
										border: "3px solid #FF385C",
									}}>
										{currentUser.image ? (
											<Image
												src={currentUser.image}
												alt={currentUser.name || "User"}
												fill
												style={{ objectFit: "cover" }}
												unoptimized
											/>
										) : (
											<div style={{
												width: "100%",
												height: "100%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												backgroundColor: "#DDDDDD",
												color: "#717171",
												fontSize: "32px",
												fontWeight: "600",
											}}>
												{(currentUser.name || currentUser.email || "U")[0].toUpperCase()}
											</div>
										)}
									</div>
									<div style={{ flex: 1 }}>
										<h3 style={{
											fontSize: "20px",
											fontWeight: "600",
											color: "#222222",
											margin: "0 0 8px 0",
										}}>
											{currentUser.name || "User"}
										</h3>
										<p style={{
											fontSize: "15px",
											color: "#717171",
											margin: "0 0 4px 0",
										}}>
											{currentUser.email}
										</p>
										{currentUser.profile?.bio && (
											<p style={{
												fontSize: "14px",
												color: "#767676",
												margin: "8px 0 0 0",
												lineHeight: "1.5",
											}}>
												{currentUser.profile.bio}
											</p>
										)}
										<div style={{
											display: "flex",
											gap: "16px",
											marginTop: "12px",
										}}>
											<span style={{
												fontSize: "13px",
												color: "#717171",
												padding: "4px 12px",
												backgroundColor: "#F7F7F7",
												borderRadius: "8px",
											}}>
												Member since {new Date(currentUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
											</span>
											{currentUser.role === "ADMIN" && (
												<span style={{
													fontSize: "13px",
													color: "#FF385C",
													padding: "4px 12px",
													backgroundColor: "rgba(255, 56, 92, 0.1)",
													borderRadius: "8px",
													fontWeight: "600",
												}}>
													Administrator
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Introduction */}
						<div style={{
							marginBottom: "48px",
							paddingBottom: "32px",
							borderBottom: "1px solid #E0E0E0",
						}}>
							<p style={{
								fontSize: "16px",
								color: "#222222",
								lineHeight: "1.8",
								margin: "0 0 20px 0",
							}}>
								Welcome to Amber's Homes. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
							</p>
							<p style={{
								fontSize: "16px",
								color: "#222222",
								lineHeight: "1.8",
								margin: "0",
							}}>
								By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
							</p>
						</div>

						{/* Sections */}
						<div style={{
							display: "grid",
							gap: "32px",
						}}>
							{sections.map((section, index) => {
								const IconComponent = section.icon;
								return (
									<div
										key={index}
										style={{
											padding: "32px",
											borderRadius: "12px",
											backgroundColor: "#FAFAFA",
											border: "1px solid #E0E0E0",
										}}
									>
										<div style={{
											display: "flex",
											alignItems: "flex-start",
											gap: "20px",
										}}>
											<div style={{
												width: "48px",
												height: "48px",
												borderRadius: "12px",
												background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												flexShrink: 0,
												boxShadow: "0 4px 12px rgba(255, 56, 92, 0.2)",
											}}>
												<IconComponent size={24} color="#FFFFFF" strokeWidth={2} />
											</div>
											<div style={{ flex: 1 }}>
												<h3 style={{
													fontSize: "20px",
													fontWeight: "600",
													color: "#222222",
													margin: "0 0 12px 0",
													lineHeight: "1.3",
												}}>
													{section.title}
												</h3>
												<p style={{
													fontSize: "15px",
													color: "#717171",
													lineHeight: "1.7",
													margin: "0",
												}}>
													{section.content}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						{/* Footer Note */}
						<div style={{
							marginTop: "48px",
							paddingTop: "32px",
							borderTop: "1px solid #E0E0E0",
							textAlign: "center",
						}}>
							<p style={{
								fontSize: "14px",
								color: "#717171",
								lineHeight: "1.6",
								margin: "0",
							}}>
								If you have any questions or concerns about this Privacy Policy, please don't hesitate to contact us. We are here to help and ensure your privacy is protected.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPolicy;

"use client";

import React from "react";
import { Info, Users, Award, Heart, Target, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import aboutImg from "../../../public/images/about-img.png";

const page = () => {

	const features = [
		{
			icon: Users,
			title: "5M+ Trusted Users",
			description: "Join millions of users who trust AmberHomes for their classified ads and directory listings.",
		},
		{
			icon: Award,
			title: "Top Rated Platform",
			description: "Recognized as the #1 classified ads platform with the highest user satisfaction ratings.",
		},
		{
			icon: Heart,
			title: "User-Centric Approach",
			description: "We prioritize your needs and continuously improve based on your valuable feedback.",
		},
		{
			icon: Target,
			title: "Precise Listings",
			description: "Find exactly what you're looking for with our advanced search and filtering system.",
		},
		{
			icon: Sparkles,
			title: "Innovation First",
			description: "Stay ahead with cutting-edge features and technology that makes listing easy.",
		},
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
					padding: "0 10px",
				}}>
					{/* Header */}
					<div style={{ marginBottom: "64px" }}>
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
								<Info size={28} color="#FFFFFF" strokeWidth={2.5} />
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
									About Us
								</h1>
								<p style={{
									fontSize: "15px",
									color: "#717171",
									margin: "0",
									fontWeight: "500",
								}}>
									Our Story
								</p>
							</div>
						</div>
					</div>

					{/* Main Content Section */}
					<div style={{
						backgroundColor: "#FFFFFF",
						borderRadius: "16px",
						padding: "40px",
						boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
						border: "1px solid #E0E0E0",
						marginBottom: "64px",
					}}>
						<div className="about-content-grid" style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "48px",
							alignItems: "center",
						}}>
							{/* Text Content - First */}
							<div className="about-text-content" style={{ 
								order: 1,
								display: "block",
								width: "100%",
							}}>
								<h2 style={{
									fontSize: "32px",
									fontWeight: "700",
									color: "#222222",
									margin: "0 0 24px 0",
									lineHeight: "1.3",
									letterSpacing: "-0.5px",
								}}>
									We Are Top #1 Classified Ads Site Where 5 Millions User Trust Us
								</h2>
								<p style={{
									fontSize: "16px",
									color: "#767676",
									lineHeight: "1.7",
									margin: "0 0 32px 0",
								}}>
									AmberHomes is the leading platform for classified ads and directory listings. 
									We've built a trusted community where millions of users connect, discover, 
									and find exactly what they're looking for. Our commitment to excellence 
									and user satisfaction has made us the #1 choice for classified advertising.
								</p>
								<p style={{
									fontSize: "16px",
									color: "#767676",
									lineHeight: "1.7",
									margin: "0 0 32px 0",
								}}>
									With advanced search capabilities, user-friendly interface, and robust 
									security measures, we ensure that every listing is authentic and every 
									interaction is safe. Join the AmberHomes community today and experience 
									the difference.
								</p>
								<Link
									href="/authors"
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: "8px",
										background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
										color: "#FFFFFF",
										padding: "14px 28px",
										borderRadius: "12px",
										fontSize: "16px",
										fontWeight: "600",
										textDecoration: "none",
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
									Be A Trusted User
								</Link>
							</div>
							{/* Image - Second */}
							<div className="about-image-content" style={{
								order: 2,
								display: "block",
								width: "100%",
								borderRadius: "16px",
								overflow: "hidden",
								boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
							}}>
								<Image
									src={aboutImg}
									alt="About AmberHomes"
									width={600}
									height={500}
									style={{
										width: "100%",
										height: "auto",
										display: "block",
									}}
								/>
							</div>
						</div>
					</div>

					{/* Features Grid */}
					<div style={{ marginBottom: "64px" }}>
						<div style={{
							textAlign: "center",
							marginBottom: "48px",
						}}>
							<h2 style={{
								fontSize: "32px",
								fontWeight: "700",
								color: "#222222",
								margin: "0 0 16px 0",
								letterSpacing: "-0.5px",
							}}>
								Why Choose AmberHomes?
							</h2>
							<p style={{
								fontSize: "16px",
								color: "#767676",
								margin: "0",
								maxWidth: "600px",
								marginLeft: "auto",
								marginRight: "auto",
							}}>
								Discover what makes us the preferred choice for millions of users worldwide.
							</p>
						</div>

						<div style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
							gap: "24px",
						}}>
							{features.map((feature, index) => {
								const IconComponent = feature.icon;
								return (
									<div
										key={index}
										style={{
											backgroundColor: "#FFFFFF",
											borderRadius: "16px",
											padding: "32px",
											boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
											border: "1px solid #E0E0E0",
											transition: "all 0.3s ease",
											cursor: "pointer",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.transform = "translateY(-4px)";
											e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform = "translateY(0)";
											e.currentTarget.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.08)";
										}}
									>
										<div style={{
											width: "56px",
											height: "56px",
											borderRadius: "14px",
											background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											marginBottom: "24px",
											boxShadow: "0 4px 12px rgba(255, 56, 92, 0.25)",
										}}>
											<IconComponent size={28} color="#FFFFFF" strokeWidth={2.5} />
										</div>
										<h3 style={{
											fontSize: "20px",
											fontWeight: "700",
											color: "#222222",
											margin: "0 0 12px 0",
											letterSpacing: "-0.3px",
										}}>
											{feature.title}
										</h3>
										<p style={{
											fontSize: "15px",
											color: "#767676",
											lineHeight: "1.6",
											margin: "0",
										}}>
											{feature.description}
										</p>
									</div>
								);
							})}
						</div>
					</div>

					{/* How It Works Section */}
					<div className="how-it-works-section" style={{
						backgroundColor: "#FFFFFF",
						borderRadius: "16px",
						padding: "48px 40px",
						boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
						border: "1px solid #E0E0E0",
					}}>
						<div className="how-it-works-header" style={{
							textAlign: "center",
							marginBottom: "48px",
						}}>
							<h2 className="how-it-works-title" style={{
								fontSize: "32px",
								fontWeight: "700",
								color: "#222222",
								margin: "0 0 16px 0",
								letterSpacing: "-0.5px",
							}}>
								How AmberHomes Works For You
							</h2>
							<p className="how-it-works-subtitle" style={{
								fontSize: "16px",
								color: "#767676",
								margin: "0",
							}}>
								Simple steps to get started on our platform
							</p>
						</div>

						<div className="how-it-works-grid" style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: "40px",
						}}>
							<div style={{ textAlign: "center" }}>
								<div style={{
									width: "80px",
									height: "80px",
									borderRadius: "20px",
									background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: "0 auto 24px",
									boxShadow: "0 8px 24px rgba(255, 56, 92, 0.25)",
									fontSize: "32px",
									fontWeight: "700",
									color: "#FFFFFF",
								}}>
									1
								</div>
								<h3 style={{
									fontSize: "22px",
									fontWeight: "700",
									color: "#222222",
									margin: "0 0 12px 0",
								}}>
									Choose A Category
								</h3>
								<p style={{
									fontSize: "15px",
									color: "#767676",
									lineHeight: "1.6",
									margin: "0",
								}}>
									Select a category that best suits your interest. Use filters to customize 
									your search and find exactly what you want.
								</p>
							</div>

							<div style={{ textAlign: "center" }}>
								<div style={{
									width: "80px",
									height: "80px",
									borderRadius: "20px",
									background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: "0 auto 24px",
									boxShadow: "0 8px 24px rgba(255, 56, 92, 0.25)",
									fontSize: "32px",
									fontWeight: "700",
									color: "#FFFFFF",
								}}>
									2
								</div>
								<h3 style={{
									fontSize: "22px",
									fontWeight: "700",
									color: "#222222",
									margin: "0 0 12px 0",
								}}>
									Find What You Want
								</h3>
								<p style={{
									fontSize: "15px",
									color: "#767676",
									lineHeight: "1.6",
									margin: "0",
								}}>
									Once you have settled on a listing, learn more about it, read reviews 
									and find its location so you can reach it in no time!
								</p>
							</div>

							<div style={{ textAlign: "center" }}>
								<div style={{
									width: "80px",
									height: "80px",
									borderRadius: "20px",
									background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: "0 auto 24px",
									boxShadow: "0 8px 24px rgba(255, 56, 92, 0.25)",
									fontSize: "32px",
									fontWeight: "700",
									color: "#FFFFFF",
								}}>
									3
								</div>
								<h3 style={{
									fontSize: "22px",
									fontWeight: "700",
									color: "#222222",
									margin: "0 0 12px 0",
								}}>
									Go Out & Explore
								</h3>
								<p style={{
									fontSize: "15px",
									color: "#767676",
									lineHeight: "1.6",
									margin: "0",
								}}>
									The only thing left to do now is to go out, explore and have fun! Meet 
									new people and experience the community like a true local!
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				/* Ensure text comes first, image second on all screen sizes */
				.about-content-grid {
					display: grid !important;
				}
				.about-text-content {
					order: 1 !important;
					width: 100% !important;
				}
				.about-image-content {
					order: 2 !important;
					width: 100% !important;
				}

				/* Tablet: 768px - 991px */
				@media (max-width: 991px) {
					div[style*="1760px"] {
						padding: 0 24px !important;
					}
					.about-content-grid {
						grid-template-columns: 1fr !important;
						gap: 32px !important;
					}
					div[style*="gridTemplateColumns: \"1fr 1fr\""] {
						grid-template-columns: 1fr !important;
						gap: 32px !important;
					}
					div[style*="gridTemplateColumns: \"repeat(3, 1fr)\""] {
						grid-template-columns: 1fr !important;
						gap: 32px !important;
					}
					
					/* How It Works Section - Tablet */
					.how-it-works-grid {
						grid-template-columns: 1fr !important;
						gap: 32px !important;
					}
					.how-it-works-section {
						padding: 32px 24px !important;
					}
					.how-it-works-header {
						margin-bottom: 32px !important;
					}
					.how-it-works-title {
						font-size: 24px !important;
					}
					.how-it-works-subtitle {
						font-size: 15px !important;
					}
					
					div[style*="padding: \"48px 40px\""] {
						padding: 32px 24px !important;
					}
					div[style*="padding: \"40px\""] {
						padding: 24px !important;
					}
					h1[style*="fontSize: \"36px\""] {
						font-size: 28px !important;
					}
					h2[style*="fontSize: \"32px\""] {
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
					div[style*="marginBottom: \"64px\""] {
						margin-bottom: 40px !important;
					}
					div[style*="padding: \"40px\""] {
						padding: 20px !important;
					}
					div[style*="padding: \"48px 40px\""] {
						padding: 24px 20px !important;
					}
					div[style*="padding: \"32px\""] {
						padding: 20px !important;
					}
					
					/* Force grid to single column on mobile */
					.about-content-grid {
						grid-template-columns: 1fr !important;
						gap: 24px !important;
						display: grid !important;
					}
					.about-text-content {
						order: 1 !important;
						width: 100% !important;
						margin-bottom: 0 !important;
					}
					.about-image-content {
						order: 2 !important;
						width: 100% !important;
						margin-top: 0 !important;
					}
					
					/* How It Works Section - Mobile */
					.how-it-works-grid {
						grid-template-columns: 1fr !important;
						gap: 32px !important;
					}
					.how-it-works-section {
						padding: 24px 20px !important;
					}
					.how-it-works-header {
						margin-bottom: 32px !important;
					}
					.how-it-works-title {
						font-size: 22px !important;
						margin-bottom: 12px !important;
					}
					.how-it-works-subtitle {
						font-size: 14px !important;
					}
					
					/* Step items on mobile */
					.how-it-works-grid > div {
						padding: 0 !important;
					}
					.how-it-works-grid h3[style*="fontSize: \"22px\""] {
						font-size: 18px !important;
					}
					.how-it-works-grid p[style*="fontSize: \"15px\""] {
						font-size: 14px !important;
					}
					
					h1[style*="fontSize: \"36px\""] {
						font-size: 24px !important;
					}
					h2[style*="fontSize: \"32px\""] {
						font-size: 22px !important;
					}
					h3[style*="fontSize: \"22px\""] {
						font-size: 18px !important;
					}
					h3[style*="fontSize: \"20px\""] {
						font-size: 18px !important;
					}
					p[style*="fontSize: \"16px\""] {
						font-size: 14px !important;
					}
					div[style*="gridTemplateColumns: \"repeat(auto-fit, minmax(280px, 1fr))\""] {
						grid-template-columns: 1fr !important;
					}
					div[style*="width: \"56px\""] {
						width: 48px !important;
						height: 48px !important;
					}
					div[style*="width: \"80px\""] {
						width: 64px !important;
						height: 64px !important;
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
					
					/* Ensure grid stacks properly on small mobile */
					.about-content-grid {
						grid-template-columns: 1fr !important;
						gap: 20px !important;
					}
					.about-text-content {
						order: 1 !important;
						width: 100% !important;
					}
					.about-image-content {
						order: 2 !important;
						width: 100% !important;
					}
					
					/* How It Works Section - Small Mobile */
					.how-it-works-grid {
						grid-template-columns: 1fr !important;
						gap: 28px !important;
					}
					.how-it-works-section {
						padding: 20px 16px !important;
					}
					.how-it-works-header {
						margin-bottom: 28px !important;
					}
					.how-it-works-title {
						font-size: 20px !important;
						margin-bottom: 10px !important;
					}
					.how-it-works-subtitle {
						font-size: 13px !important;
					}
					
					/* Step items on small mobile */
					.how-it-works-grid h3[style*="fontSize: \"22px\""] {
						font-size: 17px !important;
					}
					.how-it-works-grid p[style*="fontSize: \"15px\""] {
						font-size: 13px !important;
					}
					h1[style*="fontSize: \"36px\""] {
						font-size: 22px !important;
					}
					h2[style*="fontSize: \"32px\""] {
						font-size: 20px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default page;
"use client";

import React, { useEffect, useState } from "react";
import { FileText, Calendar, User, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateBlog } from "@/utils/formatDate";

const Page = () => {
	const [blogPosts, setBlogPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBlogPosts = async () => {
			try {
				const response = await fetch("/api/blog");
				if (response.ok) {
					const data = await response.json();
					setBlogPosts(data);
				}
			} catch (error) {
				console.error("Error fetching blog posts:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchBlogPosts();
	}, []);

	const BlogCard = ({ id, slug, title, category, created_at, imageSrc, user }) => {
		return (
			<div style={{
				backgroundColor: "#FFFFFF",
				borderRadius: "16px",
				overflow: "hidden",
				boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
				border: "1px solid #E0E0E0",
				transition: "all 0.3s ease",
				cursor: "pointer",
				display: "flex",
				flexDirection: "column",
				height: "100%",
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
				<Link 
					href={`/blog/${id}/${slug}`}
					style={{
						position: "relative",
						display: "block",
						width: "100%",
						paddingTop: "66.67%",
						overflow: "hidden",
						backgroundColor: "#F7F7F7",
					}}
				>
					<Image
						src={imageSrc || "/images/blog/blog-1.jpg"}
						alt={title}
						width={936}
						height={672}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							transition: "transform 0.3s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "scale(1.05)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "scale(1)";
						}}
					/>
					<div style={{
						position: "absolute",
						top: "16px",
						left: "16px",
						background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
						padding: "8px 14px",
						borderRadius: "8px",
						color: "#FFFFFF",
						fontSize: "12px",
						fontWeight: "600",
						boxShadow: "0 2px 8px rgba(255, 56, 92, 0.3)",
						display: "flex",
						alignItems: "center",
						gap: "6px",
					}}>
						<Calendar size={14} strokeWidth={2.5} />
						<span
							dangerouslySetInnerHTML={{
								__html: formatDateBlog(created_at),
							}}
						/>
					</div>
				</Link>

				<div style={{
					padding: "24px",
					flex: "1",
					display: "flex",
					flexDirection: "column",
				}}>
					<div style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "6px",
						marginBottom: "16px",
					}}>
						<Tag size={14} color="#FF385C" strokeWidth={2} />
						<Link 
							href="/blog"
							style={{
								fontSize: "13px",
								fontWeight: "600",
								color: "#FF385C",
								textDecoration: "none",
								textTransform: "uppercase",
								letterSpacing: "0.5px",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.textDecoration = "underline";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.textDecoration = "none";
							}}
						>
							{category || "Uncategorized"}
						</Link>
					</div>

					<h3 style={{
						fontSize: "22px",
						fontWeight: "700",
						color: "#222222",
						margin: "0 0 16px 0",
						lineHeight: "1.4",
						letterSpacing: "-0.3px",
					}}>
						<Link 
							href={`/blog/${id}/${slug}`}
							style={{
								color: "inherit",
								textDecoration: "none",
								transition: "color 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.color = "#FF385C";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.color = "#222222";
							}}
						>
							{title}
						</Link>
					</h3>

					{user && (
						<div style={{
							display: "flex",
							alignItems: "center",
							gap: "10px",
							marginBottom: "20px",
							paddingTop: "16px",
							borderTop: "1px solid #F0F0F0",
						}}>
							<div style={{
								width: "32px",
								height: "32px",
								borderRadius: "50%",
								backgroundColor: "#F7F7F7",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								overflow: "hidden",
							}}>
								{user.image ? (
									<Image
										src={user.image}
										alt={user.name || "Author"}
										width={32}
										height={32}
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
									/>
								) : (
									<User size={18} color="#717171" strokeWidth={2} />
								)}
							</div>
							<span style={{
								fontSize: "14px",
								color: "#717171",
								fontWeight: "500",
							}}>
								{user.name || "Anonymous"}
							</span>
						</div>
					)}

					<div style={{ marginTop: "auto" }}>
						<Link
							href={`/blog/${id}/${slug}`}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
								fontSize: "15px",
								fontWeight: "600",
								color: "#FF385C",
								textDecoration: "none",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.gap = "12px";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.gap = "8px";
							}}
						>
							Read More
							<ArrowRight size={16} strokeWidth={2.5} />
						</Link>
					</div>
				</div>
			</div>
		);
	};

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
								<FileText size={28} color="#FFFFFF" strokeWidth={2.5} />
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
									Blog
								</h1>
								<p style={{
									fontSize: "15px",
									color: "#717171",
									margin: "0",
									fontWeight: "500",
								}}>
									Latest Posts & Articles
								</p>
							</div>
						</div>
						<p style={{
							fontSize: "16px",
							color: "#767676",
							lineHeight: "1.6",
							margin: "0",
						}}>
							Discover the latest news, insights, and updates from AmberHomes. Stay informed with our expert articles and community stories.
						</p>
					</div>

					{/* Blog Posts Grid */}
					{loading ? (
						<div style={{
							backgroundColor: "#FFFFFF",
							borderRadius: "16px",
							padding: "80px 40px",
							boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
							border: "1px solid #E0E0E0",
							textAlign: "center",
						}}>
							<div style={{
								display: "inline-block",
								width: "40px",
								height: "40px",
								border: "3px solid #FF385C",
								borderTopColor: "transparent",
								borderRadius: "50%",
								animation: "spin 0.8s linear infinite",
							}} />
						</div>
					) : blogPosts && blogPosts.length > 0 ? (
						<div style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
							gap: "32px",
						}}>
							{blogPosts.map((blog) => (
								<BlogCard
									key={blog.id}
									id={blog.id}
									slug={blog.slug}
									title={blog.title}
									category={blog.category}
									created_at={blog.created_at}
									imageSrc={blog.imageSrc}
									user={blog.user}
								/>
							))}
						</div>
					) : (
						<div style={{
							backgroundColor: "#FFFFFF",
							borderRadius: "16px",
							padding: "80px 40px",
							boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
							border: "1px solid #E0E0E0",
							textAlign: "center",
						}}>
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
							}}>
								<FileText size={40} color="#FFFFFF" strokeWidth={2.5} />
							</div>
							<h2 style={{
								fontSize: "28px",
								fontWeight: "700",
								color: "#222222",
								margin: "0 0 12px 0",
							}}>
								No Blog Posts Yet
							</h2>
							<p style={{
								fontSize: "16px",
								color: "#767676",
								margin: "0",
							}}>
								Check back soon for exciting blog posts and articles!
							</p>
						</div>
					)}
				</div>
			</div>

			<style jsx>{`
				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				@media (max-width: 1128px) {
					div[style*="1760px"] {
						padding: 0 24px !important;
					}
					div[style*="gridTemplateColumns: \"repeat(auto-fill, minmax(320px, 1fr))\""] {
						grid-template-columns: 1fr !important;
					}
				}
			`}</style>
		</div>
	);
};

export default Page;
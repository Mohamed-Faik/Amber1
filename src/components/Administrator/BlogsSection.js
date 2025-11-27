"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import { getTranslation } from "@/utils/translations";

const BlogsSection = ({ blogPosts, displayLanguage = "en" }) => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");

	const filteredBlogs = blogPosts?.filter(
		(blog) =>
			blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = async (blogId, blogTitle) => {
		if (
			!confirm(
				`Are you sure you want to delete blog "${blogTitle}"? This action cannot be undone.`
			)
		) {
			return;
		}

		try {
			await axios.delete(`/api/blog/${blogId}`);
			toast.success("Blog deleted successfully!");
			if (typeof window !== "undefined") {
				router.refresh();
			}
		} catch (error) {
			toast.error("Failed to delete blog");
		}
	};

	const getBlogImage = (imageSrc) => {
		if (!imageSrc) return null;
		if (imageSrc.startsWith("/")) return imageSrc;
		return `/${imageSrc}`;
	};

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "24px",
					flexWrap: "wrap",
					gap: "16px",
				}}
			>
				<h2
					style={{
						fontSize: "24px",
						fontWeight: "600",
						color: "#222222",
						margin: 0,
				}}
			>
				{getTranslation(displayLanguage, "admin.allBlogs")}
			</h2>

			{/* Search */}
			<input
				type="text"
				placeholder={getTranslation(displayLanguage, "admin.searchBlogs")}
				value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					style={{
						padding: "10px 16px",
						border: "1px solid #DDDDDD",
						borderRadius: "8px",
						fontSize: "14px",
						width: "300px",
						outline: "none",
					}}
					className="blogs-search"
					onFocus={(e) => {
						e.currentTarget.style.borderColor = "#222222";
					}}
					onBlur={(e) => {
						e.currentTarget.style.borderColor = "#DDDDDD";
					}}
				/>
			</div>

			{/* Blogs Grid */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
					gap: "24px",
				}}
				className="blogs-grid"
			>
				{filteredBlogs?.map((blog) => {
					const blogImage = getBlogImage(blog.imageSrc);
					return (
						<div
							key={blog.id}
							style={{
								border: "1px solid #DDDDDD",
								borderRadius: "12px",
								overflow: "hidden",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.boxShadow =
									"0 4px 12px rgba(0,0,0,0.1)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.boxShadow = "none";
							}}
						>
							{/* Image */}
							<div
								style={{
									position: "relative",
									width: "100%",
									paddingTop: "60%",
									backgroundColor: "#F7F7F7",
								}}
							>
								{blogImage ? (
									<Image
										src={blogImage}
										alt={blog.title}
										fill
										style={{ objectFit: "cover" }}
										unoptimized
									/>
								) : (
									<div
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: "100%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#999",
										}}
									>
										No Image
									</div>
								)}
							</div>

							{/* Content */}
							<div style={{ padding: "16px" }}>
								<div
									style={{
										display: "inline-block",
										padding: "4px 12px",
										borderRadius: "20px",
										fontSize: "12px",
										fontWeight: "600",
										backgroundColor: "#F7F7F7",
										color: "#222222",
										marginBottom: "8px",
									}}
								>
									{blog.category}
								</div>

								<h3
									style={{
										fontSize: "16px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
									}}
								>
									{blog.title}
								</h3>

								<p
									style={{
										fontSize: "12px",
										color: "#717171",
										marginBottom: "12px",
									}}
								>
									{formatDate(blog.created_at)}
								</p>

								{/* Actions */}
								<div
									style={{
										display: "flex",
										gap: "8px",
									}}
								>
									<Link
										href={`/blog/${blog.id}/${blog.slug}`}
										style={{
											flex: 1,
											padding: "8px 16px",
											backgroundColor: "#222222",
											color: "#FFFFFF",
											border: "none",
											borderRadius: "8px",
											fontSize: "14px",
											fontWeight: "500",
											textDecoration: "none",
											textAlign: "center",
											cursor: "pointer",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#000000";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = "#222222";
										}}
									>
										View
									</Link>

									<button
										onClick={() => handleDelete(blog.id, blog.title)}
										style={{
											padding: "8px 16px",
											backgroundColor: "#FFFFFF",
											color: "#FF385C",
											border: "1px solid #FF385C",
											borderRadius: "8px",
											fontSize: "14px",
											fontWeight: "500",
											cursor: "pointer",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#FF385C";
											e.currentTarget.style.color = "#FFFFFF";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = "#FFFFFF";
											e.currentTarget.style.color = "#FF385C";
										}}
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{filteredBlogs?.length === 0 && (
				<div
					style={{
						textAlign: "center",
						padding: "64px 20px",
						color: "#717171",
					}}
				>
					<p style={{ fontSize: "16px", margin: 0 }}>
						{searchTerm
							? "No blogs found matching your search"
							: "No blogs found"}
					</p>
				</div>
			)}
			<style jsx>{`
				/* Tablet: 768px - 991px */
				@media (max-width: 991px) {
					.blogs-grid {
						grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
						gap: 20px !important;
					}
					.blogs-search {
						width: 250px !important;
					}
				}

				/* Mobile: < 768px */
				@media (max-width: 767px) {
					.blogs-search {
						width: 100% !important;
					}
					.blogs-grid {
						grid-template-columns: 1fr !important;
						gap: 16px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default BlogsSection;


"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@mantine/rte"), {
	ssr: false,
	loading: () => null,
});
import RTEControls from "@/utils/RTEControls";
import Button from "@/components/FormHelpers/Button";
import { getTranslation } from "@/utils/translations";

const ContentSection = ({ displayLanguage = "en" }) => {
	const router = useRouter();
	const [contentPages, setContentPages] = useState([]);
	const [selectedPage, setSelectedPage] = useState(null);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		fetchContentPages();
	}, []);

	const fetchContentPages = async () => {
		try {
			const response = await axios.get("/api/content");
			setContentPages(response.data);
		} catch (error) {
			toast.error("Failed to load content pages");
		}
	};

	const handlePageSelect = async (slug) => {
		setIsLoading(true);
		try {
			const response = await axios.get(`/api/content/${slug}`);
			setSelectedPage(slug);
			setTitle(response.data.title);
			setContent(response.data.content);
		} catch (error) {
			// If page doesn't exist, create new one
			if (error.response?.status === 404) {
				setSelectedPage(slug);
				setTitle(getPageTitle(slug));
				setContent("");
			} else {
				toast.error("Failed to load content");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const getPageTitle = (slug) => {
		const titles = {
			"terms-condition": "Terms & Conditions",
			"privacy-policy": "Privacy Policy",
		};
		return titles[slug] || slug;
	};

	const handleSave = async () => {
		if (!selectedPage || !title || !content) {
			toast.error("Please fill in all fields");
			return;
		}

		setIsSaving(true);
		try {
			await axios.put(`/api/content/${selectedPage}`, {
				title,
				content,
			});
			toast.success("Content saved successfully!");
			fetchContentPages();
		} catch (error) {
			toast.error("Failed to save content");
		} finally {
			setIsSaving(false);
		}
	};

	const predefinedPages = [
		{ slug: "terms-condition", label: "Terms & Conditions" },
		{ slug: "privacy-policy", label: "Privacy Policy" },
	];

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
				{getTranslation(displayLanguage, "admin.manageContent")}
			</h2>
		</div>

		<div
			style={{
				display: "grid",
				gridTemplateColumns: "250px 1fr",
				gap: "24px",
			}}
		>
			{/* Page List */}
			<div
				style={{
					border: "1px solid #E0E0E0",
					borderRadius: "12px",
					padding: "16px",
					backgroundColor: "#F9FAFB",
				}}
			>
				<h3
					style={{
						fontSize: "16px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "16px",
					}}
				>
					{getTranslation(displayLanguage, "nav.legal")}
				</h3>
					<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
						{predefinedPages.map((page) => (
							<button
								key={page.slug}
								onClick={() => handlePageSelect(page.slug)}
								style={{
									padding: "12px 16px",
									border: selectedPage === page.slug ? "2px solid #FF385C" : "1px solid #E0E0E0",
									borderRadius: "8px",
									backgroundColor: selectedPage === page.slug ? "#FFFFFF" : "transparent",
									color: "#222222",
									fontSize: "14px",
									fontWeight: selectedPage === page.slug ? "600" : "500",
									cursor: "pointer",
									textAlign: "left",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									if (selectedPage !== page.slug) {
										e.currentTarget.style.backgroundColor = "#FFFFFF";
										e.currentTarget.style.borderColor = "#DDDDDD";
									}
								}}
								onMouseLeave={(e) => {
									if (selectedPage !== page.slug) {
										e.currentTarget.style.backgroundColor = "transparent";
										e.currentTarget.style.borderColor = "#E0E0E0";
									}
								}}
							>
								{page.label}
							</button>
						))}
					</div>
				</div>

				{/* Editor */}
				<div
					style={{
						border: "1px solid #E0E0E0",
						borderRadius: "12px",
						padding: "24px",
						backgroundColor: "#FFFFFF",
					}}
				>
					{isLoading ? (
						<div style={{ textAlign: "center", padding: "40px" }}>
							<p>Loading...</p>
						</div>
					) : selectedPage ? (
						<>
							<div style={{ marginBottom: "24px" }}>
								<label
									style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
									}}
								>
									Page Title
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									style={{
										width: "100%",
										padding: "12px 16px",
										border: "1px solid #E0E0E0",
										borderRadius: "8px",
										fontSize: "15px",
										outline: "none",
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = "#FF385C";
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = "#E0E0E0";
									}}
								/>
							</div>

							<div style={{ marginBottom: "24px" }}>
								<label
									style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "600",
										color: "#222222",
										marginBottom: "8px",
									}}
								>
									Content
								</label>
								<RichTextEditor
									value={content}
									onChange={setContent}
									controls={RTEControls}
									style={{
										border: "1px solid #E0E0E0",
										borderRadius: "8px",
										minHeight: "400px",
									}}
								/>
							</div>

							<Button
								label={isSaving ? "Saving..." : "Save Content"}
								onClick={handleSave}
								disabled={isSaving || !title || !content}
							/>
						</>
				) : (
					<div style={{ textAlign: "center", padding: "40px" }}>
						<p style={{ color: "#717171" }}>{getTranslation(displayLanguage, "pages.selectPage") || "Select a page to edit"}</p>
					</div>
				)}
				</div>
			</div>
		</div>
	);
};

export default ContentSection;


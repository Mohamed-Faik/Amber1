"use client";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

const ImageUpload = ({ onChange, value }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef(null);

	const handleFileSelect = useCallback(
		async (file) => {
			if (!file) return;

			// Validate file type
			if (!file.type.startsWith("image/")) {
				toast.error(`${file.name} is not an image file`);
				return;
			}

			// Validate file size (10MB max)
			if (file.size > 10 * 1024 * 1024) {
				toast.error(`${file.name} is too large (max 10MB)`);
				return;
			}

			setIsUploading(true);

			// Show preview immediately
			const reader = new FileReader();
			let previewUrl = "";
			reader.onloadend = () => {
				previewUrl = reader.result;
				onChange(previewUrl); // Show preview immediately
			};
			reader.readAsDataURL(file);

			// Upload file
			const formData = new FormData();
			formData.append("file", file);
			formData.append("type", "profile"); // Specify this is a profile image

			try {
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
					throw new Error(errorData.error || "Upload failed");
				}

				const data = await response.json();
				if (data.url) {
					onChange(data.url); // Replace preview with actual URL
					toast.success("Image uploaded successfully!");
				} else {
					throw new Error("No URL returned from server");
				}
			} catch (error) {
				console.error("Upload error:", error);
				toast.error(`Failed to upload ${file.name}`);
				onChange(value || ""); // Revert to previous value on error
			} finally {
				setIsUploading(false);
			}
		},
		[onChange, value]
	);

	const handleFileInputChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleDrop = useCallback(
		(e) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files?.[0];
			if (file) {
				handleFileSelect(file);
			}
		},
		[handleFileSelect]
	);

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemove = () => {
		onChange("");
	};

	return (
		<div>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileInputChange}
				style={{ display: "none" }}
			/>

			{/* Upload Area */}
			<div
				onClick={handleClick}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				style={{
					border: `2px dashed ${isDragging ? "#FF385C" : "#dddddd"}`,
					borderRadius: "12px",
					padding: "40px 20px",
					textAlign: "center",
					cursor: isUploading ? "wait" : "pointer",
					transition: "all 0.2s ease",
					backgroundColor: isDragging ? "#FFF5F7" : "#ffffff",
					marginBottom: value ? "20px" : "0",
				}}
				onMouseEnter={(e) => {
					if (!isDragging && !isUploading) {
						e.currentTarget.style.borderColor = "#FF385C";
						e.currentTarget.style.backgroundColor = "#FFF5F7";
					}
				}}
				onMouseLeave={(e) => {
					if (!isDragging) {
						e.currentTarget.style.borderColor = "#dddddd";
						e.currentTarget.style.backgroundColor = "#ffffff";
					}
				}}
			>
				{isUploading ? (
					<>
						<div
							style={{
								width: "48px",
								height: "48px",
								margin: "0 auto 16px",
								border: "3px solid #f0f0f0",
								borderTopColor: "#FF385C",
								borderRadius: "50%",
								animation: "spin 1s linear infinite",
							}}
						/>
						<div
							style={{
								fontSize: "16px",
								fontWeight: "600",
								color: "#222222",
							}}
						>
							Uploading...
						</div>
					</>
				) : (
					<>
						<svg
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#717171"
							strokeWidth="2"
							style={{ margin: "0 auto 16px" }}
						>
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
							<circle cx="8.5" cy="8.5" r="1.5"></circle>
							<polyline points="21 15 16 10 5 21"></polyline>
						</svg>
						<div
							style={{
								fontSize: "16px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "8px",
							}}
						>
							Click to upload or drag and drop image
						</div>
						<div
							style={{
								fontSize: "14px",
								color: "#717171",
							}}
						>
							PNG, JPG, WEBP up to 10MB
						</div>
					</>
				)}
			</div>

			{/* Image Preview */}
			{value && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
						gap: "16px",
					}}
				>
					<div
						style={{
							position: "relative",
							borderRadius: "12px",
							overflow: "hidden",
							border: "1px solid #e0e0e0",
							backgroundColor: "#ffffff",
							aspectRatio: "4/3",
						}}
					>
						<Image
							src={value}
							alt="Profile preview"
							fill
							style={{
								objectFit: "cover",
							}}
							sizes="(max-width: 768px) 50vw, 200px"
							unoptimized
						/>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleRemove();
							}}
							disabled={isUploading}
							style={{
								position: "absolute",
								top: "8px",
								right: "8px",
								width: "32px",
								height: "32px",
								borderRadius: "50%",
								backgroundColor: "rgba(0, 0, 0, 0.6)",
								border: "none",
								color: "#ffffff",
								cursor: isUploading ? "not-allowed" : "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "18px",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								if (!isUploading) {
									e.target.style.backgroundColor = "rgba(220, 53, 69, 0.9)";
									e.target.style.transform = "scale(1.1)";
								}
							}}
							onMouseLeave={(e) => {
								if (!isUploading) {
									e.target.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
									e.target.style.transform = "scale(1)";
								}
							}}
						>
							×
						</button>
					</div>
				</div>
			)}

			<style jsx>{`
				@keyframes spin {
					to {
						transform: rotate(360deg);
					}
				}
			`}</style>
		</div>
	);
};

export default ImageUpload;

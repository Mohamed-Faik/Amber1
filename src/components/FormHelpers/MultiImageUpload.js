"use client";
import Image from "next/image";
import { useCallback, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";

const MultiImageUpload = ({ onChange, value, uploadText, fileTypesText }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadingIndex, setUploadingIndex] = useState(null);
	const [images, setImages] = useState(Array.isArray(value) ? value : value ? [value] : []);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef(null);

	const handleFileSelect = useCallback(
		async (files) => {
			if (!files || files.length === 0) return;

			const fileArray = Array.from(files);
			const validFiles = [];

			// Validate and compress all files
			for (const file of fileArray) {
				if (!file.type.startsWith("image/")) {
					toast.error(`${file.name} is not an image file`);
					continue;
				}

				if (file.size > 10 * 1024 * 1024) {
					toast.error(`${file.name} is too large (max 10MB)`);
					continue;
				}

				validFiles.push(file);
			}

			if (validFiles.length === 0) return;

			// Upload files one by one
			const uploadedUrls = [...images];
			
			for (let i = 0; i < validFiles.length; i++) {
				let file = validFiles[i];
				
				// Compress image before upload
				try {
					const compressionOptions = {
						maxSizeMB: 1, // Maximum size in MB (1MB)
						maxWidthOrHeight: 1920, // Maximum width or height in pixels
						useWebWorker: true,
						fileType: file.type,
						initialQuality: 0.85, // Quality: 0-1, 0.85 is a good balance
					};
					
					const compressedFile = await imageCompression(file, compressionOptions);
					file = compressedFile;
					
					const originalSize = (validFiles[i].size / 1024 / 1024).toFixed(2);
					const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
					console.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB`);
				} catch (compressionError) {
					console.warn("Image compression failed, using original:", compressionError);
					// Continue with original file if compression fails
				}
				setUploadingIndex(i);
				setIsUploading(true);

				// Show preview immediately
				const reader = new FileReader();
				reader.onloadend = () => {
					// Add temporary preview
					const tempIndex = uploadedUrls.length;
					uploadedUrls.push(reader.result);
					setImages([...uploadedUrls]);
				};
				reader.readAsDataURL(file);

				// Upload file
				const formData = new FormData();
				formData.append("file", file);
				formData.append("type", "listings"); // Specify this is a listing image

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
						// Replace temporary preview with actual URL
						const previewIndex = uploadedUrls.length - 1;
						uploadedUrls[previewIndex] = data.url;
						setImages([...uploadedUrls]);
						onChange(uploadedUrls);
					} else {
						throw new Error("No URL returned from server");
					}
				} catch (error) {
					console.error("Upload error:", error);
					toast.error(`Failed to upload ${file.name}`);
					// Remove failed preview
					uploadedUrls.pop();
					setImages([...uploadedUrls]);
				}
			}

			setIsUploading(false);
			setUploadingIndex(null);
			if (validFiles.length > 0) {
				toast.success(`${validFiles.length} image(s) uploaded successfully!`);
			}
		},
		[onChange, images]
	);

	const handleFileInputChange = (e) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			handleFileSelect(files);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleDrop = useCallback(
		(e) => {
			e.preventDefault();
			setIsDragging(false);
			const files = e.dataTransfer.files;
			if (files && files.length > 0) {
				handleFileSelect(files);
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

	const handleRemove = (index) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
		onChange(newImages);
	};

	return (
		<div>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple
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
					cursor: "pointer",
					transition: "all 0.2s ease",
					backgroundColor: isDragging ? "#FFF5F7" : "#ffffff",
					marginBottom: "20px",
				}}
				onMouseEnter={(e) => {
					if (!isDragging) {
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
							Uploading {uploadingIndex !== null ? `${uploadingIndex + 1} of ${images.length}` : ""}...
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
							{uploadText || "Click to upload or drag and drop multiple images"}
						</div>
						<div
							style={{
								fontSize: "14px",
								color: "#717171",
							}}
						>
							{fileTypesText || "PNG, JPG, WEBP up to 10MB each"}
						</div>
					</>
				)}
			</div>

			{/* Images Grid */}
			{images.length > 0 && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
						gap: "16px",
					}}
				>
					{images.map((imageUrl, index) => (
						<div
							key={index}
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
								src={imageUrl}
								alt={`Property image ${index + 1}`}
								fill
								style={{
									objectFit: "cover",
								}}
								sizes="(max-width: 768px) 50vw, 200px"
								unoptimized
							/>
							<button
								type="button"
								onClick={() => handleRemove(index)}
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
							{index === 0 && (
								<div
									style={{
										position: "absolute",
										bottom: "8px",
										left: "8px",
										backgroundColor: "rgba(255, 255, 255, 0.9)",
										padding: "4px 8px",
										borderRadius: "4px",
										fontSize: "12px",
										fontWeight: "600",
										color: "#222222",
									}}
								>
									Main
								</div>
							)}
						</div>
					))}
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

export default MultiImageUpload;


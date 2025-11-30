"use client";
import Image from "next/image";

/**
 * ProfileImage component that handles both local and external (Vercel Blob) image URLs
 * Automatically uses unoptimized for external URLs to avoid Next.js optimization issues
 */
const ProfileImage = ({ src, alt, width, height, style, className, ...props }) => {
	// Check if it's an external URL (Vercel Blob Storage or other external sources)
	const isExternalUrl = src?.startsWith("http://") || src?.startsWith("https://");
	const isDataUrl = src?.startsWith("data:");
	
	// Use unoptimized for external URLs and data URLs
	const shouldUnoptimize = isExternalUrl || isDataUrl;

	if (!src) {
		return null;
	}

	return (
		<Image
			src={src}
			alt={alt || "Profile"}
			width={width}
			height={height}
			style={style}
			className={className}
			unoptimized={shouldUnoptimize}
			{...props}
		/>
	);
};

export default ProfileImage;


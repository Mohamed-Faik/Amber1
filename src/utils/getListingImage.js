/**
 * Get the main image from a listing's imageSrc field
 * Supports both old format (single string) and new format (JSON array)
 */
export function getListingImage(imageSrc) {
	// Handle null, undefined, or empty values
	if (!imageSrc || imageSrc === "" || imageSrc === "[]" || imageSrc === "null" || imageSrc === "undefined") {
		return null;
	}

	// If it's already an array (shouldn't happen from DB, but handle it)
	if (Array.isArray(imageSrc)) {
		if (imageSrc.length > 0 && imageSrc[0]) {
			const img = String(imageSrc[0]).trim();
			if (img && img !== "" && img !== "null" && img !== "undefined") {
				return img.startsWith("/") ? img : `/${img}`;
			}
		}
		return null;
	}

	// If it's not a string, return null
	if (typeof imageSrc !== "string") {
		return null;
	}

	// Trim whitespace
	const trimmed = imageSrc.trim();
	if (!trimmed || trimmed === "[]" || trimmed === "null" || trimmed === "undefined") {
		return null;
	}

	// Check if it looks like a JSON array (starts with [)
	if (trimmed.startsWith("[")) {
		// Try to parse as JSON first
		try {
			// Ensure we have a valid JSON string
			if (trimmed.length < 2) {
				return null;
			}
			
			const parsed = JSON.parse(trimmed);
			if (Array.isArray(parsed) && parsed.length > 0) {
				const firstImage = parsed[0];
				if (firstImage && typeof firstImage === "string") {
					const imagePath = firstImage.trim();
					if (imagePath && imagePath !== "" && imagePath !== "null" && imagePath !== "undefined") {
						return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
					}
				}
			}
		} catch (parseError) {
			// JSON parse failed - might be truncated or malformed
			// Use regex to extract first image path: ["/path/to/image", ...]
			try {
				const match = trimmed.match(/\["([^"]+)"\s*,?/);
				if (match && match[1]) {
					const imagePath = match[1].trim();
					if (imagePath && imagePath !== "" && imagePath !== "null" && imagePath !== "undefined") {
						return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
					}
				}
			} catch (regexError) {
				// If regex also fails, return null
				return null;
			}
		}
		// If we get here, couldn't extract image from array
		return null;
	}

	// Not a JSON array, treat as single image string
	if (trimmed !== "" && trimmed !== "null" && trimmed !== "undefined") {
		// Make sure it starts with / for relative paths
		return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	}

	return null;
}

/**
 * Get all images from a listing's imageSrc field
 * Returns array of image URLs
 */
export function getAllListingImages(imageSrc) {
	// Debug logging
	console.log("[getAllListingImages] Input:", typeof imageSrc, imageSrc);

	// Handle null, undefined, or empty values
	if (!imageSrc || imageSrc === "" || imageSrc === "[]" || imageSrc === "null" || imageSrc === "undefined") {
		console.log("[getAllListingImages] Empty or null value");
		return [];
	}

	// If it's already an array
	if (Array.isArray(imageSrc)) {
		console.log("[getAllListingImages] Already an array, length:", imageSrc.length);
		const filtered = imageSrc
			.filter(img => img && typeof img === "string" && img.trim() !== "" && img !== "null" && img !== "undefined")
			.map(img => {
				const trimmedImg = img.trim();
				return trimmedImg.startsWith("/") ? trimmedImg : `/${trimmedImg}`;
			});
		console.log("[getAllListingImages] Filtered array:", filtered);
		return filtered;
	}

	// If it's not a string, return empty
	if (typeof imageSrc !== "string") {
		console.log("[getAllListingImages] Not a string, type:", typeof imageSrc);
		return [];
	}

	// Trim whitespace
	const trimmed = imageSrc.trim();
	if (!trimmed || trimmed === "[]" || trimmed === "null" || trimmed === "undefined") {
		console.log("[getAllListingImages] Trimmed value is empty");
		return [];
	}

	// Try to parse as JSON array
	try {
		// Check if it looks like a JSON array
		if (trimmed.startsWith("[")) {
			console.log("[getAllListingImages] Looks like JSON array, attempting parse...");
			if (trimmed.length < 2) {
				console.log("[getAllListingImages] JSON array too short");
				return [];
			}
			
			// Try to parse as JSON first
			try {
				const parsed = JSON.parse(trimmed);
				console.log("[getAllListingImages] Parsed successfully:", parsed);
				if (Array.isArray(parsed) && parsed.length > 0) {
					const result = parsed
						.filter(img => img && typeof img === "string" && img.trim() !== "" && img !== "null" && img !== "undefined")
						.map(img => {
							const trimmedImg = img.trim();
							return trimmedImg.startsWith("/") ? trimmedImg : `/${trimmedImg}`;
						});
					console.log("[getAllListingImages] Final result:", result);
					return result;
				} else {
					console.log("[getAllListingImages] Parsed array is empty or not an array");
				}
			} catch (parseError) {
				// JSON parse failed - might be truncated
				console.log("[getAllListingImages] JSON parse error (might be truncated):", parseError.message);
				
				// Try to extract image paths using regex even if JSON is incomplete
				// Pattern: "/uploads/listings/filename.jpg" or "/uploads/listing..."
				const imagePathRegex = /"(\/uploads\/listings?\/[^"]+\.(jpg|jpeg|png|gif|webp))"/gi;
				const matches = [];
				let match;
				
				while ((match = imagePathRegex.exec(trimmed)) !== null) {
					if (match[1]) {
						const imgPath = match[1].trim();
						if (imgPath && imgPath !== "null" && imgPath !== "undefined") {
							matches.push(imgPath.startsWith("/") ? imgPath : `/${imgPath}`);
						}
					}
				}
				
				if (matches.length > 0) {
					console.log("[getAllListingImages] Extracted images from truncated JSON:", matches);
					return matches;
				}
				
				// If regex didn't work, try a simpler approach - extract all paths that look like image paths
				const simplePathRegex = /\/uploads\/listings?\/[^\s",\[\]]+\.(jpg|jpeg|png|gif|webp)/gi;
				const simpleMatches = [];
				let simpleMatch;
				
				while ((simpleMatch = simplePathRegex.exec(trimmed)) !== null) {
					if (simpleMatch[0]) {
						const imgPath = simpleMatch[0].trim();
						if (imgPath && !simpleMatches.includes(imgPath)) {
							simpleMatches.push(imgPath.startsWith("/") ? imgPath : `/${imgPath}`);
						}
					}
				}
				
				if (simpleMatches.length > 0) {
					console.log("[getAllListingImages] Extracted images using simple regex:", simpleMatches);
					return simpleMatches;
				}
			}
		} else {
			// Not a JSON array, treat as single image string
			console.log("[getAllListingImages] Not a JSON array, treating as single image");
			if (trimmed !== "" && trimmed !== "null" && trimmed !== "undefined") {
				const result = [trimmed.startsWith("/") ? trimmed : `/${trimmed}`];
				console.log("[getAllListingImages] Single image result:", result);
				return result;
			}
		}
	} catch (e) {
		// JSON parse failed, treat as single image string
		console.log("[getAllListingImages] Outer catch - error:", e.message);
		if (trimmed !== "" && trimmed !== "null" && trimmed !== "undefined" && !trimmed.startsWith("[")) {
			const result = [trimmed.startsWith("/") ? trimmed : `/${trimmed}`];
			console.log("[getAllListingImages] Fallback single image:", result);
			return result;
		}
	}

	console.log("[getAllListingImages] Returning empty array");
	return [];
}


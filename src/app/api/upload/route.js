import { NextResponse } from "next/server";
import cloudinary from "@/libs/cloudinary";

export async function POST(request) {
	try {
		const formData = await request.formData();
		const file = formData.get("file");

		if (!file) {
			return NextResponse.json(
				{ error: "No file provided" },
				{ status: 400 }
			);
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return NextResponse.json(
				{ error: "File must be an image" },
				{ status: 400 }
			);
		}

		// Validate file size (10MB max)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: "File size must be less than 10MB" },
				{ status: 400 }
			);
		}

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Get upload type (listings or profile), default to listings
		const uploadType = formData.get("type") || "listings";
		const folder = uploadType === "profile" ? "profiles" : "listings";

		console.log("Starting Cloudinary upload...", {
			cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
			has_api_key: !!process.env.CLOUDINARY_API_KEY,
			has_api_secret: !!process.env.CLOUDINARY_API_SECRET
		});

		// Upload to Cloudinary
		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload_stream(
				{
					folder: `amber1/${folder}`, // Organized in amber1 folder
					resource_type: "image",
				},
				(error, result) => {
					if (error) {
						console.error("Cloudinary Upload Error Details:", error);
						reject(error);
					} else {
						resolve(result);
					}
				}
			).end(buffer);
		});

		console.log("File uploaded successfully to Cloudinary:", result.secure_url);

		return NextResponse.json({
			url: result.secure_url,
			filename: result.public_id,
		});

	} catch (error) {
		console.error("Upload API Error:", error);
		return NextResponse.json(
			{
				error: error.message || "Upload failed",
				details: error
			},
			{ status: 500 }
		);
	}
}


import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

		// Generate unique filename
		const timestamp = Date.now();
		const randomString = Math.random().toString(36).substring(2, 15);
		const fileExtension = file.name.split(".").pop() || "jpg";
		const prefix = uploadType === "profile" ? "profile" : "listing";
		const filename = `${prefix}-${timestamp}-${randomString}.${fileExtension}`;

		// Create uploads directory if it doesn't exist
		const uploadsDir = join(process.cwd(), "public", "uploads", folder);
		if (!existsSync(uploadsDir)) {
			await mkdir(uploadsDir, { recursive: true });
		}

		// Save file to disk
		const filepath = join(uploadsDir, filename);
		await writeFile(filepath, buffer);

		// Return the public URL
		const publicUrl = `/uploads/${folder}/${filename}`;

		console.log("File uploaded successfully:", publicUrl);

		return NextResponse.json({
			url: publicUrl,
			filename: filename,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: error.message || "Upload failed" },
			{ status: 500 }
		);
	}
}


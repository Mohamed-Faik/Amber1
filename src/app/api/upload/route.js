import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { put } from "@vercel/blob";

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

		// Check if we're on Vercel - always use Blob Storage on Vercel
		// Vercel sets VERCEL=1 environment variable automatically
		// Also check for VERCEL_URL which is always set on Vercel deployments
		const isVercel = !!(
			process.env.VERCEL === "1" || 
			process.env.VERCEL_URL || 
			process.env.VERCEL_ENV ||
			process.env.NEXT_PUBLIC_VERCEL_URL ||
			// Check if we're in a serverless environment (Vercel's /var/task path)
			process.cwd().includes("/var/task")
		);
		
		// On Vercel, filesystem is read-only, so we MUST use Blob Storage
		if (isVercel) {
			// Check if Blob Storage token is available
			if (!process.env.BLOB_READ_WRITE_TOKEN) {
				return NextResponse.json(
					{ 
						error: "Vercel Blob Storage is not configured. Please set up Blob Storage in your Vercel project.",
						details: "Go to Vercel Dashboard → Your Project → Storage → Create Database → Select 'Blob'",
						helpUrl: "https://vercel.com/docs/storage/vercel-blob"
					},
					{ status: 500 }
				);
			}

			// Always use Vercel Blob Storage on Vercel (filesystem is read-only)
			try {
				const blob = await put(`uploads/${folder}/${filename}`, buffer, {
					access: "public",
					contentType: file.type,
				});

				console.log("File uploaded successfully to Vercel Blob:", blob.url);

				return NextResponse.json({
					url: blob.url,
					filename: filename,
				});
			} catch (blobError) {
				console.error("Vercel Blob Storage error:", blobError);
				
				// If Blob Storage fails, provide helpful error message
				if (blobError.message?.includes("BLOB_READ_WRITE_TOKEN") || blobError.message?.includes("token") || blobError.message?.includes("unauthorized")) {
					return NextResponse.json(
						{ 
							error: "Blob Storage not configured. Please set up Vercel Blob Storage in your project settings.",
							details: "Go to Vercel Dashboard → Storage → Create Blob Store",
							helpUrl: "https://vercel.com/docs/storage/vercel-blob"
						},
						{ status: 500 }
					);
				}
				
				// Re-throw other errors
				throw blobError;
			}
		} else {
			// Use local filesystem for development (localhost only)
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
		}
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: error.message || "Upload failed" },
			{ status: 500 }
		);
	}
}


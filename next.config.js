/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		unoptimized: false, // Enable Next.js image optimization
		formats: ["image/avif", "image/webp"], // Use modern image formats
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
		domains: [
			"res.cloudinary.com",
			"avatars.githubusercontent.com",
			"lh3.googleusercontent.com",
			"via.placeholder.com",
			"developers.google.com",
			"img.icons8.com",
		],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.public.blob.vercel-storage.com",
			},
			{
				protocol: "https",
				hostname: "*.public.blob.vercel-storage.com",
			},
			{
				protocol: "https",
				hostname: "public.blob.vercel-storage.com",
			},
			// Allow all Vercel Blob Storage subdomains
			{
				protocol: "https",
				hostname: "*.blob.vercel-storage.com",
			},
			// More permissive pattern for any Vercel Blob URL
			{
				protocol: "https",
				hostname: "**.blob.vercel-storage.com",
			},
		],
	},
	env: {
		NEXTAUTH_SECRET: "b51afa1ed38dde0d5d8f218a7fe48e1a",
		NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dev", // Update here your NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
		NEXT_CLOUDINARY_PRESET: "vikings",
	},
};

module.exports = nextConfig;

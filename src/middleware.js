import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware for protecting routes - only runs on specific paths
export default async function middleware(req) {
	const { pathname } = req.nextUrl;
	
	// Define protected routes explicitly
	const protectedRoutes = [
		"/listings/my-listings",
		"/listings/new", 
		"/listings/favourites",
		"/profile/edit-my-info",
		"/profile/settings",
		"/administrator",
	];
	
	// Check if it's an edit route
	const isEditRoute = /^\/listings\/[^/]+\/edit$/.test(pathname);
	
	// Check if current path is protected
	const isProtected = protectedRoutes.some(route => 
		pathname === route || pathname.startsWith(`${route}/`)
	) || isEditRoute;
	
	// If NOT a protected route, immediately pass through - DO NOT TOUCH IT
	if (!isProtected) {
		return NextResponse.next();
	}
	
	// Only check auth for protected routes
	try {
		const token = await getToken({ 
			req, 
			secret: process.env.NEXTAUTH_SECRET 
		});
		
		if (!token) {
			// Redirect to sign in only for protected routes
			const signInUrl = new URL("/auth/signin", req.url);
			signInUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(signInUrl);
		}
		
		return NextResponse.next();
	} catch (error) {
		// On error, allow through to prevent blocking
		console.error("Middleware auth check error:", error);
		return NextResponse.next();
	}
}

export const config = {
	// Only match these specific routes - nothing else
	matcher: [
		"/listings/my-listings",
		"/listings/new",
		"/listings/favourites", 
		"/profile/edit-my-info",
		"/profile/settings",
		"/administrator",
		"/listings/:path*/edit",
	],
};

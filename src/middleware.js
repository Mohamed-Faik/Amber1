import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		// If user is authenticated, allow access to the protected route
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => {
				// Allow access if token exists (user is authenticated)
				return !!token;
			},
		},
		pages: {
			signIn: "/auth/signin",
		},
	}
);

export const config = {
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

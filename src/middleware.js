import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		// If user is authenticated, allow access to the protected route
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				// Allow access if token exists (user is authenticated)
				// withAuth will automatically redirect to signIn page if token is missing
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

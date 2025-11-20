export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/listings/my-listings",
		"/listings/new",
		"/listings/favourites",
		"/profile/edit-my-info",
		"/profile/settings",
		"/dashboard/blog",
		"/dashboard/blog/new",
		"/dashboard/listings",
		"/dashboard/reviews",
		"/dashboard/users",
	],
};

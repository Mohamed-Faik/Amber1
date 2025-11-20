import React from "react";
import { redirect } from "next/navigation";
import PageBanner from "@/components/Common/PageBanner";
import getBlogPosts from "@/actions/getBlogPosts";
import BlogContent from "@/components/BlogContent";
import { getCurrentUser } from "@/actions/getCurrentUser";

// const limitParams = { limit: 6 };
const page = async () => {
	const blogPosts = await getBlogPosts();
	const currentUser = await getCurrentUser();
	const isAdmin = currentUser?.role === "ADMIN";
	if (!isAdmin) {
		redirect("/");
	}
	return (
		<>
			<PageBanner pageTitle="Blog" />
			
			<BlogContent blogPosts={blogPosts} />
		</>
	);
};

export default page;

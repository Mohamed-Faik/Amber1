import React from "react";
import PageBanner from "@/components/Common/PageBanner";
import getBlogById from "@/actions/getBlogById";
import BlogDetails from "@/components/BlogDetails";

const page = async ({ params }) => {
	const post = await getBlogById(params);

	return (
		<>
			<PageBanner pageTitle={post?.title} />
			
			<BlogDetails post={post} />
		</>
	);
};

export default page;

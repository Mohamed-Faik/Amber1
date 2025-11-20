"use client";
import React from "react";
import BlogCard from "./BlogCard";

const BlogContent = ({ blogPosts }) => {
	return (
		<div className="blog-area ptb-100">
			<div className="container">
				<div className="section-title">
					<h2>Blog Posts</h2>
				</div>

				<div className="row justify-content-center">
					{blogPosts.map((blog) => (
						<BlogCard key={blog.id} {...blog} />
					))}
				</div>
			</div>
		</div>
	);
};

export default BlogContent;

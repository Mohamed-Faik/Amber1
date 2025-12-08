"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDateBlog } from "@/utils/formatDate";

const BlogCard = ({ id, slug, title, category, created_at, imageSrc }) => {
	return (
		<div className="col-lg-3 col-sm-6">
			<div className="single-blog">
				<Link href={`/blog/${id}/${slug}`} className="blog-img">
					<Image
						src={imageSrc}
						alt={title}
						width={936}
						height={672}
					/>
					<span className="date">
						<div
							dangerouslySetInnerHTML={{
								__html: formatDateBlog(created_at),
							}}
						/>
					</span>
				</Link>

				<div className="blog-content">
					<Link href="/blog" className="tag">
						{category}
					</Link>
					<h3>
						<Link href={`/blog/${id}/${slug}`}>{title}</Link>
					</h3>
					<Link href={`/blog/${id}/${slug}`} className="read-more">
						Read More
						<i className="ri-arrow-right-line"></i>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BlogCard;

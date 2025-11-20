"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import userImg from "../../public/images/blog/user.jpg";
import { formatDateWithMonth } from "@/utils/formatDate";

const BlogDetails = ({ post }) => {
	return (
		<div className="blog-details-area ptb-100">
			<div className="container">
				<div className="blog-details-content">
					<h2 className="title">{post.title}</h2>
					
					<div className="d-md-flex align-items-center">
						<ul className="blog-poster">
							<li>
								<p>
									<Link href={`/author/${post.user.id}`}>
										<Image
											src={
												post.user?.image
													? post.user?.image
													: userImg
											}
											width={25}
											height={25}
											alt="user"
											className="me-2"
										/>
									</Link>
									By{" "}
									<Link href={`/author/${post.user.id}`}>
										{post.user.name}
									</Link>
								</p>
							</li>
							<li>{formatDateWithMonth(post.created_at)}</li>
						</ul>

						<ul className="tag-list">
							<li>
								<Link href="/blog">{post.category}</Link>
							</li>
						</ul>
					</div>

					<Image
						src={post.imageSrc}
						width={936}
						height={672}
						alt="post"
						className="mb-4"
					/>

					<div dangerouslySetInnerHTML={{ __html: post.content }} className="blog-details-content-box" />
				</div>
			</div>
		</div>
	);
};

export default BlogDetails;

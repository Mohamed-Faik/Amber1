"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper";
import { categories } from "@/libs/Categories";

const Category = () => {
	return (
		<div
			className="category-area"
			style={{
				backgroundColor: "#f7f7f7",
				paddingTop: "80px",
				paddingBottom: "80px",
			}}
		>
			<div className="container">
				<div
					className="section-title"
					style={{
						textAlign: "center",
						marginBottom: "48px",
					}}
				>
					<h2
						style={{
							fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
						}}
					>
						Browse by Category
					</h2>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							margin: 0,
						}}
					>
						Find exactly what you're looking for
					</p>
				</div>

				<Swiper
					spaceBetween={30}
					navigation={true}
					mousewheel={true}
					breakpoints={{
						0: {
							slidesPerView: 2,
						},
						576: {
							slidesPerView: 3,
						},
						768: {
							slidesPerView: 4,
						},
						1200: {
							slidesPerView: 6,
						},
					}}
					modules={[Navigation, Mousewheel]}
					className="category-slide"
				>
					{categories.map((cat) => (
						<SwiperSlide key={cat.label}>
							<div className="single-category">
								<Link
									href={`/listings/?category=${cat.value}`}
									className="category-img"
								>
									<Image
										src={cat.imageSrc}
										width={400}
										height={440}
										alt="category"
									/>
									<i className="ri-add-circle-fill"></i>
								</Link>

								<div className="category-content">
									<h3>
										<Link
											href={`/listings/?category=${cat.value}`}
										>
											{cat.label}
										</Link>
									</h3>
									{/* <span>131 Listings</span> */}
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>

				<div
					style={{
						textAlign: "center",
						marginTop: "40px",
					}}
				>
					<Link
						href="/listings"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							color: "#222222",
							fontSize: "16px",
							fontWeight: "600",
							textDecoration: "none",
							padding: "12px 24px",
							borderRadius: "8px",
							backgroundColor: "#ffffff",
							border: "1px solid #dddddd",
							transition: "all 0.3s ease",
						}}
						onMouseEnter={(e) => {
							e.target.style.backgroundColor = "#222222";
							e.target.style.color = "#ffffff";
							e.target.style.borderColor = "#222222";
						}}
						onMouseLeave={(e) => {
							e.target.style.backgroundColor = "#ffffff";
							e.target.style.color = "#222222";
							e.target.style.borderColor = "#dddddd";
						}}
					>
						View All Properties
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Category;

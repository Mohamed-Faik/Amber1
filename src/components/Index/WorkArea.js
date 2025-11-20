"use client";
import React from "react";
import Image from "next/image";
import work1 from "../../../public/images/work/work-1.png";
import work2 from "../../../public/images/work/work-2.png";
import work3 from "../../../public/images/work/work-3.png";
import shape1 from "../../../public/images/shape-3.png";
import shape2 from "../../../public/images/shape-4.png";

const WorkArea = () => {
	return (
		<div className="work-area pt-100 pb-70 bg-color-fffcf8">
			<div className="container">
				<div className="section-title">
					<h2>How AmberHomes Work For You</h2>
				</div>

				<div className="row justify-content-center">
					<div className="col-lg-4 col-sm-6">
						<div className="single-work">
							<Image
								src={work1}
								width={282}
								height={292}
								alt="work area"
							/>
							<h3>1. Choose A Category</h3>
							<p>
								Select a category that best suits your interest.
								Use filters to customize your search and to find
								exactly what you want.
							</p>
						</div>
					</div>

					<div className="col-lg-4 col-sm-6">
						<div className="single-work">
							<Image
								src={shape1}
								width={167}
								height={24}
								className="shape shape-3"
								alt="work area"
							/>
							<Image
								src={shape2}
								width={167}
								height={24}
								className="shape shape-4"
								alt="work area"
							/>
							<Image
								src={work2}
								width={282}
								height={292}
								alt="work area"
							/>
							<h3>2. Find What You Want</h3>
							<p>
								Once you have settled on a business, learn more
								about it, read reviews and find its location so
								that you can reach it in no time!
							</p>
						</div>
					</div>

					<div className="col-lg-4 col-sm-6">
						<div className="single-work">
							<Image
								src={work3}
								width={282}
								height={292}
								alt="work area"
							/>
							<h3>3. Go Out & Explore</h3>
							<p>
								The only thing left to do now is to go out,
								exploreand have fun! Meet new friends and
								experience the city like a true local!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkArea;

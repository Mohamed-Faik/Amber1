"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper";

import partner1 from "../../../public/images/partner/partner-1.png";
import partner2 from "../../../public/images/partner/partner-2.png";
import partner3 from "../../../public/images/partner/partner-3.png";
import partner4 from "../../../public/images/partner/partner-4.png";
import partner5 from "../../../public/images/partner/partner-5.png";
import partner6 from "../../../public/images/partner/partner-6.png";

const Partner = () => {
	return (
		<div className="partner-area ptb-100">
			<div className="container">
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
					className="partner-slide"
				>
					<SwiperSlide>
						<div className="partner-item">
							<Image
								src={partner1}
								width={215}
								height={100}
								alt="partner"
							/>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className="partner-item">
							<Image
								src={partner2}
								width={215}
								height={100}
								alt="partner"
							/>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className="partner-item">
							<Image
								src={partner3}
								width={215}
								height={100}
								alt="partner"
							/>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className="partner-item">
							<Image
								src={partner4}
								width={215}
								height={100}
								alt="partner"
							/>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className="partner-item">
							<Image
								src={partner5}
								width={215}
								height={100}
								alt="partner"
							/>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className="partner-item">
							<Image
								src={partner6}
								width={215}
								height={100}
								alt="partner"
							/>
						</div>
					</SwiperSlide>
				</Swiper>
			</div>
		</div>
	);
};

export default Partner;

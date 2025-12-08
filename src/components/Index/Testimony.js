"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper";

import testimonyImg from "../../../public/images/testimony/testimony-img.png";
import testimonyShp1 from "../../../public/images/testimony/testimony-shape-1.png";
import testimonyShp2 from "../../../public/images/testimony/testimony-shape-2.png";
import quotemarks from "../../../public/images/icon/quotemarks-left.svg";
import starIco from "../../../public/images/icon/star.svg";
import starHIco from "../../../public/images/icon/star-h.svg";
import testimonyUser from "../../../public/images/testimony/testimony-1.jpg";

const Testimony = () => {
	return (
		<div className="testimony-area ptb-100">
			<div className="container">
				<div className="row">
					<div className="col-lg-6">
						<div className="testimony-img">
							<Image
								src={testimonyImg}
								alt="testimony"
								width={510}
								height={531}
							/>
							<Image
								src={testimonyShp1}
								className="shape shape-1"
								alt="testimony"
								width={416}
								height={405}
							/>
							<Image
								src={testimonyShp2}
								className="shape shape-2"
								alt="testimony"
								width={127}
								height={171}
							/>
						</div>
					</div>

					<div className="col-lg-6">
						<div className="testimony-content">
							<h2>Clients Testimony Is Very Important For Us</h2>

							<Swiper
								slidesPerView={1}
								spaceBetween={30}
								navigation={true}
								mousewheel={true}
								modules={[Navigation, Mousewheel]}
								className="testimony-slide"
							>
								<SwiperSlide>
									<div className="single-testimony">
										<div className="d-flex justify-content-between align-items-center">
											<Image
												className="quotes"
												src={quotemarks}
												width="50"
												height="50"
												alt="testimony"
											/>
											<ul>
												<li>
													<Image
														src={starIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
												<li>
													<Image
														src={starIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
												<li>
													<Image
														src={starIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
												<li>
													<Image
														src={starIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
												<li>
													<Image
														src={starHIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
											</ul>
										</div>

										<p>
											Once you’ve settled on a business,
											learn more about it, read reviews
											and find its location so that you
											can reach it in no time! Thanks To
											ADLES!
										</p>

										<div className="for-post d-flex justify-content-start align-items-center">
											<Image
												src={testimonyUser}
												alt="testimony"
												width={64}
												height={64}
											/>
											<div className="traveller">
												<h3>Victor James</h3>
												<span>Traveller</span>
											</div>
										</div>
									</div>
								</SwiperSlide>
								
								<SwiperSlide>
									<div className="single-testimony">
										<div className="d-flex justify-content-between align-items-center">
											<Image
												className="quotes"
												src={quotemarks}
												width="50"
												height="50"
												alt="testimony"
											/>
											<ul>
												<li>
													<Image
														src={starIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
												<li>
													<Image
														src={starIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
												<li>
													<Image
														src={starIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
												<li>
													<Image
														src={starIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
												<li>
													<Image
														src={starHIco}
														width="17"
														height="16"
														alt="testimony"
													/>
												</li>
											</ul>
										</div>

										<p>
											Once you’ve settled on a business,
											learn more about it, read reviews
											and find its location so that you
											can reach it in no time! Thanks To
											ADLES!
										</p>

										<div className="for-post d-flex justify-content-start align-items-center">
											<Image
												src={testimonyUser}
												alt="testimony"
												width={64}
												height={64}
											/>
											<div className="traveller">
												<h3>Victor James</h3>
												<span>Traveller</span>
											</div>
										</div>
									</div>
								</SwiperSlide>
							</Swiper>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Testimony;

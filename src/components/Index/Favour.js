"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import plush from "../../../public/images/icon/plush.svg";
import favimg from "../../../public/images/favourite-img.png";

const Favour = () => {
	return (
		<div className="favourite-area bg-color-fbf6ff ptb-100">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-lg-7">
						<div className="favourite-content">
							<h2>
								Find Your Favourite Places Where You Want To Go
							</h2>
							<p>
								Select a category that best suits your interest.
								Use filters to customize your search{" "}
								<span className="br">
									<br />
								</span>{" "}
								and to find exactly what you want.
							</p>

							<Link href="/listing" className="default-btn">
								<span>
									Explore Listing
									<Image
										width="18"
										height="18"
										src={plush}
										alt="plush"
									/>
								</span>
							</Link>
						</div>
					</div>
					<div className="col-lg-5">
						<div className="favourite-img">
							<Image
								width={530}
								height={402}
								src={favimg}
								alt="favimg"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Favour;

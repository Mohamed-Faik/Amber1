import React from "react";
import Image from "next/image";
import shp1 from "../../../public/images/contact-info/contact-shape-1.png";
import shp2 from "../../../public/images/contact-info/contact-shape-2.png";
import shp3 from "../../../public/images/contact-info/contact-shape-3.png";

const ContactForm = () => {
	return (
		<div className="contact-area pb-100">
			<div className="container">
				<div className="section-title">
					<h2>
						Contact Us Anytime{" "}
						<span className="br">
							<br />
						</span>{" "}
						From Anywhere
					</h2>
				</div>

				<div className="contact-form">
					<form id="contactForm">
						<div className="row">
							<div className="col-lg-6 col-md-6">
								<div className="form-group">
									<input
										type="text"
										name="name"
										id="name"
										className="form-control"
										required
										data-error="Please enter your name"
										placeholder="Your Name"
									/>
									<div className="help-block with-errors"></div>
								</div>
							</div>

							<div className="col-lg-6 col-md-6">
								<div className="form-group">
									<input
										type="email"
										name="email"
										id="email"
										className="form-control"
										required
										data-error="Please enter your email"
										placeholder="Your Email"
									/>
									<div className="help-block with-errors"></div>
								</div>
							</div>

							<div className="col-lg-6 col-md-6">
								<div className="form-group">
									<input
										type="text"
										name="phone_number"
										id="phone_number"
										required
										data-error="Please enter your number"
										className="form-control"
										placeholder="Website"
									/>
									<div className="help-block with-errors"></div>
								</div>
							</div>

							<div className="col-lg-6 col-md-6">
								<div className="form-group">
									<input
										type="text"
										name="msg_subject"
										id="msg_subject"
										className="form-control"
										required
										data-error="Please enter your subject"
										placeholder="Phone No"
									/>
									<div className="help-block with-errors"></div>
								</div>
							</div>

							<div className="col-lg-12">
								<div className="form-group">
									<textarea
										name="message"
										className="form-control"
										id="message"
										cols="30"
										rows="6"
										required
										data-error="Write your message"
										placeholder="Write Your Review Here"
									></textarea>
									<div className="help-block with-errors"></div>
								</div>
							</div>

							<div className="col-12">
								<div className="form-check">
									<div className="form-group">
										<div className="form-check">
											<input
												name="gridCheck"
												value="1"
												className="form-check-input"
												type="checkbox"
												required
											/>

											<label
												className="form-check-label"
												htmlFor="gridCheck"
											>
												Save My Name, Email, And Website
												In This Browser For The Next
												Time I Send Message.
											</label>
											<div className="help-block with-errors gridCheck-error"></div>
										</div>
									</div>
								</div>
							</div>

							<div className="col-lg-12 col-md-12 text-center">
								<button type="submit" className="default-btn">
									Send Message
								</button>
								<div
									id="msgSubmit"
									className="h3 text-center hidden"
								></div>
								<div className="clearfix"></div>
							</div>
						</div>
					</form>

					<Image
						src={shp1}
						width={"auto"}
						height={"auto"}
						className="shape shape-1"
						alt="shape"
					/>
					<Image
						src={shp2}
						width={"auto"}
						height={"auto"}
						className="shape shape-2"
						alt="shape"
					/>
					<Image
						src={shp3}
						width={"auto"}
						height={"auto"}
						className="shape shape-3"
						alt="shape"
					/>
				</div>
			</div>
		</div>
	);
};

export default ContactForm;

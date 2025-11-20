"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "../FormHelpers/Input";
import Button from "../FormHelpers/Button";

const InfoUpdateForm = ({ currentUser }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			bio: currentUser && currentUser.bio ? currentUser.bio : "",
			gender: currentUser && currentUser.gender ? currentUser.gender : "",
			address:
				currentUser && currentUser.address ? currentUser.address : "",
			phone: currentUser && currentUser.phone ? currentUser.phone : "",
			website:
				currentUser && currentUser.website ? currentUser.website : "",
			twitter:
				currentUser && currentUser.twitter ? currentUser.twitter : "",
			facebook:
				currentUser && currentUser.facebook ? currentUser.facebook : "",
			linkedin:
				currentUser && currentUser.linkedin ? currentUser.linkedin : "",
			youtube:
				currentUser && currentUser.youtube ? currentUser.youtube : "",
		},
	});

	const onSubmit = async (data) => {
		setIsLoading(true);
		axios
			.post("/api/profile/info", data)
			.then((response) => {
				toast.success("Information updated!");
				router.refresh();
			})
			.catch((error) => {
				toast.error("Something went wrong!");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div
			style={{
				paddingTop: "40px",
				paddingBottom: "80px",
				width: "100%",
			}}
		>
			<div className="container" style={{ maxWidth: "1400px", margin: "0 auto", paddingLeft: "24px", paddingRight: "24px", boxSizing: "border-box" }}>
				{/* Header */}
				<div style={{ marginBottom: "48px", width: "100%" }}>
					<h1
						style={{
							fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
							marginTop: 0,
							lineHeight: "1.3",
						}}
					>
						Edit My Info
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							margin: 0,
							lineHeight: "1.5",
						}}
					>
						Update your personal information and social media links.
					</p>
				</div>

				<style jsx>{`
					.profile-form-grid {
						display: grid;
						grid-template-columns: 1fr 1fr;
						gap: 32px;
						align-items: start;
					}
					.profile-form-column {
						display: flex;
						flex-direction: column;
						gap: 32px;
						min-height: 100%;
					}
					.form-section-card {
						background-color: #ffffff;
						border-radius: 16px;
						padding: 32px;
						box-shadow: 0 2px 8px rgba(0,0,0,0.08);
						width: 100%;
						box-sizing: border-box;
						transition: box-shadow 0.2s ease;
					}
					.form-section-card:hover {
						box-shadow: 0 4px 12px rgba(0,0,0,0.1);
					}
					.form-section-title {
						font-size: 20px;
						font-weight: 600;
						color: #222222;
						margin: 0 0 24px 0;
						padding-bottom: 16px;
						border-bottom: 2px solid #f7f7f7;
					}
					.form-field-group {
						display: flex;
						flex-direction: column;
						gap: 24px;
					}
					@media only screen and (max-width: 991px) {
						.profile-form-grid {
							grid-template-columns: 1fr;
							gap: 24px;
						}
						.form-section-card {
							padding: 24px;
						}
						.form-section-title {
							font-size: 18px;
							margin-bottom: 20px;
							padding-bottom: 12px;
						}
						.form-field-group {
							gap: 20px;
						}
					}
					@media only screen and (max-width: 767px) {
						.form-section-card {
							padding: 20px;
							border-radius: 12px;
						}
						.form-section-title {
							font-size: 16px;
							margin-bottom: 16px;
						}
					}
				`}</style>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="profile-form-grid"
				>
					{/* Left Column */}
					<div className="profile-form-column">
						{/* Section 1: Personal Information */}
						<div className="form-section-card">
							<h2 className="form-section-title">
								Personal Information
							</h2>
							<div className="form-field-group">
								<Input
									id="bio"
									label="Bio"
									placeholder="Tell us about yourself"
									disabled={isLoading}
									register={register}
									errors={errors}
									required
								/>
								<Input
									id="gender"
									label="Gender"
									placeholder="e.g., Male, Female, Other"
									disabled={isLoading}
									register={register}
									errors={errors}
									required
								/>
								<Input
									id="address"
									label="Address"
									placeholder="Your full address"
									disabled={isLoading}
									register={register}
									errors={errors}
									required
								/>
								<Input
									id="phone"
									label="Phone"
									placeholder="Your phone number"
									disabled={isLoading}
									register={register}
									errors={errors}
									required
								/>
							</div>
						</div>
					</div>

					{/* Right Column */}
					<div className="profile-form-column">
						{/* Section 2: Social Media & Links */}
						<div className="form-section-card">
							<h2 className="form-section-title">
								Social Media & Links
							</h2>
							<div className="form-field-group">
								<Input
									id="website"
									label="Website"
									placeholder="https://yourwebsite.com"
									disabled={isLoading}
									register={register}
									errors={errors}
								/>
								<Input
									id="twitter"
									label="Twitter"
									placeholder="Your Twitter profile URL"
									disabled={isLoading}
									register={register}
									errors={errors}
								/>
								<Input
									id="facebook"
									label="Facebook"
									placeholder="Your Facebook profile URL"
									disabled={isLoading}
									register={register}
									errors={errors}
								/>
								<Input
									id="linkedin"
									label="LinkedIn"
									placeholder="Your LinkedIn profile URL"
									disabled={isLoading}
									register={register}
									errors={errors}
								/>
								<Input
									id="youtube"
									label="YouTube"
									placeholder="Your YouTube channel URL"
									disabled={isLoading}
									register={register}
									errors={errors}
								/>
							</div>
						</div>
					</div>

					{/* Submit Button - Spans both columns */}
					<div
						style={{
							gridColumn: "1 / -1",
							display: "flex",
							justifyContent: "flex-end",
							gap: "16px",
							paddingTop: "32px",
							marginTop: "8px",
							borderTop: "1px solid #f7f7f7",
						}}
					>
						<button
							type="button"
							onClick={() => router.back()}
							disabled={isLoading}
							style={{
								padding: "14px 32px",
								borderRadius: "8px",
								border: "1px solid #dddddd",
								backgroundColor: "#ffffff",
								color: "#222222",
								fontSize: "16px",
								fontWeight: "600",
								cursor: isLoading ? "not-allowed" : "pointer",
								transition: "all 0.2s ease",
								opacity: isLoading ? 0.6 : 1,
							}}
							onMouseEnter={(e) => {
								if (!isLoading) {
									e.target.style.backgroundColor = "#f7f7f7";
								}
							}}
							onMouseLeave={(e) => {
								if (!isLoading) {
									e.target.style.backgroundColor = "#ffffff";
								}
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading}
							style={{
								padding: "14px 48px",
								borderRadius: "8px",
								border: "none",
								backgroundColor: isLoading ? "#cccccc" : "#FF385C",
								color: "#ffffff",
								fontSize: "16px",
								fontWeight: "600",
								cursor: isLoading ? "not-allowed" : "pointer",
								transition: "all 0.3s ease",
								boxShadow: isLoading
									? "none"
									: "0 4px 12px rgba(255, 56, 92, 0.3)",
							}}
							onMouseEnter={(e) => {
								if (!isLoading) {
									e.target.style.backgroundColor = "#E61E4D";
									e.target.style.transform = "translateY(-2px)";
									e.target.style.boxShadow =
										"0 6px 16px rgba(255, 56, 92, 0.4)";
								}
							}}
							onMouseLeave={(e) => {
								if (!isLoading) {
									e.target.style.backgroundColor = "#FF385C";
									e.target.style.transform = "translateY(0)";
									e.target.style.boxShadow =
										"0 4px 12px rgba(255, 56, 92, 0.3)";
								}
							}}
						>
							{isLoading ? "Updating..." : "Update My Info"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default InfoUpdateForm;

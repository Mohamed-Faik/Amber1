"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "../FormHelpers/Input";
import Button from "../FormHelpers/Button";
import ImageUpload from "../FormHelpers/ImageUpload";

const SettingsForm = ({ currentUser }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const setCustomValue = (id, value) => {
		setValue(id, value, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	};

	const {
		register,
		handleSubmit,
		setError,
		watch,
		setValue,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: currentUser.name || "",
			image: currentUser.image ? currentUser.image : "",
		},
	});

	const image = watch("image");

	const onSubmit = (data) => {
		setIsLoading(true);
		axios
			.post("/api/profile/settings", data)
			.then((response) => {
				toast.success("Profile Updated");
				router.refresh();
			})
			.catch((error) => {
				toast.error("Something went wrong.");
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
			<div className="container" style={{ maxWidth: "900px", margin: "0 auto", paddingLeft: "24px", paddingRight: "24px", boxSizing: "border-box" }}>
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
						Edit My Profile
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							margin: 0,
							lineHeight: "1.5",
						}}
					>
						Update your profile name and profile picture.
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "32px",
					}}
				>
					{/* Section 1: Profile Information */}
					<div
						style={{
							backgroundColor: "#ffffff",
							borderRadius: "16px",
							padding: "32px",
							boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
							width: "100%",
							boxSizing: "border-box",
							transition: "box-shadow 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
						}}
					>
						<h2
							style={{
								fontSize: "20px",
								fontWeight: "600",
								color: "#222222",
								margin: "0 0 24px 0",
								paddingBottom: "16px",
								borderBottom: "2px solid #f7f7f7",
							}}
						>
							Profile Information
						</h2>
						<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
							<Input
								id="name"
								label="Name"
								placeholder="Your full name"
								disabled={isLoading}
								register={register}
								errors={errors}
								required
							/>
						</div>
					</div>

					{/* Section 2: Profile Image */}
					<div
						style={{
							backgroundColor: "#ffffff",
							borderRadius: "16px",
							padding: "32px",
							boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
							width: "100%",
							boxSizing: "border-box",
							transition: "box-shadow 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
						}}
					>
						<h2
							style={{
								fontSize: "20px",
								fontWeight: "600",
								color: "#222222",
								margin: "0 0 24px 0",
								paddingBottom: "16px",
								borderBottom: "2px solid #f7f7f7",
							}}
						>
							Profile Image
						</h2>
						<ImageUpload
							onChange={(value) =>
								setCustomValue("image", value)
							}
							value={image}
						/>
					</div>

					{/* Submit Button */}
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							gap: "16px",
							paddingTop: "16px",
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
							{isLoading ? "Updating..." : "Update Profile"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SettingsForm;

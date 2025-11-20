"use client";

import React, { useState } from "react";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { useForm, useController, Controller } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import MultiImageUpload from "@/components/FormHelpers/MultiImageUpload";
import CountrySelect from "@/components/FormHelpers/CountrySelect";
import { categories } from "@/libs/Categories";
import Button from "@/components/FormHelpers/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@mantine/rte"), {
	ssr: false,
	loading: () => null,
});
import RTEControls from "@/utils/RTEControls";

const ListingForm = () => {
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
		setValue,
		watch,
		setError,
		formState: { errors },
		reset,
		control,
	} = useForm({
		defaultValues: {
			title: "",
			description: "",
			imageSrc: [],
			address: "",
			features: "",
			category: "",
			location: null,
			price: 1,
			area: "",
			bedrooms: "",
			bathrooms: "",
		},
	});

	const {
		field: { value: catValue, onChange: catOnChange, ...restCategoryField },
	} = useController({ name: "category", control });

	const location = watch("location");
	const imageSrc = watch("imageSrc");
	const category = watch("category");

	const onSubmit = (data) => {
		// Ensure imageSrc is an array and has at least one image
		if (!data.imageSrc || !Array.isArray(data.imageSrc) || data.imageSrc.length === 0) {
			toast.error("Please upload at least one image");
			return;
		}

		// Validate conditional fields based on category
		if (data.category === "House" || data.category === "Land") {
			if (!data.area || data.area === "") {
				toast.error("Please enter the area in square meters");
				setError("area", { type: "required", message: "Area is required" });
				return;
			}
		}

		if (data.category === "House") {
			if (!data.bedrooms || data.bedrooms === "") {
				toast.error("Please enter the number of bedrooms");
				setError("bedrooms", { type: "required", message: "Bedrooms is required" });
				return;
			}
			if (!data.bathrooms || data.bathrooms === "") {
				toast.error("Please enter the number of bathrooms");
				setError("bathrooms", { type: "required", message: "Bathrooms is required" });
				return;
			}
		}

		// Convert imageSrc array to JSON string for storage
		const submitData = {
			...data,
			imageSrc: JSON.stringify(data.imageSrc),
		};

		setIsLoading(true);
		axios
			.post("/api/listings/create", submitData)
			.then((response) => {
				toast.success("Listing created! It is pending admin approval and will be visible once approved.");
				router.push("/listings/my-listings");
				reset();
			})
			.catch((error) => {
				console.error("Error creating listing:", error);
				const errorMessage = error.response?.data?.message || error.message || "Something went wrong. Please try again.";
				toast.error(errorMessage);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div
			className="listing-form-container"
			style={{
				paddingTop: "40px",
				paddingBottom: "80px",
				width: "100%",
			}}
		>
			<div className="listing-form-wrapper" style={{ maxWidth: "1400px", margin: "0 auto", paddingLeft: "24px", paddingRight: "24px", boxSizing: "border-box" }}>
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
						Create a New Listing
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							margin: 0,
							lineHeight: "1.5",
						}}
					>
						Share your property with potential buyers. All listings require admin approval.
					</p>
				</div>

				<style jsx>{`
					.listing-form-grid {
						display: grid;
						grid-template-columns: 1fr 1fr;
						gap: 32px;
						align-items: start;
					}
					.listing-form-column {
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
					.form-label-custom {
						display: block;
						font-size: 14px;
						font-weight: 600;
						color: #222222;
						margin-bottom: 8px;
					}
					@media only screen and (max-width: 991px) {
						.listing-form-grid {
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
					className="listing-form-grid"
				>
					{/* Left Column */}
					<div className="listing-form-column">
						{/* Section 1: Basic Information */}
						<div className="form-section-card">
							<h2 className="form-section-title">
								Basic Information
							</h2>
							<div className="form-field-group">
								<Input
									label="Property Title"
									id="title"
									type="text"
									placeholder="e.g., Beautiful 3-bedroom house in downtown"
									disabled={isLoading}
									register={register}
									errors={errors}
									required
								/>

								<div className="form-group">
									<label className="form-label-custom">
										Description <span style={{ color: "#FF385C" }}>*</span>
									</label>
									<Controller
										name="description"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<RichTextEditor
												controls={RTEControls}
												{...field}
												placeholder="Describe your property in detail..."
												style={{
													border: "1px solid #e0e0e0",
													borderRadius: "8px",
													minHeight: "200px",
												}}
											/>
										)}
									/>
								</div>
							</div>
						</div>

						{/* Section 2: Images */}
						<div className="form-section-card">
							<h2 className="form-section-title">
								Property Images
							</h2>
							<MultiImageUpload
								onChange={(value) =>
									setCustomValue("imageSrc", value)
								}
								value={imageSrc}
							/>
						</div>
					</div>

					{/* Right Column */}
					<div className="listing-form-column">
						{/* Section 3: Location & Category */}
						<div className="form-section-card">
							<h2 className="form-section-title">
								Location & Category
							</h2>
							<div className="form-field-group">
								<div>
									<label className="form-label-custom">
										Location <span style={{ color: "#FF385C" }}>*</span>
									</label>
									<CountrySelect
										value={location}
										onChange={(value) =>
											setCustomValue("location", value)
										}
									/>
								</div>

								<div>
									<label className="form-label-custom">
										Category <span style={{ color: "#FF385C" }}>*</span>
									</label>
									<Select
										id="react-select-2-live-region"
										className="select-input"
										placeholder="Select Category"
										isClearable
										options={categories}
										value={
											catValue
												? categories.find(
														(x) => x.value === catValue
												  )
												: catValue
										}
										onChange={(option) =>
											catOnChange(
												option ? option.value : option
											)
										}
										{...restCategoryField}
										styles={{
											control: (base) => ({
												...base,
												border: "1px solid #e0e0e0",
												borderRadius: "8px",
												padding: "4px",
												boxShadow: "none",
												"&:hover": {
													borderColor: "#222222",
												},
											}),
										}}
									/>
								</div>

								<Input
									label="Full Address"
									id="address"
									type="text"
									placeholder="e.g., 123 Main Street, City, State"
									disabled={isLoading}
									register={register}
									errors={errors}
									required
								/>
							</div>

							{/* Conditional Fields based on Category */}
							{(category === "House" || category === "Land") && (
								<div
									style={{
										marginTop: "24px",
										padding: "24px",
										backgroundColor: "#f9f9f9",
										borderRadius: "12px",
										border: "1px solid #e0e0e0",
										width: "100%",
										boxSizing: "border-box",
									}}
								>
									<h3
										style={{
											fontSize: "16px",
											fontWeight: "600",
											color: "#222222",
											marginBottom: "20px",
											marginTop: 0,
										}}
									>
										Property Details
									</h3>
									<div
										style={{
											display: "grid",
											gridTemplateColumns: category === "House" ? "repeat(3, 1fr)" : "1fr",
											gap: "20px",
											width: "100%",
										}}
									>
										<Input
											label="Area (Square Meters)"
											id="area"
											type="number"
											placeholder="e.g., 150"
											disabled={isLoading}
											register={register}
											errors={errors}
											required={category === "House" || category === "Land"}
										/>

										{category === "House" && (
											<>
												<Input
													label="Bedrooms"
													id="bedrooms"
													type="number"
													placeholder="e.g., 3"
													disabled={isLoading}
													register={register}
													errors={errors}
													required={category === "House"}
												/>
												<Input
													label="Bathrooms"
													id="bathrooms"
													type="number"
													placeholder="e.g., 2"
													disabled={isLoading}
													register={register}
													errors={errors}
													required={category === "House"}
												/>
											</>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Section 4: Details & Pricing */}
						<div className="form-section-card">
							<h2 className="form-section-title">
								Details & Pricing
							</h2>
							<div className="form-field-group">
								<div className="form-group">
									<label className="form-label-custom">
										Features & Amenities
									</label>
									<Controller
										name="features"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<RichTextEditor
												controls={RTEControls}
												{...field}
												placeholder="List the features and amenities of your property..."
												style={{
													border: "1px solid #e0e0e0",
													borderRadius: "8px",
													minHeight: "150px",
												}}
											/>
										)}
									/>
								</div>

								<Input
									label="Price"
									id="price"
									type="number"
									placeholder="0"
									disabled={isLoading}
									register={register}
									errors={errors}
									required
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
							{isLoading ? "Creating..." : "Create Listing"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ListingForm;

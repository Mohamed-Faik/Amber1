"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { useForm, useController, Controller } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import MultiImageUpload from "@/components/FormHelpers/MultiImageUpload";
import MoroccanCitySelect from "@/components/FormHelpers/MoroccanCitySelect";
import MoroccanNeighborhoodSelect from "@/components/FormHelpers/MoroccanNeighborhoodSelect";
import { categories } from "@/libs/Categories";
import { formatLocationValue, moroccanCities } from "@/libs/moroccanCities";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useCountries from "@/hooks/useCountries";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";
const RichTextEditor = dynamic(
	() => import("@mantine/rte").then((mod) => mod.default || mod.RichTextEditor),
	{
		ssr: false,
		loading: () => <p>Loading editor...</p>,
	}
);
import RTEControls from "@/utils/RTEControls";

// Experience Categories
const experienceCategories = [
	{ value: "Adventure & Outdoor", label: "Adventure & Outdoor", icon: "🏔️" },
	{ value: "Food & Drink", label: "Food & Drink", icon: "🍷" },
	{ value: "Art & Culture", label: "Art & Culture", icon: "🎨" },
	{ value: "Wellness", label: "Wellness", icon: "🧘" },
	{ value: "Tours & Sightseeing", label: "Tours & Sightseeing", icon: "🗺️" },
	{ value: "Classes & Workshops", label: "Classes & Workshops", icon: "📚" },
	{ value: "Entertainment", label: "Entertainment", icon: "🎭" },
	{ value: "Sports & Fitness", label: "Sports & Fitness", icon: "⚽" },
	{ value: "Shopping", label: "Shopping", icon: "🛍️" },
	{ value: "Nature & Wildlife", label: "Nature & Wildlife", icon: "🦁" },
];

// Service Categories
const serviceCategories = [
	{ value: "Cleaning", label: "Cleaning Services", icon: "🧹" },
	{ value: "Property Management", label: "Property Management", icon: "🏢" },
	{ value: "Maintenance & Repair", label: "Maintenance & Repair", icon: "🔧" },
	{ value: "Gardening & Landscaping", label: "Gardening & Landscaping", icon: "🌳" },
	{ value: "Interior Design", label: "Interior Design", icon: "🛋️" },
	{ value: "Photography", label: "Photography & Videography", icon: "📸" },
	{ value: "Catering", label: "Catering & Chef Services", icon: "👨‍🍳" },
	{ value: "Security", label: "Security Services", icon: "🔒" },
	{ value: "Transportation", label: "Transportation & Transfer", icon: "🚗" },
	{ value: "Pet Care", label: "Pet Care Services", icon: "🐕" },
	{ value: "Concierge", label: "Concierge Services", icon: "🎩" },
	{ value: "Event Planning", label: "Event Planning", icon: "🎉" },
];

const parseImages = (value) => {
	if (!value) return [];
	if (Array.isArray(value)) {
		return value;
	}
	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			if (Array.isArray(parsed)) {
				return parsed;
			}
		} catch (error) {
			if (value.trim() !== "") {
				return [value];
			}
		}
	}
	return [];
};

const ListingForm = ({ initialData = null, featureType = null }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const isEditMode = Boolean(initialData);
	const { getAll } = useCountries();
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;
	const countryOptions = getAll();

	const defaultValues = useMemo(() => {
		if (!initialData) {
			return {
				title: "",
				description: "",
				imageSrc: [],
				address: "",
				features: "",
				category: "",
				listingType: "SALE",
				city: null,
				neighborhood: null,
				price: 1,
				area: "",
				bedrooms: "",
				bathrooms: "",
			};
		}

		const images = parseImages(initialData.imageSrc);
		// Try to parse city and neighborhood from location_value
		// Format: "Neighborhood, City" or just "City"
		let cityOption = null;
		let neighborhoodOption = null;

		if (initialData.location_value) {
			const parts = initialData.location_value.split(",").map(p => p.trim());
			if (parts.length >= 2) {
				// Has neighborhood and city (format: "Neighborhood, City")
				const cityName = parts[parts.length - 1]; // Last part is city
				const neighborhoodName = parts.slice(0, -1).join(", "); // Everything before last part is neighborhood
				// Try to find city and neighborhood
				cityOption = moroccanCities.find(c =>
					c.label.toLowerCase() === cityName.toLowerCase()
				);
				if (cityOption) {
					neighborhoodOption = cityOption.neighborhoods.find(n =>
						n.label.toLowerCase() === neighborhoodName.toLowerCase()
					);
				}
			} else if (parts.length === 1) {
				// Just city
				cityOption = moroccanCities.find(c =>
					c.label.toLowerCase() === parts[0].toLowerCase()
				);
			}
		}

		return {
			title: initialData.title || "",
			description: initialData.description || "",
			imageSrc: images,
			address: initialData.address || "",
			features: initialData.features || "",
			category: initialData.category || "",
			listingType: initialData.listingType || "SALE",
			city: cityOption ? { value: cityOption.value, label: cityOption.label, latlng: cityOption.latlng } : null,
			neighborhood: neighborhoodOption ? { value: neighborhoodOption.value, label: neighborhoodOption.label, city: cityOption?.label, latlng: cityOption?.latlng } : null,
			price: initialData.price ?? 1,
			area: initialData.area ?? "",
			bedrooms: initialData.bedrooms ?? "",
			bathrooms: initialData.bathrooms ?? "",
		};
	}, [initialData]);

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
		defaultValues,
	});

	const setCustomValue = (id, value) => {
		setValue(id, value, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	};

	useEffect(() => {
		reset(defaultValues);
	}, [defaultValues, reset]);

	const {
		field: { value: catValue, onChange: catOnChange, ...restCategoryField },
	} = useController({ name: "category", control });

	const {
		field: { value: listingTypeValue, onChange: listingTypeOnChange, ...restListingTypeField },
	} = useController({
		name: "listingType",
		control,
		defaultValue: "SALE",
		rules: {
			required: "Listing type is required",
			validate: (value) => {
				if (!value || (value !== "SALE" && value !== "RENT" && value !== "DAILY_RENT")) {
					return "Please select a valid listing type";
				}
				return true;
			}
		}
	});

	const city = watch("city");
	const neighborhood = watch("neighborhood");
	const imageSrc = watch("imageSrc");
	const category = watch("category");
	const listingType = watch("listingType");

	// Clear neighborhood when city changes
	useEffect(() => {
		if (city && neighborhood) {
			// Check if neighborhood belongs to current city
			const cityData = moroccanCities.find(c => c.value === city.value);
			if (cityData && neighborhood.city !== cityData.label) {
				setCustomValue("neighborhood", null);
			}
		}
	}, [city, neighborhood, setCustomValue]);

	const onSubmit = (data) => {
		console.log("Form submitted with data:", data);
		console.log("Listing type value:", data.listingType);
		console.log("Listing type value type:", typeof data.listingType);

		// Ensure imageSrc is an array and has at least one image
		if (!data.imageSrc || !Array.isArray(data.imageSrc) || data.imageSrc.length === 0) {
			toast.error("Please upload at least one image");
			return;
		}

		// Define feature type flags
		const isHomes = !featureType || featureType === "HOMES";
		const isExperience = featureType === "EXPERIENCES";
		const isService = featureType === "SERVICES";

		// Validate listing type - Only for HOMES
		if (isHomes && (!data.listingType || (data.listingType !== "SALE" && data.listingType !== "RENT" && data.listingType !== "DAILY_RENT"))) {
			console.error("Invalid listing type:", data.listingType);
			toast.error("Please select a listing type (For Sale, For Rent Monthly, or For Rent Daily)");
			setError("listingType", { type: "required", message: "Listing type is required" });
			return;
		}

		// Validate city selection
		if (!data.city || !data.city.value) {
			toast.error("Please select a city");
			setError("city", { type: "required", message: "City is required" });
			return;
		}

		// Validate conditional fields based on feature type
		const propertyType = data.category;

		// HOMES validation
		if (isHomes) {
			// Area is required for all property types except Land (optional for Land)
			if (propertyType && propertyType !== "Land") {
				if (!data.area || data.area === "") {
					toast.error("Please enter the area in square meters");
					setError("area", { type: "required", message: "Area is required" });
					return;
				}
			}

			// Bedrooms and bathrooms required for Villa, Apartment, and House
			if (propertyType === "Villa" || propertyType === "Apartment" || propertyType === "House") {
				if (!data.bedrooms || data.bedrooms === "") {
					toast.error("Please enter the number of bedrooms/chambers");
					setError("bedrooms", { type: "required", message: "Bedrooms/Chambers is required" });
					return;
				}
				if (!data.bathrooms || data.bathrooms === "") {
					toast.error("Please enter the number of bathrooms");
					setError("bathrooms", { type: "required", message: "Bathrooms is required" });
					return;
				}
			}
		}

		// EXPERIENCES validation
		if (isExperience) {
			if (!data.area || data.area === "") {
				toast.error("Please enter the duration in hours");
				setError("area", { type: "required", message: "Duration is required" });
				return;
			}
			if (!data.bedrooms || data.bedrooms === "") {
				toast.error("Please enter the maximum group size");
				setError("bedrooms", { type: "required", message: "Group size is required" });
				return;
			}
		}

		// Format location value from city and neighborhood
		const locationValue = formatLocationValue(data.city, data.neighborhood);
		const locationLatlng = data.neighborhood?.latlng || data.city?.latlng || [31.6295, -7.9811];

		// Convert imageSrc array to JSON string for storage
		const submitData = {
			...data,
			imageSrc: JSON.stringify(data.imageSrc),
			location: {
				label: locationValue,
				value: locationValue,
				latlng: locationLatlng,
			},
			// Set default listingType for Experiences and Services (not used but required in schema)
			listingType: featureType ? "SALE" : data.listingType,
			// Include featureType if provided (for Experiences and Services)
			...(featureType && { featureType }),
		};

		setIsLoading(true);
		const request = isEditMode
			? axios.patch(`/api/listings/${initialData.id}`, submitData)
			: axios.post("/api/listings/create", submitData);

		setIsLoading(true);
		request
			.then(() => {
				toast.success(
					isEditMode
						? "Listing updated! Changes will be reviewed before going live."
						: featureType === "EXPERIENCES"
							? "Experience created successfully!"
							: featureType === "SERVICES"
								? "Service created successfully!"
								: "Listing created! It is pending admin approval and will be visible once approved."
				);
				// Redirect based on feature type
				if (featureType === "EXPERIENCES") {
					router.push("/experiences");
				} else if (featureType === "SERVICES") {
					router.push("/services");
				} else {
					router.push("/listings/my-listings");
				}
				router.refresh();
				reset(defaultValues);
			})
			.catch((error) => {
				console.error("Error saving listing:", error);
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
						{isEditMode
							? featureType === "EXPERIENCES"
								? getTranslation(displayLanguage, "listings.editExperience")
								: featureType === "SERVICES"
									? getTranslation(displayLanguage, "listings.editService")
									: getTranslation(displayLanguage, "listings.editListing")
							: featureType === "EXPERIENCES"
								? getTranslation(displayLanguage, "listings.createNewExperience")
								: featureType === "SERVICES"
									? getTranslation(displayLanguage, "listings.createNewService")
									: getTranslation(displayLanguage, "listings.createListing")}
					</h1>
					<p
						style={{
							fontSize: "16px",
							color: "#717171",
							margin: 0,
							lineHeight: "1.5",
						}}
					>
						{isEditMode
							? getTranslation(displayLanguage, "listings.updateListingDescription")
							: featureType === "EXPERIENCES"
								? getTranslation(displayLanguage, "listings.createExperienceDescription")
								: featureType === "SERVICES"
									? getTranslation(displayLanguage, "listings.createServiceDescription")
									: getTranslation(displayLanguage, "listings.sharePropertyDescription")}
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
								{getTranslation(displayLanguage, "listings.basicInformation")}
							</h2>
							<div className="form-field-group">
								<Input
									label={getTranslation(displayLanguage, "listings.propertyTitle")}
									id="title"
									type="text"
									placeholder={getTranslation(displayLanguage, "listings.propertyTitlePlaceholder")}
									disabled={isLoading}
									register={register}
									errors={errors}
									required
								/>

								<div className="form-group">
									<label className="form-label-custom">
										{getTranslation(displayLanguage, "listings.description")} <span style={{ color: "#FF385C" }}>*</span>
									</label>
									<Controller
										name="description"
										control={control}
										defaultValue={defaultValues.description}
										render={({ field }) => (
											<RichTextEditor
												controls={RTEControls}
												{...field}
												placeholder={getTranslation(displayLanguage, "listings.describePropertyPlaceholder")}
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
								{getTranslation(displayLanguage, "listings.propertyImages")}
							</h2>
							<MultiImageUpload
								onChange={(value) =>
									setCustomValue("imageSrc", value)
								}
								value={imageSrc}
								uploadText={getTranslation(displayLanguage, "listings.clickToUpload")}
								fileTypesText={getTranslation(displayLanguage, "listings.fileTypesText")}
							/>
						</div>
					</div>

					{/* Right Column */}
					<div className="listing-form-column">
						{/* Section 3: Location & Category */}
						<div className="form-section-card">
							<h2 className="form-section-title">
								{getTranslation(displayLanguage, "listings.locationCategory")}
							</h2>
							<div className="form-field-group">
								<div className="form-group" style={{ marginBottom: 0 }}>
									<label className="form-label-custom" style={{ marginBottom: "8px", display: "block" }}>
										{getTranslation(displayLanguage, "listings.city")} <span style={{ color: "#FF385C" }}>*</span>
									</label>
									<div style={{ width: "100%" }}>
										<MoroccanCitySelect
											value={city}
											placeholder={getTranslation(displayLanguage, "listings.selectCity")}
											onChange={(value) => {
												setCustomValue("city", value);
												// Clear neighborhood when city changes
												if (!value || (value && city && value.value !== city.value)) {
													setCustomValue("neighborhood", null);
												}
											}}
										/>
									</div>
								</div>

								<div className="form-group" style={{ marginBottom: 0 }}>
									<label className="form-label-custom" style={{ marginBottom: "8px", display: "block" }}>
										{getTranslation(displayLanguage, "listings.neighborhood")}
									</label>
									<div style={{ width: "100%" }}>
										<MoroccanNeighborhoodSelect
											city={city}
											value={neighborhood}
											selectCityFirstPlaceholder={getTranslation(displayLanguage, "listings.selectNeighborhood")}
											placeholder={getTranslation(displayLanguage, "listings.selectNeighborhood")}
											onChange={(value) =>
												setCustomValue("neighborhood", value)
											}
										/>
									</div>
								</div>

								<div style={{ position: "relative", zIndex: 1 }}>
									<label className="form-label-custom" style={{ position: "relative", zIndex: 2 }}>
										{featureType === "EXPERIENCES"
											? getTranslation(displayLanguage, "listings.experienceType")
											: featureType === "SERVICES"
												? getTranslation(displayLanguage, "listings.serviceType")
												: getTranslation(displayLanguage, "listings.propertyType")} <span style={{ color: "#FF385C" }}>*</span>
									</label>
									<div style={{ position: "relative", zIndex: 1 }}>
										<Select
											id="react-select-2-live-region"
											className="select-input"
											classNamePrefix="select"
											placeholder={
												featureType === "EXPERIENCES"
													? getTranslation(displayLanguage, "listings.selectExperienceType")
													: featureType === "SERVICES"
														? getTranslation(displayLanguage, "listings.selectServiceType")
														: getTranslation(displayLanguage, "listings.selectPropertyType")
											}
											isClearable
											isSearchable
											menuPortalTarget={typeof document !== "undefined" ? document.body : null}
											menuPosition="fixed"
											options={
												featureType === "EXPERIENCES"
													? experienceCategories
													: featureType === "SERVICES"
														? serviceCategories
														: categories
											}
											value={
												catValue
													? (featureType === "EXPERIENCES"
														? experienceCategories
														: featureType === "SERVICES"
															? serviceCategories
															: categories
													).find((x) => x.value === catValue)
													: catValue
											}
											onChange={(option) => {
												catOnChange(option ? option.value : option);
												// Clear bedrooms and bathrooms when switching to Land (only for HOMES)
												if (!featureType && (!option || option.value === "Land")) {
													setCustomValue("bedrooms", "");
													setCustomValue("bathrooms", "");
												}
											}}
											{...restCategoryField}
											styles={{
												control: (base, state) => ({
													...base,
													border: state.isFocused ? "2px solid #FF385C" : "1px solid #e0e0e0",
													borderRadius: "8px",
													padding: "4px",
													boxShadow: state.isFocused ? "0 0 0 3px rgba(255, 56, 92, 0.1)" : "none",
													minHeight: "48px",
													"&:hover": {
														borderColor: state.isFocused ? "#FF385C" : "#222222",
													},
												}),
												placeholder: (base) => ({
													...base,
													color: "#717171",
													fontSize: "14px",
												}),
												singleValue: (base) => ({
													...base,
													color: "#222222",
													fontSize: "14px",
												}),
												menu: (base) => ({
													...base,
													borderRadius: "8px",
													boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
													border: "1px solid #e0e0e0",
													zIndex: 9999,
												}),
												menuPortal: (base) => ({
													...base,
													zIndex: 9999,
												}),
												menuList: (base) => ({
													...base,
													padding: "4px",
												}),
												option: (base, state) => ({
													...base,
													backgroundColor: state.isSelected
														? "#FF385C"
														: state.isFocused
															? "#FFF5F7"
															: "white",
													color: state.isSelected ? "white" : "#222222",
													padding: "12px 16px",
													fontSize: "14px",
													cursor: "pointer",
													borderRadius: "6px",
													margin: "2px 0",
													"&:hover": {
														backgroundColor: state.isSelected ? "#FF385C" : "#FFF5F7",
													},
												}),
												indicatorSeparator: () => ({
													display: "none",
												}),
												dropdownIndicator: (base) => ({
													...base,
													color: "#717171",
													"&:hover": {
														color: "#FF385C",
													},
												}),
												clearIndicator: (base) => ({
													...base,
													color: "#717171",
													"&:hover": {
														color: "#FF385C",
													},
												}),
											}}
											theme={(theme) => ({
												...theme,
												borderRadius: 8,
												colors: {
													...theme.colors,
													primary: "#FF385C",
													primary25: "#FFF5F7",
													primary50: "#FFE5EA",
													primary75: "#FFB8C5",
												},
											})}
										/>
									</div>
								</div>

								{/* Full Address - Only for HOMES */}
								{!featureType && (
									<Input
										label={getTranslation(displayLanguage, "listings.fullAddress")}
										id="address"
										type="text"
										placeholder={getTranslation(displayLanguage, "listings.fullAddressPlaceholder")}
										disabled={isLoading}
										register={register}
										errors={errors}
										required={!featureType}
									/>
								)}

								{/* For Experiences and Services - Register address as optional hidden field */}
								{featureType && (
									<input
										type="hidden"
										{...register("address")}
										value=""
									/>
								)}
							</div>

							{/* Conditional Fields based on Feature Type */}
							{category && category !== "" && (
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
										{featureType === "EXPERIENCES"
											? getTranslation(displayLanguage, "listings.experienceDetails")
											: featureType === "SERVICES"
												? getTranslation(displayLanguage, "listings.serviceDetails")
												: getTranslation(displayLanguage, "listings.propertyDetails")}
									</h3>

									{/* HOMES - Property Details */}
									{!featureType && (
										<div
											style={{
												display: "grid",
												gridTemplateColumns: (category === "Villa" || category === "Apartment" || category === "House")
													? "repeat(3, 1fr)"
													: "1fr",
												gap: "20px",
												width: "100%",
											}}
										>
											{(category === "Villa" || category === "Apartment" || category === "House" || category === "Land") && (
												<Input
													label={getTranslation(displayLanguage, "listings.areaSquareMeters")}
													id="area"
													type="number"
													placeholder={getTranslation(displayLanguage, "listings.areaPlaceholder")}
													disabled={isLoading}
													register={register}
													errors={errors}
													required={category !== "Land"}
												/>
											)}

											{(category === "Villa" || category === "Apartment" || category === "House") && (
												<>
													<Input
														label={category === "Apartment" ? getTranslation(displayLanguage, "listings.chambers") : getTranslation(displayLanguage, "listings.bedrooms")}
														id="bedrooms"
														type="number"
														placeholder={getTranslation(displayLanguage, "listings.bedroomsPlaceholder")}
														disabled={isLoading}
														register={register}
														errors={errors}
														required
													/>
													<Input
														label={getTranslation(displayLanguage, "listings.bathrooms")}
														id="bathrooms"
														type="number"
														placeholder={getTranslation(displayLanguage, "listings.bathroomsPlaceholder")}
														disabled={isLoading}
														register={register}
														errors={errors}
														required
													/>
												</>
											)}
										</div>
									)}

									{/* EXPERIENCES - Experience Details */}
									{featureType === "EXPERIENCES" && (
										<>
											<div
												style={{
													display: "grid",
													gridTemplateColumns: "repeat(2, 1fr)",
													gap: "20px",
													width: "100%",
												}}
											>
												<Input
													label={getTranslation(displayLanguage, "listings.durationHours")}
													id="area"
													type="number"
													placeholder={getTranslation(displayLanguage, "listings.durationPlaceholder")}
													disabled={isLoading}
													register={register}
													errors={errors}
													required
												/>
												<Input
													label={getTranslation(displayLanguage, "listings.groupSizeMaxGuests")}
													id="bedrooms"
													type="number"
													placeholder={getTranslation(displayLanguage, "listings.groupSizePlaceholder")}
													disabled={isLoading}
													register={register}
													errors={errors}
													required
												/>
											</div>
											{/* Hidden fields for experiences */}
											<input type="hidden" {...register("bathrooms")} value="" />
											<input type="hidden" {...register("features")} value="" />
										</>
									)}

									{/* SERVICES - Service Details */}
									{featureType === "SERVICES" && (
										<div
											style={{
												display: "grid",
												gridTemplateColumns: "repeat(2, 1fr)",
												gap: "20px",
												width: "100%",
											}}
										>
											<Input
												label={getTranslation(displayLanguage, "listings.serviceDuration")}
												id="area"
												type="text"
												placeholder={getTranslation(displayLanguage, "listings.serviceDurationPlaceholder")}
												disabled={isLoading}
												register={register}
												errors={errors}
											/>
											<Input
												label={getTranslation(displayLanguage, "listings.availability")}
												id="bedrooms"
												type="text"
												placeholder={getTranslation(displayLanguage, "listings.availabilityPlaceholder")}
												disabled={isLoading}
												register={register}
												errors={errors}
											/>
											<Input
												label={getTranslation(displayLanguage, "listings.serviceAreaCoverage")}
												id="bathrooms"
												type="text"
												placeholder={getTranslation(displayLanguage, "listings.serviceAreaPlaceholder")}
												disabled={isLoading}
												register={register}
												errors={errors}
											/>
											<Input
												label={getTranslation(displayLanguage, "listings.responseTime")}
												id="features"
												type="text"
												placeholder={getTranslation(displayLanguage, "listings.responseTimePlaceholder")}
												disabled={isLoading}
												register={register}
												errors={errors}
											/>
										</div>
									)}
								</div>
							)}
						</div>

						{/* Section 4: Details & Pricing */}
						<div className="form-section-card">
							<h2 className="form-section-title">
								{getTranslation(displayLanguage, "listings.detailsPricing")}
							</h2>
							<div className="form-field-group">
								<div className="form-group">
									<label className="form-label-custom">
										{getTranslation(displayLanguage, "listings.featuresAmenities")}
									</label>
									<Controller
										name="features"
										control={control}
										defaultValue={defaultValues.features}
										render={({ field }) => (
											<RichTextEditor
												controls={RTEControls}
												{...field}
												placeholder={getTranslation(displayLanguage, "listings.listFeaturesPlaceholder")}
												style={{
													border: "1px solid #e0e0e0",
													borderRadius: "8px",
													minHeight: "150px",
												}}
											/>
										)}
									/>
								</div>

								{/* Listing Type - Sale or Rent - Only for HOMES */}
								{!featureType && (
									<div style={{ position: "relative", zIndex: 1 }}>
										<label className="form-label-custom" style={{ position: "relative", zIndex: 2 }}>
											{getTranslation(displayLanguage, "listings.listingType")} <span style={{ color: "#FF385C" }}>*</span>
										</label>
										<div style={{ position: "relative", zIndex: 1 }}>
											<Select
												id="react-select-listing-type"
												className="select-input"
												classNamePrefix="select"
												placeholder={getTranslation(displayLanguage, "listings.selectListingType")}
												isSearchable={false}
												menuPortalTarget={typeof document !== "undefined" ? document.body : null}
												menuPosition="fixed"
												options={[
													{ value: "SALE", label: getTranslation(displayLanguage, "listings.forSale") },
													{ value: "RENT", label: getTranslation(displayLanguage, "listings.forRent") },
													{ value: "DAILY_RENT", label: getTranslation(displayLanguage, "listings.forRentDaily") }
												]}
												value={
													listingTypeValue
														? [{ value: "SALE", label: getTranslation(displayLanguage, "listings.forSale") }, { value: "RENT", label: getTranslation(displayLanguage, "listings.forRent") }, { value: "DAILY_RENT", label: getTranslation(displayLanguage, "listings.forRentDaily") }].find(
															(x) => x.value === listingTypeValue
														)
														: null
												}
												onChange={(option) => {
													const value = option ? option.value : null;
													console.log("Listing type changed to:", value);
													// Call the field's onChange to update react-hook-form
													listingTypeOnChange(value);
													// Also update via setValue to ensure it's registered
													setCustomValue("listingType", value);
													// Clear any existing errors when a valid option is selected
													if (value && (value === "SALE" || value === "RENT" || value === "DAILY_RENT")) {
														setError("listingType", null);
													}
												}}
												onBlur={restListingTypeField.onBlur}
												name={restListingTypeField.name}
												ref={restListingTypeField.ref}
												styles={{
													control: (base, state) => ({
														...base,
														border: state.isFocused ? "2px solid #FF385C" : "1px solid #e0e0e0",
														borderRadius: "8px",
														padding: "4px",
														boxShadow: state.isFocused ? "0 0 0 3px rgba(255, 56, 92, 0.1)" : "none",
														minHeight: "48px",
														"&:hover": {
															borderColor: state.isFocused ? "#FF385C" : "#222222",
														},
													}),
													placeholder: (base) => ({
														...base,
														color: "#717171",
														fontSize: "14px",
													}),
													singleValue: (base) => ({
														...base,
														color: "#222222",
														fontSize: "14px",
													}),
													menu: (base) => ({
														...base,
														borderRadius: "8px",
														boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
														zIndex: 9999,
													}),
													option: (base, state) => ({
														...base,
														backgroundColor: state.isSelected
															? "#FFF5F7"
															: state.isFocused
																? "#FFF5F7"
																: "#ffffff",
														color: state.isSelected ? "#FF385C" : "#222222",
														fontWeight: state.isSelected ? "600" : "400",
														"&:active": {
															backgroundColor: "#FFF5F7",
														},
													}),
													menuPortal: (base) => ({
														...base,
														zIndex: 9999,
													}),
												}}
											/>
										</div>
										{errors.listingType && (
											<p style={{ color: "#FF385C", fontSize: "12px", marginTop: "4px", marginBottom: 0 }}>
												{errors.listingType.message}
											</p>
										)}
									</div>
								)}

								<Input
									label={
										featureType === "EXPERIENCES"
											? getTranslation(displayLanguage, "listings.pricePerPerson")
											: featureType === "SERVICES"
												? getTranslation(displayLanguage, "listings.priceStartingFrom")
												: listingType === "RENT"
													? `${getTranslation(displayLanguage, "listings.price")} (${getTranslation(displayLanguage, "listings.pricePerMonth")})`
													: listingType === "DAILY_RENT"
														? `${getTranslation(displayLanguage, "listings.price")} (${getTranslation(displayLanguage, "listings.pricePerDay")})`
														: getTranslation(displayLanguage, "listings.price")
									}
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
							{getTranslation(displayLanguage, "listings.cancel")}
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
							{isLoading
								? isEditMode
									? getTranslation(displayLanguage, "listings.saving")
									: getTranslation(displayLanguage, "listings.creating")
								: isEditMode
									? getTranslation(displayLanguage, "listings.saveChanges")
									: getTranslation(displayLanguage, "listings.createListing")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ListingForm;

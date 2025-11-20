"use client";

import React, { useState } from "react";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { useForm, useController, Controller } from "react-hook-form";
import Input from "@/components/FormHelpers/Input";
import ImageUpload from "@/components/FormHelpers/ImageUpload";
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

const BlogPostForm = () => {
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
			content: "",
			imageSrc: "",
			category: "",
		},
	});

	const {
		field: { value: catValue, onChange: catOnChange, ...restCategoryField },
	} = useController({ name: "category", control });

	const imageSrc = watch("imageSrc");

	const onSubmit = (data) => {
		setIsLoading(true);
		axios
			.post("/api/blog/create", data)
			.then((response) => {
				toast.success("Blog created!");
				router.refresh();
				reset();
			})
			.catch((error) => {
				toast.error("Something went wrong.");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="submit-property-area">
			<form
				className="submit-property-form"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="row">
					<div className="col-lg-12">
						<Input
							label="Post Title"
							id="title"
							type="text"
							placeholder="Post Title"
							disabled={isLoading}
							register={register}
							errors={errors}
							required
						/>
					</div>

					<div className="col-lg-12">
						<div className="form-group">
							<Controller
								name="content"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<RichTextEditor
										controls={RTEControls}
										{...field}
										placeholder="Details Content"
									/>
								)}
							/>
						</div>
					</div>

					<div className="col-lg-12">
						<ImageUpload
							onChange={(value) =>
								setCustomValue("imageSrc", value)
							}
							value={imageSrc}
						/>
					</div>

					<div className="col-lg-12">
						<div className="form-group">
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
							/>
						</div>
					</div>
					
					<Button disabled={isLoading} label={"Post"} />
				</div>
			</form>
		</div>
	);
};

export default BlogPostForm;

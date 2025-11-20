"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import Button from "../FormHelpers/Button";
import TextArea from "../FormHelpers/TextArea";
const options = [
	{ value: "1", label: "Terrible" },
	{ value: "2", label: "Poor" },
	{ value: "3", label: "Average" },
	{ value: "4", label: "Good" },
	{ value: "5", label: "Excellent" },
];

const FeedbackForm = ({ currentUser, listingId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setError,
		control,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			rating: null,
			comment: "",
		},
	});

	const onSubmit = async (data) => {
		if (!currentUser) {
			return router.push("/auth/signin");
		}
		setIsLoading(true);
		axios
			.post(`/api/listings/review/${listingId}`, data)
			.then((response) => {
				toast.success("Rating success!");

				router.refresh();
				reset();
			})
			.catch((error) => {
				toast.error("Something went wrong!");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<form className="leave-replay" onSubmit={handleSubmit(onSubmit)}>
			<div className="d-flex justify-content-between">
				<h3>Leave A Review</h3>
				<Controller
					name="rating"
					control={control}
					rules={{ required: "Please select an option" }}
					render={({ field, fieldState }) => (
						<Select
							id="react-select-3-live-region"
							{...field}
							options={options}
							placeholder="Select Experience"
							isClearable
						/>
					)}
				/>
			</div>
			<div className="row">
				<div className="col-lg-12">
					<div className="form-group">
						<TextArea
							id="comment"
							placeholder="Write a review"
							disabled={isLoading}
							register={register}
							errors={errors}
							required
						/>
					</div>
				</div>

				<div className="col-12">
					<Button label="Submit Review" disabled={isLoading} />
				</div>
			</div>
		</form>
	);
};

export default FeedbackForm;

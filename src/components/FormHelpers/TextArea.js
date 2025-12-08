"use client";

import React from "react";

const TextArea = ({
	id,
	placeholder,
	disabled,
	register,
	required,
	errors,
}) => {
	return (
		<div className="form-group">
			<textarea
				id={id}
				{...register(id, { required })}
				placeholder={placeholder}
				className={`
                form-control
                ${errors[id] ? "is-invalid" : ""}
            `}
				disabled={disabled}
				cols="30"
				rows="10"
			/>
		</div>
	);
};

export default TextArea;

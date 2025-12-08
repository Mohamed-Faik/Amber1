"use client";

import React from "react";

const Input = ({
	id,
	type = "text",
	label,
	placeholder,
	disabled,
	register,
	required,
	errors,
	...rest
}) => {
	// Handle both cases: register as function or already called register
	const registerProps = typeof register === "function" 
		? register(id, { required })
		: register || {};

	return (
		<div className="form-group">
			{label && (
				<label
					htmlFor={id}
					style={{
						display: "block",
						fontSize: "14px",
						fontWeight: "600",
						color: "#222222",
						marginBottom: "8px",
					}}
				>
					{label}
					{required && <span style={{ color: "#FF385C", marginLeft: "4px" }} aria-label="required">*</span>}
				</label>
			)}
			<input
				id={id}
				{...registerProps}
				{...rest}
				placeholder={placeholder}
				type={type}
				className={`
                form-control
                ${errors[id] ? "is-invalid" : ""}
            `}
				disabled={disabled}
				aria-invalid={errors[id] ? "true" : "false"}
				aria-describedby={errors[id] ? `${id}-error` : undefined}
				aria-required={required}
				style={{
					width: "100%",
					padding: "12px 16px",
					border: errors[id] ? "2px solid #FF385C" : "1px solid #e0e0e0",
					borderRadius: "8px",
					fontSize: "15px",
					color: "#222222",
					backgroundColor: disabled ? "#f7f7f7" : "#ffffff",
					transition: "all 0.2s ease",
					outline: "none",
				}}
				onFocus={(e) => {
					if (!errors[id]) {
						e.target.style.borderColor = "#222222";
						e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.05)";
					}
				}}
				onBlur={(e) => {
					if (!errors[id]) {
						e.target.style.borderColor = "#e0e0e0";
						e.target.style.boxShadow = "none";
					}
				}}
			/>
			{errors[id] && (
				<div
					role="alert"
					aria-live="polite"
					id={`${id}-error`}
					style={{
						marginTop: "6px",
						fontSize: "13px",
						color: "#FF385C",
					}}
				>
					{errors[id]?.message || "This field is required"}
				</div>
			)}
		</div>
	);
};

export default Input;

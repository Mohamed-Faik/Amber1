import React from "react";

const Button = ({ disabled, label }) => {
	return (
		<button type="submit" disabled={disabled} className="default-btn">
			{label}
		</button>
	);
};

export default Button;

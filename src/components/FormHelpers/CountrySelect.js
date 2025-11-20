"use client";

import Select from "react-select";
import useCountries from "@/hooks/useCountries";

const CountrySelectValue = {
	flag: "",
	label: "",
	latlng: [],
	region: "",
	value: "",
};

const CountrySelect = ({ value, onChange }) => {
	const { getAll } = useCountries();

	return (
		<div className="form-group">
			<Select
				placeholder="Select Neighborhood"
				isClearable
				options={getAll()}
				value={value}
				onChange={(value) => onChange(value, CountrySelectValue)}
				formatOptionLabel={(option) => (
					<div className="dropdown">
						<div>{option.flag}</div>
						<div>
							{option.label}
						</div>
					</div>
				)}
				className={{
					control: () => "p-3 border-2",
					input: () => "text-lg",
					option: () => "text-lg",
				}}
				theme={(theme) => ({
					...theme,
					borderRadius: 6,
					colors: {
						...theme.colors,
						primary: "black",
						primary25: "#ffe4e6",
					},
				})}
			/>
		</div>
	);
};

export default CountrySelect;

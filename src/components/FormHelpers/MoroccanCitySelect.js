"use client";

import Select from "react-select";
import { moroccanCities } from "@/libs/moroccanCities";

const MoroccanCitySelect = ({ value, onChange }) => {
	const cityOptions = moroccanCities.map((city) => ({
		value: city.value,
		label: city.label,
		latlng: city.latlng,
	}));

	return (
		<div className="form-group">
			<Select
				placeholder="Select City"
				isClearable
				isSearchable
				options={cityOptions}
				value={value}
				onChange={(selectedValue) => {
					onChange(selectedValue);
				}}
				formatOptionLabel={(option) => (
					<div style={{ display: "flex", alignItems: "center" }}>
						<div>{option.label}</div>
					</div>
				)}
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
					option: (base, state) => ({
						...base,
						backgroundColor: state.isSelected
							? "#FF385C"
							: state.isFocused
							? "#FFF5F7"
							: "white",
						color: state.isSelected ? "white" : "#222222",
						"&:hover": {
							backgroundColor: state.isSelected ? "#FF385C" : "#FFF5F7",
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
					},
				})}
			/>
		</div>
	);
};

export default MoroccanCitySelect;


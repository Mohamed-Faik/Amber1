"use client";

import Select from "react-select";
import { getNeighborhoodsByCity, getCityByValue } from "@/libs/moroccanCities";

const MoroccanNeighborhoodSelect = ({ city, value, onChange }) => {
	if (!city || !city.value) {
		return (
			<div className="form-group">
				<Select
					placeholder="Select a city first"
					isDisabled
					options={[]}
				/>
			</div>
		);
	}

	const neighborhoods = getNeighborhoodsByCity(city.value);
	const cityData = getCityByValue(city.value);

	const neighborhoodOptions = neighborhoods.map((neighborhood) => ({
		value: neighborhood.value,
		label: neighborhood.label,
		city: cityData.label,
		latlng: cityData.latlng,
	}));

	return (
		<div className="form-group">
			<Select
				placeholder={`Select neighborhood in ${cityData.label}`}
				isClearable
				isSearchable
				options={neighborhoodOptions}
				value={value}
				onChange={(selectedValue) => {
					if (selectedValue) {
						onChange({
							...selectedValue,
							latlng: cityData.latlng,
							city: cityData.label,
						});
					} else {
						onChange(null);
					}
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

export default MoroccanNeighborhoodSelect;


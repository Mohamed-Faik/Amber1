"use client";

import Select from "react-select";
import { moroccanCities } from "@/libs/moroccanCities";

const MoroccanCitySelect = ({ value, onChange, placeholder }) => {
	const cityOptions = moroccanCities.map((city) => ({
		value: city.value,
		label: city.label,
		latlng: city.latlng,
	}));

	return (
		<Select
			placeholder={placeholder || "Select City"}
			isClearable
			isSearchable
			options={cityOptions}
			value={value}
			onChange={(selectedValue) => {
				onChange(selectedValue);
			}}
			menuPortalTarget={typeof document !== "undefined" ? document.body : null}
			menuPosition="fixed"
			formatOptionLabel={(option) => (
				<div style={{ display: "flex", alignItems: "center" }}>
					<div>{option.label}</div>
				</div>
			)}
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
	);
};

export default MoroccanCitySelect;


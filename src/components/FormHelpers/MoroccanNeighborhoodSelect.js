"use client";

import Select from "react-select";
import { getNeighborhoodsByCity, getCityByValue } from "@/libs/moroccanCities";

const MoroccanNeighborhoodSelect = ({ city, value, onChange, placeholder, selectCityFirstPlaceholder }) => {
	if (!city || !city.value) {
		return (
			<Select
				placeholder={selectCityFirstPlaceholder || "Select a city first"}
				isDisabled
				options={[]}
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
				}}
			/>
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
		<Select
			placeholder={placeholder ? `${placeholder} ${cityData.label}` : `Select neighborhood in ${cityData.label}`}
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

export default MoroccanNeighborhoodSelect;


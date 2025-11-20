"use client";

import Select from "react-select";

// Marrakech neighborhoods
const marrakechNeighborhoods = [
	{ value: "allal el fassi marrakech", label: "Allal El Fassi, Marrakech" },
	{ value: "gueliz marrakech", label: "Gueliz, Marrakech" },
	{ value: "hivernage marrakech", label: "Hivernage, Marrakech" },
	{ value: "agdal marrakech", label: "Agdal, Marrakech" },
	{ value: "sidi youssef ben ali marrakech", label: "Sidi Youssef Ben Ali, Marrakech" },
	{ value: "sidi ghanem marrakech", label: "Sidi Ghanem, Marrakech" },
	{ value: "daoudiate marrakech", label: "Daoudiate, Marrakech" },
	{ value: "massira marrakech", label: "Massira, Marrakech" },
	{ value: "targa marrakech", label: "Targa, Marrakech" },
	{ value: "menara marrakech", label: "Menara, Marrakech" },
	{ value: "sidi abdelaziz marrakech", label: "Sidi Abdelaziz, Marrakech" },
	{ value: "riad zitoun marrakech", label: "Riad Zitoun, Marrakech" },
	{ value: "kasbah marrakech", label: "Kasbah, Marrakech" },
	{ value: "mellah marrakech", label: "Mellah, Marrakech" },
	{ value: "medina marrakech", label: "Medina, Marrakech" },
	{ value: "palmeraie marrakech", label: "Palmeraie, Marrakech" },
	{ value: "amizmiz marrakech", label: "Amizmiz, Marrakech" },
	{ value: "tamansourt marrakech", label: "Tamansourt, Marrakech" },
];

const CitySelectValue = {
	label: "",
	value: "",
	latlng: [31.6295, -7.9811], // Default Marrakech coordinates
};

const CitySelect = ({ value, onChange }) => {
	return (
		<div className="form-group">
			<Select
				placeholder="Select neighborhood in Marrakech"
				isClearable
				isSearchable
				options={marrakechNeighborhoods}
				value={value}
				onChange={(selectedValue) => {
					if (selectedValue) {
						onChange({
							...selectedValue,
							latlng: [31.6295, -7.9811], // Marrakech coordinates
							region: "Marrakech",
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

export default CitySelect;


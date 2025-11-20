import React from "react";
import LocationItem from "./LocationItem";

const LocationFind = ({ locations, onSelect }) => {
	return (
		<ul className="search-list">
			{locations.map((loc) => (
				<LocationItem
					key={loc.id}
					{...loc}
					onSelect={() => onSelect(loc.location_value)}
				/>
			))}
		</ul>
	);
};

export default LocationFind;

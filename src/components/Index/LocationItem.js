import React from "react";
import Image from "next/image";
import locationIco from "../../../public/images/icon/location.svg";

const LocationItem = ({ location_value, onSelect }) => {
	return (
		<li onClick={onSelect}>
			<Image
				src={locationIco}
				alt="globalSearch"
				width="18"
				height="18"
			/>{" "}
			{location_value}
		</li>
	);
};

export default LocationItem;

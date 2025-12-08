import React from "react";
import Image from "next/image";
import globalSearch from "../../../public/images/global-search.png";

const CategoryItem = ({ category, onSelect }) => {
	return (
		<li onClick={onSelect}>
			<Image
				src={globalSearch}
				alt="globalSearch"
				width="18"
				height="18"
			/>{" "}
			{category}
		</li>
	);
};

export default CategoryItem;

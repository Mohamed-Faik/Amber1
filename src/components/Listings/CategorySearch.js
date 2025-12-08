"use client";
import React from "react";
import Image from "next/image";

import grid from "../../../public/images/icon/grid.svg";
import list from "../../../public/images/icon/list.svg";

const CategorySearch = ({ listStyle, onStyle }) => {
	return (
		<div className="section-title-rights" style={{ position: "relative" }}>
			<ul className="nav nav-tabs featured-tabs list-grid" style={{ position: "relative", zIndex: 1 }}>
				{/* Grid/List view toggle removed - keeping component for compatibility */}
			</ul>
		</div>
	);
};

export default CategorySearch;

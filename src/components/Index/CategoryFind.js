import React from "react";
import CategoryItem from "./CategoryItem";

const CategoryFind = ({ categories, onSelect }) => {
	return (
		<ul className="search-list">
			{categories.map((cat) => (
				<CategoryItem
					key={cat.id}
					{...cat}
					onSelect={() => {
						onSelect(cat.category);
					}}
				/>
			))}
		</ul>
	);
};

export default CategoryFind;

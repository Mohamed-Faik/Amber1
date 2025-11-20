"use client";
import React, { useState } from "react";
import Image from "next/image";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import grid from "../../../public/images/icon/grid.svg";
import list from "../../../public/images/icon/list.svg";
import { categories } from "@/libs/Categories";

const CategorySearch = ({ listStyle, onStyle }) => {
	const [selectedOption, setSelectedOption] = useState("");
	const router = useRouter();
	const params = useSearchParams();

	const handleSelectChange = (event) => {
		setSelectedOption(event.target.value);

		let currentQuery = {};
		if (params) {
			currentQuery = qs.parse(params.toString());
		}

		const updatedQuery = {
			...currentQuery,
			category: event.target.value,
		};

		const url = qs.stringifyUrl(
			{
				url: "/listings",
				query: updatedQuery,
			},
			{ skipNull: true }
		);
		router.push(url);
	};
	return (
		<div className="section-title-rights">
			<ul className="nav nav-tabs featured-tabs list-grid">
				<li className="nav-item">
					<select
						value={selectedOption}
						onChange={handleSelectChange}
						className="form-select form-control"
					>
						<option value="">Select Category</option>
						{categories.map((cat) => (
							<option key={cat.label} value={cat.value}>
								{cat.label}
							</option>
						))}
					</select>
				</li>
				<li className="nav-item" role="presentation">
					<button
						className={`nav-link ${
							listStyle === "grid" && "active"
						}`}
						type="button"
						onClick={() => onStyle("grid")}
					>
						<Image width="24" height="24" src={grid} alt="grid" />
					</button>
				</li>
				<li className="nav-item" role="presentation">
					<button
						className={`nav-link ${
							listStyle === "list" && "active"
						}`}
						type="button"
						onClick={() => onStyle("list")}
					>
						<Image width="24" height="24" src={list} alt="list" />
					</button>
				</li>
			</ul>
		</div>
	);
};

export default CategorySearch;

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
		<div className="section-title-rights" style={{ position: "relative" }}>
			<ul className="nav nav-tabs featured-tabs list-grid" style={{ position: "relative", zIndex: 1 }}>
				<li className="nav-item" style={{ position: "relative", zIndex: 1, marginTop: "0" }}>
					<select
						value={selectedOption}
						onChange={handleSelectChange}
						className="form-select form-control"
						style={{
							position: "relative",
							zIndex: 1,
							appearance: "none",
							WebkitAppearance: "none",
							MozAppearance: "none",
							backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23717171' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "right 12px center",
							backgroundSize: "12px",
							paddingRight: "36px",
							cursor: "pointer",
							marginTop: "0",
						}}
					>
						<option value="">Select Category</option>
						{categories.map((cat) => (
							<option key={cat.label} value={cat.value}>
								{cat.label}
							</option>
						))}
					</select>
				</li>
			</ul>
		</div>
	);
};

export default CategorySearch;

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PaginationBar = ({ totalPages, searchParams: { page: currentPage } }) => {
	const router = useRouter();

	return (
		<div className="col-lg-12">
			<div className="pagination-area">
				<button
					onClick={() =>
						router.push(
							`/listings/?page=${parseInt(currentPage) - 1}`
						)
					}
					className="next page-numbers"
					disabled={
						parseInt(currentPage) === 1 ||
						isNaN(parseInt(currentPage))
					}
				>
					<i className="ri-arrow-left-line"></i>
				</button>
				{Array.from(
					{ length: totalPages },
					(_, index) => index + 1
				).map((page) => (
					<Link
						href={`/listings?page=${page}`}
						key={page}
						className={`page-numbers ${
							page === parseInt(currentPage) ? "current" : ""
						}`}
					>
						{page}
					</Link>
				))}

				{parseInt(currentPage) < totalPages ? (
					<button
						onClick={() =>
							router.push(
								`/listings/?page=${parseInt(currentPage) + 1}`
							)
						}
						className="next page-numbers"
					>
						<i className="ri-arrow-right-line"></i>
					</button>
				) : (
					<button className="next page-numbers" disabled={true}>
						<i className="ri-arrow-right-line"></i>
					</button>
				)}
			</div>
		</div>
	);
};

export default PaginationBar;

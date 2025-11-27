"use client";
import React, { useState } from "react";
import CategorySearch from "./CategorySearch";
import PaginationBar from "./PaginationBar";
import GridStyle from "./GridStyle";
import ListStyle from "./ListStyle";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";

const Index = ({
	currentUser,
	listings,
	totalPages,
	searchParams,
	totalCount,
	startListingNumber,
	endListingNumber,
}) => {
	const [listStyle, setListStyle] = useState("grid");
	const { language, isDetecting } = useLanguage();
	const displayLanguage = isDetecting ? "en" : language;

	return (
		<div
			style={{
				backgroundColor: "transparent",
				paddingTop: "0",
				paddingBottom: "0",
				minHeight: "auto",
			}}
		>
			<div style={{ maxWidth: "100%", margin: "0 auto", padding: "0" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "32px",
						flexWrap: "wrap",
						gap: "16px",
					}}
				>
					<div>
						{totalCount === 0 ? (
							<p
								style={{
									fontSize: "18px",
									color: "#717171",
									margin: 0,
								}}
							>
								<span style={{ fontWeight: "600", color: "#222222" }}>
									0
								</span>{" "}
							{getTranslation(displayLanguage, "listings.propertiesFound")}
							</p>
						) : (
							<p
								style={{
									fontSize: "18px",
									color: "#717171",
									margin: 0,
								}}
							>
								<span style={{ fontWeight: "600", color: "#222222" }}>
									{startListingNumber} - {endListingNumber}
								</span>{" "}
							{getTranslation(displayLanguage, "listings.ofProperties", { count: totalCount })}
							</p>
						)}
					</div>

					<CategorySearch
						listStyle={listStyle}
						onStyle={setListStyle}
					/>
				</div>
			</div>

			<div className="container">
				<div className="tab-content">
					<div className="tab-pane fade show active">
						<div className="row">
							{listStyle === "grid" ? (
								listings.length > 0 ? (
									listings.map((list) => (
										<GridStyle
											currentUser={currentUser}
											key={list.id}
										displayLanguage={displayLanguage}
											{...list}
										/>
									))
								) : (
									<div className="col-lg-12">
										<div
											style={{
												textAlign: "center",
												padding: "80px 20px",
											}}
										>
											<svg
												width="64"
												height="64"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#dddddd"
												strokeWidth="1.5"
												style={{ marginBottom: "16px" }}
											>
												<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
												<circle cx="12" cy="10" r="3"></circle>
											</svg>
											<h3
												style={{
													fontSize: "20px",
													fontWeight: "600",
													color: "#222222",
													marginBottom: "8px",
												}}
											>
												No properties found
											</h3>
											<p style={{ color: "#717171", margin: 0 }}>
												Try adjusting your search filters
											</p>
										</div>
									</div>
								)
							) : listings.length > 0 ? (
								listings.map((list) => (
									<ListStyle
										currentUser={currentUser}
										key={list.id}
									displayLanguage={displayLanguage}
										{...list}
									/>
								))
							) : (
								<div className="col-lg-12">
									<div
										style={{
											textAlign: "center",
											padding: "80px 20px",
										}}
									>
										<svg
											width="64"
											height="64"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#dddddd"
											strokeWidth="1.5"
											style={{ marginBottom: "16px" }}
										>
											<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
											<circle cx="12" cy="10" r="3"></circle>
										</svg>
										<h3
											style={{
												fontSize: "20px",
												fontWeight: "600",
												color: "#222222",
												marginBottom: "8px",
											}}
										>
											{getTranslation(displayLanguage, "listings.noPropertiesFound")}
										</h3>
										<p style={{ color: "#717171", margin: 0 }}>
											{getTranslation(displayLanguage, "listings.tryAdjustingFilters")}
										</p>
									</div>
								</div>
							)}
							{totalPages > 1 && (
								<div className="col-lg-12" style={{ marginTop: "40px" }}>
									<PaginationBar
										totalPages={totalPages}
										searchParams={searchParams}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;

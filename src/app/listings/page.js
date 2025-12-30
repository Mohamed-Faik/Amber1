import React from "react";
import { Search, LayoutGrid } from "lucide-react";
import ListingsWithLoading from "@/components/Listings/ListingsWithLoading";
import ExperiencesStyleSearchForm from "@/components/Listings/ExperiencesStyleSearchForm";
import ListingFilters from "@/components/Listings/ListingFilters";
import getListings from "@/actions/getListings";
import { getCurrentUser } from "@/actions/getCurrentUser";

export const dynamic = "force-dynamic";

const page = async ({ searchParams }) => {
	const {
		listings,
		totalPages,
		startListingNumber,
		endListingNumber,
		totalListings: totalCount,
	} = await getListings({ ...searchParams, featureType: "HOMES" });
	const currentUser = await getCurrentUser();

	return (
		<div className="listings-page-container" style={{
			backgroundColor: "#FAFAFA",
			minHeight: "100vh",
			position: "relative",
			overflow: "hidden",
		}}>
			{/* Decorative Background Elements */}
			<div style={{
				position: "absolute",
				top: "-200px",
				right: "-200px",
				width: "600px",
				height: "600px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(255, 56, 92, 0.05) 0%, rgba(230, 30, 77, 0.08) 100%)",
				zIndex: 0,
			}} />
			<div style={{
				position: "absolute",
				bottom: "-250px",
				left: "-250px",
				width: "700px",
				height: "700px",
				borderRadius: "50%",
				background: "linear-gradient(135deg, rgba(215, 4, 102, 0.05) 0%, rgba(255, 56, 92, 0.08) 100%)",
				zIndex: 0,
			}} />

			<div style={{ height: "80px" }} />

			{/* Search Form Section - Styled */}
			<div className="listings-search-section" style={{
				position: "relative",
				zIndex: 10,
				marginBottom: "48px",
			}}>
				<div className="listings-search-wrapper" style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: "0 10px",
					display: "flex",
					justifyContent: "center",
				}}>
					<ExperiencesStyleSearchForm searchParams={searchParams} />
				</div>
			</div>

			{/* Listings Section */}
			<div className="listings-results-section" style={{
				position: "relative",
				zIndex: 1,
				paddingBottom: "48px",
			}}>
				<div className="listings-results-wrapper" style={{
					maxWidth: "1760px",
					margin: "0 auto",
					padding: "0 10px",
				}}>
					<div className="listings-results-card" style={{
						backgroundColor: "#FFFFFF",
						borderRadius: "16px",
						padding: "40px",
						boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
						border: "1px solid #E0E0E0",
					}}>
						{/* Header */}
						<div style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: "32px",
							paddingBottom: "24px",
							borderBottom: "1px solid #E0E0E0",
						}}>
							<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
								<div style={{
									width: "44px",
									height: "44px",
									borderRadius: "12px",
									background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}>
									<LayoutGrid size={22} color="#FFFFFF" strokeWidth={2.5} />
								</div>
								<h2 style={{
									fontSize: "28px",
									fontWeight: "700",
									color: "#222222",
									margin: "0",
									letterSpacing: "-0.5px",
								}}>
									Available Properties
								</h2>
							</div>

							<ListingFilters searchParams={searchParams} />
						</div>

						<ListingsWithLoading
							currentUser={currentUser}
							totalPages={totalPages}
							listings={listings}
							searchParams={searchParams}
							totalCount={totalCount}
							startListingNumber={startListingNumber}
							endListingNumber={endListingNumber}
						/>
					</div>
				</div>
			</div >
		</div >
	);
};

export default page;

import React from "react";
import { redirect } from "next/navigation";
import PageBanner from "@/components/Common/PageBanner";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getReviews from "@/actions/getReviews";
import ReviewCard from "./ReviewCard";
import LeftSidebar from "@/components/Dashboard/LeftSidebar";

export const dynamic = 'force-dynamic';

const page = async () => {
	const reviews = await getReviews();
	const currentUser = await getCurrentUser();
	const { isModerator } = await import("@/utils/checkRole");
	
	if (!isModerator(currentUser)) {
		redirect("/");
	}
	return (
		<>
			<div
				style={{
					backgroundColor: "#F9FAFB",
					minHeight: "100vh",
					paddingTop: "24px",
					paddingBottom: "48px",
				}}
			>
				<div className="container">
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "280px 1fr",
							gap: "24px",
							alignItems: "start",
						}}
					>
						<LeftSidebar />

						<div>
							<div
								style={{
									marginBottom: "24px",
								}}
							>
								<h1
									style={{
										fontSize: "32px",
										fontWeight: "700",
										color: "#111827",
										marginBottom: "8px",
									}}
								>
									Reviews Management
								</h1>
								<p
									style={{
										fontSize: "16px",
										color: "#6B7280",
										margin: 0,
									}}
								>
									Monitor and manage user reviews
								</p>
							</div>

							<ReviewCard reviews={reviews} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default page;

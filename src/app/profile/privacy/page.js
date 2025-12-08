import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { hasAdminAccess } from "@/utils/checkRole";
import getPendingListingsCount from "@/actions/getPendingListingsCount";
import PageBanner from "@/components/Common/PageBanner";
import PrivacySettings from "@/components/Profile/PrivacySettings";
import LeftSidebar from "@/components/Dashboard/LeftSidebar";

export const dynamic = "force-dynamic";

const PrivacyPage = async () => {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		redirect("/auth/signin");
	}

	// Get pending listings count if user is admin
	const pendingListingsCount = hasAdminAccess(currentUser) 
		? await getPendingListingsCount() 
		: 0;

	return (
		<>
			<PageBanner pageTitle="Privacy Settings" />
			
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
						<LeftSidebar pendingListingsCount={pendingListingsCount} />
						
						<div>
							<PrivacySettings currentUser={currentUser} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PrivacyPage;


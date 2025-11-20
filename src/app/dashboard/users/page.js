import React from "react";
import { redirect } from "next/navigation";
import PageBanner from "@/components/Common/PageBanner";
import UsersCard from "./UsersCard";
import { getCurrentUser } from "@/actions/getCurrentUser";
import getAllUsers from "@/actions/getAllUser";
import LeftSidebar from "@/components/Dashboard/LeftSidebar";

const page = async () => {
	const users = await getAllUsers();
	const currentUser = await getCurrentUser();
	const { isAdmin } = await import("@/utils/checkRole");
	
	if (!isAdmin(currentUser)) {
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
									Users Management
								</h1>
								<p
									style={{
										fontSize: "16px",
										color: "#6B7280",
										margin: 0,
									}}
								>
									View and manage all registered users
								</p>
							</div>

							<UsersCard users={users} currentUser={currentUser} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default page;

import React, { Suspense } from "react";
import AuthorDetails from "@/components/Author/AuthorDetails";
import getUserById from "@/actions/getUserById";
import UserListing from "@/components/Author/UserListing";
import { getCurrentUser } from "@/actions/getCurrentUser";

export const dynamic = "force-dynamic";

const page = async ({ params }) => {
	const user = await getUserById(params);
	const currentUser = await getCurrentUser();

	// Check if user exists
	if (!user) {
		return (
			<div style={{
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
				<div style={{
					maxWidth: "1400px",
					margin: "0 auto",
					padding: "64px 32px",
					position: "relative",
					zIndex: 1,
				}}>
					<div style={{
						backgroundColor: "#ffffff",
						borderRadius: "16px",
						padding: "48px 32px",
						textAlign: "center",
						boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
					}}>
						<h2 style={{
							fontSize: "24px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
						}}>
							Author Not Found
						</h2>
						<p style={{
							fontSize: "16px",
							color: "#717171",
							margin: 0,
						}}>
							The author you are looking for does not exist.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div style={{
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
			<Suspense fallback={
				<div style={{
					padding: "64px 32px",
					textAlign: "center",
					position: "relative",
					zIndex: 1,
				}}>
					<div style={{
						display: "inline-block",
						width: "40px",
						height: "40px",
						border: "3px solid #FF385C",
						borderTopColor: "transparent",
						borderRadius: "50%",
						animation: "spin 0.8s linear infinite",
					}} />
					<style jsx>{`
						@keyframes spin {
							from { transform: rotate(0deg); }
							to { transform: rotate(360deg); }
						}
					`}</style>
				</div>
			}>
				<div style={{ position: "relative", zIndex: 1 }}>
					<AuthorDetails user={user} />
					
					<UserListing
						listings={user?.listings && user.listings || []}
						user={user?.name || "Unknown User"}
						currentUser={currentUser}
					/>
				</div>
			</Suspense>
		</div>
	);
};

export default page;

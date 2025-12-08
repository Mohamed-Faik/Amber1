"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const ForgotPasswordForm = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!email || !email.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsLoading(true);

		try {
			const response = await axios.post("/api/auth/forgot-password", {
				email,
			});

			if (response.data.success) {
				setIsSuccess(true);
				toast.success("Password reset link sent to your email!");
			} else {
				toast.error(response.data.error || "Failed to send reset link");
			}
		} catch (error) {
			const errorMessage = error.response?.data?.error || "Failed to send reset link. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div style={{
			minHeight: "100vh",
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
		}}>
			{/* Left Side - Form */}
			<div style={{
				backgroundColor: "#FFFFFF",
				display: "flex",
				flexDirection: "column",
				padding: "40px 60px",
			}}>
				{/* Back Arrow */}
				{!isSuccess && (
					<div style={{ marginBottom: "auto" }}>
						<button
							onClick={() => router.push("/auth/signin")}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: "8px",
								marginLeft: "-8px",
							}}
						>
							<ArrowLeft size={24} color="#222222" />
						</button>
					</div>
				)}

				{/* Main Content */}
				<div style={{
					maxWidth: "460px",
					width: "100%",
					margin: "0 auto",
					display: "flex",
					flexDirection: "column",
					justifyContent: isSuccess ? "center" : "flex-start",
					minHeight: isSuccess ? "calc(100vh - 160px)" : "auto",
				}}>
					{isSuccess ? (
						<>
							{/* Success State - Simple and Centered */}
							<div style={{
								textAlign: "center",
							}}>
								{/* Success Icon */}
								<div style={{
									width: "64px",
									height: "64px",
									borderRadius: "50%",
									backgroundColor: "#10b981",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: "0 auto 24px",
								}}>
									<svg 
										width="32" 
										height="32" 
										viewBox="0 0 24 24" 
										fill="none" 
										stroke="#ffffff" 
										strokeWidth="3"
									>
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								</div>

								<h1 style={{
									fontSize: "32px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "12px",
									lineHeight: "1.2",
								}}>
									Check your email
								</h1>
								
								<p style={{
									fontSize: "16px",
									color: "#767676",
									lineHeight: "1.5",
									marginBottom: "32px",
								}}>
									We've sent a password reset link to <strong>{email}</strong>
								</p>

								<div style={{
									display: "flex",
									gap: "12px",
									justifyContent: "center",
									flexWrap: "wrap",
								}}>
									<button
										onClick={() => {
											setIsSuccess(false);
											setEmail("");
										}}
										style={{
											padding: "12px 24px",
											backgroundColor: "#ffffff",
											border: "1px solid #E0E0E0",
											borderRadius: "8px",
											color: "#222222",
											fontSize: "15px",
											fontWeight: "500",
											cursor: "pointer",
											transition: "all 0.2s",
										}}
										onMouseEnter={(e) => {
											e.target.style.borderColor = "#222222";
											e.target.style.backgroundColor = "#F8F8F8";
										}}
										onMouseLeave={(e) => {
											e.target.style.borderColor = "#E0E0E0";
											e.target.style.backgroundColor = "#ffffff";
										}}
									>
										Try again
									</button>
									<Link
										href="/auth/signin"
										style={{
											padding: "12px 24px",
											background: "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)",
											borderRadius: "8px",
											color: "#ffffff",
											fontSize: "15px",
											fontWeight: "600",
											textDecoration: "none",
											transition: "all 0.2s",
											display: "inline-block",
										}}
										onMouseEnter={(e) => {
											e.target.style.background = "linear-gradient(to right, #D01346 0%, #C7124D 50%, #B0035C 100%)";
										}}
										onMouseLeave={(e) => {
											e.target.style.background = "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)";
										}}
									>
										Back to Sign In
									</Link>
								</div>
							</div>
						</>
					) : (
						<>
							{/* Form State */}
							<div style={{ marginBottom: "40px" }}>
								<h1 style={{
									fontSize: "32px",
									fontWeight: "600",
									color: "#222222",
									marginBottom: "12px",
									lineHeight: "1.2",
								}}>
									Forgot your password?
								</h1>
								<p style={{
									fontSize: "16px",
									color: "#767676",
									lineHeight: "1.5",
								}}>
									No worries! Enter your email address and we'll send you a link to reset your password.
								</p>
							</div>

							<form onSubmit={handleSubmit}>
								{/* Email Input */}
								<div style={{ marginBottom: "24px" }}>
									<input
										type="email"
										placeholder="Email address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={isLoading}
										style={{
											width: "100%",
											padding: "14px 16px",
											border: "1px solid #E0E0E0",
											borderRadius: "8px",
											fontSize: "16px",
											outline: "none",
											transition: "all 0.2s",
											opacity: isLoading ? 0.6 : 1,
										}}
										onFocus={(e) => e.currentTarget.style.borderColor = "#E61E4D"}
										onBlur={(e) => e.currentTarget.style.borderColor = "#E0E0E0"}
									/>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={isLoading || !email.includes("@")}
									style={{
										width: "100%",
										padding: "14px 20px",
										background: "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)",
										color: "#FFFFFF",
										border: "none",
										borderRadius: "8px",
										fontSize: "16px",
										fontWeight: "600",
										cursor: isLoading || !email.includes("@") ? "not-allowed" : "pointer",
										opacity: isLoading || !email.includes("@") ? 0.5 : 1,
										transition: "all 0.2s",
									}}
									onMouseOver={(e) => {
										if (!isLoading && email.includes("@")) {
											e.currentTarget.style.background = "linear-gradient(to right, #D01346 0%, #C7124D 50%, #B0035C 100%)";
										}
									}}
									onMouseOut={(e) => {
										if (!isLoading && email.includes("@")) {
											e.currentTarget.style.background = "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)";
										}
									}}
								>
									{isLoading ? "Sending..." : "Send reset link"}
								</button>
							</form>

							{/* Back to Sign In Link */}
							<div style={{
								textAlign: "center",
								marginTop: "32px",
							}}>
								<p style={{
									fontSize: "15px",
									color: "#767676",
								}}>
									Remember your password?{" "}
									<Link href="/auth/signin" style={{
										color: "#E61E4D",
										textDecoration: "none",
										fontWeight: "500",
									}}>
										Sign in
									</Link>
								</p>
							</div>
						</>
					)}
				</div>

				{/* Footer Links */}
				{!isSuccess && (
					<div style={{
						display: "flex",
						gap: "24px",
						justifyContent: "center",
						paddingTop: "40px",
					}}>
						<button style={{
							background: "none",
							border: "none",
							color: "#717171",
							fontSize: "14px",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							padding: 0,
						}}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
								<circle cx="12" cy="12" r="10"/>
								<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
								<path d="M2 12h20"/>
							</svg>
							English
						</button>
						<button style={{
							background: "none",
							border: "none",
							color: "#717171",
							fontSize: "14px",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							padding: 0,
						}}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
								<circle cx="12" cy="12" r="10"/>
								<path d="M12 16v-4M12 8h.01"/>
							</svg>
							Help and support
						</button>
					</div>
				)}
			</div>

			{/* Right Side - Image */}
			<div style={{
				position: "relative",
				overflow: "hidden",
				height: "100vh",
			}}>
				<img 
					src="https://www.fresha.com/assets/_next/static/images/Image5-db2e8204dd7d58aedfee81f58fb0c570.webp"
					alt="AmberHomes"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						objectPosition: "center",
					}}
				/>
			</div>
		</div>
	);
};

export default ForgotPasswordForm;


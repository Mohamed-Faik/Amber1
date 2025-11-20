"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const ResetPasswordForm = () => {
	const router = useRouter();
	const params = useParams();
	const token = params?.token;
	
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isValidating, setIsValidating] = useState(true);
	const [isValid, setIsValid] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	useEffect(() => {
		// Validate token on mount
		if (!token) {
			setIsValidating(false);
			setIsValid(false);
			return;
		}

		// We'll validate the token when the form is submitted
		// For now, just check if token exists
		setIsValidating(false);
		setIsValid(true);
	}, [token]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!password || password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setIsLoading(true);

		try {
			const response = await axios.post("/api/auth/reset-password", {
				token,
				password,
			});

			if (response.data.success) {
				setIsSuccess(true);
				toast.success("Password reset successfully!");
				
				// Redirect to sign in after 2 seconds
				setTimeout(() => {
					router.push("/auth/signin");
				}, 2000);
			} else {
				toast.error(response.data.error || "Failed to reset password");
			}
		} catch (error) {
			const errorMessage = error.response?.data?.error || "Failed to reset password. Please try again.";
			toast.error(errorMessage);
			
			// If token is invalid or expired, redirect to forgot password
			if (error.response?.status === 400) {
				setTimeout(() => {
					router.push("/auth/forgot-password");
				}, 3000);
			}
		} finally {
			setIsLoading(false);
		}
	};

	if (isValidating) {
		return (
			<div style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}>
				<div style={{
					textAlign: "center",
				}}>
					<div style={{
						display: "inline-block",
						width: "40px",
						height: "40px",
						border: "3px solid #E61E4D",
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
			</div>
		);
	}

	if (!isValid || !token) {
		return (
			<div style={{
				minHeight: "100vh",
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
			}}>
				<div style={{
					backgroundColor: "#FFFFFF",
					display: "flex",
					flexDirection: "column",
					padding: "40px 60px",
					justifyContent: "center",
				}}>
					<div style={{
						maxWidth: "460px",
						width: "100%",
						margin: "0 auto",
						textAlign: "center",
					}}>
						<div style={{
							width: "64px",
							height: "64px",
							borderRadius: "50%",
							backgroundColor: "#ef4444",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "0 auto 24px",
						}}>
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</div>
						<h1 style={{
							fontSize: "32px",
							fontWeight: "600",
							color: "#222222",
							marginBottom: "12px",
							lineHeight: "1.2",
						}}>
							Invalid Reset Link
						</h1>
						<p style={{
							fontSize: "16px",
							color: "#767676",
							lineHeight: "1.5",
							marginBottom: "32px",
						}}>
							This password reset link is invalid or has expired. Please request a new one.
						</p>
						<Link
							href="/auth/forgot-password"
							style={{
								display: "inline-block",
								padding: "14px 32px",
								background: "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)",
								color: "#FFFFFF",
								textDecoration: "none",
								borderRadius: "8px",
								fontSize: "16px",
								fontWeight: "600",
							}}
						>
							Request New Reset Link
						</Link>
					</div>
				</div>
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
	}

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

				{/* Main Content */}
				<div style={{
					maxWidth: "460px",
					width: "100%",
					margin: "0 auto",
				}}>
					{isSuccess ? (
						<>
							{/* Success State */}
							<div style={{ marginBottom: "40px" }}>
								<div style={{
									width: "64px",
									height: "64px",
									borderRadius: "50%",
									backgroundColor: "#10b981",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									marginBottom: "24px",
								}}>
									<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
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
									Password reset successful!
								</h1>
								<p style={{
									fontSize: "16px",
									color: "#767676",
									lineHeight: "1.5",
								}}>
									Your password has been reset successfully. Redirecting you to sign in...
								</p>
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
									Reset your password
								</h1>
								<p style={{
									fontSize: "16px",
									color: "#767676",
									lineHeight: "1.5",
								}}>
									Enter your new password below.
								</p>
							</div>

							<form onSubmit={handleSubmit}>
								{/* Password Input */}
								<div style={{ marginBottom: "16px" }}>
									<input
										type="password"
										placeholder="New password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
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

								{/* Confirm Password Input */}
								<div style={{ marginBottom: "24px" }}>
									<input
										type="password"
										placeholder="Confirm new password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
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
									disabled={isLoading || !password || password.length < 6 || password !== confirmPassword}
									style={{
										width: "100%",
										padding: "14px 20px",
										background: "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)",
										color: "#FFFFFF",
										border: "none",
										borderRadius: "8px",
										fontSize: "16px",
										fontWeight: "600",
										cursor: isLoading || !password || password.length < 6 || password !== confirmPassword ? "not-allowed" : "pointer",
										opacity: isLoading || !password || password.length < 6 || password !== confirmPassword ? 0.5 : 1,
										transition: "all 0.2s",
									}}
									onMouseOver={(e) => {
										if (!isLoading && password && password.length >= 6 && password === confirmPassword) {
											e.currentTarget.style.background = "linear-gradient(to right, #D01346 0%, #C7124D 50%, #B0035C 100%)";
										}
									}}
									onMouseOut={(e) => {
										if (!isLoading && password && password.length >= 6 && password === confirmPassword) {
											e.currentTarget.style.background = "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)";
										}
									}}
								>
									{isLoading ? "Resetting..." : "Reset password"}
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

export default ResetPasswordForm;


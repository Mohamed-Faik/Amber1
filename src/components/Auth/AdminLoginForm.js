"use client";
import React, { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft, Shield, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

const AdminLoginForm = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleAdminLogin = async (e) => {
		e.preventDefault();
		
		if (!email || !email.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}
		if (!password || password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}

		setIsLoading(true);

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				toast.error("Invalid email or password");
				setIsLoading(false);
				return;
			}

			// Wait a moment for session to update, then check if user is admin
			await new Promise((resolve) => setTimeout(resolve, 500));
			
			const response = await fetch("/api/auth/session");
			const session = await response.json();
			
			if (session?.user?.role !== "ADMIN") {
				// Sign out the user if they're not admin
				await signOut({ redirect: false });
				toast.error("Access denied. Admin privileges required.");
				setIsLoading(false);
				return;
			}

			toast.success("Welcome back, Admin!");
			router.refresh();
			router.push("/administrator");
		} catch (error) {
			console.error("Login error:", error);
			toast.error("Login failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div style={{
			minHeight: "100vh",
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			position: "relative",
		}}>
			{/* Left Side - Form */}
			<div style={{
				backgroundColor: "#FAFAFA",
				display: "flex",
				flexDirection: "column",
				padding: "48px 80px",
				position: "relative",
				overflow: "hidden",
			}}>
				{/* Decorative Background Elements */}
				<div style={{
					position: "absolute",
					top: "-100px",
					right: "-100px",
					width: "400px",
					height: "400px",
					borderRadius: "50%",
					background: "linear-gradient(135deg, rgba(255, 56, 92, 0.05) 0%, rgba(230, 30, 77, 0.08) 100%)",
					zIndex: 0,
				}} />
				<div style={{
					position: "absolute",
					bottom: "-150px",
					left: "-150px",
					width: "500px",
					height: "500px",
					borderRadius: "50%",
					background: "linear-gradient(135deg, rgba(215, 4, 102, 0.05) 0%, rgba(255, 56, 92, 0.08) 100%)",
					zIndex: 0,
				}} />

				{/* Back Arrow */}
				<div style={{ marginBottom: "auto", position: "relative", zIndex: 1 }}>
					<button
						onClick={() => window.history.back()}
						style={{
							background: "rgba(255, 255, 255, 0.9)",
							border: "1px solid #E0E0E0",
							borderRadius: "50%",
							cursor: "pointer",
							padding: "10px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							transition: "all 0.2s",
							boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = "#FFFFFF";
							e.currentTarget.style.borderColor = "#FF385C";
							e.currentTarget.style.transform = "translateX(-2px)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
							e.currentTarget.style.borderColor = "#E0E0E0";
							e.currentTarget.style.transform = "translateX(0)";
						}}
					>
						<ArrowLeft size={20} color="#222222" />
					</button>
				</div>

				{/* Main Content */}
				<div style={{
					maxWidth: "480px",
					width: "100%",
					margin: "0 auto",
					position: "relative",
					zIndex: 1,
				}}>
					{/* Header */}
					<div style={{ marginBottom: "48px" }}>
						<div style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							marginBottom: "20px",
						}}>
							<div style={{
								width: "56px",
								height: "56px",
								borderRadius: "16px",
								background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								boxShadow: "0 8px 24px rgba(255, 56, 92, 0.25)",
								position: "relative",
							}}>
								<Shield size={28} color="#FFFFFF" strokeWidth={2.5} />
								<div style={{
									position: "absolute",
									top: "-4px",
									right: "-4px",
									width: "20px",
									height: "20px",
									borderRadius: "50%",
									background: "#222222",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
								}}>
									<Sparkles size={10} color="#FFFFFF" />
								</div>
							</div>
							<div>
								<h1 style={{
									fontSize: "36px",
									fontWeight: "700",
									color: "#222222",
									margin: "0 0 4px 0",
									lineHeight: "1.1",
									letterSpacing: "-0.5px",
								}}>
									Admin Portal
								</h1>
								<p style={{
									fontSize: "15px",
									color: "#717171",
									margin: "0",
									fontWeight: "500",
								}}>
									Secure Access
								</p>
							</div>
						</div>
						<p style={{
							fontSize: "16px",
							color: "#767676",
							lineHeight: "1.6",
							margin: "0",
						}}>
							Sign in to manage your platform, review content, and oversee operations.
						</p>
					</div>

					{/* Email/Password Form */}
					<form onSubmit={handleAdminLogin}>
						{/* Email Input */}
						<div style={{ marginBottom: "20px" }}>
							<label style={{
								display: "block",
								fontSize: "14px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "8px",
							}}>
								Email Address
							</label>
							<div style={{ position: "relative" }}>
								<Mail 
									size={20} 
									color="#717171" 
									style={{
										position: "absolute",
										left: "16px",
										top: "50%",
										transform: "translateY(-50%)",
										zIndex: 1,
									}} 
								/>
								<input
									type="email"
									placeholder="admin@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isLoading}
									required
									style={{
										width: "100%",
										padding: "16px 16px 16px 48px",
										border: "2px solid #E0E0E0",
										borderRadius: "12px",
										fontSize: "15px",
										outline: "none",
										transition: "all 0.2s",
										opacity: isLoading ? 0.6 : 1,
										backgroundColor: "#FFFFFF",
										fontWeight: "500",
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = "#FF385C";
										e.currentTarget.style.boxShadow = "0 0 0 4px rgba(255, 56, 92, 0.1)";
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = "#E0E0E0";
										e.currentTarget.style.boxShadow = "none";
									}}
								/>
							</div>
						</div>

						{/* Password Input */}
						<div style={{ marginBottom: "28px" }}>
							<label style={{
								display: "block",
								fontSize: "14px",
								fontWeight: "600",
								color: "#222222",
								marginBottom: "8px",
							}}>
								Password
							</label>
							<div style={{ position: "relative" }}>
								<Lock 
									size={20} 
									color="#717171" 
									style={{
										position: "absolute",
										left: "16px",
										top: "50%",
										transform: "translateY(-50%)",
										zIndex: 1,
									}} 
								/>
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isLoading}
									required
									style={{
										width: "100%",
										padding: "16px 48px 16px 48px",
										border: "2px solid #E0E0E0",
										borderRadius: "12px",
										fontSize: "15px",
										outline: "none",
										transition: "all 0.2s",
										opacity: isLoading ? 0.6 : 1,
										backgroundColor: "#FFFFFF",
										fontWeight: "500",
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = "#FF385C";
										e.currentTarget.style.boxShadow = "0 0 0 4px rgba(255, 56, 92, 0.1)";
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = "#E0E0E0";
										e.currentTarget.style.boxShadow = "none";
									}}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									style={{
										position: "absolute",
										right: "16px",
										top: "50%",
										transform: "translateY(-50%)",
										background: "none",
										border: "none",
										cursor: "pointer",
										padding: "4px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#717171",
										transition: "color 0.2s",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.color = "#FF385C";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.color = "#717171";
									}}
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading || !email.includes("@") || !password}
							style={{
								width: "100%",
								padding: "16px 24px",
								background: isLoading || !email.includes("@") || !password 
									? "linear-gradient(to right, #DDDDDD 0%, #CCCCCC 100%)"
									: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
								color: "#FFFFFF",
								border: "none",
								borderRadius: "12px",
								fontSize: "16px",
								fontWeight: "600",
								cursor: isLoading || !email.includes("@") || !password ? "not-allowed" : "pointer",
								transition: "all 0.3s ease",
								boxShadow: isLoading || !email.includes("@") || !password 
									? "none"
									: "0 4px 16px rgba(255, 56, 92, 0.3)",
								position: "relative",
								overflow: "hidden",
							}}
							onMouseEnter={(e) => {
								if (!isLoading && email.includes("@") && password) {
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 56, 92, 0.4)";
								}
							}}
							onMouseLeave={(e) => {
								if (!isLoading && email.includes("@") && password) {
									e.currentTarget.style.transform = "translateY(0)";
									e.currentTarget.style.boxShadow = "0 4px 16px rgba(255, 56, 92, 0.3)";
								}
							}}
						>
							{isLoading ? (
								<span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
									<div style={{
										width: "18px",
										height: "18px",
										border: "2px solid #FFFFFF",
										borderTopColor: "transparent",
										borderRadius: "50%",
										animation: "spin 0.8s linear infinite",
									}} />
									Authenticating...
								</span>
							) : (
								<span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
									<Lock size={18} />
									Sign In to Dashboard
								</span>
							)}
						</button>
					</form>

					{/* Security Notice */}
					<div style={{
						marginTop: "32px",
						padding: "20px",
						backgroundColor: "#FFFFFF",
						borderRadius: "12px",
						border: "1px solid #E0E0E0",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
					}}>
						<div style={{
							display: "flex",
							alignItems: "flex-start",
							gap: "12px",
						}}>
							<div style={{
								width: "40px",
								height: "40px",
								borderRadius: "10px",
								background: "linear-gradient(135deg, rgba(255, 56, 92, 0.1) 0%, rgba(230, 30, 77, 0.15) 100%)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
							}}>
								<Shield size={20} color="#FF385C" />
							</div>
							<div>
								<p style={{
									fontSize: "13px",
									color: "#717171",
									margin: "0 0 4px 0",
									lineHeight: "1.5",
									fontWeight: "500",
								}}>
									<strong style={{ color: "#222222" }}>Protected Area</strong>
								</p>
								<p style={{
									fontSize: "12px",
									color: "#767676",
									margin: "0",
									lineHeight: "1.5",
								}}>
									This is a secure admin portal. Only authorized administrators with proper credentials can access this area.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer Links */}
				<div style={{
					display: "flex",
					gap: "32px",
					justifyContent: "center",
					paddingTop: "48px",
					position: "relative",
					zIndex: 1,
				}}>
					<button style={{
						background: "none",
						border: "none",
						color: "#717171",
						fontSize: "14px",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: "8px",
						padding: "8px 12px",
						borderRadius: "8px",
						transition: "all 0.2s",
						fontWeight: "500",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.color = "#222222";
						e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.04)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.color = "#717171";
						e.currentTarget.style.backgroundColor = "transparent";
					}}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
						gap: "8px",
						padding: "8px 12px",
						borderRadius: "8px",
						transition: "all 0.2s",
						fontWeight: "500",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.color = "#222222";
						e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.04)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.color = "#717171";
						e.currentTarget.style.backgroundColor = "transparent";
					}}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<circle cx="12" cy="12" r="10"/>
							<path d="M12 16v-4M12 8h.01"/>
						</svg>
						Help & Support
					</button>
				</div>

				{/* CSS Animation */}
				<style jsx>{`
					@keyframes spin {
						from {
							transform: rotate(0deg);
						}
						to {
							transform: rotate(360deg);
						}
					}
				`}</style>
			</div>

			{/* Right Side - Image with Gradient Overlay */}
			<div style={{
				position: "relative",
				overflow: "hidden",
				height: "100vh",
			}}>
				<img 
					src="https://www.fresha.com/assets/_next/static/images/Image3-fd3ccd7b3d9946a42a9baf567e5cb7eb.webp"
					alt="Admin Panel"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						objectPosition: "center",
					}}
				/>
				{/* Gradient Overlay */}
				<div style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "linear-gradient(135deg, rgba(255, 56, 92, 0.5) 0%, rgba(230, 30, 77, 0.55) 50%, rgba(215, 4, 102, 0.6) 100%)",
					zIndex: 1,
				}} />
				{/* Additional Decorative Elements */}
				<div style={{
					position: "absolute",
					top: "20%",
					right: "10%",
					width: "200px",
					height: "200px",
					borderRadius: "50%",
					background: "rgba(255, 255, 255, 0.1)",
					filter: "blur(60px)",
					zIndex: 2,
				}} />
				<div style={{
					position: "absolute",
					bottom: "15%",
					left: "15%",
					width: "150px",
					height: "150px",
					borderRadius: "50%",
					background: "rgba(255, 255, 255, 0.08)",
					filter: "blur(50px)",
					zIndex: 2,
				}} />
			</div>
		</div>
	);
};

export default AdminLoginForm;


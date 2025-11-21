import nodemailer from "nodemailer";

// Create transporter function to ensure env vars are loaded
function createTransporter() {
	const smtpUser = process.env.SMTP_USER;
	const smtpPass = process.env.SMTP_PASSWORD;
	const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
	const smtpPort = parseInt(process.env.SMTP_PORT || "587");

	console.log("📧 SMTP Configuration:");
	console.log("  Host:", smtpHost);
	console.log("  Port:", smtpPort);
	console.log("  User:", smtpUser ? `${smtpUser.substring(0, 3)}***` : "NOT SET");
	console.log("  Password:", smtpPass ? "***SET***" : "NOT SET");

	if (!smtpUser || !smtpPass) {
		console.error("❌ SMTP credentials not configured!");
		return null;
	}

	return nodemailer.createTransport({
		host: smtpHost,
		port: smtpPort,
		secure: smtpPort === 465, // true for 465, false for other ports
		auth: {
			user: smtpUser,
			pass: smtpPass,
		},
		tls: {
			// Do not fail on invalid certs
			rejectUnauthorized: false,
		},
	});
}

export async function sendOTPEmail(email, otpCode, isSignup = false) {
	try {
		// Create transporter
		const transporter = createTransporter();
		if (!transporter) {
			throw new Error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD environment variables.");
		}

		// Verify connection
		try {
			await transporter.verify();
			console.log("✅ SMTP server connection verified");
		} catch (verifyError) {
			console.error("❌ SMTP verification failed:", verifyError.message);
			throw new Error(`SMTP connection failed: ${verifyError.message}`);
		}

		const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
		const mailOptions = {
			from: `"AmberHomes" <${fromEmail}>`,
			to: email,
			subject: isSignup ? "Your Signup OTP Code - AmberHomes" : "Your Login OTP Code - AmberHomes",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
					<div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
						<h2 style="color: #111827; margin-bottom: 20px;">${isSignup ? "Your Signup OTP Code" : "Your Login OTP Code"}</h2>
						<p style="color: #374151; font-size: 16px; line-height: 1.6;">
							Hello,
						</p>
						<p style="color: #374151; font-size: 16px; line-height: 1.6;">
							${isSignup 
								? "You have requested to create an account. Please use the following OTP code to verify your email:"
								: "You have requested to login to your account. Please use the following OTP code to complete your login:"}
						</p>
						<div style="background-color: #F3F4F6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
							<h1 style="color: #E61E4D; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: 700;">
								${otpCode}
							</h1>
						</div>
						<p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
							This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
						</p>
						<p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
							Best regards,<br>
							AmberHomes Team
						</p>
					</div>
				</div>
			`,
		};

		console.log(`📤 Sending email to: ${email}`);
		const info = await transporter.sendMail(mailOptions);
		console.log("✅ Email sent successfully!");
		console.log("   Message ID:", info.messageId);
		console.log("   Response:", info.response);
		
		return { success: true, messageId: info.messageId, response: info.response };
	} catch (error) {
		console.error("❌ Error sending email:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.code);
		console.error("   Full error:", error);
		
		return { 
			success: false, 
			error: error.message,
			code: error.code,
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
	}
}

export async function sendPasswordResetEmail(email, resetToken) {
	try {
		// Create transporter
		const transporter = createTransporter();
		if (!transporter) {
			throw new Error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD environment variables.");
		}

		// Verify connection
		try {
			await transporter.verify();
			console.log("✅ SMTP server connection verified");
		} catch (verifyError) {
			console.error("❌ SMTP verification failed:", verifyError.message);
			throw new Error(`SMTP connection failed: ${verifyError.message}`);
		}

		const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
		const resetUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://amberhomes-liart.vercel.app/"}/auth/reset-password/${resetToken}`;
		
		const mailOptions = {
			from: `"AmberHomes" <${fromEmail}>`,
			to: email,
			subject: "Reset Your Password - AmberHomes",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
					<div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
						<h2 style="color: #111827; margin-bottom: 20px;">Reset Your Password</h2>
						<p style="color: #374151; font-size: 16px; line-height: 1.6;">
							Hello,
						</p>
						<p style="color: #374151; font-size: 16px; line-height: 1.6;">
							We received a request to reset your password. Click the button below to create a new password:
						</p>
						<div style="text-align: center; margin: 30px 0;">
							<a href="${resetUrl}" style="
								display: inline-block;
								padding: 14px 32px;
								background: linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%);
								color: #ffffff;
								text-decoration: none;
								border-radius: 8px;
								font-weight: 600;
								font-size: 16px;
							">Reset Password</a>
						</div>
						<p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
							Or copy and paste this link into your browser:
						</p>
						<p style="color: #6B7280; font-size: 12px; line-height: 1.6; word-break: break-all; background-color: #F3F4F6; padding: 12px; border-radius: 4px;">
							${resetUrl}
						</p>
						<p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
							This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
						</p>
						<p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
							Best regards,<br>
							AmberHomes Team
						</p>
					</div>
				</div>
			`,
		};

		console.log(`📤 Sending password reset email to: ${email}`);
		const info = await transporter.sendMail(mailOptions);
		console.log("✅ Password reset email sent successfully!");
		console.log("   Message ID:", info.messageId);
		console.log("   Response:", info.response);
		
		return { success: true, messageId: info.messageId, response: info.response };
	} catch (error) {
		console.error("❌ Error sending password reset email:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.code);
		console.error("   Full error:", error);
		
		return { 
			success: false, 
			error: error.message,
			code: error.code,
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		};
	}
}


import nodemailer from "nodemailer";
import { randomBytes } from "crypto";

// Create transporter function to ensure env vars are loaded
function createTransporter() {
	const smtpUser = process.env.SMTP_USER;
	const smtpPass = process.env.SMTP_PASSWORD;
	const smtpHost = process.env.SMTP_HOST || "smtp-relay.brevo.com";
	const smtpPort = parseInt(process.env.SMTP_PORT || "587");

	console.log("📧 SMTP Configuration:");
	console.log("  Host:", smtpHost);
	console.log("  Port:", smtpPort);
	console.log("  User:", smtpUser ? `${smtpUser.substring(0, 3)}***` : "NOT SET");
	console.log("  Password:", smtpPass ? "***SET***" : "NOT SET");
	console.log("  From Email:", process.env.SMTP_FROM || process.env.SMTP_USER || "NOT SET");
	console.log("  Provider:", smtpHost.includes("brevo") ? "✅ Brevo" : smtpHost.includes("gmail") ? "⚠️ Gmail (OLD)" : "❓ Unknown");

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
			// Enable proper TLS validation for better deliverability
			// Set to false only if you're using a self-signed certificate in development
			rejectUnauthorized: process.env.NODE_ENV !== "development",
			minVersion: "TLSv1.2",
		},
		// Additional options for better deliverability
		pool: true,
		maxConnections: 5,
		maxMessages: 100,
	});
}

// Generate a unique Message-ID
function generateMessageId() {
	// Extract domain from SMTP_FROM (preferred) or SMTP_USER
	let domain = "amberhomes.com"; // default fallback
	
	if (process.env.SMTP_FROM) {
		// Extract domain from email like "noreply@yourdomain.com"
		const match = process.env.SMTP_FROM.match(/@(.+)$/);
		if (match) {
			domain = match[1];
		}
	} else if (process.env.SMTP_USER) {
		// Extract domain from SMTP_USER, but skip Brevo format (smtp-brevo.com)
		const match = process.env.SMTP_USER.match(/@(.+)$/);
		if (match && !match[1].includes("smtp-brevo.com")) {
			domain = match[1];
		}
	}
	
	const random = randomBytes(16).toString("hex");
	const timestamp = Date.now();
	return `<${timestamp}.${random}@${domain}>`;
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
		const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://amberhomes-liart.vercel.app";
		const messageId = generateMessageId();
		
		// Log the email being sent for debugging
		console.log("📤 Email Details:");
		console.log("  From:", fromEmail);
		console.log("  To:", email);
		
		// Plain text version (important for deliverability, especially Outlook)
		const plainText = `${isSignup ? "Your Signup OTP Code" : "Your Login OTP Code"}

Hello,

${isSignup 
	? "You have requested to create an account. Please use the following OTP code to verify your email:"
	: "You have requested to login to your account. Please use the following OTP code to complete your login:"}

Your OTP code is: ${otpCode}

This code will expire in 10 minutes. If you didn't request this code, please ignore this email.

Best regards,
AmberHomes Team`;

		// HTML version
		const htmlContent = `
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
		`;

		const mailOptions = {
			from: `"AmberHomes" <${fromEmail}>`,
			to: email,
			subject: isSignup ? "Your Signup OTP Code - AmberHomes" : "Your Login OTP Code - AmberHomes",
			text: plainText, // Plain text version (required for better deliverability)
			html: htmlContent,
			// Proper email headers for better deliverability
			headers: {
				"Message-ID": messageId,
				"Date": new Date().toUTCString(),
				"Reply-To": fromEmail,
				"X-Mailer": "AmberHomes",
				"X-Priority": "1", // High priority for OTP emails
				"Importance": "high",
				"List-Unsubscribe": `<${appUrl}/unsubscribe>`, // Helps with spam filtering
				"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
				"X-Entity-Ref-ID": randomBytes(8).toString("hex"), // Unique identifier
			},
			// Additional options for better deliverability
			priority: "high",
			envelope: {
				from: fromEmail,
				to: email,
			},
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
		const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://amberhomes-liart.vercel.app";
		const resetUrl = `${appUrl}/auth/reset-password/${resetToken}`;
		const messageId = generateMessageId();

		// Plain text version
		const plainText = `Reset Your Password

Hello,

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.

Best regards,
AmberHomes Team`;

		// HTML version
		const htmlContent = `
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
		`;
		
		const mailOptions = {
			from: `"AmberHomes" <${fromEmail}>`,
			to: email,
			subject: "Reset Your Password - AmberHomes",
			text: plainText,
			html: htmlContent,
			// Proper email headers for better deliverability
			headers: {
				"Message-ID": messageId,
				"Date": new Date().toUTCString(),
				"Reply-To": fromEmail,
				"X-Mailer": "AmberHomes",
				"X-Priority": "1",
				"Importance": "high",
				"List-Unsubscribe": `<${appUrl}/unsubscribe>`,
				"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
				"X-Entity-Ref-ID": randomBytes(8).toString("hex"),
			},
			priority: "high",
			envelope: {
				from: fromEmail,
				to: email,
			},
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


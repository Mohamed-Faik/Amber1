import axios from 'axios';

// Get Infobip configuration
function getInfobipConfig() {
	const apiKey = process.env.INFOBIP_API_KEY;
	const baseUrl = process.env.INFOBIP_BASE_URL;

	console.log("📱 Infobip Configuration:");
	console.log("  API Key:", apiKey ? `${apiKey.substring(0, 10)}***` : "NOT SET");
	console.log("  Base URL:", baseUrl || "NOT SET");

	if (!apiKey || !baseUrl) {
		console.error("❌ Infobip credentials not configured!");
		return null;
	}

	// Ensure baseUrl starts with https://
	const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

	return {
		apiKey,
		baseUrl: fullBaseUrl,
	};
}

// Send OTP using Infobip SMS API
export async function sendOTPSMS(phoneNumber, otpCode, isSignup = false) {
	// Get brand name from env or use default
	const brandName = process.env.INFOBIP_BRAND_NAME || "AmberHomes";
	const smsSender = process.env.INFOBIP_SMS_SENDER || "ServiceSMS"; // Default to ServiceSMS for free trial
	
	try {
		const config = getInfobipConfig();
		if (!config) {
			throw new Error("Infobip credentials not configured. Please set INFOBIP_API_KEY and INFOBIP_BASE_URL environment variables.");
		}

		// Remove + and any spaces from phone number for SMS API
		const cleanPhoneNumber = phoneNumber.replace(/[\s\+]/g, '');
		
		console.log(`📤 Sending OTP via SMS (Infobip) to: ${phoneNumber}`);
		console.log(`   Cleaned number: ${cleanPhoneNumber}`);
		console.log(`   Using Brand: ${brandName}`);
		console.log(`   From (SMS Sender): ${smsSender}`);
		
		// Generate a 6-digit OTP code
		const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
		console.log(`   🔑 Generated OTP: ${generatedOTP}`);

		console.log("   📞 Calling Infobip SMS API...");
		
		// Use Infobip SMS API endpoint
		const apiUrl = `${config.baseUrl}/sms/2/text/advanced`;
		
		const requestData = {
			messages: [
				{
					destinations: [{ to: cleanPhoneNumber }],
					from: smsSender,
					text: `Your ${brandName} verification code is: ${generatedOTP}. This code will expire in 10 minutes.`
				}
			]
		};

		const response = await axios.post(apiUrl, requestData, {
			headers: {
				'Authorization': `App ${config.apiKey}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			timeout: 30000
		});

		console.log("✅ Infobip SMS API call successful!");
		console.log("   Response:", JSON.stringify(response.data, null, 2));
		
		// Extract message ID and status from response
		const messageId = response.data.messages?.[0]?.messageId || response.data.bulkId || `msg_${Date.now()}`;
		const status = response.data.messages?.[0]?.status?.name || response.data.messages?.[0]?.status?.groupName || 'PENDING';
		const statusDescription = response.data.messages?.[0]?.status?.description || response.data.messages?.[0]?.status?.description || '';
		const statusGroup = response.data.messages?.[0]?.status?.groupName || response.data.messages?.[0]?.status?.groupName || '';
		
		console.log("   Message ID:", messageId);
		console.log("   Status:", status);
		console.log("   Status Group:", statusGroup);
		if (statusDescription) {
			console.log("   Status Description:", statusDescription);
		}
		
		// Check delivery status and provide feedback
		if (status === 'PENDING' || statusGroup === 'PENDING' || status === 'ACCEPTED') {
			console.log("   ✅ Message accepted and queued for delivery");
			console.log("   💡 SMS delivery typically takes a few seconds");
		} else if (status === 'DELIVERED' || statusGroup === 'DELIVERED') {
			console.log("   ✅ Message delivered successfully!");
		} else if (status === 'REJECTED' || statusGroup === 'REJECTED') {
			console.log("   ❌ Message was rejected!");
			console.log("   💡 Common reasons:");
			console.log("      - Invalid recipient number format");
			console.log("      - Invalid sender ID");
			console.log("      - Account limitations (free trial restrictions)");
		} else if (status === 'UNDELIVERABLE' || statusGroup === 'UNDELIVERABLE') {
			console.log("   ❌ Message is undeliverable!");
			console.log("   💡 Check if recipient number is valid");
		}

		return {
			success: true,
			requestId: messageId,
			status: status,
			statusGroup: statusGroup,
			statusDescription: statusDescription,
			verificationSid: messageId,
			otp: generatedOTP, // Return the generated OTP for storage
		};
	} catch (error) {
		console.error("❌ Error sending SMS OTP via Infobip:");
		console.error("   Error message:", error.message);
		console.error("   Error details:", JSON.stringify(error.response?.data || error.body || "N/A", null, 2));
		console.error("   Error status:", error.response?.status || error.status || "N/A");
		
		// Check for specific error types
		if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
			console.error("   ⚠️  Connection timeout - Infobip servers may be unreachable");
			console.error("   💡 Suggestions: Check network connection or try again later");
		} else if (error.code === "ENOTFOUND" || error.message.includes("getaddrinfo")) {
			console.error("   ⚠️  DNS resolution failed - Cannot reach Infobip servers");
		} else if (error.response?.status === 401 || error.status === 401) {
			console.error("   ⚠️  Authentication Error");
			console.error("   💡 Check your INFOBIP_API_KEY");
			console.error("   📝 Visit: https://portal.infobip.com/");
		} else if (error.response?.status === 403 || error.status === 403) {
			console.error("   ⚠️  Authorization Error");
			console.error("   💡 Check your API key permissions");
		} else if (error.response?.status === 422 || error.status === 422) {
			console.error("   ⚠️  Invalid Request Format (422)");
			console.error("   💡 Common causes:");
			console.error("      - Invalid SMS sender ID");
			console.error("      - Invalid recipient number format");
			console.error("      - SMS not enabled for your account");
			console.error("      - Free trial limitations (15 messages to 5 verified recipients)");
		} else if (error.response?.status === 429 || error.status === 429) {
			console.error("   ⚠️  Rate limit exceeded - Too many requests");
			console.error("   💡 Wait a few seconds before trying again");
		} else if (error.response?.data?.requestError) {
			// Infobip specific error format
			const requestError = error.response.data.requestError;
			console.error("   ⚠️  Infobip API Error:");
			console.error("      Service Exception ID:", requestError.serviceException?.messageId);
			console.error("      Text:", requestError.serviceException?.text);
			console.error("      Variables:", requestError.serviceException?.variables);
		}

		return {
			success: false,
			error: error.message || error.response?.data?.message || error.response?.data?.requestError?.serviceException?.text || "Unknown error",
			code: error.response?.status || error.status || error.code || error.errno,
			status: error.response?.status || error.status,
			details: error.response?.data,
		};
	}
}

// Verify OTP - Since we generate our own OTP, we verify it from the database
// This function is kept for compatibility but verification is done in the route
export async function verifyOTPCodeWithRequestId(requestId, code) {
	// This is a placeholder - actual verification is done in the route by comparing with database
	// Infobip doesn't have a Verify API like Twilio/Vonage, so we verify locally
	return {
		success: false,
		error: "Use database verification instead",
		code: null,
	};
}


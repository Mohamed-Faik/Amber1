import twilio from "twilio";

// Create Twilio client
function createTwilioClient() {
	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	const authToken = process.env.TWILIO_AUTH_TOKEN;
	const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

	console.log("📱 Twilio Configuration:");
	console.log("  Account SID:", accountSid ? `${accountSid.substring(0, 5)}***` : "NOT SET");
	console.log("  Auth Token:", authToken ? "***SET***" : "NOT SET");
	console.log("  Verify Service SID:", verifyServiceSid ? `${verifyServiceSid.substring(0, 5)}***` : "NOT SET");

	if (!accountSid || !authToken) {
		console.error("❌ Twilio credentials not configured!");
		return null;
	}

	return twilio(accountSid, authToken);
}

// Send OTP using Twilio Verify v2 API via SMS
export async function sendOTPSMS(phoneNumber, otpCode, isSignup = false) {
	// Get verifyServiceSid outside try block so it's accessible in catch block
	const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
	
	try {
		const client = createTwilioClient();
		if (!client) {
			throw new Error("Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.");
		}
		
		if (!verifyServiceSid) {
			throw new Error("TWILIO_VERIFY_SERVICE_SID not configured. Please set it in your environment variables.");
		}

		console.log(`📤 Sending OTP via SMS (Twilio Verify) to: ${phoneNumber}`);
		console.log(`   Using Verify Service: ${verifyServiceSid.substring(0, 5)}***`);
		
		// Use Twilio Verify v2 API with timeout handling
		// Note: Twilio Verify generates its own OTP and sends it via SMS
		const verificationPromise = client.verify.v2
			.services(verifyServiceSid)
			.verifications
			.create({ 
				to: phoneNumber, 
				channel: 'sms' 
			});

		// Add timeout of 30 seconds
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error("Twilio API request timeout after 30 seconds"));
			}, 30000);
		});

		const verification = await Promise.race([verificationPromise, timeoutPromise]);

		console.log("✅ Twilio Verify OTP sent successfully via SMS!");
		console.log("   Verification SID:", verification.sid);
		console.log("   Status:", verification.status);
		
		// Note: Twilio Verify generates its own code
		// We still return success and the OTP code will be verified via Twilio's check endpoint
		// OR we can use our own OTP code and store it, then verify locally
		// For now, let's use Twilio's verification but still store our code for localStorage

		return {
			success: true,
			sid: verification.sid,
			status: verification.status,
			verificationSid: verification.sid,
		};
	} catch (error) {
		console.error("❌ Error sending SMS OTP via Twilio Verify:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.code || error.errno || "UNKNOWN");
		console.error("   Error status:", error.status || "N/A");
		
		// Check for specific error types
		if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
			console.error("   ⚠️  Connection timeout - Twilio servers may be unreachable");
			console.error("   💡 Suggestions: Check network connection or try again later");
		} else if (error.code === "ENOTFOUND" || error.message.includes("getaddrinfo")) {
			console.error("   ⚠️  DNS resolution failed - Cannot reach Twilio servers");
		} else if (error.status === 429) {
			console.error("   ⚠️  Rate limit exceeded - Too many requests");
			console.error("   💡 Wait a few seconds before trying again");
		} else if (error.code === 21608 || error.status === 403) {
			// Twilio trial account limitation
			console.error("   ⚠️  Twilio Trial Account Limitation");
			console.error("   💡 Trial accounts can only send SMS messages to verified phone numbers");
			console.error("   📝 Verify your phone number at: https://www.twilio.com/console/phone-numbers/verified");
			console.error("   💰 Upgrade your Twilio account to send SMS messages to any number");
		} else if (error.code === 60223) {
			// SMS channel disabled in Twilio Verify service
			console.error("   ⚠️  SMS Channel Not Enabled");
			console.error("   💡 SMS is not enabled in your Twilio Verify service");
			console.error("   📝 To enable SMS:");
			console.error("      1. Go to: https://www.twilio.com/console/verify/services");
			if (verifyServiceSid) {
				console.error("      2. Click on your Verify Service (SID: " + verifyServiceSid.substring(0, 5) + "***)");
				console.error("      3. Go to 'Channels' section");
				console.error("      4. Enable 'SMS' channel");
				console.error("      5. Save the changes");
				console.error("   🔗 Direct link: https://www.twilio.com/console/verify/services/" + verifyServiceSid);
			} else {
				console.error("      2. Click on your Verify Service");
				console.error("      3. Go to 'Channels' section");
				console.error("      4. Enable 'SMS' channel");
				console.error("      5. Save the changes");
			}
		}

		return {
			success: false,
			error: error.message,
			code: error.code || error.errno,
			status: error.status,
		};
	}
}

// Verify OTP using Twilio Verify v2 API
export async function verifyOTPCode(phoneNumber, code) {
	try {
		const client = createTwilioClient();
		if (!client) {
			throw new Error("Twilio credentials not configured.");
		}

		const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
		
		if (!verifyServiceSid) {
			throw new Error("TWILIO_VERIFY_SERVICE_SID not configured.");
		}

		console.log(`🔍 Verifying OTP code via Twilio Verify for: ${phoneNumber}`);
		
		// Add timeout for verification check
		const checkPromise = client.verify.v2
			.services(verifyServiceSid)
			.verificationChecks
			.create({ 
				to: phoneNumber, 
				code: code 
			});

		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error("Twilio verification check timeout after 15 seconds"));
			}, 15000);
		});

		const verificationCheck = await Promise.race([checkPromise, timeoutPromise]);

		console.log("✅ Twilio Verify check completed!");
		console.log("   Status:", verificationCheck.status);
		console.log("   Valid:", verificationCheck.status === 'approved');

		return {
			success: verificationCheck.status === 'approved',
			status: verificationCheck.status,
			valid: verificationCheck.status === 'approved',
		};
	} catch (error) {
		console.error("❌ Error verifying OTP via Twilio:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.code);

		return {
			success: false,
			error: error.message,
			code: error.code,
		};
	}
}


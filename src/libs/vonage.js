import { Vonage } from '@vonage/server-sdk';

// Create Vonage client
function createVonageClient() {
	const apiKey = process.env.VONAGE_API_KEY;
	const apiSecret = process.env.VONAGE_API_SECRET;

	console.log("📱 Vonage Configuration:");
	console.log("  API Key:", apiKey ? `${apiKey.substring(0, 5)}***` : "NOT SET");
	console.log("  API Secret:", apiSecret ? "***SET***" : "NOT SET");

	if (!apiKey || !apiSecret) {
		console.error("❌ Vonage credentials not configured!");
		return null;
	}

	return new Vonage({
		apiKey: apiKey,
		apiSecret: apiSecret,
	});
}

// Send OTP using Vonage Verify API via WhatsApp
export async function sendOTPSMS(phoneNumber, otpCode, isSignup = false) {
	// Get brand name from env or use default
	const brandName = process.env.VONAGE_BRAND_NAME || "AmberHomes";
	
	try {
		const vonage = createVonageClient();
		if (!vonage) {
			throw new Error("Vonage credentials not configured. Please set VONAGE_API_KEY and VONAGE_API_SECRET environment variables.");
		}

		console.log(`📤 Sending OTP via WhatsApp (Vonage Messages) to: ${phoneNumber}`);
		console.log(`   Using Brand: ${brandName}`);
		
		// Generate a 6-digit OTP code
		const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
		console.log(`   🔑 Generated OTP: ${generatedOTP}`);
		
		// Use Vonage Messages API for WhatsApp
		// For WhatsApp, the "from" field must be a valid WhatsApp Business Number (format: 14155552671 or WhatsApp Business Account ID)
		const whatsappNumber = process.env.VONAGE_WHATSAPP_NUMBER;
		
		if (!whatsappNumber) {
			throw new Error("VONAGE_WHATSAPP_NUMBER is required for WhatsApp messages. Please set it in your environment variables.");
		}
		
		const verificationPromise = new Promise((resolve, reject) => {
			try {
				console.log("   📞 Calling Vonage Messages API...");
				console.log("   📱 From (WhatsApp Number):", whatsappNumber);
				
				// Vonage Messages API structure for WhatsApp
				vonage.messages.send({
					channel: 'whatsapp',
					message_type: 'text',
					to: phoneNumber,
					from: whatsappNumber, // Must be a valid WhatsApp Business Number
					text: `Your ${brandName} verification code is: ${generatedOTP}. This code will expire in 10 minutes.`
				}, (err, result) => {
					console.log("   📥 Vonage Messages API callback received");
					if (err) {
						console.error("   ❌ Vonage Messages API error:", err);
						console.error("   Error details:", {
							message: err.message,
							body: err.body,
							status: err.status,
							statusText: err.statusText
						});
						
						// Provide more helpful error messages
						if (err.status === 422) {
							console.error("   💡 422 Error usually means:");
							console.error("      - Invalid 'from' number format");
							console.error("      - WhatsApp not enabled for your account");
							console.error("      - Invalid message structure");
							console.error("   📝 Check: https://dashboard.nexmo.com/");
						}
						
						reject(err);
					} else {
						console.log("   ✅ Vonage Messages API success:", result);
						// Return success with generated OTP
						resolve({
							request_id: result.message_uuid || `msg_${Date.now()}`,
							status: '0',
							otp: generatedOTP // Return the generated OTP for storage
						});
					}
				});
			} catch (syncError) {
				console.error("   ❌ Synchronous error in Vonage API call:", syncError);
				reject(syncError);
			}
		});

		// Add timeout of 30 seconds
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				console.error("   ⏱️  Timeout reached - Vonage API did not respond");
				reject(new Error("Vonage API request timeout after 30 seconds"));
			}, 30000);
		});

		console.log("   ⏳ Waiting for Vonage API response...");
		const verification = await Promise.race([verificationPromise, timeoutPromise]);
		console.log("   ✅ Got response from Vonage API");

		console.log("✅ Vonage OTP sent successfully via WhatsApp!");
		console.log("   Request ID:", verification.request_id);
		console.log("   Status:", verification.status);
		console.log("   OTP Code:", verification.otp ? "***" + verification.otp.slice(-2) : "N/A");

		return {
			success: true,
			requestId: verification.request_id,
			status: verification.status,
			verificationSid: verification.request_id, // For compatibility with existing code
			otp: verification.otp, // Include OTP for storage in database
		};
	} catch (error) {
		console.error("❌ Error sending WhatsApp OTP via Vonage:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.status || error.code || "UNKNOWN");
		console.error("   Error status:", error.status || "N/A");
		
		// Check for specific error types
		if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
			console.error("   ⚠️  Connection timeout - Vonage servers may be unreachable");
			console.error("   💡 Suggestions: Check network connection or try again later");
		} else if (error.code === "ENOTFOUND" || error.message.includes("getaddrinfo")) {
			console.error("   ⚠️  DNS resolution failed - Cannot reach Vonage servers");
		} else if (error.status === 422) {
			// Unprocessable Entity - usually means invalid request format
			console.error("   ⚠️  Invalid Request Format (422)");
			console.error("   💡 Common causes:");
			console.error("      - Invalid WhatsApp Business Number in 'from' field");
			console.error("      - WhatsApp not enabled for your Vonage account");
			console.error("      - Invalid phone number format");
			console.error("   📝 Solutions:");
			console.error("      1. Set VONAGE_WHATSAPP_NUMBER to your WhatsApp Business Number");
			console.error("      2. Enable WhatsApp in your Vonage dashboard");
			console.error("      3. Check: https://dashboard.nexmo.com/");
		} else if (error.status === 429) {
			console.error("   ⚠️  Rate limit exceeded - Too many requests");
			console.error("   💡 Wait a few seconds before trying again");
		} else if (error.status === 401 || error.status === 403) {
			// Authentication/Authorization issues
			console.error("   ⚠️  Authentication Error");
			console.error("   💡 Check your VONAGE_API_KEY and VONAGE_API_SECRET");
			console.error("   📝 Visit: https://dashboard.nexmo.com/settings");
		} else if (error.status === 6 || error.status === 7) {
			// Invalid number or blocked number
			console.error("   ⚠️  Invalid or Blocked Phone Number");
			console.error("   💡 Verify the phone number format (E.164 format required)");
		}

		return {
			success: false,
			error: error.message || error.body || "Unknown error",
			code: error.status || error.code || error.errno,
			status: error.status,
		};
	}
}

// Verify OTP with request ID
export async function verifyOTPCodeWithRequestId(requestId, code) {
	try {
		const vonage = createVonageClient();
		if (!vonage) {
			throw new Error("Vonage credentials not configured.");
		}

		console.log(`🔍 Verifying OTP code via Vonage Verify for Request ID: ${requestId}`);
		
		// Add timeout for verification check
		const checkPromise = new Promise((resolve, reject) => {
			vonage.verify.check(requestId, code, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});

		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				reject(new Error("Vonage verification check timeout after 15 seconds"));
			}, 15000);
		});

		const verificationCheck = await Promise.race([checkPromise, timeoutPromise]);

		console.log("✅ Vonage Verify check completed!");
		console.log("   Status:", verificationCheck.status);
		console.log("   Valid:", verificationCheck.status === '0');

		return {
			success: verificationCheck.status === '0',
			status: verificationCheck.status,
			valid: verificationCheck.status === '0',
		};
	} catch (error) {
		console.error("❌ Error verifying OTP via Vonage:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.status || error.code);

		return {
			success: false,
			error: error.message || error.body || "Unknown error",
			code: error.status || error.code,
		};
	}
}


import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Check if Twilio environment variables are set
		const hasAccountSid = !!process.env.TWILIO_ACCOUNT_SID;
		const hasAuthToken = !!process.env.TWILIO_AUTH_TOKEN;
		const hasVerifyServiceSid = !!process.env.TWILIO_VERIFY_SERVICE_SID;

		const isConfigured = hasAccountSid && hasAuthToken && hasVerifyServiceSid;

		return NextResponse.json({
			available: isConfigured,
			message: isConfigured 
				? "Twilio is configured and phone verification is available"
				: "Twilio is not configured. Phone verification is optional.",
		});
	} catch (error) {
		console.error("Error checking Twilio availability:", error);
		return NextResponse.json({
			available: false,
			message: "Unable to check Twilio configuration",
		});
	}
}


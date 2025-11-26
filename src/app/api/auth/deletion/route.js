import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import crypto from "crypto";

/**
 * Facebook Data Deletion Callback Endpoint
 * 
 * This endpoint handles Facebook's data deletion requests.
 * When a user requests account deletion from Facebook, Facebook will send
 * a POST request to this endpoint with a signed_request.
 * 
 * Facebook Documentation:
 * https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
 */

/**
 * Verify Facebook signed_request
 * @param {string} signedRequest - The signed_request from Facebook
 * @param {string} secret - Facebook App Secret
 * @returns {object|null} - Decoded data or null if invalid
 */
function parseSignedRequest(signedRequest, secret) {
	try {
		const [encodedSig, payload] = signedRequest.split('.');
		
		if (!encodedSig || !payload) {
			return null;
		}

		// Decode the signature
		const sig = base64UrlDecode(encodedSig);
		
		// Decode the payload
		const data = JSON.parse(base64UrlDecode(payload));

		// Verify signature
		const expectedSig = crypto
			.createHmac('sha256', secret)
			.update(payload)
			.digest();

		if (sig.length !== expectedSig.length || !crypto.timingSafeEqual(sig, expectedSig)) {
			console.error('Invalid signed_request signature');
			return null;
		}

		return data;
	} catch (error) {
		console.error('Error parsing signed_request:', error);
		return null;
	}
}

/**
 * Base64 URL decode helper
 */
function base64UrlDecode(str) {
	// Add padding if needed
	let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	
	while (base64.length % 4) {
		base64 += '=';
	}

	return Buffer.from(base64, 'base64');
}

/**
 * Delete user data by Facebook user ID
 */
async function deleteUserDataByFacebookId(facebookUserId) {
	try {
		// Find the user account linked to this Facebook ID
		const account = await prisma.account.findFirst({
			where: {
				provider: 'facebook',
				providerAccountId: facebookUserId.toString(),
			},
			include: {
				user: true,
			},
		});

		if (!account || !account.user) {
			console.log(`No user found for Facebook ID: ${facebookUserId}`);
			return { success: false, message: 'User not found' };
		}

		const userId = account.user.id;

		// Delete all user data (same as GDPR deletion)
		// Delete user's listings
		await prisma.listing.deleteMany({
			where: { userId: userId },
		});

		// Delete user's reviews
		await prisma.review.deleteMany({
			where: { userId: userId },
		});

		// Delete user's favorites
		await prisma.favourite.deleteMany({
			where: { userId: userId },
		});

		// Delete user's blog posts
		await prisma.blog.deleteMany({
			where: { userId: userId },
		});

		// Delete OAuth accounts
		await prisma.account.deleteMany({
			where: { userId: userId },
		});

		// Delete OTP records
		if (account.user.email) {
			await prisma.otp.deleteMany({
				where: { email: account.user.email },
			});

			// Delete password reset tokens
			await prisma.passwordResetToken.deleteMany({
				where: { email: account.user.email },
			});
		}

		// Finally, delete the user (this will cascade delete profile)
		await prisma.user.delete({
			where: { id: userId },
		});

		console.log(`Successfully deleted user data for Facebook ID: ${facebookUserId}`);

		return { success: true, message: 'User data deleted successfully' };
	} catch (error) {
		console.error('Error deleting user data:', error);
		return { success: false, message: error.message };
	}
}

/**
 * GET request - Initial verification
 * Facebook checks this endpoint to verify it exists
 */
export async function GET(request) {
	try {
		// Facebook expects a confirmation response
		const confirmationCode = process.env.FACEBOOK_CLIENT_ID || 'CONFIRMED';
		
		return NextResponse.json({
			url: `${process.env.NEXTAUTH_URL || 'https://amberhomes-liart.vercel.app'}/api/auth/deletion`,
			confirmation_code: confirmationCode,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.error('Error in GET /api/auth/deletion:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

/**
 * POST request - Handle actual deletion request
 * Facebook sends a POST request with signed_request when user requests deletion
 */
export async function POST(request) {
	try {
		const formData = await request.formData();
		const signedRequest = formData.get('signed_request');

		if (!signedRequest) {
			console.error('No signed_request provided');
			return NextResponse.json(
				{ error: 'Missing signed_request' },
				{ status: 400 }
			);
		}

		const appSecret = process.env.FACEBOOK_CLIENT_SECRET;

		if (!appSecret) {
			console.error('FACEBOOK_CLIENT_SECRET not configured');
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			);
		}

		// Verify and parse the signed_request
		const data = parseSignedRequest(signedRequest, appSecret);

		if (!data) {
			console.error('Invalid signed_request');
			return NextResponse.json(
				{ error: 'Invalid request' },
				{ status: 400 }
			);
		}

		// Extract user ID from signed_request
		const facebookUserId = data.user_id;

		if (!facebookUserId) {
			console.error('No user_id in signed_request');
			return NextResponse.json(
				{ error: 'Invalid request data' },
				{ status: 400 }
			);
		}

		// Delete user data
		const result = await deleteUserDataByFacebookId(facebookUserId);

		if (result.success) {
			// Return confirmation to Facebook
			// Facebook expects a URL where users can check deletion status
			const deletionStatusUrl = `${process.env.NEXTAUTH_URL || 'https://amberhomes-liart.vercel.app'}/api/auth/deletion/status?facebook_user_id=${facebookUserId}`;
			
			return NextResponse.json({
				url: deletionStatusUrl,
				confirmation_code: process.env.FACEBOOK_CLIENT_ID || 'DELETED',
			}, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} else {
			// If user not found, still return success to Facebook
			// (User might have already been deleted)
			return NextResponse.json({
				url: `${process.env.NEXTAUTH_URL || 'https://amberhomes-liart.vercel.app'}/api/auth/deletion/status?facebook_user_id=${facebookUserId}`,
				confirmation_code: 'NOT_FOUND',
			});
		}
	} catch (error) {
		console.error('Error in POST /api/auth/deletion:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}


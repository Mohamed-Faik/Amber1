import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

/**
 * Facebook Data Deletion Status Endpoint
 * 
 * This endpoint allows users to check the status of their data deletion.
 * Facebook provides a link to this endpoint after processing the deletion request.
 */

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const facebookUserId = searchParams.get('facebook_user_id');

		if (!facebookUserId) {
			return NextResponse.json(
				{ error: 'Missing facebook_user_id parameter' },
				{ status: 400 }
			);
		}

		// Check if user data still exists
		const account = await prisma.account.findFirst({
			where: {
				provider: 'facebook',
				providerAccountId: facebookUserId.toString(),
			},
		});

		const dataDeleted = !account;

		return NextResponse.json({
			status: dataDeleted ? 'deleted' : 'pending',
			message: dataDeleted
				? 'Your data has been successfully deleted from our system.'
				: 'Your data deletion request is being processed.',
			facebook_user_id: facebookUserId,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.error('Error in GET /api/auth/deletion/status:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}


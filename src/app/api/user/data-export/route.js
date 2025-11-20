import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

export async function GET(request) {
	try {
		const currentUser = await getCurrentUser();
		
		if (!currentUser) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Fetch all user data
		const user = await prisma.user.findUnique({
			where: { id: currentUser.id },
			include: {
				profile: true,
				listings: {
					select: {
						id: true,
						title: true,
						description: true,
						price: true,
						location_value: true,
						address: true,
						category: true,
						status: true,
						created_at: true,
						updated_at: true,
					},
				},
				reviews: {
					select: {
						id: true,
						rating: true,
						comment: true,
						created_at: true,
						listingId: true,
					},
				},
				accounts: {
					select: {
						provider: true,
						type: true,
						created_at: true,
					},
				},
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Format data for export (GDPR-compliant format)
		const exportData = {
			personal_information: {
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image,
				role: user.role,
				status: user.status,
				emailVerified: user.emailVerified,
				created_at: user.created_at,
				updated_at: user.updated_at,
			},
			profile: user.profile || null,
			listings: user.listings || [],
			reviews: user.reviews || [],
			connected_accounts: user.accounts || [],
			export_date: new Date().toISOString(),
			export_format: "JSON",
			data_subject_rights: {
				right_to_access: "This export contains all your personal data stored on our platform.",
				right_to_rectification: "You can update your data in your profile settings.",
				right_to_erasure: "You can request account deletion in your privacy settings.",
				right_to_portability: "This export is provided in a machine-readable format.",
			},
		};

		// Return as JSON download
		return new NextResponse(JSON.stringify(exportData, null, 2), {
			headers: {
				"Content-Type": "application/json",
				"Content-Disposition": `attachment; filename="amberhomes-data-export-${user.id}-${Date.now()}.json"`,
			},
		});
	} catch (error) {
		console.error("Error exporting user data:", error);
		return NextResponse.json(
			{ error: "Failed to export data" },
			{ status: 500 }
		);
	}
}


import { getServerSession } from "next-auth/next";
import { authHandler } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prismadb";

export async function getCurrentSession() {
	return await getServerSession(authHandler);
}

export async function getCurrentUser() {
	try {
		const session = await getCurrentSession();

		if (!session?.user?.email) {
			return null;
		}

		const currentUser = await prisma.user.findUnique({
			where: {
				email: session.user.email,
			},
		});

		if (!currentUser) {
			return null;
		}

		// Fetch profile and favourites separately since there are no relations
		let profile = null;
		let favourites = [];
		
		try {
			profile = await prisma.profile.findUnique({
				where: {
					userId: currentUser.id,
				},
			});
		} catch (error) {
			console.error(`Error fetching profile for user ${currentUser.id}:`, error);
		}

		try {
			favourites = await prisma.favourite.findMany({
				where: {
					userId: currentUser.id,
				},
			});
		} catch (error) {
			console.error(`Error fetching favourites for user ${currentUser.id}:`, error);
		}

		return {
			...currentUser,
			profile: profile || null,
			favourites: favourites || [],
			created_at: currentUser.created_at.toISOString(),
			updated_at: currentUser.updated_at?.toISOString() || currentUser.created_at.toISOString(),
			emailVerified: currentUser.emailVerified?.toISOString() || null,
		};
	} catch (error) {
		console.error("❌ Error in getCurrentUser:");
		console.error("   Error message:", error.message);
		console.error("   Error code:", error.code);
		
		// Database connection error - return null gracefully
		if (error.message?.includes("Can't reach database server") || 
		    error.code === "P1001") {
			console.warn("⚠️  Database connection error in getCurrentUser");
			return null;
		}
		
		return null;
	}
}

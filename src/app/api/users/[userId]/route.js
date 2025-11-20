import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

export async function DELETE(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser || currentUser.role !== "ADMIN") {
		return NextResponse.json(
			{ message: "Unauthorized" },
			{ status: 401 }
		);
	}
	const { userId } = params;
	if (!userId) {
		return NextResponse.json(
			{ message: "Invalid user ID" },
			{ status: 400 }
		);
	}
	if (parseInt(userId) === currentUser.id) {
		return NextResponse.json(
			{ message: "Cannot delete your own account" },
			{ status: 400 }
		);
	}

	try {
		const deletedUser = await prisma.user.delete({
			where: {
				id: parseInt(userId),
			},
		});

		return NextResponse.json(deletedUser);
	} catch (error) {
		console.error("Error deleting user:", error);
		if (error.code === "P2025") {
			return NextResponse.json(
				{ message: "User not found." },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ message: error.message || "Failed to delete user." },
			{ status: 500 }
		);
	}
}

export async function PATCH(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser || currentUser.role !== "ADMIN") {
		return NextResponse.json(
			{ message: "Unauthorized" },
			{ status: 401 }
		);
	}

	const { userId } = params;
	if (!userId) {
		return NextResponse.json(
			{ message: "Invalid user ID" },
			{ status: 400 }
		);
	}

	if (parseInt(userId) === currentUser.id) {
		return NextResponse.json(
			{ message: "Cannot modify your own account status or role" },
			{ status: 400 }
		);
	}

	const body = await request.json();
	const { status, role } = body;

	// Validate status if provided
	if (status && status !== "Active" && status !== "Inactive") {
		return NextResponse.json(
			{ message: "Invalid status. Must be 'Active' or 'Inactive'." },
			{ status: 400 }
		);
	}

	// Validate role if provided
	if (role && !["USER", "MODERATOR", "SUPPORT", "ADMIN"].includes(role)) {
		return NextResponse.json(
			{ message: "Invalid role. Must be 'USER', 'MODERATOR', 'SUPPORT', or 'ADMIN'." },
			{ status: 400 }
		);
	}

	// Check if at least one field is provided
	if (!status && !role) {
		return NextResponse.json(
			{ message: "Either 'status' or 'role' must be provided." },
			{ status: 400 }
		);
	}

	const updateData = {};
	if (status) {
		updateData.status = status;
	}
	if (role) {
		updateData.role = role;
	}
	updateData.updated_at = new Date();

	try {
		const updatedUser = await prisma.user.update({
			where: {
				id: parseInt(userId),
			},
			data: updateData,
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error("Error updating user:", error);
		if (error.code === "P2025") {
			return NextResponse.json(
				{ message: "User not found." },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ message: error.message || "Failed to update user." },
			{ status: 500 }
		);
	}
}

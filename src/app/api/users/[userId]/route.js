import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

export async function DELETE(request, { params }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}
	const { userId } = params;
	if (!userId) {
		throw new Error("Invalid ID");
	}
	if (parseInt(userId) === currentUser.id) {
		return NextResponse.error();
	}

	const deletedUser = await prisma.user.delete({
		where: {
			id: parseInt(userId),
		},
	});

	return NextResponse.json(deletedUser);
}

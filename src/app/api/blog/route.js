import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import getBlogPosts from "@/actions/getBlogPosts";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = searchParams.get("limit");

		const params = limit ? { limit: parseInt(limit) } : null;
		const blogPosts = await getBlogPosts(params);

		return NextResponse.json(blogPosts || []);
	} catch (error) {
		console.error("Error fetching blog posts:", error);
		return NextResponse.json(
			{ message: "Failed to fetch blog posts", error: error.message },
			{ status: 500 }
		);
	}
}

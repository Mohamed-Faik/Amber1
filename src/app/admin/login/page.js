import React from "react";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/Auth/AdminLoginForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const AdminLoginPage = async () => {
	const currentUser = await getCurrentUser();
	
	// If already logged in as admin, redirect to admin panel
	if (currentUser && currentUser.role === "ADMIN") {
		redirect("/administrator");
	}
	
	return <AdminLoginForm />;
};

export default AdminLoginPage;


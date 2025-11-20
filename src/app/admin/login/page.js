import React from "react";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/Auth/AdminLoginForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const AdminLoginPage = async () => {
	const currentUser = await getCurrentUser();
	
	// If already logged in with admin access, redirect to admin panel
	const { hasAdminAccess } = await import("@/utils/checkRole");
	if (hasAdminAccess(currentUser)) {
		redirect("/administrator");
	}
	
	return <AdminLoginForm />;
};

export default AdminLoginPage;


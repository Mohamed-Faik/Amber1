import React from "react";
import { redirect } from "next/navigation";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const page = async () => {
	const currentUser = await getCurrentUser();
	if (currentUser) {
		redirect("/");
	}
	return <ForgotPasswordForm />;
};

export default page;


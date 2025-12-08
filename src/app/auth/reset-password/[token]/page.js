import React from "react";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const page = async () => {
	const currentUser = await getCurrentUser();
	if (currentUser) {
		redirect("/");
	}
	return <ResetPasswordForm />;
};

export default page;


import React from "react";
import { redirect } from "next/navigation";
import SignupForm from "@/components/Auth/SignupForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const page = async () => {
	const currentUser = await getCurrentUser();
	if (currentUser) {
		redirect("/");
	}
	return <SignupForm />;
};

export default page;

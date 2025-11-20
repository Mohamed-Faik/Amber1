import React from "react";
import { redirect } from "next/navigation";
import SigninForm from "@/components/Auth/SigninForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const page = async () => {
	const currentUser = await getCurrentUser();
	if (currentUser) {
		redirect("/");
	}
	return <SigninForm />;
};

export default page;

"use client";
import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserItem from "./UserItem";

const UsersCard = ({ users, currentUser }) => {
	const router = useRouter();
	const deleteUser = async (userId) => {
		const shouldDelete = window.confirm(
			"Are you sure you want to delete this user?"
		);

		if (parseInt(userId) === currentUser.id) {
			return toast.error("You can't delete your own ID!");
		}

		if (shouldDelete) {
			await axios
				.delete(`/api/users/${userId}`)
				.then((response) => {
					toast.success("Success");
					router.refresh();
				})
				.catch((error) => {
					toast.error("Something went wrong!");
				});
		}
	};
	return (
		<div className="row">
			{users.map((user) => (
				<UserItem
					key={user.id}
					{...user}
					onDelete={() => deleteUser(user.id)}
				/>
			))}
		</div>
	);
};

export default UsersCard;

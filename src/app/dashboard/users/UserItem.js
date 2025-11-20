"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UserItem = ({ id, name, email, image, onDelete }) => {
	const router = useRouter();
	return (
		<div className="col-md-6 mb-3">
			<div className="d-flex a border-bottom pb-3">
				<div style={{ width: "100px" }}>
					<Image
						src={image ? image : "https://via.placeholder.com/150"}
						className="card-img-top"
						alt="User Image"
						width={1185}
						height={990}
					/>
				</div>
				<div className="ms-3">
					<h6 className="card-title">{name}</h6>
					<p className="card-text mb-2 fs-14">Email: {email}</p>

					<button
						className="btn btn-primary btn-sm btn-view"
						onClick={() => router.push(`/author/${id}`)}
					>
						View
					</button>
					<button
						className="btn btn-danger btn-sm btn-delete ms-2"
						onClick={onDelete}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserItem;

import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

import googleImg from "../../../public/images/google.png";
import githubImg from "../../../public/images/github.png";

const SocialButton = () => {
	return (
		<>
			<div className="text-center mt-3">
				<div
					className="g-sign-in-button"
					onClick={() =>
						signIn("google", {
							callbackUrl: typeof window !== "undefined" ? window.location.origin : "/",
						})
					}
				>
					<div className="content-wrapper">
						<div className="logo-wrapper">
							<Image
								src={googleImg}
								width={80}
								height={80}
								alt="Google"
							/>
						</div>
						<span className="text-container">
							<span>Continue with Google</span>
						</span>
					</div>
				</div>

				<div
					className="g-sign-in-button bg-171515"
					onClick={() => signIn("github")}
				>
					<div className="content-wrapper">
						<div className="logo-wrapper">
							<Image
								src={githubImg}
								width={80}
								height={80}
								alt="Github"
							/>
						</div>
						<span className="text-container">
							<span>Continue with Github</span>
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default SocialButton;

import React from "react";
import PageBanner from "@/components/Common/PageBanner";
import getContentPage from "@/actions/getContentPage";

export const dynamic = 'force-dynamic';

const TermsCondition = async () => {
	const content = await getContentPage("terms-condition");

	return (
		<>
			<PageBanner pageTitle="Terms & Condition" />
			
			<div className="ptb-100">
				<div className="container">
					<div className="main-textarea">
						{content ? (
							<div dangerouslySetInnerHTML={{ __html: content.content }} />
						) : (
							<>
								<h3>Terms & Conditions</h3>
								<p>Content not yet configured. Please contact the administrator.</p>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default TermsCondition;

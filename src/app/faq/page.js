import React from "react";
import PageBanner from "@/components/Common/PageBanner";
import FaqContent from "@/components/Faq/FaqContent";
  
const Faq = () => {
	return (
		<>
			<PageBanner pageTitle="Faq" />

      <FaqContent />
		</>
	);
};

export default Faq;

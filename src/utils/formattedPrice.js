export const formattedPrice = (price) => {
	const formattedPriceUSD = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(price);
	return formattedPriceUSD;
};

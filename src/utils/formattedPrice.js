export const formattedPrice = (price, language = 'en') => {
	// Determine currency and locale based on language
	let currency, locale;

	switch (language) {
		case 'fr':  // French → Euro
			currency = 'EUR';
			locale = 'fr-FR';
			break;
		case 'nl':  // Belgian/Dutch → Euro
			currency = 'EUR';
			locale = 'nl-BE';
			break;
		case 'en':  // English → Dollar
			currency = 'USD';
			locale = 'en-US';
			break;
		default:    // Default → Dollar
			currency = 'USD';
			locale = 'en-US';
	}

	const formattedPriceValue = new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);

	return formattedPriceValue;
};

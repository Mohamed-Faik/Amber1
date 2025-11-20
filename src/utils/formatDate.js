export const formatDate = (date) => {
	return new Date(date).toLocaleDateString("en-US");
};

export const formatDateWithMonth = (inputDate) => {
	const dateObject = new Date(inputDate);

	// Define the month names to use in the output
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	// Get the day, month, and year from the date object
	const day = dateObject.getDate();
	const month = monthNames[dateObject.getMonth()];
	const year = dateObject.getFullYear();

	// Construct the formatted date string
	const formattedDate = `${day} ${month} ${year}`;

	return formattedDate;
};

export const formatDateBlog = (inputDate) => {
	const dateObject = new Date(inputDate);

	// Define the month names to use in the output
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	// Get the day, month, and year from the date object
	const day = dateObject.getDate();
	const month = monthNames[dateObject.getMonth()];
	const year = dateObject.getFullYear();

	// Construct the formatted date string
	const formattedDate = `${day} <br /> ${month}`;

	return formattedDate;
};

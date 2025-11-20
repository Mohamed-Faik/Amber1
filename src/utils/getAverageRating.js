export const getAverageRating = (data) => {
	const totalRatings = data.length;
	const sumRatings = data.reduce((acc, item) => acc + item.rating, 0);
	const averageRating = sumRatings / totalRatings;

	return averageRating;
};

// const averageRating = getAverageRating(data);

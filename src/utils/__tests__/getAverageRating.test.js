import { getAverageRating } from '../getAverageRating'

describe('getAverageRating', () => {
	test('calculates average rating correctly', () => {
		const data = [
			{ rating: 5 },
			{ rating: 4 },
			{ rating: 3 },
		]
		expect(getAverageRating(data)).toBe(4)
	})

	test('handles single rating', () => {
		const data = [{ rating: 5 }]
		expect(getAverageRating(data)).toBe(5)
	})

	test('handles decimal averages', () => {
		const data = [
			{ rating: 5 },
			{ rating: 4 },
			{ rating: 3 },
			{ rating: 2 },
		]
		expect(getAverageRating(data)).toBe(3.5)
	})

	test('handles empty array', () => {
		const data = []
		expect(getAverageRating(data)).toBeNaN()
	})

	test('handles all same ratings', () => {
		const data = [
			{ rating: 5 },
			{ rating: 5 },
			{ rating: 5 },
		]
		expect(getAverageRating(data)).toBe(5)
	})

	test('handles large dataset', () => {
		const data = Array.from({ length: 100 }, (_, i) => ({ rating: 5 }))
		expect(getAverageRating(data)).toBe(5)
	})
})


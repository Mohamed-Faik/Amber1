import { formattedPrice } from '../formattedPrice'

describe('formattedPrice', () => {
	test('formats price correctly with USD currency', () => {
		expect(formattedPrice(1000)).toBe('$1,000.00')
		expect(formattedPrice(1000000)).toBe('$1,000,000.00')
		expect(formattedPrice(1234567)).toBe('$1,234,567.00')
	})

	test('handles zero', () => {
		expect(formattedPrice(0)).toBe('$0.00')
	})

	test('handles negative numbers', () => {
		expect(formattedPrice(-1000)).toBe('-$1,000.00')
	})

	test('handles decimal values', () => {
		expect(formattedPrice(1234.56)).toBe('$1,234.56')
		expect(formattedPrice(999.99)).toBe('$999.99')
	})

	test('handles large numbers', () => {
		expect(formattedPrice(1000000000)).toBe('$1,000,000,000.00')
	})
})


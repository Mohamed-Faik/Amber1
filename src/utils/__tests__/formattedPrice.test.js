import { formattedPrice } from '../formattedPrice'

describe('formattedPrice', () => {
	test('formats price correctly with MAD currency', () => {
		expect(formattedPrice(1000)).toContain('1 000')
		expect(formattedPrice(1000000)).toContain('1 000 000')
		expect(formattedPrice(1234567)).toContain('1 234 567')
		// Should contain MAD or د.م. symbol
		expect(formattedPrice(1000)).toMatch(/MAD|د\.م\./)
	})

	test('handles zero', () => {
		const result = formattedPrice(0)
		expect(result).toContain('0')
		expect(result).toMatch(/MAD|د\.م\./)
	})

	test('handles negative numbers', () => {
		const result = formattedPrice(-1000)
		expect(result).toContain('1 000')
		expect(result).toMatch(/MAD|د\.م\./)
	})

	test('handles decimal values (should round to whole numbers)', () => {
		const result1 = formattedPrice(1234.56)
		const result2 = formattedPrice(999.99)
		expect(result1).toContain('1 235') // Rounded up
		expect(result2).toContain('1 000') // Rounded up
		expect(result1).toMatch(/MAD|د\.م\./)
		expect(result2).toMatch(/MAD|د\.م\./)
	})

	test('handles large numbers', () => {
		const result = formattedPrice(1000000000)
		expect(result).toContain('1 000 000 000')
		expect(result).toMatch(/MAD|د\.م\./)
	})
})


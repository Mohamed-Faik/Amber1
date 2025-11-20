import { slugify } from '../slugify'

describe('slugify', () => {
	test('converts string to lowercase slug', () => {
		expect(slugify('Hello World')).toBe('hello-world')
		expect(slugify('My Property Listing')).toBe('my-property-listing')
	})

	test('removes special characters', () => {
		expect(slugify('Hello! World@')).toBe('hello-world')
		expect(slugify('Property #123')).toBe('property-123')
	})

	test('replaces spaces with hyphens', () => {
		expect(slugify('Multiple   Spaces')).toBe('multiple-spaces')
		expect(slugify('  Leading  Trailing  ')).toBe('leading-trailing')
	})

	test('removes multiple consecutive hyphens', () => {
		expect(slugify('Hello---World')).toBe('hello-world')
		expect(slugify('Test---Multiple---Hyphens')).toBe('test-multiple-hyphens')
	})

	test('removes leading and trailing hyphens', () => {
		expect(slugify('-Hello World-')).toBe('hello-world')
		expect(slugify('---Test---')).toBe('test')
	})

	test('handles empty strings', () => {
		expect(slugify('')).toBe('')
		expect(slugify('   ')).toBe('')
	})

	test('handles numbers', () => {
		expect(slugify('123')).toBe('123')
		expect(slugify('Property 123')).toBe('property-123')
	})

	test('handles special cases', () => {
		expect(slugify('Luxury Villa in Marrakech')).toBe('luxury-villa-in-marrakech')
		expect(slugify('3 Bedroom House')).toBe('3-bedroom-house')
	})
})


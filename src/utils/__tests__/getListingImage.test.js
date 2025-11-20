import { getListingImage, getAllListingImages } from '../getListingImage'

describe('getListingImage', () => {
	test('returns null for null or undefined', () => {
		expect(getListingImage(null)).toBeNull()
		expect(getListingImage(undefined)).toBeNull()
		expect(getListingImage('')).toBeNull()
		expect(getListingImage('[]')).toBeNull()
	})

	test('handles single image string', () => {
		expect(getListingImage('/uploads/listings/image.jpg')).toBe('/uploads/listings/image.jpg')
		expect(getListingImage('uploads/listings/image.jpg')).toBe('/uploads/listings/image.jpg')
	})

	test('handles JSON array format', () => {
		const jsonArray = '["/uploads/listings/image1.jpg","/uploads/listings/image2.jpg"]'
		expect(getListingImage(jsonArray)).toBe('/uploads/listings/image1.jpg')
	})

	test('handles truncated JSON array', () => {
		const truncated = '["/uploads/listings/image1.jpg","/uploads/listings/image2.jpg","/uploads/listing'
		const result = getListingImage(truncated)
		expect(result).toBe('/uploads/listings/image1.jpg')
	})

	test('handles already parsed array', () => {
		const array = ['/uploads/listings/image1.jpg', '/uploads/listings/image2.jpg']
		expect(getListingImage(array)).toBe('/uploads/listings/image1.jpg')
	})

	test('handles invalid JSON gracefully', () => {
		expect(getListingImage('["invalid')).toBeNull()
		expect(getListingImage('not json')).toBe('/not json')
	})

	test('handles null and undefined in array', () => {
		expect(getListingImage('["null"]')).toBeNull()
		expect(getListingImage('["undefined"]')).toBeNull()
		expect(getListingImage('[""]')).toBeNull()
	})
})

describe('getAllListingImages', () => {
	test('returns empty array for null or undefined', () => {
		expect(getAllListingImages(null)).toEqual([])
		expect(getAllListingImages(undefined)).toEqual([])
		expect(getAllListingImages('')).toEqual([])
		expect(getAllListingImages('[]')).toEqual([])
	})

	test('handles single image string', () => {
		expect(getAllListingImages('/uploads/listings/image.jpg')).toEqual(['/uploads/listings/image.jpg'])
		expect(getAllListingImages('uploads/listings/image.jpg')).toEqual(['/uploads/listings/image.jpg'])
	})

	test('handles JSON array format', () => {
		const jsonArray = '["/uploads/listings/image1.jpg","/uploads/listings/image2.jpg","/uploads/listings/image3.jpg"]'
		const result = getAllListingImages(jsonArray)
		expect(result).toEqual([
			'/uploads/listings/image1.jpg',
			'/uploads/listings/image2.jpg',
			'/uploads/listings/image3.jpg',
		])
	})

	test('handles truncated JSON array', () => {
		const truncated = '["/uploads/listings/image1.jpg","/uploads/listings/image2.jpg","/uploads/listing'
		const result = getAllListingImages(truncated)
		expect(result.length).toBeGreaterThan(0)
		expect(result[0]).toBe('/uploads/listings/image1.jpg')
	})

	test('handles already parsed array', () => {
		const array = ['/uploads/listings/image1.jpg', '/uploads/listings/image2.jpg']
		expect(getAllListingImages(array)).toEqual([
			'/uploads/listings/image1.jpg',
			'/uploads/listings/image2.jpg',
		])
	})

	test('filters out invalid images', () => {
		const jsonArray = '["/uploads/listings/image1.jpg","null","","/uploads/listings/image2.jpg"]'
		const result = getAllListingImages(jsonArray)
		expect(result).toEqual([
			'/uploads/listings/image1.jpg',
			'/uploads/listings/image2.jpg',
		])
	})
})


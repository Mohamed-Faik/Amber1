# Testing Guide

This project uses **Jest** as the testing framework with **React Testing Library** for component testing.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

Tests are located in `__tests__` directories next to the files they test:

```
src/
  utils/
    __tests__/
      formattedPrice.test.js
      slugify.test.js
      getListingImage.test.js
      getAverageRating.test.js
  app/
    api/
      __tests__/
        register.test.js
```

## Current Test Coverage

### ✅ Utility Functions (Fully Tested)
- `formattedPrice` - Price formatting
- `slugify` - String to slug conversion
- `getListingImage` - Image path extraction
- `getAllListingImages` - Multiple image extraction
- `getAverageRating` - Rating calculation

### 📝 API Routes (Structure Tests)
- `/api/register` - User registration endpoint

## Writing New Tests

### Example: Testing a Utility Function

```javascript
import { myFunction } from '../myFunction'

describe('myFunction', () => {
  test('does something correctly', () => {
    expect(myFunction(input)).toBe(expectedOutput)
  })
})
```

### Example: Testing API Routes

For API routes, you'll need to mock Prisma and test the route handlers:

```javascript
import { POST } from '../route'

jest.mock('@/libs/prismadb', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}))

describe('POST /api/my-route', () => {
  test('handles request correctly', async () => {
    // Mock Prisma responses
    // Test the route handler
  })
})
```

## Test Configuration

- **Config File**: `jest.config.js`
- **Setup File**: `jest.setup.js`
- **Environment**: `jest-environment-jsdom` (for React components)

## Coverage Goals

- **Current**: Basic utility functions
- **Target**: 
  - All utility functions ✅
  - Critical API routes
  - Form validation logic
  - Authentication flows

## Best Practices

1. **Test behavior, not implementation** - Focus on what the function does, not how
2. **Use descriptive test names** - Test names should explain what is being tested
3. **Keep tests simple** - One assertion per test when possible
4. **Test edge cases** - Null, undefined, empty strings, etc.
5. **Mock external dependencies** - Database, APIs, etc.

## Future Testing Enhancements

- [ ] Integration tests for API routes with test database
- [ ] Component tests for React components
- [ ] E2E tests with Playwright or Cypress
- [ ] Performance tests
- [ ] Accessibility tests


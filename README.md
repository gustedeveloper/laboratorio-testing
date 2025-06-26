# Testing Laboratory - Frontend Master Lemoncode

## 📋 Project Overview

This repository contains the implementation of a testing laboratory for a React application, where good frontend testing practices have been applied, including unit, integration, and end-to-end tests.

## 🧪 Testing Concepts and Techniques Implemented

### 1. Unit Tests with Vitest

#### Mappers and Pure Functions

- **API to ViewModel mapper testing**: Validation of data transformations between layers
- **Parameterized testing with `it.each`**: Efficient execution of multiple test cases
- **Edge cases**: Handling of `null`, `undefined`, empty objects, and incorrect types
- **AAA Structure**: Consistent application of the Arrange-Act-Assert pattern

```typescript
// Parameterized testing example
it.each([
  { apiProject: null, description: 'null' },
  { apiProject: undefined, description: 'undefined' },
  { apiProject: '', description: 'empty string' },
])('should return empty project if input is $description', ({ apiProject }) => {
  // Test implementation
});
```

### 2. React Component Testing

#### React Testing Library

- **Rendering and queries**: Usage of `render`, `screen`, and semantic queries
- **Interaction testing**: User event simulation with `fireEvent`
- **Dynamic props testing**: Content validation based on different props
- **Accessibility tests**: Verification of ARIA attributes and roles

#### Testing Patterns

- **Conditional rendering**: Tests for showing/hiding components
- **User interactions**: Callback validation and event handling
- **Dynamic content**: Testing content that changes based on state

```typescript
// Interaction test example
it('should call onAccept when accept button is clicked', () => {
  const mockOnAccept = vi.fn();
  render(<Component onAccept={mockOnAccept} />);

  fireEvent.click(screen.getByRole('button', { name: 'Accept' }));

  expect(mockOnAccept).toHaveBeenCalledTimes(1);
});
```

### 3. Custom Hook Testing

#### Hook Testing with renderHook

- **Initial state**: Validation of default hook state
- **Workflows**: Testing complete action sequences
- **State management**: Verification of complex state changes
- **Error handling**: Handling exceptional cases and unexpected values

```typescript
// Hook test example
it('should handle complete workflow correctly', () => {
  const { result } = renderHook(() => useConfirmationDialog());

  act(() => {
    result.current.onOpenDialog(mockItem);
  });

  expect(result.current.isOpen).toBe(true);
});
```

### 4. Mocking and Stubbing

#### Mocking Techniques

- **Vi.fn()**: Creating mock functions for callback testing
- **Vi.mock()**: Mocking complete modules and external dependencies
- **Return value mocking**: Controlling dependency behavior

#### Use Cases

- **External libraries**: Mocking `react-promise-tracker`
- **Internal modules**: Mocking utility functions
- **API calls**: Simulating service responses

### 5. End-to-End Tests with Cypress

#### Navigation and User Flows

- **User journeys**: Testing complete user flows
- **Form interactions**: Testing forms, inputs, and validations
- **Navigation testing**: Route and navigation verification

#### Advanced E2E Techniques

- **Custom commands**: Using Testing Library commands in Cypress
- **Data-driven testing**: Tests based on mock data
- **Visual testing**: Verification of visual elements and structure

```typescript
// E2E test example
it('should filter projects by name as user types', () => {
  cy.findByPlaceholderText('Search project').type(projectName);
  cy.get('tbody tr').should('have.length', 1);
  cy.contains(projectName).should('be.visible');
});
```

### 6. Continuous Integration (CI/CD)

#### GitHub Actions Pipeline

- **Multi-stage testing**: Sequential execution of unit and E2E tests
- **Artifact management**: Screenshot and video capture on failures
- **Branch protection**: Automatic validation on pull requests

## 🛠️ Tools and Technologies

- **Testing Framework**: Vitest for unit tests
- **Component Testing**: React Testing Library
- **E2E Testing**: Cypress
- **Mocking**: Vi (Vitest mocking utilities)
- **CI/CD**: GitHub Actions
- **Type Safety**: TypeScript in all tests

## 📁 Testing Structure

```
src/
├── common/components/
│   ├── confirmation-dialog/
│   │   ├── *.spec.tsx        # Component tests
│   │   └── *.hook.spec.ts    # Hook tests
│   └── spinner/
│       └── *.spec.tsx        # Component tests
├── pods/project/
│   └── *.mapper.spec.ts      # Unit tests
cypress/
├── e2e/
    └── *.spec.ts             # E2E tests
```

## 🙏 Acknowledgments

Special thanks to the **Lemoncode Frontend Master** instructors who made this learning journey possible through their excellent teaching and guidance in modern frontend testing practices.

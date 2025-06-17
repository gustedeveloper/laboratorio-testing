import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

const createMockProps = (overrides = {}) => ({
  isOpen: true,
  onAccept: vi.fn(),
  onClose: vi.fn(),
  title: 'Test Dialog Title',
  labels: {
    closeButton: 'Cancel',
    acceptButton: 'Accept',
  },
  children: <p>Test dialog content</p>,
  ...overrides,
});

describe('ConfirmationDialogComponent', () => {
  describe('Conditional render', () => {
    it.each([
      {
        isOpen: true,
        expectVisible: true,
        description: 'visible when isOpen is true',
      },
      {
        isOpen: false,
        expectVisible: false,
        description: 'not visible when isOpen is false',
      },
    ])('should be $description', ({ isOpen, expectVisible }) => {
      // Arrange
      const mockProps = createMockProps({ isOpen });

      // Act
      render(<ConfirmationDialogComponent {...mockProps} />);

      // Assert
      if (expectVisible) {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toBeVisible();
      } else {
        const dialog = screen.queryByRole('dialog');
        expect(dialog).not.toBeInTheDocument();
      }
    });
  });

  describe('Dynamic content rendering', () => {
    it.each([
      {
        title: 'Simple String Title',
        type: 'string',
        expectedText: 'Simple String Title',
      },
      {
        title: <h2>React Node Title</h2>,
        type: 'ReactNode',
        expectedText: 'React Node Title',
      },
      {
        title: 'Titles with accents: áéíóú',
        type: 'special characters',
        expectedText: 'Titles with accents: áéíóú',
      },
    ])('should render title as $type correctly', ({ title, expectedText }) => {
      // Arrange
      const mockProps = createMockProps({ title });

      // Act
      render(<ConfirmationDialogComponent {...mockProps} />);

      // Assert
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });
});

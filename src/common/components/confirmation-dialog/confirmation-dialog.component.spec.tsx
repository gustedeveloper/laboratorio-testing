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
});

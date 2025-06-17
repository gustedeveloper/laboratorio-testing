import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
        title: <span>React Node Title</span>,
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

    it.each([
      { closeButton: 'Cancelar', acceptButton: 'Aceptar' },
      { closeButton: 'Close', acceptButton: 'Confirm' },
      { closeButton: '❌ Cancel', acceptButton: '✅ Accept' },
    ])(
      'should render custom button labels',
      ({ closeButton, acceptButton }) => {
        // Arrange
        const mockProps = createMockProps({
          labels: { closeButton, acceptButton },
        });

        // Act
        render(<ConfirmationDialogComponent {...mockProps} />);

        // Assert
        const closeBtn = screen.getByRole('button', { name: closeButton });
        const acceptBtn = screen.getByRole('button', { name: acceptButton });

        expect(closeBtn).toBeInTheDocument();
        expect(acceptBtn).toBeInTheDocument();
      }
    );
  });

  describe('User interactions', () => {
    it('should call onClose when close (cancel) button is clicked', () => {
      // Arrange
      const mockOnClose = vi.fn();
      const mockProps = createMockProps({ onClose: mockOnClose });

      // Act
      render(<ConfirmationDialogComponent {...mockProps} />);
      const closeButton = screen.getByRole('button', {
        name: mockProps.labels.closeButton,
      });
      fireEvent.click(closeButton);

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call both onAccept and onClose when accept button is clicked', () => {
      // Arrange
      const mockOnAccept = vi.fn();
      const mockOnClose = vi.fn();
      const mockProps = createMockProps({
        onAccept: mockOnAccept,
        onClose: mockOnClose,
      });

      // Act
      render(<ConfirmationDialogComponent {...mockProps} />);
      const acceptButton = screen.getByRole('button', {
        name: mockProps.labels.acceptButton,
      });
      fireEvent.click(acceptButton);

      // Assert
      expect(mockOnAccept).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnAccept).toHaveBeenCalledBefore(mockOnClose);
    });
  });

  describe('Dynamic children content rendering', () => {
    it.each([
      {
        children: 'Simple text content',
        type: 'text',
        expectedTexts: ['Simple text content'],
      },
      {
        children: <p>Paragraph content</p>,
        type: 'single element',
        expectedTexts: ['Paragraph content'],
      },
      {
        children: (
          <div>
            <p>Multiple</p>
            <span>Elements</span>
          </div>
        ),
        type: 'multiple elements',
        expectedTexts: ['Multiple', 'Elements'],
      },
    ])(
      'should render $type children correctly',
      ({ children, expectedTexts }) => {
        // Arrange
        const mockProps = createMockProps({ children });

        // Act
        render(<ConfirmationDialogComponent {...mockProps} />);

        // Assert
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();

        expectedTexts.forEach((text) => {
          expect(screen.getByText(text)).toBeInTheDocument();
        });
      }
    );
  });

  describe('Unexpected children values', () => {
    it.each([
      {
        scenario: 'null children',
        props: { children: null },
        expectError: false,
      },
      {
        scenario: 'undefined children',
        props: { children: undefined },
        expectError: false,
      },
    ])('should handle $scenario', ({ props, expectError }) => {
      // Arrange
      const mockProps = createMockProps(props);

      if (expectError) {
        // Act & Assert for error cases
        expect(() => {
          render(<ConfirmationDialogComponent {...mockProps} />);
        }).toThrow();
      } else {
        // Act
        render(<ConfirmationDialogComponent {...mockProps} />);

        // Assert
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      }
    });
  });

  it('should have correct accessibility attributes', () => {
    // Arrange
    const mockProps = createMockProps({
      title: 'Accessible Dialog Title',
      labels: {
        closeButton: 'Cancel',
        acceptButton: 'Confirm',
      },
    });

    // Act
    render(<ConfirmationDialogComponent {...mockProps} />);

    // Assert

    // role="dialog"
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // 2. title aria-labelledby
    const titleEl = screen.getByText('Accessible Dialog Title');
    expect(titleEl).toHaveAttribute('id');

    const labelledById = titleEl.getAttribute('id');
    expect(dialog).toHaveAttribute('aria-labelledby', labelledById);

    // 3. accesible buttons text
    const closeBtn = screen.getByRole('button', { name: 'Cancel' });
    const acceptBtn = screen.getByRole('button', { name: 'Confirm' });

    expect(closeBtn).toBeVisible();
    expect(acceptBtn).toBeVisible();
  });
});

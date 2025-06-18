import { renderHook } from '@testing-library/react';
import { useConfirmationDialog } from './confirmation-dialog.hook';
import { createEmptyLookup } from '#common/models';
import { act } from '@testing-library/react';

vi.mock('#common/models', () => ({
  createEmptyLookup: vi.fn(),
}));

describe('useConfirmationDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(createEmptyLookup).mockReturnValue({
      id: '',
      name: '',
    });
  });

  describe('Initial State', () => {
    it('should return correct initial state', () => {
      // Arrange & Act
      const { result } = renderHook(() => useConfirmationDialog());

      // Assert
      expect(result.current.isOpen).toBe(false);
      expect(result.current.itemToDelete).toEqual({
        id: '',
        name: '',
      });
      expect(createEmptyLookup).toHaveBeenCalledTimes(1);
    });

    it('should expose all required functions as defined functions', () => {
      // Arrange & Act
      const { result } = renderHook(() => useConfirmationDialog());

      // Assert
      expect(typeof result.current.onAccept).toBe('function');
      expect(typeof result.current.onClose).toBe('function');
      expect(typeof result.current.onOpenDialog).toBe('function');
    });
  });

  describe('onOpenDialog', () => {
    it('should open dialog with valid item', () => {
      // Arrange
      const mockItem = { id: '123', name: 'Test Item' };
      const { result } = renderHook(() => useConfirmationDialog());

      // Act
      act(() => {
        result.current.onOpenDialog(mockItem);
      });

      // Assert
      expect(result.current.isOpen).toBe(true);
      expect(result.current.itemToDelete).toEqual(mockItem);
    });

    it('should replace previous item when opening dialog multiple times with different items', () => {
      // Arrange
      const firstItem = { id: '123', name: 'First Item' };
      const secondItem = { id: '456', name: 'Second Item' };
      const { result } = renderHook(() => useConfirmationDialog());

      // Act - Open dialog with first item
      act(() => {
        result.current.onOpenDialog(firstItem);
      });

      // Assert - Verify first item is set
      expect(result.current.isOpen).toBe(true);
      expect(result.current.itemToDelete).toEqual(firstItem);

      // Act - Open dialog with second item
      act(() => {
        result.current.onOpenDialog(secondItem);
      });

      // Assert - Verify second item replaced the first item
      expect(result.current.isOpen).toBe(true);
      expect(result.current.itemToDelete).toEqual(secondItem);
      expect(result.current.itemToDelete).not.toEqual(firstItem);
    });
  });
});

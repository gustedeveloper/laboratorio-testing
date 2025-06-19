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
      expect(createEmptyLookup).toHaveBeenCalled(); // Verify createEmptyLookup was called for initialization
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

  describe('onClose', () => {
    it('should close dialog while keeping itemToDelete unchanged', () => {
      // Arrange
      const mockItem = { id: '123', name: 'Test Item' };
      const { result } = renderHook(() => useConfirmationDialog());

      // Act - Open dialog first
      act(() => {
        result.current.onOpenDialog(mockItem);
      });

      // Assert - Verify dialog is open
      expect(result.current.isOpen).toBe(true);
      expect(result.current.itemToDelete).toEqual(mockItem);

      // Act - Close dialog
      act(() => {
        result.current.onClose();
      });

      // Assert - Verify dialog is closed but item remains
      expect(result.current.isOpen).toBe(false);
      expect(result.current.itemToDelete).toEqual(mockItem);
    });

    it('should handle closing already closed dialog without issues', () => {
      // Arrange
      const { result } = renderHook(() => useConfirmationDialog());

      // Assert - Verify initial state (dialog is closed)
      expect(result.current.isOpen).toBe(false);

      // Act - Close already closed dialog
      act(() => {
        result.current.onClose();
      });

      // Assert - Verify state remains consistent
      expect(result.current.isOpen).toBe(false);
      expect(result.current.itemToDelete).toEqual({
        id: '',
        name: '',
      });
    });
  });

  describe('onAccept', () => {
    it('should reset itemToDelete to empty lookup without changing isOpen state', () => {
      // Arrange
      const mockItem = { id: '123', name: 'Test Item' };
      const { result } = renderHook(() => useConfirmationDialog());

      // Act - Open dialog first
      act(() => {
        result.current.onOpenDialog(mockItem);
      });

      // Assert - Verify dialog is open with item
      expect(result.current.isOpen).toBe(true);
      expect(result.current.itemToDelete).toEqual(mockItem);

      // Act - Accept confirmation
      act(() => {
        result.current.onAccept();
      });

      // Assert - Verify itemToDelete is reset but isOpen remains unchanged
      expect(result.current.itemToDelete).toEqual({
        id: '',
        name: '',
      });
      expect(result.current.isOpen).toBe(true);
      expect(createEmptyLookup).toHaveBeenCalled(); // Verify createEmptyLookup was called for reset
    });

    it('should handle accepting when no item is set without errors', () => {
      // Arrange
      const { result } = renderHook(() => useConfirmationDialog());

      // Assert - Verify initial state (no item set, dialog closed)
      expect(result.current.isOpen).toBe(false);
      expect(result.current.itemToDelete).toEqual({
        id: '',
        name: '',
      });

      // Act - Accept without opening dialog first
      act(() => {
        result.current.onAccept();
      });

      // Assert - Verify itemToDelete remains empty and no errors thrown
      expect(result.current.itemToDelete).toEqual({
        id: '',
        name: '',
      });
      expect(result.current.isOpen).toBe(false);
      expect(createEmptyLookup).toHaveBeenCalled(); // Verify createEmptyLookup was called for reset
    });
  });

  describe('Complete Workflows', () => {
    it('should handle full dialog workflow correctly', () => {
      // Arrange
      const firstItem = { id: '123', name: 'First Item' };
      const secondItem = { id: '456', name: 'Second Item' };
      const { result } = renderHook(() => useConfirmationDialog());

      // Assert - Start with initial state
      expect(result.current.isOpen).toBe(false);
      expect(result.current.itemToDelete).toEqual({
        id: '',
        name: '',
      });

      // Act - Open dialog with first item
      act(() => {
        result.current.onOpenDialog(firstItem);
      });

      // Assert - Verify state after opening
      expect(result.current.isOpen).toBe(true);
      expect(result.current.itemToDelete).toEqual(firstItem);

      // Act - Close dialog
      act(() => {
        result.current.onClose();
      });

      // Assert - Verify state after closing
      expect(result.current.isOpen).toBe(false);
      expect(result.current.itemToDelete).toEqual(firstItem); // Item should remain

      // Act - Open dialog with different item
      act(() => {
        result.current.onOpenDialog(secondItem);
      });

      // Assert - Verify state after opening with new item
      expect(result.current.isOpen).toBe(true);
      expect(result.current.itemToDelete).toEqual(secondItem);

      // Act - Accept confirmation
      act(() => {
        result.current.onAccept();
      });

      // Assert - Verify final state after accept
      expect(result.current.isOpen).toBe(true); // Still open
      expect(result.current.itemToDelete).toEqual({
        id: '',
        name: '',
      }); // Item cleared
    });

    it('should handle accept and close workflow correctly', () => {
      // Arrange
      const mockItem = { id: '789', name: 'Test Item' };
      const { result } = renderHook(() => useConfirmationDialog());

      // Act - Open dialog with item
      act(() => {
        result.current.onOpenDialog(mockItem);
      });

      // Assert - Verify dialog is open with item
      expect(result.current.isOpen).toBe(true);
      expect(result.current.itemToDelete).toEqual(mockItem);

      // Act - Accept confirmation
      act(() => {
        result.current.onAccept();
      });

      // Assert - Verify item is cleared but dialog still open
      expect(result.current.isOpen).toBe(true);
      expect(result.current.itemToDelete).toEqual({
        id: '',
        name: '',
      });

      // Act - Close dialog
      act(() => {
        result.current.onClose();
      });

      // Assert - Verify final state: dialog closed, item empty
      expect(result.current.isOpen).toBe(false);
      expect(result.current.itemToDelete).toEqual({
        id: '',
        name: '',
      });
    });
  });
});

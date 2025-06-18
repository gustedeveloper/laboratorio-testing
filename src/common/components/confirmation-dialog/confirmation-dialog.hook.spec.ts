import { renderHook } from '@testing-library/react';
import { useConfirmationDialog } from './confirmation-dialog.hook';
import { createEmptyLookup } from '#common/models';

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
});

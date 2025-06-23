import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SpinnerComponent } from './spinner.component';
import * as promiseTracker from 'react-promise-tracker';

vi.mock('react-promise-tracker');

const mockUsePromiseTracker = vi.mocked(promiseTracker.usePromiseTracker);

describe('SpinnerComponent', () => {
  describe('Modal render', () => {
    it.each([
      {
        promiseInProgress: false,
        toBeInDocument: false,
        description: 'not render when promiseInProgress is false',
      },
      {
        promiseInProgress: true,
        toBeInDocument: true,
        description: 'render when promiseInProgress is true',
      },
    ])(
      'should $description when promise tracking is $promiseInProgress',
      ({ promiseInProgress, toBeInDocument }) => {
        //Arrange
        mockUsePromiseTracker.mockReturnValue({ promiseInProgress });

        //Act
        render(<SpinnerComponent />);

        //Assert
        if (toBeInDocument) {
          const spinner = screen.getByRole('presentation');
          expect(spinner).toBeInTheDocument();
        } else {
          const spinner = screen.queryByRole('presentation');
          expect(spinner).not.toBeInTheDocument();
        }
      }
    );
  });
});

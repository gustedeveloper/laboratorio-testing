import { describe, it, expect } from 'vitest';
import { mapProjectFromApiToVm } from './project.mapper';
import * as viewModel from './project.vm';
import * as apiModel from './api/project.api-model';

describe('mapProjectFromApiToVm', () => {
  it.each<{ apiProject: any; description: string }>([
    { apiProject: null, description: 'null' },
    { apiProject: undefined, description: 'undefined' },
    { apiProject: '', description: 'empty string' },
    { apiProject: 0, description: 'zero' },
    { apiProject: false, description: 'false' },
  ])(
    'should return an empty project if input project is $description',
    ({ apiProject }) => {
      // Arrange
      const expectedEmptyProject = viewModel.createEmptyProject();

      // Act
      const result = mapProjectFromApiToVm(apiProject);

      // Assert
      expect(result).toEqual(expectedEmptyProject);
    }
  );

  it.each<{ apiProject: any; description: string }>([
    { apiProject: [], description: 'empty array' },
    { apiProject: {}, description: 'empty object' },
  ])(
    'should attempt to map project even if input is $description (will likely fail)',
    ({ apiProject }) => {
      // Arrange & Act & Assert
      // These cases will attempt to spread the array/object as a project
      // This test documents the current behavior (which might be unexpected)
      expect(() => mapProjectFromApiToVm(apiProject)).not.toThrow();
    }
  );

  it('should map a project with no employees correctly', () => {
    // Arrange
    const apiProject: apiModel.Project = {
      id: 'project-1',
      name: 'Test Project Alpha',
      externalId: 'ext-alpha',
      comments: 'Comments for Alpha',
      isActive: true,
      employees: [],
    };

    const expectedVmProject: viewModel.Project = {
      id: 'project-1',
      name: 'Test Project Alpha',
      externalId: 'ext-alpha',
      comments: 'Comments for Alpha',
      isActive: true,
      employees: [],
    };

    // Act
    const result = mapProjectFromApiToVm(apiProject);

    // Assert
    expect(result).toEqual(expectedVmProject);
  });

  it('should map a project with undefined employees correctly', () => {
    // Arrange
    const apiProject: apiModel.Project = {
      id: 'project-1',
      name: 'Test Project Alpha',
      externalId: 'ext-alpha',
      comments: 'Comments for Alpha',
      isActive: true,
      employees: undefined,
    };

    const expectedVmProject: viewModel.Project = {
      id: 'project-1',
      name: 'Test Project Alpha',
      externalId: 'ext-alpha',
      comments: 'Comments for Alpha',
      isActive: true,
      employees: [],
    };
    // Act
    const result = mapProjectFromApiToVm(apiProject);

    // Assert
    expect(result).toEqual(expectedVmProject);
  });

  it('should map a project with employees correctly', () => {
    // Arrange
    const apiProject: apiModel.Project = {
      id: 'project-2',
      name: 'Test Project Beta',
      externalId: 'ext-beta',
      comments: 'Comments for Beta',
      isActive: false,
      employees: [
        { id: 'emp-100', employeeName: 'John Doe', isAssigned: true },
        { id: 'emp-101', employeeName: 'Jane Roe', isAssigned: false },
      ],
    };

    const expectedVmProject: viewModel.Project = {
      id: 'project-2',
      name: 'Test Project Beta',
      externalId: 'ext-beta',
      comments: 'Comments for Beta',
      isActive: false,
      employees: [
        { id: 'emp-100', employeeName: 'John Doe', isAssigned: true },
        { id: 'emp-101', employeeName: 'Jane Roe', isAssigned: false },
      ],
    };

    // Act
    const result = mapProjectFromApiToVm(apiProject);

    // Assert
    expect(result).toEqual(expectedVmProject);
  });
});

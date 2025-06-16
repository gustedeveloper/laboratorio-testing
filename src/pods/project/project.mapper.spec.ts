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
    { apiProject: [], description: 'empty array' },
    { apiProject: {}, description: 'empty object' },
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
    { apiProject: { name: 'Test' }, description: 'object without id property' },
    {
      apiProject: { id: 123, name: 'Test' },
      description: 'object with non-string id',
    },
    {
      apiProject: { id: null, name: 'Test' },
      description: 'object with null id',
    },
    {
      apiProject: { id: '', name: 'Test' },
      description: 'object with empty string id',
    },
  ])(
    'should return an empty project if input is $description',
    ({ apiProject }) => {
      // Arrange
      const expectedEmptyProject = viewModel.createEmptyProject();

      // Act
      const result = mapProjectFromApiToVm(apiProject);

      // Assert
      expect(result).toEqual(expectedEmptyProject);
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

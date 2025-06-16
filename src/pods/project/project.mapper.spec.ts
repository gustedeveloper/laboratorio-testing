import { describe, it, expect } from 'vitest';
import {
  mapProjectFromApiToVm,
  mapEmployeeSummaryFromApiToVm,
  mapEmployeeSummaryListFromApiToVm,
} from './project.mapper';
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

  it.each<{
    apiProject: apiModel.Project;
    expectedEmployees: viewModel.EmployeeSummary[];
    description: string;
  }>([
    {
      apiProject: {
        id: 'project-1',
        name: 'Test Project 1',
        externalId: '1',
        comments: 'Comments for project 1',
        isActive: true,
        employees: [],
      },
      expectedEmployees: [],
      description: 'empty employees array',
    },
    {
      apiProject: {
        id: 'project-1',
        name: 'Test Project 1',
        externalId: '1',
        comments: 'Comments for project 1',
        isActive: true,
        employees: undefined,
      },
      expectedEmployees: [],
      description: 'undefined employees',
    },
    {
      apiProject: {
        id: 'project-1',
        name: 'Test Project 1',
        externalId: '1',
        comments: 'Comments for project 1',
        isActive: true,
        employees: null,
      },
      expectedEmployees: [],
      description: 'null employees',
    },
    {
      apiProject: {
        id: 'project-2',
        name: 'Test Project 2',
        externalId: '2',
        comments: 'Comments for project 2',
        isActive: false,
        employees: [
          { id: 'emp0', employeeName: 'John Doe', isAssigned: true },
          { id: 'emp1', employeeName: 'Jane Roe', isAssigned: false },
        ],
      },
      expectedEmployees: [
        { id: 'emp0', employeeName: 'John Doe', isAssigned: true },
        { id: 'emp1', employeeName: 'Jane Roe', isAssigned: false },
      ],
      description: 'populated employees array',
    },
    {
      apiProject: {
        id: 'project-3',
        name: 'Test Project 3',
        externalId: '3',
        comments: 'Comments for project 3',
        isActive: true,
        employees: [
          { id: 'emp0', employeeName: 'Alice Smith', isAssigned: undefined },
          { id: 'emp1', employeeName: 'Bob Johnson', isAssigned: null },
        ],
      },
      expectedEmployees: [
        { id: 'emp0', employeeName: 'Alice Smith', isAssigned: undefined },
        { id: 'emp1', employeeName: 'Bob Johnson', isAssigned: null },
      ],
      description: 'employees with undefined/null properties',
    },
  ])(
    'should map a project with $description correctly',
    ({ apiProject, expectedEmployees }) => {
      // Arrange
      const expectedVmProject: viewModel.Project = {
        ...apiProject,
        employees: expectedEmployees,
      };

      // Act
      const result = mapProjectFromApiToVm(apiProject);

      // Assert
      expect(result).toEqual(expectedVmProject);
    }
  );
});

describe('mapEmployeeSummaryFromApiToVm', () => {
  it.each<{
    apiEmployee: apiModel.EmployeeSummary;
    expected: viewModel.EmployeeSummary;
    description: string;
  }>([
    {
      apiEmployee: {
        id: 'emp-1',
        employeeName: 'John Doe',
        isAssigned: true,
      },
      expected: {
        id: 'emp-1',
        employeeName: 'John Doe',
        isAssigned: true,
      },
      description: 'complete employee',
    },
    {
      apiEmployee: {
        id: 'emp-2',
        employeeName: 'Jane Smith',
        isAssigned: undefined,
      },
      expected: {
        id: 'emp-2',
        employeeName: 'Jane Smith',
        isAssigned: undefined,
      },
      description: 'employee with undefined isAssigned',
    },
    {
      apiEmployee: {
        id: 'emp-3',
        employeeName: 'Bob Johnson',
        isAssigned: null,
      },
      expected: {
        id: 'emp-3',
        employeeName: 'Bob Johnson',
        isAssigned: null,
      },
      description: 'employee with null isAssigned',
    },
    {
      apiEmployee: {
        id: 'emp-4',
        employeeName: 'Alice Brown',
      },
      expected: {
        id: 'emp-4',
        employeeName: 'Alice Brown',
      },
      description: 'employee without isAssigned property',
    },
  ])('should map $description correctly', ({ apiEmployee, expected }) => {
    // Act
    const result = mapEmployeeSummaryFromApiToVm(apiEmployee);

    // Assert
    expect(result).toEqual(expected);
  });
});

describe('mapEmployeeSummaryListFromApiToVm', () => {
  it.each<{
    apiEmployees: apiModel.EmployeeSummary[];
    expected: viewModel.EmployeeSummary[];
    description: string;
  }>([
    {
      apiEmployees: [],
      expected: [],
      description: 'empty array',
    },
    {
      apiEmployees: null,
      expected: [],
      description: 'null array',
    },
    {
      apiEmployees: undefined,
      expected: [],
      description: 'undefined array',
    },
    {
      apiEmployees: [
        { id: 'emp-1', employeeName: 'John Doe', isAssigned: true },
        { id: 'emp-2', employeeName: 'Jane Smith', isAssigned: false },
      ],
      expected: [
        { id: 'emp-1', employeeName: 'John Doe', isAssigned: true },
        { id: 'emp-2', employeeName: 'Jane Smith', isAssigned: false },
      ],
      description: 'array with valid employees',
    },
    {
      apiEmployees: [
        { id: 'emp-1', employeeName: 'John Doe', isAssigned: undefined },
        { id: 'emp-2', employeeName: 'Jane Smith', isAssigned: null },
        { id: 'emp-3', employeeName: 'Bob Johnson' },
      ],
      expected: [
        { id: 'emp-1', employeeName: 'John Doe', isAssigned: undefined },
        { id: 'emp-2', employeeName: 'Jane Smith', isAssigned: null },
        { id: 'emp-3', employeeName: 'Bob Johnson' },
      ],
      description: 'array with employees having undefined/null properties',
    },
  ])('should map $description correctly', ({ apiEmployees, expected }) => {
    // Act
    const result = mapEmployeeSummaryListFromApiToVm(apiEmployees);

    // Assert
    expect(result).toEqual(expected);
  });
});

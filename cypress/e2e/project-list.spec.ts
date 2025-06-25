import { mockProjectList } from '../../src/pods/project-list/api/project-list.mock-data';

const projectListEndPoint = '/projects';

const tableHeaders = [
  'Activo',
  'Código',
  'Proyecto',
  'Fecha Ultimo incurrido',
  'Fecha creación',
];

describe('Project List Scene specs', () => {
  it('should visit project list page', () => {
    // Arrange

    // Act
    cy.visit(projectListEndPoint);

    // Assert
  });

  describe('Table Structure', () => {
    it('should display table', () => {
      // Arrange

      // Act
      cy.visit(projectListEndPoint);

      // Assert
      cy.get('table').should('exist');
    });

    it('should display all table headers', () => {
      // Arrange

      // Act
      cy.visit(projectListEndPoint);

      // Assert
      cy.get('table').should('exist');
      tableHeaders.forEach((header) => {
        cy.contains(header).should('be.visible');
      });
    });
  });

  describe('Data Display', () => {
    const visibleProjects = mockProjectList.slice(0, 5);

    describe('Project values', () => {
      it('should display project codes correctly', () => {
        // Arrange

        // Act
        cy.visit(projectListEndPoint);

        // Assert
        visibleProjects.forEach((project) => {
          cy.contains(project.code).should('be.visible');
        });
      });

      it('should display project names correctly', () => {
        // Arrange

        // Act
        cy.visit(projectListEndPoint);

        // Assert
        visibleProjects.forEach((project) => {
          cy.contains(project.name).should('be.visible');
        });
      });

      it('should display project dates correctly', () => {
        // Arrange

        // Act
        cy.visit(projectListEndPoint);

        // Assert
        cy.get('tbody tr').each(($row, index) => {
          const project = visibleProjects[index];

          cy.wrap($row).within(() => {
            cy.contains(project.creationDate).should('be.visible');
            cy.contains(project.lastDateIncurred).should('be.visible');
          });
        });
      });
    });

    describe('Project status (active/inactive)', () => {
      it('should display correct checkbox status per project', () => {
        // Arrange

        // Act
        cy.visit(projectListEndPoint);

        // Assert
        // Check checkboxes exist and are disabled
        cy.get('tbody tr input[type="checkbox"]')
          .should('have.length', visibleProjects.length)
          .each(($checkbox) => {
            cy.wrap($checkbox).should('be.disabled');
          });

        // Check checked/unchecked based on isActive
        cy.get('tbody tr').each(($row, index) => {
          const project = visibleProjects[index];

          cy.wrap($row)
            .find('input[type="checkbox"]')
            .should(project.isActive ? 'be.checked' : 'not.be.checked');
        });
      });
    });
  });
});

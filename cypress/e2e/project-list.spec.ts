import { mockProjectList } from '../../src/pods/project-list/api/project-list.mock-data';
import '@testing-library/cypress/add-commands';

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
    beforeEach(() => {
      cy.visit(projectListEndPoint);
    });

    it('should display table', () => {
      // Arrange

      // Act

      // Assert
      cy.get('table').should('exist');
    });

    it('should display all table headers', () => {
      // Arrange

      // Act

      // Assert
      cy.get('table').should('exist');
      tableHeaders.forEach((header) => {
        cy.contains(header).should('be.visible');
      });
    });
  });

  describe('Data Display', () => {
    beforeEach(() => {
      cy.visit(projectListEndPoint);
    });

    const visibleProjects = mockProjectList.slice(0, 5);

    describe('Project values', () => {
      it('should display project codes correctly', () => {
        // Arrange

        // Act

        // Assert
        visibleProjects.forEach((project) => {
          cy.contains(project.code).should('be.visible');
        });
      });

      it('should display project names correctly', () => {
        // Arrange

        // Act

        // Assert
        visibleProjects.forEach((project) => {
          cy.contains(project.name).should('be.visible');
        });
      });

      it('should display project dates correctly', () => {
        // Arrange

        // Act

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

  describe('Action Buttons', () => {
    beforeEach(() => {
      cy.visit(projectListEndPoint);
    });

    describe('Button visibility', () => {
      it('should display one edit and one delete button per project row', () => {
        // Arrange

        // Act

        // Assert

        cy.get('[data-testid="EditIcon"]')
          .should('have.length', 5)
          .and('be.visible');

        cy.get('[data-testid="DeleteIcon"]')
          .should('have.length', 5)
          .and('be.visible');
      });
    });

    describe('Edit button behavior', () => {
      it('should navigate to the edit view when clicking the first edit button', () => {
        // Arrange

        // Act
        cy.get('[data-testid="EditIcon"]').first().click();

        // Assert
        cy.url().should('include', '/projects/1');
        cy.contains('Datos').should('be.visible');
      });
    });

    describe('Delete button behavior', () => {
      beforeEach(() => {
        cy.get('[data-testid="DeleteIcon"]').first().click();
      });

      it('should open confirmation dialog when clicking the first delete button', () => {
        // Arrange

        // Act

        // Assert
        cy.findByRole('dialog').should('be.visible');
        cy.contains('¿Seguro que quiere borrar a Bankia?').should('be.visible');
      });

      it('should close the dialog when clicking "Cancelar"', () => {
        // Arrange

        // Act

        // Assert
        cy.findByRole('button', { name: 'Cancelar' }).click();
        cy.findByRole('dialog').should('not.exist');
        cy.contains('Bankia').should('exist');
      });

      it('should delete the project when clicking "Aceptar"', () => {
        // Arrange

        // Act

        // Assert
        cy.findByRole('button', { name: 'Aceptar' }).click();
        cy.findByRole('dialog').should('not.exist');
        cy.contains('Bankia').should('not.exist');
      });
    });
  });
});

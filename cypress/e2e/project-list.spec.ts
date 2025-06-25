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

  // Table Structure

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
});

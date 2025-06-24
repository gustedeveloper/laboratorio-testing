describe('Project specs', () => {
  it('should load new project page', () => {
    // Arrange

    // Act
    cy.visit('#/projects');
    cy.contains('Nuevo proyecto');

    // Assert
  });
});

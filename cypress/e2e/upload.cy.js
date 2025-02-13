describe('Document Upload & Management Page', () => {
  const username = 'tanmay625'; // Use an existing username from the JSON
  const fileName = 'product_list(25).pdf'; // Ensure this file exists in cypress/fixtures
  const baseUrl = `http://localhost:3000/api/users/${username}`;

  beforeEach(() => {
    cy.visit(`http://localhost:4200/documents?user=${username}`); // Visit page with user param
    cy.intercept('GET', baseUrl, { fixture: 'users.json' }).as('getUserDocuments');
  });

  it('should load the document upload form', () => {
    cy.get('h2').contains('Document Upload & Management').should('be.visible');
    cy.get('input[type="file"]').should('exist');
  });

  it('should select a file', () => {
    cy.get('input[type="file"]').selectFile('cypress/fixtures/' + fileName, { force: true });
  });
});

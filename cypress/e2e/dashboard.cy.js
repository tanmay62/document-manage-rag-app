describe('Dashboard Page Tests', () => {
  const dashboardUrl = '/dashboard?user=testuser';

  beforeEach(() => {
    cy.visit(dashboardUrl);
  });

  it('should display the correct dashboard title and description', () => {
    cy.contains('Welcome to the Dashboard').should('be.visible');
    cy.contains('Manage your documents, users, and monitor the ingestion process efficiently.').should('be.visible');
  });

  it('should display user information correctly', () => {
    cy.get('.card-header.bg-primary').should('contain', 'User Overview');
    cy.contains('Welcome back, testuser!').should('exist');
  });

  it('should display document count and manage documents button', () => {
    cy.get('.card-header.bg-secondary').should('contain', 'Document Management');
    cy.contains('Documents Uploaded').should('exist');
    cy.get('a.btn-outline-primary')
      .should('have.attr', 'href')
      .and('include', '/documents?user=testuser');
  });

  it('should display ingestion status correctly', () => {
    cy.get('.card-header.bg-success').should('contain', 'Ingestion Status');
    cy.contains('Current Status').should('exist');
  });

  it('should log out when clicking the logout button', () => {
    cy.get('.btn-outline-dark').click();
    cy.url().should('not.include', '/dashboard');
  });

  it('should hide "Manage Users" button for non-admin users', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('userRole', 'User');
    });

    cy.reload();
    cy.contains('Manage Users').should('not.exist');
  });
});

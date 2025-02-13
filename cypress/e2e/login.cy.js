describe('Login Page Test', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form with required fields', () => {
    cy.get('h3').should('have.text', 'Login');
    cy.get('input[formControlName="email"]').should('exist').and('be.visible');
    cy.get('input[formControlName="password"]').should('exist').and('be.visible');
    cy.get('button[name="login"]').should('exist').and('be.visible').and('be.disabled');
  });

  it('should show validation errors when submitting an empty form', () => {
    cy.get('button[name="login"]').should('be.disabled');
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('input[formControlName="password"]').focus().blur();
    cy.contains('Email is required.').should('be.visible');
    cy.contains('Password is required.').should('be.visible');
    cy.get('button[name="login"]').should('be.disabled');
  });

});

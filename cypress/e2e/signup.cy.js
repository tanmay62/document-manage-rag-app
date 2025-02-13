const { delay } = require("rxjs");

describe('Sign Up Page Test', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('should display the sign-up form with all fields and button disabled initially', () => {
    cy.get('h2').should('have.text', 'Sign Up');
    cy.get('input[formControlName="username"]').should('exist').and('be.visible');
    cy.get('input[formControlName="email"]').should('exist').and('be.visible');
    cy.get('input[formControlName="password"]').should('exist').and('be.visible');
    cy.get('input[formControlName="confirmPassword"]').should('exist').and('be.visible');
    cy.get('button[type="submit"]').should('exist').and('be.visible').and('be.disabled');
  });

  it('should show an error if passwords do not match', () => {
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('input[formControlName="confirmPassword"]').type('differentpass').blur();
    cy.contains('Passwords do not match').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should enable the sign-up button when all inputs are valid', () => {
    cy.get('input[formControlName="username"]').type('testuser');
    cy.get('input[formControlName="email"]').type('test@example.com');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('input[formControlName="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });


  it('should successfully submit the form when valid inputs are provided', () => {
    cy.intercept('POST', '/api/signup', {
      statusCode: 201,
      body: { message: 'User registered successfully' },
    }).as('signupRequest');

    cy.get('input[formControlName="username"]').type('newuser');
    cy.get('input[formControlName="email"]').type('newuser@example.com');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('input[formControlName="confirmPassword"]').type('password123');

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@signupRequest');
    cy.contains('User registered successfully').should('not.exist');
  });
});

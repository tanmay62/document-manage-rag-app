describe('Q&A Interface', () => {
  const username = 'tanmay625';
  const question = 'What is Angular?';
  const answer = 'Angular is a platform for building web applications.';
  const documentExcerpt = 'Angular is a framework developed by Google for front-end development.';

  beforeEach(() => {
    cy.visit(`http://localhost:4200/qna?user=${username}`);
  });

  it('should load the Q&A interface correctly', () => {
    cy.get('h2').contains('Q&A Interface').should('be.visible');
    cy.get('.alert-secondary').should('contain.text', `Welcome, ${username}`);
    cy.get('input#question').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Submit Question');
  });

  it('should allow the user to type a question', () => {
    cy.get('input#question').type(question);
    cy.wait(500);
    cy.get('input#question').should('have.value', question);
  });


  it('should display a loading indicator on question submission', () => {
    cy.get('input#question').type(question);
    cy.get('button[type="submit"]').click();
    cy.get('.spinner-border').should('be.visible');
    cy.get('.text-muted').should('contain.text', 'Searching for answers...');
  });

  it('should display the answer and relevant document after loading', () => {
    cy.fixture('answer.json').then((data) => {
      expect(data).to.be.an('array').and.not.be.empty;

      const testEntry = data[0];

      expect(testEntry).to.have.property('question');
      expect(testEntry).to.have.property('answer');
      expect(testEntry).to.have.property('documentExcerpt');

      const { question, answer, documentExcerpt } = testEntry;

      if (typeof question === 'string' && question.trim().length > 0) {
        cy.get('input#question').clear().type(question);
      } else {
        throw new Error('Invalid or missing "question" field in fixture.');
      }

      cy.get('button[type="submit"]').click();
      cy.wait(500);
      cy.get('.alert-success').should('contain.text', answer);
      cy.get('.alert-light').should('contain.text', documentExcerpt);
    });
  });

  it('should navigate to the dashboard when clicking "Go to Dashboard"', () => {
    cy.get('.btn-primary').contains('Go to dashboard').click();
    cy.url().should('include', `/dashboard?user=${username}`);
  });
});

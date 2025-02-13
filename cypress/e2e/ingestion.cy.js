describe('Document Ingestion Page Tests', () => {
  const ingestionUrl = '/ingestion?user=testuser';

  beforeEach(() => {
    cy.visit(ingestionUrl);
  });

  it('should display the correct page title and description', () => {
    cy.contains('Document Ingestion').should('be.visible');
    cy.contains('Trigger the ingestion process and monitor the progress.').should('be.visible');
  });

  it('should display the Start Ingestion button and be enabled initially', () => {
    cy.get('button.btn-primary')
      .should('contain', 'Start Ingestion')
      .should('not.be.disabled');
  });

  it('should disable the button and show progress bar after clicking Start Ingestion', () => {
    cy.get('button.btn-primary').click();

    cy.get('button.btn-primary').should('be.disabled');

    cy.get('.progress').should('be.visible');
    cy.get('.progress-bar').should('exist');
  });

  it('should show increasing progress percentage', () => {
    cy.get('button.btn-primary').click();

    cy.get('.progress-bar', { timeout: 6000 }).should('exist');

    cy.waitUntil(() =>
      cy.get('.progress-bar').invoke('text').then((text) => {
        const progress = text.trim().replace(/\u00a0/g, '');
        return parseInt(progress) > 0;
      }),
      { timeout: 10000, interval: 500 }
    );

    cy.get('.progress-bar')
      .invoke('text')
      .should((text) => {
        const progress = text.trim().replace(/\u00a0/g, '');
        expect(progress).to.match(/[1-9][0-9]?%/);
      });
  });


  it('should reach 100% progress and mark process as completed', () => {
    cy.get('button.btn-primary').click();

    cy.wait(5000);
    cy.get('.progress-bar').should('contain', '100%');
  });

  it('should maintain the user query parameter in the URL', () => {
    cy.url().should('include', 'user=testuser');
  });
});

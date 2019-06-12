context('Stock', () => {
  beforeEach(() => {
    cy.visit('/stock')
  })

  it('is prerendered', () => {
    cy.get('.location').should('exist')
  })

  it('is dynamic', () => {
    cy.get('#main-navigation')
      .contains('a', 'settings')
      .click()

    cy.get('#main-navigation')
      .contains('a', 'stock')
      .click()

    cy.get('.location').should('exist')
  })
})

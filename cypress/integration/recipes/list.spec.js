context('Recipe list', () => {
  beforeEach(() => {
    cy.visit('/recipes')
  })

  it('is prerendered', () => {
    cy.get('.recipes .recipe').should('exist')
  })

  it('is dynamic', () => {
    cy.get('#main-navigation')
      .contains('a', 'settings')
      .click()

    cy.get('#main-navigation')
      .contains('a', 'recipes')
      .click()

    cy.get('.recipes .recipe').should('exist')
  })
})

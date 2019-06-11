context('Recipe list', () => {
  beforeEach(() => {
    cy.visit('/recipes')
  })

  it('exists', () => {
    cy.get('.recipes .recipe').should('exist')
  })
})

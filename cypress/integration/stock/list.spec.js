context('Stock', () => {
  beforeEach(() => {
    cy.visit('/stock')
  })

  it('exists', () => {
    cy.get('.location').should('exist')
  })
})

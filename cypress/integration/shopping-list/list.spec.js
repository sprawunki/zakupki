context('Shopping list', () => {
  beforeEach(() => {
    cy.visit('/list')
  })

  it('exists', () => {
    cy.get('.shopping-list .list-item').should('exist')
  })
})

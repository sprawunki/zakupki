context('Shopping list', () => {
  beforeEach(() => {
    cy.server()
    cy.fixture('shoppinglist').as('shoppingList')
    cy.route('http://192.168.0.100:9080/**', '@shoppingList').as('api')

    cy.get('#main-navigation')
      .contains('a', 'list')
      .click()
  })

  it('exists', () => {
    cy.get('.shopping-list .list-item').should('exist')
  })
})

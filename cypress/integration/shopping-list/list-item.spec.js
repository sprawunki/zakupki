context('Shopping list item', () => {
  beforeEach(() => {
    cy.server()
    cy.fixture('shoppinglist').as('shoppingList')
    cy.route('http://192.168.0.100:9080/**', '@shoppingList').as('api')

    cy.get('#main-navigation')
      .contains('a', 'list')
      .click()
  })

  it('can be marked as complete', () => {
    cy.get('.shopping-list .list-item')
      .contains('li', 'Chocolate')
      .click()

    cy.get('.shopping-list .list-item')
      .last()
      .should('contain', 'Chocolate')

    cy.get('#main-navigation')
      .contains('a', 'settings')
      .click()

    cy.get('#main-navigation')
      .contains('a', 'list')
      .click()

    cy.get('.shopping-list')
      .contains('.list-item', 'Chocolate')
      .find('input[type="checkbox"]')
      .should('be.checked')

    cy.get('.shopping-list')
      .find('.list-item')
      .last()
      .find('input[type="checkbox"]')
      .should('be.checked')
  })
})

context('Recipe list', () => {
  beforeEach(() => {
    cy.fixture('recipes').as('recipes')
    cy.server()
    cy.route('http://192.168.0.100:9080/**', '@recipes').as('api')

    cy.visit('/')
    cy.get('#main-navigation')
      .contains('a', 'recipes')
      .click()
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

  it('has an out-of-stock item', () => {
    cy.get('.recipe')
      .contains('.product', 'out-of-stock')
      .should('have.class', 'out-of-stock')
  })

  it('has a low-stock item', () => {
    cy.get('.recipe')
      .contains('.product', 'low-stock')
      .should('have.class', 'low-stock')
  })

  it('has a soon-to-expire/expired item', () => {
    cy.get('.recipe')
      .contains('.product', 'expired')
      .should('have.class', 'expires-soon')
  })

  it('has a soon-to-expire/expired low-stock item', () => {
    cy.get('.recipe')
      .contains('.product', 'low-stock & expired')
      .should('have.class', 'expires-soon')
      .should('have.class', 'low-stock')
  })
})

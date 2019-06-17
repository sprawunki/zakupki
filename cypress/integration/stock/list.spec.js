context('Stock', () => {
  beforeEach(() => {
    cy.fixture('stock').as('stock')
    cy.server()
    cy.route('http://192.168.0.100:9080/**', '@stock').as('api')

    cy.get('#main-navigation')
      .contains('a', 'stock')
      .click()
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

  it("doesn't show items that are note in stock", () => {
    cy.get('.location')
      .contains('.product', 'not-in-stock')
      .should('not.exist')
  })

  it('has an out-of-stock item', () => {
    cy.get('.location')
      .contains('.product', 'out-of-stock')
      .should('have.class', 'out-of-stock')
  })

  it('has a low-stock item', () => {
    cy.get('.location')
      .contains('.product', 'low-stock')
      .should('have.class', 'low-stock')
  })

  it('has a soon-to-expire/expired item', () => {
    cy.get('.location')
      .contains('.product', 'expired')
      .should('have.class', 'expires-soon')
  })

  it('has a soon-to-expire/expired low-stock item', () => {
    cy.get('.location')
      .contains('.product', 'low-stock & expired')
      .should('have.class', 'expires-soon')
      .should('have.class', 'low-stock')
  })
})

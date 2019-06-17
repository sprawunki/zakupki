context('App', () => {
  it('has a favicon', () => {
    cy.request('/favicon.ico').then(resp => {
      expect(resp.status).to.eq(200)
    })
  })
})

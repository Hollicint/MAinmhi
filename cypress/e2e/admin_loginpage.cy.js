describe('Check Admin Login', () => {
  it('passes', () => {
      cy.visit('http://localhost:3000/admin/admin_loginpage');

      cy.get('input[name="username"]').type('peter.admin');
      cy.get('input[name="password"]').type('password123');

      cy.get('button[type="submit"]').click();

      //confirm to land on Admin profile page
      cy.url().should('include', '/admin/admin_profile');

      //Logout
      cy.get('[data-cy="adminLogout"]').first().click({force:true});
      // confirm lands on Index/Home page
     cy.url().should('include', '/');
  })
})
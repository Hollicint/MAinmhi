describe('Check login, locate pet profile, create claim, and logout', () => {
  it('Check runs and passes', () => {
    // locates site and user login page
    cy.visit('http://localhost:3000/user/user_loginpage');
    // enters users login details
    cy.get('input[name="username"]').type('Athomas');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    //confirm to land on users profile page
    cy.url().should('include', '/user/user_profile');
    // locate and click on the pet link
    cy.get('[data-cy="petLink"]').first().click({force:true});
    // confirm lands on pet profile
    cy.url().should('include', '/user/pets_profile');
    // locate and click on the new claim link
    cy.get('[data-cy="claimLink"]').first().click({force:true});
     // confirm lands on new claim
    cy.url().should('include', '/user/new_claims');
   
    // Claim form
    cy.get('input[name="claimTitle"]').type('Knee Injury');
    cy.get('[data-cy="claimDescrip"]').type('Lame on one leg after jumping');
    cy.get('select[name="areaOfIssue"]').select('Back Right');
    cy.get('input[name="incidentStartDate"]').type('2025-06-29').click({force:true});
    cy.get('input[name="vetDate"]').type('2025-07-03').click({force:true});
    cy.get('[data-cy="vetDetailNote"]').type('Xray and on pain tablets. Bed rest');
    cy.get('select[name="claimStatus"]').select('claim Working');
    cy.get('input[name="claimAmount"]').type('450');
    cy.get('[data-cy="extraDetails"]').type('Might need another check and could leave to surgery');
    cy.get('button[type="submit"]').click();

    //Find Pet Profile button to go back to home page
    cy.get('[data-cy="petLink"]').first().click({force:true});
    // confirm lands on pet profile
    cy.url().should('include', '/user/pets_profile');

    //Logout
    cy.get('[data-cy="userLogout"]').first().click({force:true});
    // confirm lands on Index/Home page
    cy.url().should('include', '/');
  })
})


  //cy.contains('Pet Name: <%= pet.petName %>').parents().find('a').click()
  //cy.location('pathname').should('include', '/user/pets_profile');
  // cy.location('href').should('include', '/user/pets_profile/<%= pet._id %>')
  // cy.contains('/user/pets_profile/<%= pet._id %>').click()
  // cy.location('pathname').should('eq', '/blog')
  // cy.location('search').should('eq', '?name=Cookie');
  // cy.contains("a", "/user/pets_profile/<%= pet._id %>"); 
  //cy.get('textarea').type('Lame on one leg after jumping');
  // cy.get('input[name="claimDescription"]').type('Lame on one leg after jumping');
  //cy.get('#areaOfIssue').select('Back Left');
  // cy.get('select').select('Back Left') .invoke("val").should("eq",'back Left')
      //cy.get('select[name="incidentStartDate"]').clear().type('2025-06-29').trigger('keydown', { key: 'Enter',}).should('have.value', '2025-06-29');
    //cy.get('select[name="incidentStartDate"]').select('2025-06-29');

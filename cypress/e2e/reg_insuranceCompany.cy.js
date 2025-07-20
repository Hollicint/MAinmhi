describe('Complete Register Form for Register Insurance Form', () => {
  it('Fill in form and save', () => {
    cy.visit('http://localhost:3000/insurance/insurance_loginpage');
    cy.get('[data-cy="regICU"]').first().click({force:true});

    //filling in Reg Form
    cy.get('input[name="staffFirstName"]').type('Angela');
    cy.get('input[name="staffLastName"]').type('Booth');
    cy.get('input[name="staffEmailAddress"]').type('Angela.Booth@premInsurance.com');
    cy.get('input[name="staffContactNumber"]').type('01 203 1211');
    cy.get('input[name="staffNumber"]').type('1211');
    cy.get('input[name="staffRole"]').type('Customer Rep'); 
    
    cy.get('input[name="username"]').type('AngelaB');  
    cy.get('input[name="password"]').type('password123');  

    
    cy.get('input[name="insuranceCompanyName"]').type('Prem One Insurance');  
    cy.get('input[name="insuranceCompanyEmail"]').type('support@premInsurance.com');  
    cy.get('input[name="insuranceCompanyContact"]').type('01 203 0011');  
    cy.get('input[name="insuranceCompanyAddress"]').type('52 Heigh Shaft, May TenRoad');      

    cy.get('button[type="submit"]').click();

  })
})
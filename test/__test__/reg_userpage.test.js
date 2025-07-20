const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const RegisterUser = require('../../models/registeruser');

//Unit Testing
describe('Testing Functions of Registering User', () => {

    //Checking Email correct format is being checked 
   test('Checking emai inputed format to Pass', ()=> {
       const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
       expect(emailFormat.test('taiberry@gmail.com')).toBe(true);
       //expect(emailFormat.test('taiberrygmail.com')).toBe(false)
   });
   //Checking Email incorrect format is being checked 
   test('Checking emai inputed format to Fail', ()=> {
       const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
       //expect(emailFormat.test('taiberry@gmail.com')).toBe(true);
       expect(emailFormat.test('taiberrygmail.com')).toBe(false)

   });   
    //Checking Username correct input is being checked 
   test('Checking Username must be more than 6 characters', ()=> {
       const username = "tiaberry"
       expect(username.length).toBeGreaterThanOrEqual(6);
       expect('tiaberry'.length).toBeGreaterThanOrEqual(6);
       //expect('tia'.length).toBeLessThan(6);
   });
  //Checking Username incorrect input is being checked 
    test('Checking Username must be less than 6 characters', ()=> {
       const username = "tiaberry"
       expect(username.length).toBeGreaterThanOrEqual(6);
      // expect('tiaberry'.length).toBeGreaterThanOrEqual(6);
       expect('tia'.length).toBeLessThan(6);
   });

   // Checking Password input length is correct
    test('Checking Password must contain 8-14 characters', ()=> {
        const password = "password123"
        expect(password.length).toBeGreaterThanOrEqual(8);
        expect('password123'.length).toBeGreaterThanOrEqual(8);
      
    });
     // Checking Password input length is incorrect
    test('Checking Password doesnt contain 8-14 characters', ()=> {
        const password = "password123"
        expect(password.length).toBeGreaterThanOrEqual(8);
        expect('pass'.length).toBeLessThan(8);
      
    });


});

afterAll( async() => {
     await mongoose.connection.close();
 });
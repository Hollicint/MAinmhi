//integration  testing
const request = require('supertest');
const app = require('../../app');
//const mockingoose = require('../../__mock__/registeruser');
const mongoose = require('mongoose');
const RegisterUser = require('../../models/registeruser');
const bcrypt = require('bcrypt');

// mock
jest.mock('../../models/registeruser');
//jest.mock('bcrypt',() =>({
//  compare: jest.fn(() => true)
//}));
jest.mock('bcrypt');

describe('Testing User Login Page', () => {
   test('Should pass the login ', async ()=> {
     const userDetails ={
       _id: '001',
       username: 'Athomas',
       password: 'password123'
     };
     RegisterUser.findOne.mockResolvedValue(userDetails);
     bcrypt.compare.mockResolvedValue(true);
     const response = await request(app)
        .post('/user/user_loginpage')
        .send({
            username: 'Athomas',
            password: 'password123'
        });
     expect(response.status).toBe(200);
  
    // expect(response.header.location).toContain('/user/user_profile'); 
     //expect(response.text).toContain('<h1>Login </h1> ');
  }); 
  
  //  test('Should not pass the login ', async ()=> {
  //      const userDetails ={
  //      _id: '001',
  //      username: 'Athomas',
  //      password: 'password123'
  //    };
  //    RegisterUser.findOne.mockResolvedValue(userDetails);
  //    bcrypt.compare.mockResolvedValue(false)

  //    const response = await request(app)
  //       .post('/user/user_loginpage')
  //       .send({
  //           username: 'at',
  //           password: 'password123'
  //       });
  //    expect(response.status).toBe(404);
  // 
  //   // expect(response.header.location).toContain('/user/user_profile'); 
  //    //expect(response.text).toContain('<h1>Login </h1> ');
  //}); 

//    test('username missing should not pass the login ', async ()=> {
//
//      const userDetails ={
//        _id: '001',
//        username: 'Athomas',
//        password: 'password123'
//      };
//
//      RegisterUser.findOne.mockResolvedValue(userDetails);
//      bcrypt.compare.mockResolvedValue(false);
//
//      const response = await request(app)
//         .post('/user/user_loginpage')
//         .send({
//             username: '',
//             password: 'password123'
//         });
//
//      expect(response.status).toBe(404);
//    //  expect(response.text).toContain("Username is missing");
//   
//     // expect(response.header.location).toContain('/user/user_profile'); 
//      //expect(response.text).toContain('<h1>Login </h1> ');
//  }); 
//
//      test('password missing should not pass the login ', async ()=> {
//
//      const userDetails ={
//        _id: '001',
//        username: 'Athomas',
//        password: 'password123'
//      };
//
//      RegisterUser.findOne.mockResolvedValue(userDetails);
//      bcrypt.compare.mockResolvedValue(false);
//
//      const response = await request(app)
//         .post('/user/user_loginpage')
//         .send({
//             username: 'Athomas',
//             password: ''
//         });
//
//      expect(response.status).toBe(404);
//
//  }); 

});  


afterAll(async () => {
 await mongoose.connection.close();
});



// firstName: 'Tia',
      // lastName: 'Berry',
      // emailAddress: 'TiaBerry@gmail.com',
      // contactNumber:'+353 092 111 1234',
      // dateOfBirth: '1997-10-21',
      // address: '101 Street Road',
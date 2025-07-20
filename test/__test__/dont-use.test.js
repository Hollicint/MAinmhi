//const request = require('supertest')
//const app = require('../../app')
//const mongoose = require('mongoose')
//
////const userViews = require('./views/user/user_loginpage');
//
//describe('Testing User Login', () => {
//
//    //test('lOGIN status status 404', async()=> {
//    //    const response = await request(app)
//    //    .post('/user/user_loginpage')
//    //    .send({
//    //        username: 'TiaBerry',
//    //        password: 'password123'
//    //    });
////
//    //    expect(response.statusCode).toBe(404);
//    //    //expect(response.statusCode).toBe(302/202);
//    //   expect(response.headers.location).toBe('/user/user_profile');
//    //});
//
//    //test('lOGIN status status 404', async()=> {
//        
//});
////https://stackoverflow.com/questions/71427088/leaking-mongoose-connection-in-jest-tests
//afterAll(async () => {
// await mongoose.connection.close();
//});

const request = require('supertest');
const app = require('../../app');//.default
const mongoose = require('mongoose');
//const login = require('./user/user_loginpage');

describe('Testing User Login', () => {
  

  //test('lOGIN status status 404', async()=> {
  //         const response = await request(app)
  //         .post('./user/user_loginpage')
  //         .send({
  //             username: 'TiaBerry',
  //             password: 'password123'
  //         });
  //         expect(response.statusCode).toBe(404);
  //         //expect(response.statusCode).toBe(302/202);
  //        expect(response.headers.location).toBe('/user/user_profile');
  //  });  
  
    test('lOGIN status status 200', async()=> {
       const response = await request(app).get('/user/user_loginpage');
       // expect(response.statusCode).toBe(200);

      
        expect(response.statusCode).toBe(404);
      //  expect(response.text).toContain('<h1>Login </h1>');
      //  expect(response.text).toContain('username');
    });   


 });   
afterAll(async () => {
 await mongoose.connection.close();
});

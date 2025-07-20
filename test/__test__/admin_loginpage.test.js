const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const AdminUser = require('../../models/adminuser');
const bcrypt = require('bcrypt');

// mock
jest.mock('../../models/adminuser');
jest.mock('bcrypt');


describe('Testing Admin Login Page', () => {
    test('Should pass the login ', async ()=> {

  }); 

});  



afterAll(async () => {
 await mongoose.connection.close();
});

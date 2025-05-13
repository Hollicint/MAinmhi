const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const regUserSchema= new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    //paymentType: {
     //   type: String,
     //   required: true
    //},
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },   
}, { timestamps: true });

// creating the registerUser model entry
const RegisterUser = mongoose.model("registeruser", regUserSchema);

//export the User Login Details
module.exports = RegisterUser;
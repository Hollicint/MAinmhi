const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userLoginSchema= new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNum: {
        type: String,
        required: true
    },
}, { timestamps: true });

// creating the userlogindetail model entry
const UserLoginDetail = mongoose.model("userlogindetail", userLoginSchema);

//export the User Login Details
module.exports = UserLoginDetail;
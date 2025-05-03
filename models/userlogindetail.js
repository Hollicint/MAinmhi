const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userLoginSchema= new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true });

// creating the userlogindetail model entry
const UserLoginDetail = mongoose.model("userlogindetail", userLoginSchema);

//export the User Login Details
module.exports = UserLoginDetail;
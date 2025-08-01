const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminUserSchema= new Schema({
    adminfirstName: {
        type: String,
        required: true
    },
     adminLastName: {
        type: String,
        required: true
    },
     adminEmailAddress: {
        type: String,
        required: true
    },
    adminStaffNumber: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser",
    }, 
    insurerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterInsurer",
    }, 
    // only user role access set as defluat
    role:{
        type: String,
        enum: ['admin'],
        default: 'admin',
    } ,
}, { timestamps: true });

// creating the registerUser model entry
const AdminUser = mongoose.model("AdminUser", adminUserSchema);

//export the User Login Details
module.exports = AdminUser;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const regInsurerSchema = new Schema({
    staffFirstName: {
        type: String,
        required: true
    },
    staffLastName: {
        type: String,
        required: true
    },
    staffEmailAddress: {
        type: String,
        required: true
    },
    staffContactNumber: {
        type: String,
        required: true
    },
    staffNumber: {
        type: Number,
        required: true
    },
    staffRole: {
        type: String,
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
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterInsuranceCompany",
        // required: false
    }
}, { timestamps: true });

// creating the userlogindetail model entry
const RegisterInsurer = mongoose.model("RegisterInsurer", regInsurerSchema);

//export the User Login Details
module.exports = RegisterInsurer;












const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const regInsuranceCompanySchema = new Schema({
    insuranceCompanyName: {
        type: String,
        required: true
    },
    insuranceCompanyEmail: {
        type: String,
        required: true
    },
    insuranceCompanyContact: {
        type: String,
        required: true
    },
    insuranceCompanyAddress: {
        type: String,
        required: true
    }, 
    insurerId: {
        type: Schema.Types.ObjectId,
         ref: "RegisterInsurer",
       // required: true
    },
        role:{
        type: String,
        enum: ['insurancecompany'],
        default:'insurancecompany',
    },
}, { timestamps: true });

// creating the userlogindetail model entry
const RegisterInsuranceCompany = mongoose.model("RegisterInsuranceCompany", regInsuranceCompanySchema);

//export the User Login Details
module.exports = RegisterInsuranceCompany;



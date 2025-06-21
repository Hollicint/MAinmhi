const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const petDetailSchema = new Schema({
    petName: {
        type: String,
        required: true
    },
    petType:{
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    microchipping: {
        type: String,
        required: true
    },
    microchippingNum: {
        type: String,
        required: true
    },
    policyNum: {
        type: String,
        required: true
    },
 //   insuranceCompanyName: {
 //       type: mongoose.Schema.Types.ObjectId,
 //       ref: "RegisterInsuranceCompany"     
 //      // type: String,
 //      // required: true
 //   },
     insurerCompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterInsuranceCompany",
    },
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        //ref: "registeruser",
        ref: "RegisterUser",
       // required: true
    }
}, { timestamps: true });

// creating the userlogindetail model entry
const PetAccountDetail = mongoose.model("PetAccountDetail", petDetailSchema);

//export the User Login Details
module.exports = PetAccountDetail;
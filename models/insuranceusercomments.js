const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InsuranceCommentsSchema = new Schema({
    insuranceComment:{
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser",
    },
     petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PetAccountDetail",
    }
}, { timestamps: true });

// creating the ClaimDetail model entry
const InsuranceUserComments = mongoose.model("insuranceusercomments", InsuranceCommentsSchema);

//export the User Claim Details
module.exports = InsuranceUserComments;
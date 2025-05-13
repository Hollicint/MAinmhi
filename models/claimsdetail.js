const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const claimDetailSchema = new Schema({
    claimTitle: {
        type: String,
        required: true
    },
    claimDescription:{
        type: String,
        required: true
    },
    areaOfIssue: {
        type: String,
        required: true
    },
    incidentStartDate: {
        type: Date,
        required: true
    },
    vetDate: {
        type: Date,
        required: true
    },
    vetDetail: {
        type: String,
        required: true
    },
// claimImage: {
//     type: String,
//     required: true
// },
// claimDocument: {
//     type: String,
//     required: true
// },
    claimStatus: {
        type: String,
        required: true
    },
    claimAmount: {
        type: Number,
        required: true
    },
  
    //userId: {
    //    type: mongoose.Schema.Types.ObjectId,
    //    //ref: "registeruser",
    //    ref: "User",
    //    required: true
    //}
    // petId: {
    //    type: mongoose.Schema.Types.ObjectId,
    //    //ref: "registeruser",
    //    ref: "PetAccountDetail",
    //    required: true
    //}
}, { timestamps: true });

// creating the userlogindetail model entry
const ClaimDetail = mongoose.model("claimsdetail", claimDetailSchema);

//export the User Login Details
module.exports = ClaimDetail;
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
    claimStatus: {
        type: String,
        required: true
    },
    claimAmount: {
        type: Number,
        required: true
    },
    claimImage: [{
        file: String,
        fileId:mongoose.Schema.Types.ObjectId,
     }],
    claimDocument: [{
         file: String,
         fileId: mongoose.Schema.Types.ObjectId,
     }],
    additionalclaimDescription:{
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
const ClaimDetail = mongoose.model("claimsdetail", claimDetailSchema);

//export the User Claim Details
module.exports = ClaimDetail;
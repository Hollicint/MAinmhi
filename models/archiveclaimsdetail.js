const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const archiveClaimDetailSchema = new Schema({
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
const ArchiveClaimsDetail = mongoose.model("ArchiveClaimsDetail", archiveClaimDetailSchema);

//export the User Claim Details
module.exports = ArchiveClaimsDetail;
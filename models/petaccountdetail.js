const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const petDetailSchema = new Schema({
    petName: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        required: true
    },
}, { timestamps: true });

// creating the userlogindetail model entry
const PetAccountDetail = mongoose.model("petaccountdetail", petDetailSchema);

//export the User Login Details
module.exports = PetAccountDetail;
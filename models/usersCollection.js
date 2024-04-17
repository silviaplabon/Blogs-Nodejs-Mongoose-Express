
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let UsersCollectionSchema = new Schema({
    _id: {
        type: mongoose.ObjectId
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    isAgreedWithTerms:{
        type:String
    },
    createdTime: {
        type: Number
    },
    password: {
        type: String
    }
});

const UsersCollection = mongoose.model("users_collection", UsersCollectionSchema);
module.exports = UsersCollection
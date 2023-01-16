
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let UsersCollectionSchema = new Schema({
    _id: {
        type: mongoose.ObjectId
    },
    email: {
        type: String
    },
    fullName: {
        type: String
    },
    professionTitle: {
        type: String
    },
    birthDate: {
        type: Number
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

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let BlogsCollectionSchema = new Schema({
  _id: {
    type: mongoose.ObjectId
  },
  email: {
    type: String
  },
  title: {
    type: String
  },
  subTitle: {
    type: String
  },
  details: {
    type: String
  },
  minAge: {
    type: Number
  },
  maxAge: {
    type: Number
  },
  createdTime: {
    type: Number
  },
  interests: {
    type: Array
  }
});

const BlogsCollection = mongoose.model("blogs_collection", BlogsCollectionSchema);
module.exports = BlogsCollection
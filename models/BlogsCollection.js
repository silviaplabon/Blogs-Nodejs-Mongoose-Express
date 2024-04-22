const mongoose = require('mongoose');
const RatingsCollection = require('./RatingsCollection');

const Schema = mongoose.Schema;
const RatingsCollectionSchema = new Schema({
  user: { type: mongoose.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});
const ReactionsCollectionSchema = new Schema({
  user: { type: mongoose.ObjectId, ref: 'User', required: true },
  reaction: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

let BlogsCollectionSchema = new Schema({
  _id: {
    type: mongoose.ObjectId,
  },
  userId: {
    type: mongoose.ObjectId,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  title: {
    type: String,
  },
  subTitle: {
    type: String,
  },
  category: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  shortDescription: {
    type: String,
  },
  longDescription: {
    type: String,
  },
  featuredImage: {
    type: String,
  },
  createdTime: {
    type: Number,
  },
  isEnabledPaidService: {
    type: Boolean,
  },
  readCount:{
    type:Number
  },
  ratings: [RatingsCollectionSchema],
  reactions: [ReactionsCollectionSchema],
});

const BlogsCollection = mongoose.model(
  'blogs_collection',
  BlogsCollectionSchema,
);
module.exports = BlogsCollection;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReactionsCollectionSchema = new Schema({
  user: { type: mongoose.ObjectId, ref: 'User', required: true },
  reaction: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  postId: {
    type: String,
    default: ""
  }
});

const ReactionsCollection = mongoose.model(
  'reactions_collection',
  ReactionsCollectionSchema,
);
module.exports = ReactionsCollection;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RatingsCollectionSchema = new Schema({
  user: { type: mongoose.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

const RatingsCollection = mongoose.model(
  'ratings_collection',
  RatingsCollectionSchema,
);
module.exports = RatingsCollection;

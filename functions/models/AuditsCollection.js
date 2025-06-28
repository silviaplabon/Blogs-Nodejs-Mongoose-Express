

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuditsCollectionSchema = new Schema({
  userId: {
    type: String,
    required: false
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: Object,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: false
  }
});

const AuditsCollection = mongoose.model(
  'audits_collection',
  AuditsCollectionSchema,
);
module.exports =AuditsCollection;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrdersCollectionSchema = new Schema({

  orderRefNo: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  portfolioNo: { 
    type: String,
    required: true,
    trim: true
  },
  securityName: {
    type: String,
    required: true,
    trim: true
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['Buy', 'Sell'] 
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Submitted', 'Cancelled', 'Executed', 'Completed', 'Failed'] 
  },
  orderDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1 
  },
  orderValue: {
    type: Number,
    required: true,
    min: 0 
  },
  createdOn: { 
    type: Date,
    default: Date.now
  },
  createdBy: { 
    type: String,
    default: ''
  },
  updatedAt: { 
    type: Date,
    default: Date.now
  }
});

const OrdersCollection = mongoose.model(
  'orders_collection',
  OrdersCollectionSchema,
);
module.exports =OrdersCollection;

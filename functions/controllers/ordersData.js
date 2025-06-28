const { query } = require('express');
const { default: mongoose } = require('mongoose');
const OrdersCollection = require('../models/ordersCollection');
const ordersData = {
  getAllOrders: async (req, res) => {
    try {
      let userId = '';
      if (req.query.userId) {
        userId = req.query.userId;
      }
      let category = '';
      //   if (req.query.category != undefined) {
      //     category =
      //       req.query.category.charAt(0)?.toUpperCase() +
      //       req.query.category?.slice(1);
      //   }

      const page = parseInt(req.query.page) || 1;

      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;
      if (category != undefined && category !== '') {
        const data = await OrdersCollection.aggregate([
          {
            $match: {
              $and: [
                { category: category },
                { userId: mongoose.Types.ObjectId(userId) },
              ],
            },
          },
          { $sort: { createdTime: -1 } },
          { $skip: skip },
          { $limit: limit },
        ]);
        const totalCount = await OrdersCollection.countDocuments({
          $and: [
            {
              category: category,
            },
            {
              userId: mongoose.Types.ObjectId(userId),
            },
          ],
        });
        return {
          blogs: data,
          count: Math.ceil(totalCount / limit),
          isFetched: true,
        };
      } else {
        const data = await BlogsCollection.aggregate([
          { $match: { userId: mongoose.Types.ObjectId(userId) } },
          { $sort: { createdTime: -1 } },
          { $skip: skip },
          { $limit: limit },
        ]);
        const totalCount = await BlogsCollection.countDocuments([
          {
            $match: {
              userId: mongoose.Types.ObjectId(userId),
            },
          },
        ]);
        return {
          blogs: data,
          count: Math.ceil(totalCount / limit),
          isFetched: true,
        };
      }
    } catch (error) {
      return {
        blogs: [],
        count: 0,
        isFetched: false,
        errorMessage: error?.message,
      };
    }
  },
  getAllSearchedOrders: async (req, res) => {
    try {
    
        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        let query = {};
        // if (req.query.email) {
        //   query.email = req.query.email;
        // }
        // if (req.query.title) {
        //   query.title = { $regex: `${req.query.title}`, $options: 'i' };
        // }
        // if (req.query.category) {
        //   query.category = { $regex: `${req.query.category}`, $options: 'i' };
        // }

        const totalCount = await OrdersCollection.countDocuments(query);
        const data = await OrdersCollection.find(query)
            .skip(skip)
            .limit(limit);

        return {
          orders: data,
          count: Math.ceil(totalCount / limit),
          isFetched: true,
        };
    } catch (error) {
      return {
        orders: [],
        count: 0,
        isFetched: false,
        errorMessage: error?.message,
      };
    }
  },

};

module.exports = ordersData;

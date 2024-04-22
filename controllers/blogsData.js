const { query } = require('express');
const BlogsCollection = require('../models/BlogsCollection');
const { default: mongoose } = require('mongoose');
const blogsData = {
  getAllBlogs: async (req, res) => {
    try {
      let userId = '';
      if (req.query.userId) {
        userId = req.query.userId;
      }
      let category = '';
      if (req.query.category != undefined) {
        category =
          req.query.category.charAt(0)?.toUpperCase() +
          req.query.category?.slice(1);
      }

      const page = parseInt(req.query.page) || 1;

      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;
      if (category != undefined && category !== '') {
        const data = await BlogsCollection.aggregate([
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
        const totalCount = await BlogsCollection.countDocuments({
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
  getAllSearchedBlogs: async (req, res) => {
    try {

      const searchText=req.query.searchText;

      const page = parseInt(req.query.page) || 1;

      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;

        const data = await BlogsCollection.aggregate([
          { $match: {
           "title": { $regex: 'Life', $options: 'g' }
          }
          },
          { $sort: { createdTime: -1 } },
          { $skip: skip },
          { $limit: limit },
        ]);
        
        const totalCount = await BlogsCollection.countDocuments({
            "$search": {
               "regex": {
                  "path": "title",
                  "query": "(.*) Life"
               }
            }
         });
        return {
          blogs: data,
          count: Math.ceil(totalCount / limit),
          isFetched: true,
        };

    } catch (error) {
      return {
        blogs: [],
        count: 0,
        isFetched: false,
        errorMessage: error?.message,
      };
    }
  },

  getRandomBlogs: async (req, res) => {
    try {
      let category = '';
      if (req.query.category != undefined) {
        category =
          req.query.category.charAt(0)?.toUpperCase() +
          req.query.category?.slice(1);
      }
      console.log(category, 'category');
      if (category != undefined && category !== '') {
        const data = await BlogsCollection.aggregate([
          {
            $match: {
              $and: [
                {
                  isEnabledPaidService: true,
                },
                {
                  category: category,
                },
              ],
            },
          },
          { $sort: { createdTime: -1 } },
          { $sample: { size: 10 } },
        ]);
        return { blogs: data, count: 1, isFetched: true };
      } else {
        const data = await BlogsCollection.aggregate([
          { $match: { isEnabledPaidService: true } },
          { $sort: { createdTime: -1 } },
          { $sample: { size: 10 } },
        ]);

        return { blogs: data, count: 1, isFetched: true };
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
  getAllBlogsByTabs: async (req, res) => {
    try {
      let category = '';
      if (req.query.category != undefined) {
        category =
          req.query.category.charAt(0)?.toUpperCase() +
          req.query.category?.slice(1);
      }

      const page = req.query.page || 1;

      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;

      if (req.params?.tabId == 'LATEST') {
        const data = await BlogsCollection.aggregate([
          { $sort: { createdTime: -1 } },
          { $skip: skip },
          { $limit: limit },
        ]);

        const totalCount = await BlogsCollection.countDocuments();
        return {
          blogs: data,
          count: Math.ceil(totalCount / limit),
          isFetched: true,
        };
      } else if (req.params?.tabId == 'SPECIALS') {    
        if (category != undefined && category !== '') {
            const data = await BlogsCollection.aggregate([
                {
                  $match: {
                    $and: [
                      {
                        reactions: {
                          $elemMatch: {
                            reaction: true,
                          },
                        },
                      },
                      {
                        category:category,
                      },
                    ],
                  },
                },
                { $sort: { createdTime: -1 } },
                { $skip: skip },
                { $limit: limit },
              ]);
    
              const totalCount = await BlogsCollection.countDocuments({
                $and: [
                  {
                    reactions: {
                      $elemMatch: {
                        reaction: true,
                      },
                    },
                  },
                  {
                    category: queryObject.category,
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
              {
                $match: {
                  reactions: {
                    $elemMatch: {
                      reaction: true,
                    },
                  },
                },
              },
              { $sort: { createdTime: -1 } },
              { $skip: skip },
              { $limit: limit },
            ]);
            const totalCount = await BlogsCollection.countDocuments({
              reactions: {
                $elemMatch: {
                  reaction: true,
                },
              },
            });
            return {
              blogs: data,
              count: Math.ceil(totalCount / limit),
              isFetched: true,
            };
         
        }
      } else if (req.params?.tabId == 'BEST RATED') {
        console.log('line114');
             
        if (category != undefined && category != '') {
          console.log('line115');
          const data = await BlogsCollection.aggregate([
            {
              $match: {
                $and: [
                  {
                    ratings: { $elemMatch: { rating: { $gt: 0 } } },
                  },
                  {
                    category: category,
                  },
                ],
              },
            },
            {
              $addFields: {
                ratingsWithValues: {
                  $filter: {
                    input: '$ratings',
                    as: 'rating',
                    cond: { $gt: ['$$rating', 0] },
                  },
                },
              },
            },
            { $sort: { ratingsWithValues: -1, createdTime: -1 } },
            { $skip: skip },
            { $limit: limit },
          ]);

          const totalCount = await BlogsCollection.countDocuments({
            $and: [
              {
                ratings: { $elemMatch: { rating: { $gt: 0 } } },
              },
              {
                category:category,
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
              {
                $match: {
                  ratings: { $elemMatch: { rating: { $gt: 0 } } },
                },
              },
              {
                $addFields: {
                  ratingsWithValues: {
                    $filter: {
                      input: '$ratings',
                      as: 'rating',
                      cond: { $gt: ['$$rating', 0] },
                    },
                  },
                },
              },
              { $sort: { ratingsWithValues: -1, createdTime: -1 } },
              { $skip: skip },
              { $limit: limit },
            ]);
  
            const totalCount = await BlogsCollection.countDocuments({
              ratings: { $elemMatch: { rating: { $gt: 0 } } },
            });
            return {
              blogs: data,
              count: Math.ceil(totalCount / limit),
              isFetched: true,
            };
         
        }
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
  addABlog: async (req, res) => {
    const newBlog = req.body;
    const ObjectID = require('mongodb').ObjectID;
    newBlog._id = new ObjectID();
    newBlog.createdTime = Date.now();
    console.log(newBlog);
    const insertedOutput = {
      id: newBlog._id,
      error: '',
      isInserted: false,
    };
    console.log(newBlog);
    await BlogsCollection.create({ ...newBlog })
      .then((result) => {
        console.log(result, 'result');
        insertedOutput.isInserted = true;
      })
      .catch((e) => {
        insertedOutput.id = '';
        insertedOutput.error = e.message;
      });
    return insertedOutput;
  },
  getABlog: async (req, res) => {
    const data= await BlogsCollection.findOne({ _id: req.params.id });
    data.readCount=data?.readCount?data.readCount+1:1
    await data.save();
    return data
  },
  updateABlog: async (req, res) => {
    let updatedOutput = {
      modifiedCount: 0,
      errorMessage: '',
    };
    console.log({ ...req.body });
    await BlogsCollection.updateOne(
      { _id: req.params.id },
      {
        $set: { ...req.body },
      },
    )
      .then(async (result) => {
        updatedOutput.modifiedCount = await result.modifiedCount;
      })
      .catch((e) => {
        console.log(e, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        updatedOutput.errorMessage = e.message;
      });
    return updatedOutput;
  },
  deleteABlog: async (req, res) => {
    let deletedOutput = {
      deletedCount: 0,
      errorMessage: '',
    };
    await BlogsCollection.deleteOne({ _id: req.params.id })
      .then(async (result) => {
        deletedOutput.deletedCount = await result.deletedCount;
      })
      .catch((e) => {
        deletedOutput.errorMessage = e.message;
      });
    return deletedOutput;
  },
  getFilterBlogs: async (req, res) => {
    let query = {};
    if (req.body.minAge) {
      query.minAge = { $gte: `${req.body.minAge}` };
    }
    if (req.body.maxAge) {
      query.maxAge = { $lte: `${req.body.maxAge}` };
    }
    if (req.body.interests) {
      query.interests = { $in: [...req.body.interests] };
    }
    if (req.body.email) {
      query.email = req.body.email;
    }
    if (req.body.title) {
      query.title = { $regex: `${req.body.title}`, $options: 'i' };
    }
    if (req.body.subTitle) {
      query.subTitle = { $regex: `${req.body.subTitle}`, $options: 'i' };
    }
    const data = await BlogsCollection.find({ ...query });
    return data;
  },
};

module.exports = blogsData;

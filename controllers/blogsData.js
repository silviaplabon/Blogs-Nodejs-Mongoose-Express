const { query } = require("express");
const BlogsCollection = require("../models/BlogsCollection");
const blogsData = {
    getAllBlogs: async (req, res) => {
        const queryObject={}
        
        if(req.query.userId){
            queryObject.userId=req.query.userId
        }
  
        if( req.query.category!=undefined){
            queryObject.category=req.query.category.charAt(0)?.toUpperCase() + req.query.category?.slice(1);
        } 
        
        const page = parseInt(req.query.page) || 1; 
        
        const limit = parseInt(req.query.limit)||10;

        const skip = (page - 1) * limit;
       
        const data = await BlogsCollection.find(queryObject).skip(skip)
        .limit(limit);
        const totalCount = await BlogsCollection.countDocuments(queryObject);
  
        return {blogs:data,count:parseInt(totalCount/limit)}
    },
    getAllBlogsByTabs: async (req, res) => {
        const queryObject={}
  
        if( req.query.category!=undefined){
            queryObject.category=req.query.category.charAt(0)?.toUpperCase() + req.query.category?.slice(1);
        } 
        const page = req.query.page || 1; 
        
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        if(req.params?.tabId=="LATEST"){    
           
            const data = await BlogsCollection.aggregate([
                { $sort: { createdAt: -1 } },
                { $skip: skip }, 
                { $limit: limit }, 
            ]);
            const totalCount = await BlogsCollection.countDocuments();
            return {blogs:data,count:Math.ceil(totalCount/limit)};

        }else if(req.params?.tabId=="SPECIALS"){
            if(queryObject?.category){
                console.log('line50')
                const data = await BlogsCollection.aggregate([
                    { $match: {
                        reactions: {
                          $elemMatch: {
                            reaction: true
                          }
                        }
                      } }, 
                    { $sort: { createdAt: -1 } },
                    { $skip: skip }, 
                    { $limit: limit }, 
                ]);
                const totalCount= await BlogsCollection.countDocuments({
                    reactions: {
                        $elemMatch: {
                            reaction: true
                        }
                    }
                })
                return {blogs:data,count:Math.ceil(totalCount/limit)}
               
            }else{
                const data = await BlogsCollection.aggregate([
                    { 
                        $match: { 
                            $and: [
                                {
                                    reactions: {
                                        $elemMatch: {
                                            reaction: true
                                        }
                                    }
                                },
                                {
                                    category: queryObject.category
                                }
                            ]
                        } 
                    }, 
                    { $sort: { createdAt: -1 } },
                    { $skip: skip }, 
                    { $limit: limit }, 
                ]);
    
                const totalCount = await BlogsCollection.countDocuments({
                    $and: [
                        {
                            reactions: {
                                $elemMatch: {
                                    reaction: true
                                }
                            }
                        },
                        {
                            category: queryObject.category
                        }
                    ]
                });
                return {blogs:data,count:Math.ceil(totalCount/limit)}
            }
            
           

        }else if(req.params?.tabId=="BEST RATED"){
            console.log('line114')
            if(queryObject?.category){
                console.log('line115')
                const data = await BlogsCollection.aggregate([
                    {
                        $match: {
                            ratings: { $elemMatch: { rating: { $gt: 0 } } }
                        }
                    },
                    {
                        $addFields: {
                            ratingsWithValues: {
                                $filter: {
                                    input: "$ratings",
                                    as: "rating",
                                    cond: { $gt: ["$$rating", 0] }
                                }
                            }
                        }
                    },
                    { $sort: { "ratingsWithValues": -1, createdAt: -1 } }, 
                    { $skip: skip },
                    { $limit: limit },
                ]);
                
                const totalCount= await BlogsCollection.countDocuments({
                    ratings: { $elemMatch: { rating: { $gt: 0 } } }
                })
                return {blogs:data,count:Math.ceil(totalCount/limit)}
               
            }else{
                const data = await BlogsCollection.aggregate([
                    { 
                        $match: { 
                            $and: [
                                {
                                    ratings: { $elemMatch: { rating: { $gt: 0 } } }
                                },
                                {
                                    category: queryObject.category
                                }
                            ]
                        } 
                    }, 
                    {
                        $addFields: {
                            ratingsWithValues: {
                                $filter: {
                                    input: "$ratings",
                                    as: "rating",
                                    cond: { $gt: ["$$rating", 0] }
                                }
                            }
                        }
                    },
                    { $sort: { "ratingsWithValues": -1, createdAt: -1 } }, 
                    { $skip: skip }, 
                    { $limit: limit }, 
                ]);
    
                const totalCount = await BlogsCollection.countDocuments({
                    $and: [
                        {
                            ratings: { $elemMatch: { rating: { $gt: 0 } } }
                        },
                        {
                            category: queryObject.category
                        }
                    ]
                });
                return {blogs:data,count:Math.ceil(totalCount/limit)}
            }
            
           

        }
    },
    addABlog: async (req, res) => {
        const newBlog = req.body;
        const ObjectID = require('mongodb').ObjectID;
        newBlog._id = new ObjectID()
        newBlog.createdTime = Date.now()
        console.log(newBlog)
        const insertedOutput = {
            "id": newBlog._id,
            "error": "",
            "isInserted": false
        }
        console.log(newBlog)
        await BlogsCollection.create({ ...newBlog })
            .then(result => {
                console.log(result, "result")
                insertedOutput.isInserted = true
            })
            .catch((e) => {
                insertedOutput.id = ""
                insertedOutput.error = e.message;

            })
        return insertedOutput
    },
    getABlog: async (req, res) => {
       
         return await  BlogsCollection.findOne({ _id: req.params.id })
        
    },
    updateABlog: async (req, res) => {
        let updatedOutput = {
            "modifiedCount": 0,
            "errorMessage": ""
        }
        console.log({ ...req.body })
        await BlogsCollection.updateOne({ _id: req.params.id },
            {
                $set: { ...req.body }
            })
            .then(async (result) => {
                updatedOutput.modifiedCount = await result.modifiedCount;
            })
            .catch((e) => {
                console.log(e,'@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
                updatedOutput.errorMessage = e.message
            })
        return updatedOutput
    },
    deleteABlog: async (req, res) => {
        let deletedOutput = {
            "deletedCount": 0,
            "errorMessage": ""
        }
        await BlogsCollection.deleteOne({ _id: req.params.id })
            .then(async (result) => {
                deletedOutput.deletedCount = await result.deletedCount
            })
            .catch((e) => {
                deletedOutput.errorMessage = e.message
            })
        return deletedOutput
    },
    getFilterBlogs: async (req, res) => {
        let query = {};
        if (req.body.minAge) {
            query.minAge = { $gte: `${req.body.minAge}` }
        }
        if (req.body.maxAge) {
            query.maxAge = { $lte: `${req.body.maxAge}` }
        }
        if (req.body.interests) {
            query.interests = { $in: [...req.body.interests] }
        }
        if (req.body.email) {
            query.email = req.body.email;
        }
        if (req.body.title) {
            query.title = { $regex: `${req.body.title}`, $options: "i" }
        }
        if (req.body.subTitle) {
            query.subTitle = { $regex: `${req.body.subTitle}`, $options: "i" }
        }
        const data = await BlogsCollection.find({ ...query });
        return data;
    }
}

module.exports = blogsData;

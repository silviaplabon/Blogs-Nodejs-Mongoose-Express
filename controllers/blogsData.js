const BlogsCollection = require("../models/BlogsCollection");
const blogsData = {
    getAllBlogs: async (req, res) => {
        const data = await BlogsCollection.find({});
        return data;
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
       
         return BlogsCollection.findOne({ _id: req.params.id })
        
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

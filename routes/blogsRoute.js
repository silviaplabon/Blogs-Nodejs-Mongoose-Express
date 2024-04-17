
const express = require("express");
const { addABlog, updateABlog, getAllBlogs, deleteABlog, getABlog, getFilterBlogs } = require("../controllers/blogsData");
const authenticateToken = require("../middleware/authenticateToken");

const CONSTANTS = require("../utils/constants");
const responseHandler = require("../utils/responseHandler");
const BlogsCollection = require("../models/BlogsCollection");
const RatingsCollection = require("../models/RatingsCollection");

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const blogs = await getAllBlogs(req, res)
        await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, blogs)
    }
    catch (e) {
        responseHandler.sendError(req, res, e.message)
    }
})
router.post('/', authenticateToken, async (req, res) => {
    try {
        const result = await addABlog(req, res)
        if (result.isInserted == true) {
            responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.RECORD_CREATED_SUCCESSFULLY, result)
        } else {
            responseHandler.sendError(req, res, CONSTANTS.MESSAGES.NO_RECORD_FOUND, result)
        }
    } catch (e) {
        responseHandler.sendError(req, res, e.message)
    }
})
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await updateABlog(req, res)
        if (await result.modifiedCount > 0) {
            responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.RECORD_UPDATED_SUCCESSFULLY)
        } else {
            responseHandler.sendError(req, res, result.errorMessage != "" ? result.errorMessage : CONSTANTS.MESSAGES.RECORD_NOT_UPDATED)
        }
    } catch (e) {
        responseHandler.sendError(req, res, e.message)
    }
})
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await deleteABlog(req, res)
        if (result.deletedCount > 0) {
            responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.RECORD_DELETED_SUCCESSFULLY)
        } else {
            responseHandler.sendError(req, res, result.errorMessage ? result.errorMessage : CONSTANTS.MESSAGES.RECORD_NOT_DELETED)
        }
    } catch (e) {
        responseHandler.sendError(req, res, e.message)
    }
})
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const blog = await getABlog(req, res)
        console.log(blog,":@@@@@@@blog.com")
        if(blog){
            await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, blog)
        }
    }
    catch (e) {
        console.log(e,"@@@@@@@@@line62")
        responseHandler.sendError(req, res, e.message)
    }
})
router.post('/allBlogs', async (req, res) => {
    try {
        const blogs = await getFilterBlogs(req, res)
        await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, blogs)
    }
    catch (e) {
        responseHandler.sendError(req, res, e.message)
    }
})
router.post('/:blogId/reviews', async (req, res) => {
    try {
      const { rating, comment, userId } = req.body;
      
      if (!req.params.blogId.match(/^[0-9a-fA-F]{24}$/)) {
        responseHandler.sendError(req, res, 'Please provide correct blog id')
      }

      const product = await BlogsCollection.findById({ _id: req.params.blogId });
      if (!product) {
        responseHandler.sendError(req, res,CONSTANTS.MESSAGES.NO_RECORD_FOUND)
      }

      const existingReview = await RatingsCollection.findOne({ product: req.params.blogId, user: userId });
 
      let ratings=product.ratings?product.ratings:[];

      if (existingReview) {
        console.log("line97")
            existingReview.rating = rating;
            existingReview.comment = comment;
            await existingReview.save();
            const updatedRatings=ratings.filter(rating=>!(rating._id.equals(existingReview._id)))
            console.log(updatedRatings,"line102",existingReview)
            updatedRatings.push(existingReview)
            product.ratings=[...updatedRatings]

            await product.save();
            await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, product)

      }else{
        const review = new RatingsCollection({
            user: userId,
            rating,
            comment
          });
            ratings.push(review);
            await review.save();
            product.ratings=[...ratings]
            await product.save();
            await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, product)
      }
        
  
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });


router.get("*", function (req, res) {
    responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.post("*", function (req, res) {
    responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.put("*", function (req, res) {
    responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.patch("*", function (req, res) {
    responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.delete("*", function (req, res) {
    responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
module.exports = router;


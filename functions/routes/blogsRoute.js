const express = require('express');
const {
  addABlog,
  updateABlog,
  getAllBlogs,
  deleteABlog,
  getABlog,
  getFilterBlogs,
  getAllBlogsByTabs,
  getRandomBlogs,
  getAllSearchedBlogs,
} = require('../controllers/blogsData');
const authenticateToken = require('../middleware/authenticateToken');
const CONSTANTS = require('../utils/constants');
const responseHandler = require('../utils/responseHandler');
const BlogsCollection = require('../models/BlogsCollection');
const RatingsCollection = require('../models/RatingsCollection');
const ReactionsCollection = require('../models/ReactionCollection');

const { default: mongoose } = require('mongoose');
const CommentsCollection = require('../models/CommentsCollection');
const cors=require("cors")
const router = express.Router();
router.get('/',cors(), async (req, res) => {
  try {
    const blogsData = await getAllBlogs(req, res);
    if (blogsData.isFetched) {
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        blogsData,
      );
    } else if (!blogsData.isFetched) {
      responseHandler.sendError(
        req,
        res,
        blogsData.errorMessage
          ? blogsData.errorMessage
          : 'Something went wrong',
      );
    }
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.get('/search',cors(), async (req, res) => {
  try {
    const blogsData = await getAllSearchedBlogs(req, res);
    if (blogsData.isFetched) {
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        blogsData,
      );
    } else if (!blogsData.isFetched) {
      responseHandler.sendError(
        req,
        res,
        blogsData.errorMessage
          ? blogsData.errorMessage
          : 'Something went wrong',
      );
    }
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.get('/tabs/:tabId', cors(),async (req, res) => {
  try {
    const blogsData = await getAllBlogsByTabs(req, res);
    if (blogsData.isFetched) {
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        blogsData,
      );
    } else if (!blogsData.isFetched) {
      responseHandler.sendError(
        req,
        res,
        blogsData.errorMessage
          ? blogsData.errorMessage
          : 'Something went wrong',
      );
    }
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.get('/randomBlogs', async (req, res) => {
  try {
    const blogsData = await getRandomBlogs(req, res);
    if (blogsData.isFetched) {
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        blogsData,
      );
    } else if (!blogsData.isFetched) {
      responseHandler.sendError(
        req,
        res,
        blogsData.errorMessage
          ? blogsData.errorMessage
          : 'Something went wrong',
      );
    }
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.post('/',cors(), async (req, res) => {
  try {
    const result = await addABlog(req, res);
    if (result.isInserted == true) {
      responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.RECORD_CREATED_SUCCESSFULLY,
        result,
      );
    } else {
      responseHandler.sendError(
        req,
        res,
        CONSTANTS.MESSAGES.NO_RECORD_FOUND,
        result,
      );
    }
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.patch('/:id',cors(), authenticateToken, async (req, res) => {
  try {
    const result = await updateABlog(req, res);
    if ((await result.modifiedCount) > 0) {
      responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.RECORD_UPDATED_SUCCESSFULLY,
      );
    } else {
      responseHandler.sendError(
        req,
        res,
        result.errorMessage != ''
          ? result.errorMessage
          : CONSTANTS.MESSAGES.RECORD_NOT_UPDATED,
      );
    }
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.delete('/:id', cors(),authenticateToken, async (req, res) => {
  try {
    const result = await deleteABlog(req, res);
    if (result.deletedCount > 0) {
      responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.RECORD_DELETED_SUCCESSFULLY,
      );
    } else {
      responseHandler.sendError(
        req,
        res,
        result.errorMessage
          ? result.errorMessage
          : CONSTANTS.MESSAGES.RECORD_NOT_DELETED,
      );
    }
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.get('/:id',cors(), async (req, res) => {
  try {
    const blog = await getABlog(req, res);
    console.log(blog, ':@@@@@@@blog.com');
    if (blog) {
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        blog,
      );
    } else {
      await responseHandler.sendError(
        req,
        res,
        CONSTANTS.MESSAGES.NO_RECORD_FOUND,
      );
    }
  } catch (e) {
    console.log(e, '@@@@@@@@@line62');
    responseHandler.sendError(req, res, e.message);
  }
});
router.post('/allBlogs',cors(), async (req, res) => {
  try {
    const blogs = await getFilterBlogs(req, res);
    await responseHandler.sendSuccess(
      req,
      res,
      CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
      blogs,
    );
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.post('/:blogId/reviews',cors(), async (req, res) => {
  try {
    const { rating, comment, userId } = req.body;

    if (!req.params.blogId.match(/^[0-9a-fA-F]{24}$/)) {
      responseHandler.sendError(req, res, 'Please provide correct blog id');
    }

    const product = await BlogsCollection.findById({ _id: req.params.blogId });
    if (!product) {
      responseHandler.sendError(req, res, CONSTANTS.MESSAGES.NO_RECORD_FOUND);
    }

    const existingReview = await RatingsCollection.findOne({
      postId: req.params.blogId,
      user: userId,
    });

    let ratings = product.ratings ? product.ratings : [];

    if (existingReview) {
      console.log('line97');
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
      const updatedRatings = ratings.filter(
        (rating) => !rating._id.equals(existingReview._id),
      );
      console.log(updatedRatings, 'line102', existingReview);
      updatedRatings.push(existingReview);
      product.ratings = [...updatedRatings];

      await product.save();
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        product,
      );
    } else {
      const review = new RatingsCollection({
        user: userId,
        rating,
        comment,
        postId:req.params.blogId
      });
      ratings.push(review);
      await review.save();
      product.ratings = [...ratings];
      await product.save();
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        product,
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.post('/:blogId/reactions', cors(),async (req, res) => {
  try {
    const { reaction, userId } = req.body;
    if (!reaction) {
      responseHandler.sendError(req, res, 'Please provide reaction');
    }

    if (!req.params.blogId.match(/^[0-9a-fA-F]{24}$/)) {
      responseHandler.sendError(req, res, 'Please provide correct blog id');
    }

    const product = await BlogsCollection.findById({ _id: req.params.blogId });
    if (!product) {
      responseHandler.sendError(req, res, CONSTANTS.MESSAGES.NO_RECORD_FOUND);
    }

    const existingReaction = await ReactionsCollection.findOne({
      postId: req.params.blogId,
      user: userId,
    });

    let reactions = product.reactions ? product.reactions : [];

    if (existingReaction) {
      existingReaction.reaction = reaction;
      await existingReaction.save();
      const updatedReactions = reactions.filter(
        (reactionData) => !reactionData._id.equals(existingReaction._id),
      );
      console.log(updatedReactions, 'line102', existingReaction);
      updatedReactions.push(existingReaction);

      product.reactions = [...updatedReactions];
      await product.save();
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        product,
      );
    } else {
      const reactionModel = new ReactionsCollection({
        user: userId,
        reaction,
        postId: req.params.blogId,
      });
      reactions.push(reactionModel);
      await reactionModel.save();
      if (reactions.length > 0) {
        product.reactions = [...reactions];
        await product.save();
      }
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        product,
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.delete('/:postId/deleteAComment',cors(), async function(req, res) {
  try{
  const commentId=req.params.postId;

  const result1 = await CommentsCollection.deleteMany({ parentId:commentId });

  const result2 = await CommentsCollection.deleteOne({ _id:commentId });
  console.log(result1, result2);
  await responseHandler.sendSuccess(
    req,
    res,
    CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
   {},
  )
  }catch(e){
    responseHandler.sendError(
      req,
      res,
      err.message ? err.message : 'Server Error',
    )
  }
});
router.delete('/:postId/deleteABlog',cors(), async function(req, res) {
  try{
  const postId=req.params.postId;

  const result1 = await CommentsCollection.deleteMany({ postId:postId });

  const result2 = await BlogsCollection.deleteOne({ _id:postId });
  const result3=await ReactionsCollection.deleteMany({ postId:postId });
  const result4=await RatingsCollection.deleteMany({ postId:postId });
  await responseHandler.sendSuccess(
    req,
    res,
    CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
   {},
  )
  }catch(e){
    responseHandler.sendError(
      req,
      res,
      err.message ? err.message : 'Server Error',
    )
  }
});

router.post('/:commentId/editAComment',cors(), async function(req, res) {
  try{
    let comment = req.body;
    const commentId=req.params.commentId;
    CommentsCollection.updateOne({_id: commentId}, {$set: {commentText: comment.commentText}})
    .exec()
    .then( async result => 
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
       {},
      )
      )
    .catch(err => responseHandler.sendError(
      req,
      res,
      err.message ? err.message : 'Server Error',
    ))
  }catch(e){
    responseHandler.sendError(
      req,
      res,
      err.message ? err.message : 'Server Error',
    )
  }
});


router.post('/:blogId/addAComment',cors(), async (req, res) => {
  const blogId = req.params.blogId;

  const { comment, userId,name ,profileImage} = req.body;

  let data = {
    author: {
      id: userId,
      name: name,
      profileImage:profileImage
    },
    commentText: comment,
  };
  if(req.body.parentId){
    data.parentId = req.body.parentId;
  }

  if ('depth' in req.body) {
    data.depth = req.body.depth;
  }
  data.postId = blogId;
  const commentModel = new CommentsCollection(data);
  commentModel
    .save()
    .then(
      async (comment) =>
        await responseHandler.sendSuccess(
          req,
          res,
          CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
          comment,
        ),
    )
    .catch((err) =>
      responseHandler.sendError(
        req,
        res,
        err.message ? err.message : 'Server Error',
      ),
    );
});

router.get('/comments/:postId', cors(),async (req, res) => {
  const postId = req.params.postId;

  CommentsCollection.find({ postId: postId })
    .sort({ postedDate: 1 })
    .lean()
    .exec()
    .then(async (comments) => {
    
      let rec = (comment, threads) => {
        for (var thread in threads) {
          value = threads[thread];

          if (thread.toString() === comment.parentId.toString()) {
            value.children[comment._id] = comment;
            return;
          }

          if (value.children) {
            rec(comment, value.children);
          }
        }
      };

      let threads = {},comment;
      for (let i = 0; i < comments.length; i++) {
        comment = comments[i];
        comment['children'] = {};
        let parentId = comment.parentId;
        if (!parentId) {
          threads[comment._id] = comment;
          continue;
        }
        rec(comment, threads);
      }
     
      await responseHandler.sendSuccess(
        req,
        res,
        CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
        { 'count': comments.length,
        'comments': threads}
      )
    })
    .catch((err) => res.status(500).json({ error: err }));
});
router.get('*', function (req, res) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.post('*', function (req, res) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.put('*', function (req, res) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.patch('*', function (req, res) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
router.delete('*', function (req, res) {
  responseHandler.send404(req, res, CONSTANTS.MESSAGES.INVALID_METHOD);
});
module.exports = router;

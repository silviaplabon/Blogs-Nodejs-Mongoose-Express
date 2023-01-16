
const express = require("express");
const { addABlog, updateABlog, getAllBlogs, deleteABlog, getABlog, getFilterBlogs } = require("../controllers/blogsData");
const authenticateToken = require("../middleware/authenticateToken");

const CONSTANTS = require("../utils/constants");
const responseHandler = require("../utils/responseHandler");
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
        await responseHandler.sendSuccess(req, res, CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY, blog)
    }
    catch (e) {
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


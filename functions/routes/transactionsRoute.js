const express = require('express');
const {
  addAUser,
  updateAUser,
  deleteAUser,
  getAUser,
  getFilterUsers,
  logIn,
  getAUserByEmail,
  getAllUser,
} =  require('../controllers/usersData');
const { passwordIsMatched } = require('../utils/passwordSettings');
const responseHandler = require('../utils/responseHandler');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
const cors=require('cors');
const CONSTANTS = require('../utils/constants');
const { getAllSearchedOrders } = require('../controllers/ordersData');
router.get('/', cors(),async (req, res) => {
  try {
    const blogs = await getAllSearchedOrders(req, res);
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
router.post('/', cors(),async (req, res) => {
  try {
    const result = await addAUser(req, res);
    if (result.isInserted == true) {
      if (result && result.user._id) {
        await jwt.sign(
          {
            _id: result.user._id,
            typeOfUser: 'user',
            email: req.body.email,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5,
          },
          process.env.HASH_SECRET,
          function async(err, token) {
            if (err) {
              responseHandler.sendError(req, res, 'Please try again');
            } else {
              const user = { ...result, token: token };
              responseHandler.sendSuccess(
                req,
                res,
                CONSTANTS.MESSAGES.RECORD_CREATED_SUCCESSFULLY,
                user,
              );
            }
          },
        );
      } else {
        responseHandler.sendError(req, res, CONSTANTS.MESSAGES.NO_RECORD_FOUND);
      }
    } else {
      responseHandler.sendError(
        req,
        res,
        CONSTANTS.MESSAGES.NO_RECORD_FOUND,
        result,
      );
    }
  } catch (e) {
    console.log(e);
    responseHandler.sendError(req, res, e.message);
  }
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

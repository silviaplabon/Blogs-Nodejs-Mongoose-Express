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
} = require('../controllers/usersData');
const CONSTANTS = require('../utils/constants');
const { passwordIsMatched } = require('../utils/passwordSettings');
const responseHandler = require('../utils/responseHandler');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
const cors=require('cors')
router.get('/', cors(),async (req, res) => {
  try {
    const blogs = await getAllUser(req, res);
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
router.patch('/:id',cors(), authenticateToken, async (req, res) => {
  try {
    const result = await updateAUser(req, res);
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
        result.errorMessage
          ? result.errorMessage
          : CONSTANTS.MESSAGES.RECORD_NOT_UPDATED_SUCCESSFULLY,
      );
    }
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.delete('/:id',cors(), authenticateToken, async (req, res) => {
  try {
    const result = await deleteAUser(req, res);
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
router.get('/:id',cors(), authenticateToken, async (req, res) => {
  try {
    const blog = await getAUser(req, res);
    await responseHandler.sendSuccess(
      req,
      res,
      CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
      blog,
    );
  } catch (e) {
    responseHandler.sendError(req, res, e.message);
  }
});
router.post('/allUsers',cors(), authenticateToken, async (req, res) => {
  try {
    const blogs = await getFilterUsers(req, res);
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
router.post('/login',cors(), async (req, res) => {
  try {
    // const auth = new Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');
    const username = req.body.email;
    const password = req.body.password;
    let userData = await getAUserByEmail(username);
    if (userData && userData._id) {
      const isPasswordMatched = await passwordIsMatched(
        password,
        userData.password,
      );
      if (isPasswordMatched) {
        await jwt.sign(
          {
            _id: userData._id,
            typeOfUser: 'user',
            email: username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5,
          },
          process.env.HASH_SECRET,
          function (err, token) {
            if (err) {
              responseHandler.sendError(req, res, 'Please try again');
            } else {
              delete userData.password;
              const user = { user: userData._doc, token: token };
              responseHandler.sendSuccess(
                req,
                res,
                CONSTANTS.MESSAGES.DATA_RETRIED_SUCCESSFULLY,
                user,
              );
            }
          },
        );
      } else {
        responseHandler.sendError(req, res, 'Please enter correct value');
      }
    } else {
      responseHandler.sendError(req, res, CONSTANTS.MESSAGES.NO_RECORD_FOUND);
    }
  } catch (e) {
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

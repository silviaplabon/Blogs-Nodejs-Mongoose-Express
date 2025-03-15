const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responseHandler');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  jwt.verify(token, process.env.HASH_SECRET, function (err, decoded) {
    if (err != null) {
      responseHandler.sendError(req, res, err.message);
    }
    next();
  });
};
module.exports = authenticateToken;

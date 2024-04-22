const CONSTANTS = require('../utils/constants');
const responseHandler = {
  sendSuccess: async function (req, res, message, data = '') {
    res.status(200).send({
      type: 'success',
      message: message || 'Success result',
      data,
    });
    res.end();
  },
  sendError: function (req, res, message, data = '') {
    message = message ? message : 'Unhandled Error';
    console.error(data);
    return res.status(400).send({
      type: 'error',
      message: message,
      data,
    });
    // res.end();
  },
  send404: function (req, res, message, data = '') {
    message = message ? message : 'Unhandled Error';
    res.status(404).send({
      type: 'error',
      message: message,
      data,
    });
    res.end();
  },
};

module.exports = responseHandler;

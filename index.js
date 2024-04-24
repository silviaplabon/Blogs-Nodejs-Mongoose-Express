const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
const responseHandler = require('./utils/responseHandler');
const blogsRoute = require('./routes/blogsRoute');
const usersRoute = require('./routes/usersRoute');
const bodyParser = require('body-parser');
const serverless = require("serverless-http");
app.use(bodyParser.json());
const mongoose = require('mongoose');
app.use('/blogs', blogsRoute);
app.use('/users', usersRoute);




app.use((err, req, res, next) => {
  if (err) {
    console.log(err, 'line1i8');
    responseHandler.sendError(req, res, err.message);
  }
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => console.log('MongoDB Connection Error: ', err));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Port:', port));
// module.exports = app;
module.exports.handler = serverless(app);

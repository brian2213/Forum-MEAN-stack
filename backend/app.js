const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")))

mongoose
  .connect('mongodb://localhost:27017/test-angular')
  .then(() => {
    console.log('connect to mongo');
  })
  .catch(() => {
    console.log('connection failed');
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS, PUT'
  );

  next();
});

app.use("/api/posts",postsRoutes);

module.exports = app;

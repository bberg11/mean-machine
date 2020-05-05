const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_ATLAS_CREDS}@cluster0-qgg9v.mongodb.net/mean-machine?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Successfully connected to DB');
  })
  .catch(() => {
    console.log('There was an error connecting to DB');
  });

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;

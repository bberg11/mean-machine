const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();

mongoose
  .connect(
    'mongodb+srv://bberg:X04Wh2ltjsT45RHV@cluster0-qgg9v.mongodb.net/mean-machine?retryWrites=true&w=majority'
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
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());

app.post('/api/posts', (request, response) => {
  const post = new Post(request.body);

  post.save();
  response.status(201).json({
    message: 'Post successfully added',
    post: post,
  });
});

app.get('/api/posts', (request, response) => {
  Post.find().then((docs) => {
    response.status(200).json({
      posts: docs,
    });
  });
});

app.delete('/api/posts/:id', (request, response) => {
  Post.findByIdAndDelete(request.params.id).then(() => {
    response.status(200).json({
      message: 'Post sucessfully deleted',
    });
  });
});

app.patch('/api/posts/:id', (request, response) => {
  Post.findByIdAndUpdate(request.params.id, request.body, { new: true }).then(
    (post) => {
      response.status(200).json({
        message: 'Post successfully updated',
        post: post,
      });
    }
  );
});

module.exports = app;

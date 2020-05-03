const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.post('', (request, response) => {
  const post = new Post(request.body);

  post.save();
  response.status(201).json({
    message: 'Post successfully added',
    post: post,
  });
});

router.get('', (request, response) => {
  Post.find().then((docs) => {
    response.status(200).json({
      posts: docs,
    });
  });
});

router.delete('/:id', (request, response) => {
  Post.findByIdAndDelete(request.params.id).then(() => {
    response.status(200).json({
      message: 'Post sucessfully deleted',
    });
  });
});

router.patch('/:id', (request, response) => {
  Post.findByIdAndUpdate(request.params.id, request.body, { new: true }).then(
    (post) => {
      response.status(200).json({
        message: 'Post successfully updated',
        post: post,
      });
    }
  );
});

module.exports = router;

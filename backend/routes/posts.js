const express = require('express');
const Post = require('../models/post');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    callback(error, 'backend/images');
  },
  filename: (request, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  },
});

router.post(
  '',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (request, response) => {
    let imagePath;

    if (request.file) {
      const url = request.protocol + '://' + request.get('host');
      imagePath = url + '/images/' + request.file.filename;
    }

    const post = new Post({
      title: request.body.title,
      content: request.body.content,
      imagePath: imagePath || null,
    });

    post.save();
    response.status(201).json({
      message: 'Post successfully added',
      post: post,
    });
  }
);

router.get('', (request, response) => {
  const perPage = +request.query.perPage;
  const currentPage = +request.query.currentPage;
  const query = Post.find();
  let posts;

  if (perPage && currentPage) {
    query.skip(perPage * (currentPage - 1)).limit(perPage);
  }

  query
    .then((docs) => {
      posts = docs;
      return Post.count();
    })
    .then((count) => {
      response.status(200).json({
        posts: posts,
        totalPosts: count,
      });
    });
});

router.get('/:id', (request, response) => {
  Post.findById(request.params.id).then((post) => {
    response.status(200).json({
      post: post,
    });
  });
});

router.delete('/:id', checkAuth, (request, response) => {
  Post.findByIdAndDelete(request.params.id).then(() => {
    response.status(200).json({
      message: 'Post sucessfully deleted',
    });
  });
});

router.patch(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (request, response) => {
    let post;

    if (request.file) {
      const url = request.protocol + '://' + request.get('host');
      const imagePath = url + '/images/' + request.file.filename;

      post = {
        ...request.body,
        imagePath,
      };
    } else {
      post = request.body;
    }

    Post.findByIdAndUpdate(request.params.id, post, { new: true }).then(
      (post) => {
        response.status(200).json({
          message: 'Post successfully updated',
          post: post,
        });
      }
    );
  }
);

module.exports = router;

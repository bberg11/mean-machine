const express = require('express');
const multer = require('multer');

const PostsController = require('../controllers/posts');
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
  PostsController.addPost
);

router.get('', PostsController.getPosts);

router.get('/:id', PostsController.getPost);

router.delete('/:id', checkAuth, PostsController.deletePost);

router.patch(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  PostsController.updatePost
);

module.exports = router;

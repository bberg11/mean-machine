const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (request, response) => {
  bcrypt.hash(request.body.password, 10).then((hash) => {
    const user = new User({
      email: request.body.email,
      password: hash,
    });
    user
      .save()
      .then((user) => {
        response.status(201).json({
          message: 'User created!',
          user: user,
        });
      })
      .catch((err) => {
        response.status(500).json({
          error: err,
        });
      });
  });
});

router.post('/login', (request, response) => {
  let fetchedUser;

  User.findOne({ email: request.body.email })
    .then((user) => {
      console.log(user);
      if (!user) {
        return response.status(401).json({
          message: 'Auth failed',
        });
      }

      fetchedUser = user;

      return bcrypt.compare(request.body.password, user.password);
    })
    .then((authenticated) => {
      if (!authenticated) {
        return response.status(401).json({
          message: 'Auth failed',
        });
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'long_ass_secret_key_stored_somewhere_else',
        { expiresIn: '1h' }
      );

      response.status(200).json({
        token: token,
        expiresIn: 3600,
        id: fetchedUser._id,
      });
    })
    .catch(() => {
      return response.status(401).json({
        message: 'Auth failed',
      });
    });
});

module.exports = router;

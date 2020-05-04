const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (request, response) => {
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
      .catch(() => {
        response.status(500).json({
          message: `There was a problem creating your account. The email "${request.body.email}" may already be in use`,
        });
      });
  });
};

exports.loginUser = (request, response) => {
  let fetchedUser;

  User.findOne({ email: request.body.email })
    .then((user) => {
      if (!user) {
        return response.status(401).json({
          message: 'Unable to find a matching email and password',
        });
      }

      fetchedUser = user;

      return bcrypt.compare(request.body.password, user.password);
    })
    .then((authenticated) => {
      if (!authenticated) {
        return response.status(401).json({
          message: 'Unable to find a matching email and password',
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
        message: 'Unable to find a matching email and password',
      });
    });
};

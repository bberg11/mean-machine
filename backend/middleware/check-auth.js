const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      'long_ass_secret_key_stored_somewhere_else'
    );

    request.userData = { email: decodedToken.email, id: decodedToken.userId };
    next();
  } catch (error) {
    response.status(401).json({ message: 'Authentication was unsuccessful' });
  }
};

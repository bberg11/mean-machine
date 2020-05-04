const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, 'long_ass_secret_key_stored_somewhere_else');
    next();
  } catch (error) {
    response.status(401).json({ message: 'Auth failed!' });
  }
};

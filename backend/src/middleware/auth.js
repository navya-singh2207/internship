const jwt = require('jsonwebtoken');

module.exports = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      const error = new Error('JWT secret is not configured');
      error.statusCode = 500;
      return next(error);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (_err) {
    const error = new Error('Invalid token');
    error.statusCode = 401;
    return next(error);
  }
};

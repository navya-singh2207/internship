module.exports = (requiredRole = 'ADMIN') => (req, _res, next) => {
  if (!req.user || req.user.role !== requiredRole) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    return next(error);
  }

  return next();
};

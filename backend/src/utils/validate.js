const { validationResult } = require('express-validator');

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg || 'Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    return next(error);
  }
  return next();
};

module.exports = validate;

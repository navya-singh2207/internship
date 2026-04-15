module.exports = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    message,
  };

  if (Array.isArray(err.details) && err.details.length) {
    response.errors = err.details.map((detail) => ({
      field: detail.path || detail.param || 'unknown',
      message: detail.msg,
    }));
  }

  res.status(statusCode).json(response);
};

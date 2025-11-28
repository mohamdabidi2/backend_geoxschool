function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong.";

  if (status >= 500) {
    console.error("Unhandled error:", err);
  }

  res.status(status).json({
    error: message,
    details: err.details ?? undefined,
  });
}

module.exports = errorHandler;



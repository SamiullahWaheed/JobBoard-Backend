function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(" "),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id." });
  }

  res.status(error.status || 500).json({
    message: error.message || "An unexpected server error occurred.",
  });
}

module.exports = { notFound, errorHandler };

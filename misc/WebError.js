class WebError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }

  static NotFound() {
    return new WebError("Page Not Found", 404);
  }

  static Forbidden() {
    return new WebError("Forbidden", 403);
  }

  static Unauthorized() {
    return new WebError("Unauthorized", 401);
  }

  static ServerError() {
    return new WebError("Server Error", 500);
  }
};

module.exports = WebError;
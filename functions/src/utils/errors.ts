export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(400, "BAD_REQUEST", message, details);
  }

  static unauthorized(message = "Authentication required") {
    return new AppError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "Insufficient permissions") {
    return new AppError(403, "FORBIDDEN", message);
  }

  static notFound(message = "Resource not found") {
    return new AppError(404, "NOT_FOUND", message);
  }

  static conflict(message: string) {
    return new AppError(409, "CONFLICT", message);
  }

  static unprocessableEntity(message: string, details?: unknown) {
    return new AppError(422, "UNPROCESSABLE_ENTITY", message, details);
  }

  static tooManyRequests(message = "Too many requests. Please try again later.") {
    return new AppError(429, "TOO_MANY_REQUESTS", message);
  }

  static internal(message = "Internal server error") {
    return new AppError(500, "INTERNAL_ERROR", message);
  }
}

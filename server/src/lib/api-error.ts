
class ApiError extends Error {
  
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }


  public static notFound(message = 'Not found', code?: string) {
    return new ApiError(404, message, code);
  }
  
  public static badRequest(message = 'Bad Request', code?: string) {
    return new ApiError(400, message, code);
  }
  
  public static unauthorized(message = 'Unauthorized', code?: string) {
    return new ApiError(401, message, code);
  }

  
  public static forbidden(message = 'Forbidden', code?: string) {
    return new ApiError(403, message, code);
  }
  
  public static internalError(message = 'Internal Server Error', code?: string) {
    return new ApiError(500, message, code);
  }
  
  public static conflict(message = 'Conflict', code?: string) {
    return new ApiError(409, message, code);
  }
  
  public static serviceUnavailable(message = 'Service Unavailable', code?: string) {
    return new ApiError(503, message, code);
  }
  
  public static tooManyRequests(message = 'Too Many Requests', code?: string) {
    return new ApiError(429, message, code);
  }
  
  public static methodNotAllowed(message = 'Method Not Allowed', code?: string) {
    return new ApiError(405, message, code);
  }
  
  public static notImplemented(message = 'Not Implemented', code?: string) {
    return new ApiError(501, message, code);
  }

}

export default ApiError;

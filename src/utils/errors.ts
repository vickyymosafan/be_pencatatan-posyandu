import { ValidationError as ValidationErrorType } from './response.util';

/**
 * Custom Error Classes
 * 
 * Custom error classes untuk error handling yang lebih spesifik.
 * Semua error class extend dari AppError yang merupakan base class.
 */

/**
 * Base Application Error Class
 * 
 * Base class untuk semua custom errors dalam aplikasi.
 * Menyimpan statusCode dan flag isOperational untuk membedakan
 * operational errors dari programming errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error Class
 * 
 * Error untuk validation failures (400 Bad Request).
 * Menyimpan array of validation errors dengan field dan message.
 * 
 * @example
 * throw new ValidationError('Validation failed', [
 *   { field: 'email', message: 'Email is required' }
 * ]);
 */
export class ValidationError extends AppError {
  public readonly errors: ValidationErrorType[];

  constructor(message: string, errors: ValidationErrorType[]) {
    super(400, message);
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Unauthorized Error Class
 * 
 * Error untuk authentication failures (401 Unauthorized).
 * Digunakan ketika user tidak terautentikasi atau token invalid.
 * 
 * @example
 * throw new UnauthorizedError('Token tidak valid');
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden Error Class
 * 
 * Error untuk authorization failures (403 Forbidden).
 * Digunakan ketika user terautentikasi tapi tidak memiliki permission.
 * 
 * @example
 * throw new ForbiddenError('Akses ditolak');
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Akses ditolak') {
    super(403, message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Not Found Error Class
 * 
 * Error untuk resource not found (404 Not Found).
 * Digunakan ketika resource yang diminta tidak ditemukan.
 * 
 * @example
 * throw new NotFoundError('User');
 * // Message: "User tidak ditemukan"
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} tidak ditemukan`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Conflict Error Class
 * 
 * Error untuk resource conflicts (409 Conflict).
 * Digunakan ketika ada konflik dengan resource yang sudah ada.
 * 
 * @example
 * throw new ConflictError('Email sudah terdaftar');
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Internal Server Error Class
 * 
 * Error untuk internal server errors (500 Internal Server Error).
 * Digunakan untuk unexpected errors yang tidak terhandle.
 * 
 * @example
 * throw new InternalServerError('Database connection failed');
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Terjadi kesalahan pada server') {
    super(500, message, false); // isOperational = false
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * Bad Request Error Class
 * 
 * Error untuk bad request (400 Bad Request).
 * Digunakan untuk request yang tidak valid secara umum.
 * 
 * @example
 * throw new BadRequestError('Invalid request format');
 */
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

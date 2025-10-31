import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../../generated/prisma';
import {
  AppError,
  ValidationError,
  ConflictError,
  NotFoundError,
  InternalServerError,
} from '../utils/errors';
import { errorResponse } from '../utils/response.util';

/**
 * Global Error Handler Middleware
 * 
 * Middleware untuk menangani semua errors dalam aplikasi.
 * Mengkonversi berbagai jenis errors menjadi standardized error response.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */

/**
 * Handle Prisma errors
 * Converts Prisma-specific errors ke AppError
 */
const handlePrismaError = (error: any): AppError => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (error.code === 'P2002') {
      const field = error.meta?.target as string[] | undefined;
      const fieldName = field ? field[0] : 'field';
      return new ConflictError(`${fieldName} sudah terdaftar`);
    }

    // P2025: Record not found
    if (error.code === 'P2025') {
      return new NotFoundError('Data');
    }

    // P2003: Foreign key constraint violation
    if (error.code === 'P2003') {
      return new ConflictError('Data terkait dengan data lain dan tidak dapat dihapus');
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError('Data tidak valid', [
      { field: 'unknown', message: 'Format data tidak sesuai' },
    ]);
  }

  // Unknown Prisma error
  return new InternalServerError('Database error');
};

/**
 * Global error handler middleware
 * Must be registered as the last middleware in Express app
 * 
 * @example
 * app.use(errorHandler);
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: AppError;

  // Handle AppError (our custom errors)
  if (err instanceof AppError) {
    error = err;
  }
  // Handle Prisma errors
  else if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    error = handlePrismaError(err);
  }
  // Handle unknown errors
  else {
    error = new InternalServerError(
      process.env.NODE_ENV === 'production'
        ? 'Terjadi kesalahan pada server'
        : err.message
    );
  }

  // Log error untuk debugging
  if (error.statusCode >= 500) {
    console.error('❌ Server Error:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.warn('⚠️  Client Error:', {
      message: error.message,
      path: req.path,
      method: req.method,
      statusCode: error.statusCode,
    });
  }

  // Build error response
  const response = errorResponse(
    error.message,
    error instanceof ValidationError ? error.errors : undefined,
    req.path
  );

  // Send response
  res.status(error.statusCode).json(response);
};

/**
 * 404 Not Found handler
 * Handles requests to undefined routes
 * 
 * @example
 * app.use(notFoundHandler);
 * app.use(errorHandler);
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new NotFoundError(`Route ${req.method} ${req.path}`));
};

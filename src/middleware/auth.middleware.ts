import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { UnauthorizedError } from '../utils/errors';

/**
 * Authentication Middleware
 * 
 * Middleware untuk memverifikasi JWT token dan attach user data ke request.
 * Token harus dikirim dalam Authorization header dengan format: "Bearer <token>"
 * 
 * Requirements: 2.1, 2.2, 2.4
 */

/**
 * Auth middleware function
 * Extracts JWT token dari Authorization header, verifies it, dan attach user ke req.user
 * 
 * @throws UnauthorizedError jika token tidak ada, invalid, atau expired
 * 
 * @example
 * router.get('/protected', authMiddleware, controller.handler);
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token dari Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedError('Token tidak ditemukan');
    }

    // Check format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Format token tidak valid');
    }

    const token = parts[1];

    // Verify token menggunakan jwt utility
    const payload = verifyToken(token);

    // Attach user data ke request object
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    // Continue ke next middleware/handler
    next();
  } catch (error) {
    // Pass error ke error handler middleware
    if (error instanceof Error) {
      // Jika error dari verifyToken (expired/invalid)
      if (error.message === 'Token expired' || error.message === 'Invalid token') {
        next(new UnauthorizedError('Token tidak valid atau expired'));
      } else if (error instanceof UnauthorizedError) {
        next(error);
      } else {
        next(new UnauthorizedError('Autentikasi gagal'));
      }
    } else {
      next(new UnauthorizedError('Autentikasi gagal'));
    }
  }
};

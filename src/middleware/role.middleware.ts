import { Request, Response, NextFunction } from 'express';
import { Role } from '../../generated/prisma';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

/**
 * Role-based Authorization Middleware
 * 
 * Middleware untuk memverifikasi bahwa user memiliki role yang sesuai
 * untuk mengakses endpoint tertentu.
 * 
 * Requirements: 2.3
 */

/**
 * Role middleware factory function
 * Returns middleware yang check apakah user role ada dalam allowed roles
 * 
 * @param allowedRoles - Array of roles yang diizinkan mengakses endpoint
 * @returns Express middleware function
 * @throws UnauthorizedError jika user belum terautentikasi
 * @throws ForbiddenError jika user role tidak sesuai
 * 
 * @example
 * // Only ADMIN can access
 * router.post('/users', authMiddleware, roleMiddleware([Role.ADMIN]), controller.create);
 * 
 * @example
 * // Both ADMIN and PETUGAS can access
 * router.get('/lansia', authMiddleware, roleMiddleware([Role.ADMIN, Role.PETUGAS]), controller.getAll);
 */
export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Check apakah user sudah terautentikasi (req.user harus ada dari auth middleware)
      if (!req.user) {
        throw new UnauthorizedError('User belum terautentikasi');
      }

      // Check apakah user role ada dalam allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('Akses ditolak');
      }

      // User memiliki role yang sesuai, continue
      next();
    } catch (error) {
      // Pass error ke error handler middleware
      next(error);
    }
  };
};

/**
 * Admin only middleware
 * Shorthand untuk roleMiddleware([Role.ADMIN])
 * 
 * @example
 * router.delete('/users/:id', authMiddleware, adminOnly, controller.delete);
 */
export const adminOnly = roleMiddleware([Role.ADMIN]);

/**
 * Authenticated middleware
 * Allows both ADMIN and PETUGAS (all authenticated users)
 * 
 * @example
 * router.get('/pemeriksaan', authMiddleware, authenticated, controller.getAll);
 */
export const authenticated = roleMiddleware([Role.ADMIN, Role.PETUGAS]);

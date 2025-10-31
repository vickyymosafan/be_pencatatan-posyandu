import { Role } from '../../generated/prisma';

/**
 * Express Type Extensions
 * 
 * Extend Express Request interface untuk menambahkan custom properties.
 */

declare global {
  namespace Express {
    /**
     * Extended Request interface dengan user property
     * User property akan di-set oleh auth middleware setelah JWT verification
     */
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};

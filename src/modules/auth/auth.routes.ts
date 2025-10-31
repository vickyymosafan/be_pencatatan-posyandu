import { Router } from 'express';
import * as authController from './auth.controller';
import { loginValidation, registerValidation } from './auth.validation';
import { validate } from '../../middleware/validation.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/role.middleware';
import { loginLimiter } from '../../middleware/rate-limit.middleware';

/**
 * Auth Routes
 * 
 * Route definitions untuk authentication endpoints.
 * Requirements: 1.1
 */

const router = Router();

/**
 * POST /api/auth/login
 * Login user dengan email dan password
 * 
 * @access Public
 * @rate-limit 5 requests per 15 minutes
 */
router.post(
  '/login',
  loginLimiter,
  loginValidation,
  validate,
  authController.loginHandler
);

/**
 * POST /api/auth/register
 * Register user baru (Admin only)
 * 
 * @access Private (Admin only)
 */
router.post(
  '/register',
  authMiddleware,
  adminOnly,
  registerValidation,
  validate,
  authController.registerHandler
);

/**
 * GET /api/auth/me
 * Get current user data
 * 
 * @access Private (Authenticated users)
 */
router.get(
  '/me',
  authMiddleware,
  authController.getCurrentUserHandler
);

export default router;

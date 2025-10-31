import { Router } from 'express';
import * as usersController from './users.controller';
import {
  createUserValidation,
  updateUserValidation,
  paginationValidation,
} from './users.validation';
import { validate } from '../../middleware/validation.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/role.middleware';

/**
 * Users Routes
 * 
 * Route definitions untuk users management endpoints.
 * All endpoints are Admin only.
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

const router = Router();

// Apply auth dan admin middleware ke semua routes
router.use(authMiddleware);
router.use(adminOnly);

/**
 * GET /api/users
 * Get all users dengan pagination
 * 
 * @access Private (Admin only)
 */
router.get(
  '/',
  paginationValidation,
  validate,
  usersController.getAllUsersHandler
);

/**
 * GET /api/users/:id
 * Get user by ID
 * 
 * @access Private (Admin only)
 */
router.get(
  '/:id',
  usersController.getUserByIdHandler
);

/**
 * POST /api/users
 * Create new user
 * 
 * @access Private (Admin only)
 */
router.post(
  '/',
  createUserValidation,
  validate,
  usersController.createUserHandler
);

/**
 * PUT /api/users/:id
 * Update user
 * 
 * @access Private (Admin only)
 */
router.put(
  '/:id',
  updateUserValidation,
  validate,
  usersController.updateUserHandler
);

/**
 * DELETE /api/users/:id
 * Delete user
 * 
 * @access Private (Admin only)
 */
router.delete(
  '/:id',
  usersController.deleteUserHandler
);

export default router;

import { Router } from 'express';
import * as pemeriksaanController from './pemeriksaan.controller';
import {
  createPemeriksaanValidation,
  updatePemeriksaanValidation,
  pemeriksaanFilterValidation,
} from './pemeriksaan.validation';
import { validate } from '../../middleware/validation.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/role.middleware';

/**
 * Pemeriksaan Routes
 * 
 * Route definitions untuk pemeriksaan management endpoints.
 * All endpoints require authentication
 * Delete operation: Admin only
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

const router = Router();

// Apply auth middleware ke semua routes
router.use(authMiddleware);

/**
 * GET /api/pemeriksaan
 * Get all pemeriksaan dengan filtering dan pagination
 * 
 * @access Private (Admin & Petugas)
 */
router.get(
  '/',
  pemeriksaanFilterValidation,
  validate,
  pemeriksaanController.getAllPemeriksaanHandler
);

/**
 * GET /api/pemeriksaan/:id
 * Get pemeriksaan by ID dengan detail lengkap
 * 
 * @access Private (Admin & Petugas)
 */
router.get(
  '/:id',
  pemeriksaanController.getPemeriksaanByIdHandler
);

/**
 * POST /api/pemeriksaan
 * Create new pemeriksaan
 * 
 * @access Private (Admin & Petugas)
 */
router.post(
  '/',
  createPemeriksaanValidation,
  validate,
  pemeriksaanController.createPemeriksaanHandler
);

/**
 * PUT /api/pemeriksaan/:id
 * Update pemeriksaan
 * 
 * @access Private (Admin & Petugas)
 */
router.put(
  '/:id',
  updatePemeriksaanValidation,
  validate,
  pemeriksaanController.updatePemeriksaanHandler
);

/**
 * DELETE /api/pemeriksaan/:id
 * Delete pemeriksaan
 * 
 * @access Private (Admin only)
 */
router.delete(
  '/:id',
  adminOnly,
  pemeriksaanController.deletePemeriksaanHandler
);

export default router;

import { Router } from 'express';
import * as lansiaController from './lansia.controller';
import {
  createLansiaValidation,
  updateLansiaValidation,
  lansiaFilterValidation,
} from './lansia.validation';
import { validate } from '../../middleware/validation.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/role.middleware';

/**
 * Lansia Routes
 * 
 * Route definitions untuk lansia management endpoints.
 * Read operations: Admin & Petugas
 * Create/Update/Delete operations: Admin only
 * Requirements: 4.1, 4.2, 4.3, 4.4, 5.4
 */

const router = Router();

// Apply auth middleware ke semua routes
router.use(authMiddleware);

/**
 * GET /api/lansia
 * Get all lansia dengan pagination, search, dan sorting
 * 
 * @access Private (Admin & Petugas)
 */
router.get(
  '/',
  lansiaFilterValidation,
  validate,
  lansiaController.getAllLansiaHandler
);

/**
 * GET /api/lansia/qr/:id
 * Get QR Code image untuk lansia
 * Note: Harus di atas route /:id agar tidak tertangkap sebagai ID
 * 
 * @access Private (Admin & Petugas)
 */
router.get(
  '/qr/:id',
  lansiaController.getQRCodeHandler
);

/**
 * GET /api/lansia/:id
 * Get lansia by ID dengan riwayat pemeriksaan
 * 
 * @access Private (Admin & Petugas)
 */
router.get(
  '/:id',
  lansiaController.getLansiaByIdHandler
);

/**
 * POST /api/lansia
 * Create new lansia dengan auto-generate QR code
 * 
 * @access Private (Admin only)
 */
router.post(
  '/',
  adminOnly,
  createLansiaValidation,
  validate,
  lansiaController.createLansiaHandler
);

/**
 * PUT /api/lansia/:id
 * Update lansia
 * 
 * @access Private (Admin only)
 */
router.put(
  '/:id',
  adminOnly,
  updateLansiaValidation,
  validate,
  lansiaController.updateLansiaHandler
);

/**
 * DELETE /api/lansia/:id
 * Delete lansia
 * 
 * @access Private (Admin only)
 */
router.delete(
  '/:id',
  adminOnly,
  lansiaController.deleteLansiaHandler
);

export default router;

import { Router } from 'express';
import * as laporanController from './laporan.controller';
import { reportFilterValidation } from './laporan.validation';
import { validate } from '../../middleware/validation.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/role.middleware';

/**
 * Laporan Routes
 * 
 * Route definitions untuk laporan dan dashboard endpoints.
 * All endpoints are Admin only.
 * Requirements: 8.1, 9.1
 */

const router = Router();

// Apply auth dan admin middleware ke semua routes
router.use(authMiddleware);
router.use(adminOnly);

/**
 * GET /api/laporan/dashboard
 * Get dashboard statistics
 * 
 * @access Private (Admin only)
 */
router.get(
  '/dashboard',
  laporanController.getDashboardHandler
);

/**
 * GET /api/laporan/pemeriksaan
 * Get pemeriksaan report dengan filtering
 * 
 * @access Private (Admin only)
 */
router.get(
  '/pemeriksaan',
  reportFilterValidation,
  validate,
  laporanController.getPemeriksaanReportHandler
);

export default router;

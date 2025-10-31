import { Request, Response, NextFunction } from 'express';
import * as laporanService from './laporan.service';
import { successResponse } from '../../utils/response.util';
import { ReportFilterDTO } from './laporan.types';

/**
 * Laporan Controller
 * 
 * Request handlers untuk laporan dan dashboard endpoints.
 * Requirements: 8.1, 8.5
 */

/**
 * Get dashboard statistics handler
 * GET /api/laporan/dashboard
 * 
 * @returns 200 dengan dashboard stats
 */
export const getDashboardHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await laporanService.getDashboardStats();

    res.status(200).json(
      successResponse('Dashboard stats berhasil diambil', stats, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get pemeriksaan report handler
 * GET /api/laporan/pemeriksaan
 * 
 * @query startDate - Start date (ISO 8601)
 * @query endDate - End date (ISO 8601)
 * @query lansiaId - Filter by lansia ID (optional)
 * @returns 200 dengan pemeriksaan report
 */
export const getPemeriksaanReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters: ReportFilterDTO = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      lansiaId: req.query.lansiaId as string,
    };

    const report = await laporanService.getPemeriksaanReport(filters);

    res.status(200).json(
      successResponse('Laporan pemeriksaan berhasil diambil', report, req.path)
    );
  } catch (error) {
    next(error);
  }
};

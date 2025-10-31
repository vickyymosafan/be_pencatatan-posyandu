import { Request, Response, NextFunction } from 'express';
import * as pemeriksaanService from './pemeriksaan.service';
import { successResponse, paginatedResponse } from '../../utils/response.util';
import {
  CreatePemeriksaanDTO,
  UpdatePemeriksaanDTO,
  PemeriksaanFilterDTO,
} from './pemeriksaan.types';

/**
 * Pemeriksaan Controller
 * 
 * Request handlers untuk pemeriksaan management endpoints.
 * Requirements: 6.1, 6.4, 6.5
 */

/**
 * Get all pemeriksaan handler
 * GET /api/pemeriksaan
 * 
 * @query page - Page number (default: 1)
 * @query limit - Items per page (default: 10)
 * @query lansiaId - Filter by lansia ID
 * @query startDate - Filter by start date (ISO 8601)
 * @query endDate - Filter by end date (ISO 8601)
 * @returns 200 dengan paginated pemeriksaan data
 */
export const getAllPemeriksaanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters: PemeriksaanFilterDTO = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      lansiaId: req.query.lansiaId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const result = await pemeriksaanService.getAllPemeriksaan(filters);

    res.status(200).json(
      paginatedResponse(
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Data pemeriksaan berhasil diambil'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get pemeriksaan by ID handler
 * GET /api/pemeriksaan/:id
 * 
 * @param id - Pemeriksaan ID
 * @returns 200 dengan pemeriksaan data lengkap (include lansia & user)
 * @throws 404 jika pemeriksaan tidak ditemukan
 */
export const getPemeriksaanByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const pemeriksaan = await pemeriksaanService.getPemeriksaanById(id);

    res.status(200).json(
      successResponse('Data pemeriksaan berhasil diambil', pemeriksaan, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create pemeriksaan handler
 * POST /api/pemeriksaan
 * 
 * @body lansiaId - ID lansia
 * @body tekanan_darah - Tekanan darah (format: 120/80)
 * @body berat_badan - Berat badan (kg)
 * @body gula_darah - Gula darah (mg/dL)
 * @body kolesterol - Kolesterol (mg/dL)
 * @body keluhan - Keluhan (optional)
 * @returns 201 dengan created pemeriksaan data
 * @throws 404 jika lansiaId tidak valid
 */
export const createPemeriksaanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pemeriksaanData: CreatePemeriksaanDTO = req.body;
    
    // Extract userId dari req.user (set by auth middleware)
    const userId = req.user!.userId;

    const pemeriksaan = await pemeriksaanService.createPemeriksaan(
      pemeriksaanData,
      userId
    );

    res.status(201).json(
      successResponse('Data pemeriksaan berhasil dibuat', pemeriksaan, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update pemeriksaan handler
 * PUT /api/pemeriksaan/:id
 * 
 * @param id - Pemeriksaan ID
 * @body tekanan_darah - Tekanan darah (optional)
 * @body berat_badan - Berat badan (optional)
 * @body gula_darah - Gula darah (optional)
 * @body kolesterol - Kolesterol (optional)
 * @body keluhan - Keluhan (optional)
 * @returns 200 dengan updated pemeriksaan data
 * @throws 404 jika pemeriksaan tidak ditemukan
 */
export const updatePemeriksaanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const pemeriksaanData: UpdatePemeriksaanDTO = req.body;

    const pemeriksaan = await pemeriksaanService.updatePemeriksaan(
      id,
      pemeriksaanData
    );

    res.status(200).json(
      successResponse('Data pemeriksaan berhasil diupdate', pemeriksaan, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete pemeriksaan handler
 * DELETE /api/pemeriksaan/:id
 * 
 * @param id - Pemeriksaan ID
 * @returns 200 dengan success message
 * @throws 404 jika pemeriksaan tidak ditemukan
 */
export const deletePemeriksaanHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await pemeriksaanService.deletePemeriksaan(id);

    res.status(200).json(
      successResponse('Data pemeriksaan berhasil dihapus', undefined, req.path)
    );
  } catch (error) {
    next(error);
  }
};

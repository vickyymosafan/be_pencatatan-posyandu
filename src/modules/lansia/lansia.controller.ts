import { Request, Response, NextFunction } from 'express';
import * as lansiaService from './lansia.service';
import { successResponse, paginatedResponse } from '../../utils/response.util';
import { CreateLansiaDTO, UpdateLansiaDTO, LansiaFilterDTO } from './lansia.types';
import fs from 'fs';
import path from 'path';

/**
 * Lansia Controller
 * 
 * Request handlers untuk lansia management endpoints.
 * Requirements: 4.1, 4.2, 4.3, 4.4, 5.4, 5.5
 */

/**
 * Get all lansia handler
 * GET /api/lansia
 * 
 * @query page - Page number (default: 1)
 * @query limit - Items per page (default: 10)
 * @query search - Search by nama or NIK
 * @query sortBy - Sort by field (nama or createdAt)
 * @query sortOrder - Sort order (asc or desc)
 * @returns 200 dengan paginated lansia data
 */
export const getAllLansiaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters: LansiaFilterDTO = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      sortBy: req.query.sortBy as 'nama' | 'createdAt',
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await lansiaService.getAllLansia(filters);

    res.status(200).json(
      paginatedResponse(
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Data lansia berhasil diambil'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get lansia by ID handler
 * GET /api/lansia/:id
 * 
 * @param id - Lansia ID
 * @returns 200 dengan lansia data dan riwayat pemeriksaan
 * @throws 404 jika lansia tidak ditemukan
 */
export const getLansiaByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const lansia = await lansiaService.getLansiaById(id);

    res.status(200).json(
      successResponse('Data lansia berhasil diambil', lansia, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create lansia handler
 * POST /api/lansia
 * 
 * @body nama - Nama lansia
 * @body nik - NIK 16 digit
 * @body tanggal_lahir - Tanggal lahir
 * @body alamat - Alamat lengkap
 * @body penyakit_bawaan - Penyakit bawaan
 * @body kontak_keluarga - Kontak keluarga
 * @returns 201 dengan created lansia data (dengan qr_code_url)
 * @throws 409 jika NIK sudah terdaftar
 */
export const createLansiaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lansiaData: CreateLansiaDTO = req.body;

    const lansia = await lansiaService.createLansia(lansiaData);

    res.status(201).json(
      successResponse('Data lansia berhasil dibuat', lansia, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update lansia handler
 * PUT /api/lansia/:id
 * 
 * @param id - Lansia ID
 * @body nama - Nama lansia (optional)
 * @body nik - NIK 16 digit (optional)
 * @body tanggal_lahir - Tanggal lahir (optional)
 * @body alamat - Alamat lengkap (optional)
 * @body penyakit_bawaan - Penyakit bawaan (optional)
 * @body kontak_keluarga - Kontak keluarga (optional)
 * @returns 200 dengan updated lansia data
 * @throws 404 jika lansia tidak ditemukan
 * @throws 409 jika NIK baru sudah terdaftar
 */
export const updateLansiaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const lansiaData: UpdateLansiaDTO = req.body;

    const lansia = await lansiaService.updateLansia(id, lansiaData);

    res.status(200).json(
      successResponse('Data lansia berhasil diupdate', lansia, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete lansia handler
 * DELETE /api/lansia/:id
 * 
 * @param id - Lansia ID
 * @returns 200 dengan success message
 * @throws 404 jika lansia tidak ditemukan
 */
export const deleteLansiaHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await lansiaService.deleteLansia(id);

    res.status(200).json(
      successResponse('Data lansia berhasil dihapus', undefined, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get QR Code handler
 * GET /api/lansia/qr/:id
 * 
 * @param id - Lansia ID
 * @returns QR Code image file (PNG)
 * @throws 404 jika lansia atau QR code tidak ditemukan
 * 
 * Requirements: 5.4
 */
export const getQRCodeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const qrCodeUrl = await lansiaService.getQRCodePath(id);

    // Convert relative URL path ke absolute file path
    const filePath = path.join(process.cwd(), qrCodeUrl);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return next(new Error('QR Code file tidak ditemukan'));
    }

    // Set content type dan send file
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

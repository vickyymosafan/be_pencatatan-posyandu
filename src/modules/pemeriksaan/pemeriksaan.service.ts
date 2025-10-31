import prisma from '../../config/database';
import { NotFoundError } from '../../utils/errors';
import {
  CreatePemeriksaanDTO,
  UpdatePemeriksaanDTO,
  PemeriksaanFilterDTO,
  PemeriksaanDetail,
  PemeriksaanResponse,
} from './pemeriksaan.types';

/**
 * Pemeriksaan Service
 * 
 * Business logic untuk pemeriksaan management operations.
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5
 */

/**
 * Get all pemeriksaan dengan filtering dan pagination
 * 
 * @param filters - Filter parameters (page, limit, lansiaId, startDate, endDate)
 * @returns Paginated pemeriksaan data
 * 
 * Requirements: 7.1, 7.4
 */
export const getAllPemeriksaan = async (filters: PemeriksaanFilterDTO) => {
  const {
    page = 1,
    limit = 10,
    lansiaId,
    startDate,
    endDate,
  } = filters;

  const skip = (page - 1) * limit;

  // Build where clause untuk filtering
  const whereClause: any = {};

  if (lansiaId) {
    whereClause.lansiaId = lansiaId;
  }

  if (startDate || endDate) {
    whereClause.tanggal = {};
    if (startDate) {
      whereClause.tanggal.gte = new Date(startDate);
    }
    if (endDate) {
      whereClause.tanggal.lte = new Date(endDate);
    }
  }

  // Get total count untuk pagination info
  const total = await prisma.pemeriksaan.count({
    where: whereClause,
  });

  // Get pemeriksaan dengan pagination, sorting, dan include user info
  const pemeriksaan = await prisma.pemeriksaan.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: {
      tanggal: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return {
    data: pemeriksaan,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get pemeriksaan by ID dengan include lansia dan user data
 * 
 * @param id - Pemeriksaan ID
 * @returns Pemeriksaan data dengan lansia dan user info
 * @throws NotFoundError jika pemeriksaan tidak ditemukan
 * 
 * Requirements: 7.3
 */
export const getPemeriksaanById = async (id: string): Promise<PemeriksaanDetail> => {
  const pemeriksaan = await prisma.pemeriksaan.findUnique({
    where: { id },
    include: {
      lansia: true,
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!pemeriksaan) {
    throw new NotFoundError('Pemeriksaan');
  }

  return pemeriksaan as PemeriksaanDetail;
};

/**
 * Create new pemeriksaan
 * 
 * @param pemeriksaanData - Pemeriksaan data untuk create
 * @param userId - User ID dari JWT token (createdBy)
 * @returns Created pemeriksaan data
 * @throws NotFoundError jika lansiaId tidak valid
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export const createPemeriksaan = async (
  pemeriksaanData: CreatePemeriksaanDTO,
  userId: string
): Promise<PemeriksaanResponse> => {
  const {
    lansiaId,
    tekanan_darah,
    berat_badan,
    gula_darah,
    kolesterol,
    keluhan = '',
  } = pemeriksaanData;

  // Validate lansiaId exists
  const lansia = await prisma.lansia.findUnique({
    where: { id: lansiaId },
  });

  if (!lansia) {
    throw new NotFoundError('Lansia');
  }

  // Create pemeriksaan dengan createdBy dari userId
  const pemeriksaan = await prisma.pemeriksaan.create({
    data: {
      lansiaId,
      tekanan_darah,
      berat_badan,
      gula_darah,
      kolesterol,
      keluhan,
      createdBy: userId,
    },
  });

  return pemeriksaan;
};

/**
 * Update pemeriksaan
 * 
 * @param id - Pemeriksaan ID
 * @param pemeriksaanData - Pemeriksaan data untuk update (partial)
 * @returns Updated pemeriksaan data
 * @throws NotFoundError jika pemeriksaan tidak ditemukan
 * 
 * Requirements: 6.4
 */
export const updatePemeriksaan = async (
  id: string,
  pemeriksaanData: UpdatePemeriksaanDTO
): Promise<PemeriksaanResponse> => {
  // Check if pemeriksaan exists
  const existingPemeriksaan = await prisma.pemeriksaan.findUnique({
    where: { id },
  });

  if (!existingPemeriksaan) {
    throw new NotFoundError('Pemeriksaan');
  }

  // Update pemeriksaan
  // Note: lansiaId dan createdBy tidak boleh diubah
  const pemeriksaan = await prisma.pemeriksaan.update({
    where: { id },
    data: {
      tekanan_darah: pemeriksaanData.tekanan_darah,
      berat_badan: pemeriksaanData.berat_badan,
      gula_darah: pemeriksaanData.gula_darah,
      kolesterol: pemeriksaanData.kolesterol,
      keluhan: pemeriksaanData.keluhan,
    },
  });

  return pemeriksaan;
};

/**
 * Delete pemeriksaan
 * 
 * @param id - Pemeriksaan ID
 * @throws NotFoundError jika pemeriksaan tidak ditemukan
 * 
 * Requirements: 6.4
 */
export const deletePemeriksaan = async (id: string): Promise<void> => {
  // Check if pemeriksaan exists
  const existingPemeriksaan = await prisma.pemeriksaan.findUnique({
    where: { id },
  });

  if (!existingPemeriksaan) {
    throw new NotFoundError('Pemeriksaan');
  }

  // Delete pemeriksaan
  await prisma.pemeriksaan.delete({
    where: { id },
  });
};

import { Pemeriksaan, Lansia } from '../../../generated/prisma';
import { UserResponse } from '../auth/auth.types';

/**
 * Pemeriksaan Module Types
 * 
 * Type definitions untuk pemeriksaan management module.
 */

/**
 * Create Pemeriksaan DTO
 * Data Transfer Object untuk create pemeriksaan request
 */
export interface CreatePemeriksaanDTO {
  lansiaId: string;
  tekanan_darah: string;
  berat_badan: string;
  gula_darah: string;
  kolesterol: string;
  keluhan?: string;
}

/**
 * Update Pemeriksaan DTO
 * Data Transfer Object untuk update pemeriksaan request
 * Semua fields optional untuk partial update
 * Note: lansiaId dan createdBy tidak boleh diubah
 */
export interface UpdatePemeriksaanDTO {
  tekanan_darah?: string;
  berat_badan?: string;
  gula_darah?: string;
  kolesterol?: string;
  keluhan?: string;
}

/**
 * Pemeriksaan Filter DTO
 * Query parameters untuk filtering dan pagination
 */
export interface PemeriksaanFilterDTO {
  page?: number;
  limit?: number;
  lansiaId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Pemeriksaan Detail
 * Pemeriksaan data dengan relasi lansia dan user
 */
export interface PemeriksaanDetail extends Pemeriksaan {
  lansia: Lansia;
  user: UserResponse;
}

/**
 * Pemeriksaan Response
 * Response type untuk pemeriksaan data
 */
export type PemeriksaanResponse = Pemeriksaan;

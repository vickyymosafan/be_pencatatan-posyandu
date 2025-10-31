import { Lansia, Pemeriksaan } from '../../../generated/prisma';

/**
 * Lansia Module Types
 * 
 * Type definitions untuk lansia management module.
 */

/**
 * Create Lansia DTO
 * Data Transfer Object untuk create lansia request
 */
export interface CreateLansiaDTO {
  nama: string;
  nik: string;
  tanggal_lahir: Date;
  alamat: string;
  penyakit_bawaan: string;
  kontak_keluarga: string;
}

/**
 * Update Lansia DTO
 * Data Transfer Object untuk update lansia request
 * Semua fields optional untuk partial update
 */
export interface UpdateLansiaDTO {
  nama?: string;
  nik?: string;
  tanggal_lahir?: Date;
  alamat?: string;
  penyakit_bawaan?: string;
  kontak_keluarga?: string;
}

/**
 * Lansia Filter DTO
 * Query parameters untuk filtering dan pagination
 */
export interface LansiaFilterDTO {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'nama' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Lansia With History
 * Lansia data dengan riwayat pemeriksaan terakhir
 */
export interface LansiaWithHistory extends Lansia {
  pemeriksaan: Pemeriksaan[];
}

/**
 * Lansia Response
 * Response type untuk lansia data
 */
export type LansiaResponse = Lansia;

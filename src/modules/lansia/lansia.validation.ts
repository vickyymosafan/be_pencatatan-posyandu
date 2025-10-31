import { body, query } from 'express-validator';

/**
 * Lansia Validation Schemas
 * 
 * Validation rules untuk lansia endpoints menggunakan express-validator.
 * Requirements: 10.3, 10.4
 */

/**
 * Create lansia validation schema
 * Validates semua field yang required untuk create lansia
 */
export const createLansiaValidation = [
  body('nama')
    .trim()
    .notEmpty()
    .withMessage('Nama wajib diisi')
    .isLength({ min: 3 })
    .withMessage('Nama minimal 3 karakter'),
  
  body('nik')
    .trim()
    .notEmpty()
    .withMessage('NIK wajib diisi')
    .matches(/^\d{16}$/)
    .withMessage('NIK harus berupa 16 digit angka'),
  
  body('tanggal_lahir')
    .notEmpty()
    .withMessage('Tanggal lahir wajib diisi')
    .isISO8601()
    .withMessage('Format tanggal tidak valid')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate > today) {
        throw new Error('Tanggal lahir tidak boleh di masa depan');
      }
      return true;
    }),
  
  body('alamat')
    .trim()
    .notEmpty()
    .withMessage('Alamat wajib diisi')
    .isLength({ min: 10 })
    .withMessage('Alamat minimal 10 karakter'),
  
  body('penyakit_bawaan')
    .trim()
    .notEmpty()
    .withMessage('Penyakit bawaan wajib diisi'),
  
  body('kontak_keluarga')
    .trim()
    .notEmpty()
    .withMessage('Kontak keluarga wajib diisi')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Format kontak keluarga tidak valid'),
];

/**
 * Update lansia validation schema
 * Semua fields optional untuk partial update
 */
export const updateLansiaValidation = [
  body('nama')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nama minimal 3 karakter'),
  
  body('nik')
    .optional()
    .trim()
    .matches(/^\d{16}$/)
    .withMessage('NIK harus berupa 16 digit angka'),
  
  body('tanggal_lahir')
    .optional()
    .isISO8601()
    .withMessage('Format tanggal tidak valid')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate > today) {
        throw new Error('Tanggal lahir tidak boleh di masa depan');
      }
      return true;
    }),
  
  body('alamat')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Alamat minimal 10 karakter'),
  
  body('penyakit_bawaan')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Penyakit bawaan tidak boleh kosong'),
  
  body('kontak_keluarga')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Format kontak keluarga tidak valid'),
];

/**
 * Lansia filter validation schema
 * Validates query parameters untuk filtering dan pagination
 */
export const lansiaFilterValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page harus berupa angka positif')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus berupa angka antara 1-100')
    .toInt(),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query minimal 1 karakter'),
  
  query('sortBy')
    .optional()
    .isIn(['nama', 'createdAt'])
    .withMessage('sortBy harus nama atau createdAt'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder harus asc atau desc'),
];

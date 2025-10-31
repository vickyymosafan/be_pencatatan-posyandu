import { body, query } from 'express-validator';

/**
 * Pemeriksaan Validation Schemas
 * 
 * Validation rules untuk pemeriksaan endpoints menggunakan express-validator.
 * Requirements: 10.5
 */

/**
 * Create pemeriksaan validation schema
 * Validates semua field yang required untuk create pemeriksaan
 * Field wajib: lansiaId, tekanan_darah, berat_badan, gula_darah, kolesterol
 * Field optional: keluhan
 */
export const createPemeriksaanValidation = [
  body('lansiaId')
    .trim()
    .notEmpty()
    .withMessage('ID lansia wajib diisi')
    .isUUID()
    .withMessage('Format ID lansia tidak valid'),
  
  body('tekanan_darah')
    .trim()
    .notEmpty()
    .withMessage('Tekanan darah wajib diisi')
    .matches(/^\d+\/\d+$/)
    .withMessage('Format tekanan darah harus seperti: 120/80'),
  
  body('berat_badan')
    .trim()
    .notEmpty()
    .withMessage('Berat badan wajib diisi')
    .matches(/^\d+(\.\d+)?$/)
    .withMessage('Berat badan harus berupa angka'),
  
  body('gula_darah')
    .trim()
    .notEmpty()
    .withMessage('Gula darah wajib diisi')
    .matches(/^\d+$/)
    .withMessage('Gula darah harus berupa angka'),
  
  body('kolesterol')
    .trim()
    .notEmpty()
    .withMessage('Kolesterol wajib diisi')
    .matches(/^\d+$/)
    .withMessage('Kolesterol harus berupa angka'),
  
  body('keluhan')
    .optional()
    .trim(),
];

/**
 * Update pemeriksaan validation schema
 * Semua fields optional untuk partial update
 */
export const updatePemeriksaanValidation = [
  body('tekanan_darah')
    .optional()
    .trim()
    .matches(/^\d+\/\d+$/)
    .withMessage('Format tekanan darah harus seperti: 120/80'),
  
  body('berat_badan')
    .optional()
    .trim()
    .matches(/^\d+(\.\d+)?$/)
    .withMessage('Berat badan harus berupa angka'),
  
  body('gula_darah')
    .optional()
    .trim()
    .matches(/^\d+$/)
    .withMessage('Gula darah harus berupa angka'),
  
  body('kolesterol')
    .optional()
    .trim()
    .matches(/^\d+$/)
    .withMessage('Kolesterol harus berupa angka'),
  
  body('keluhan')
    .optional()
    .trim(),
];

/**
 * Pemeriksaan filter validation schema
 * Validates query parameters untuk filtering dan pagination
 */
export const pemeriksaanFilterValidation = [
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
  
  query('lansiaId')
    .optional()
    .trim()
    .isUUID()
    .withMessage('Format ID lansia tidak valid'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Format startDate tidak valid (gunakan ISO 8601)'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Format endDate tidak valid (gunakan ISO 8601)')
    .custom((value, { req }) => {
      if (req?.query?.startDate && value) {
        const start = new Date(req.query.startDate as string);
        const end = new Date(value);
        if (end < start) {
          throw new Error('endDate tidak boleh lebih awal dari startDate');
        }
      }
      return true;
    }),
];

import { query } from 'express-validator';

/**
 * Laporan Validation Schemas
 * 
 * Validation rules untuk laporan endpoints menggunakan express-validator.
 * Requirements: 9.5
 */

/**
 * Report filter validation schema
 * Validates startDate, endDate, dan lansiaId
 * Memastikan date range tidak lebih dari 1 tahun
 */
export const reportFilterValidation = [
  query('startDate')
    .notEmpty()
    .withMessage('startDate wajib diisi')
    .isISO8601()
    .withMessage('Format startDate tidak valid (gunakan ISO 8601)'),
  
  query('endDate')
    .notEmpty()
    .withMessage('endDate wajib diisi')
    .isISO8601()
    .withMessage('Format endDate tidak valid (gunakan ISO 8601)')
    .custom((value, { req }) => {
      if (req?.query?.startDate && value) {
        const start = new Date(req.query.startDate as string);
        const end = new Date(value);
        
        // Validate endDate >= startDate
        if (end < start) {
          throw new Error('endDate tidak boleh lebih awal dari startDate');
        }
        
        // Validate date range max 1 year (365 days)
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 365) {
          throw new Error('Rentang tanggal maksimal 1 tahun');
        }
      }
      return true;
    }),
  
  query('lansiaId')
    .optional()
    .trim()
    .isUUID()
    .withMessage('Format ID lansia tidak valid'),
];

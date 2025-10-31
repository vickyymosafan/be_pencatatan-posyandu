import { body, query } from 'express-validator';
import { Role } from '../../../generated/prisma';

/**
 * Users Validation Schemas
 * 
 * Validation rules untuk users endpoints menggunakan express-validator.
 * Requirements: 10.1, 10.2
 */

/**
 * Create user validation schema
 * Validates nama, email, password, dan role
 */
export const createUserValidation = [
  body('nama')
    .trim()
    .notEmpty()
    .withMessage('Nama wajib diisi')
    .isLength({ min: 3 })
    .withMessage('Nama minimal 3 karakter'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({ min: 8 })
    .withMessage('Password minimal 8 karakter')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password harus mengandung huruf dan angka'),
  
  body('role')
    .notEmpty()
    .withMessage('Role wajib diisi')
    .isIn([Role.ADMIN, Role.PETUGAS])
    .withMessage('Role harus ADMIN atau PETUGAS'),
];

/**
 * Update user validation schema
 * Semua fields optional untuk partial update
 */
export const updateUserValidation = [
  body('nama')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nama minimal 3 karakter'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password minimal 8 karakter')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password harus mengandung huruf dan angka'),
  
  body('role')
    .optional()
    .isIn([Role.ADMIN, Role.PETUGAS])
    .withMessage('Role harus ADMIN atau PETUGAS'),
];

/**
 * Pagination validation schema
 * Validates page dan limit query parameters
 */
export const paginationValidation = [
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
];

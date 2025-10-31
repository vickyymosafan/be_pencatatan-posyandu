import { body } from 'express-validator';
import { Role } from '../../../generated/prisma';

/**
 * Auth Validation Schemas
 * 
 * Validation rules untuk auth endpoints menggunakan express-validator.
 * Requirements: 10.1, 10.2
 */

/**
 * Login validation schema
 * Validates email format dan password presence
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi'),
];

/**
 * Register validation schema
 * Validates nama, email, password (min 8 char dengan huruf dan angka), dan role
 */
export const registerValidation = [
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

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errors';
import { ValidationError as ValidationErrorType } from '../utils/response.util';

/**
 * Validation Middleware
 * 
 * Middleware wrapper untuk express-validator.
 * Mengecek validation result dan throw ValidationError jika ada error.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

/**
 * Validate middleware function
 * Checks validation result dari express-validator dan format errors
 * 
 * @throws ValidationError dengan array of field errors jika validation gagal
 * 
 * @example
 * router.post('/login',
 *   [
 *     body('email').isEmail().withMessage('Email tidak valid'),
 *     body('password').notEmpty().withMessage('Password wajib diisi')
 *   ],
 *   validate,
 *   controller.login
 * );
 */
export const validate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Get validation result dari express-validator
  const errors = validationResult(req);

  // Jika tidak ada error, continue
  if (errors.isEmpty()) {
    return next();
  }

  // Format errors menjadi array of { field, message }
  const formattedErrors: ValidationErrorType[] = errors.array().map((error) => ({
    field: error.type === 'field' ? error.path : 'unknown',
    message: error.msg,
  }));

  // Throw ValidationError dengan formatted errors
  next(new ValidationError('Validasi gagal', formattedErrors));
};

/**
 * Validation chain runner
 * Runs validation chains dan kemudian check hasilnya
 * 
 * @param validations - Array of express-validator validation chains
 * @returns Array of middleware functions
 * 
 * @example
 * router.post('/users',
 *   runValidations([
 *     body('email').isEmail(),
 *     body('password').isLength({ min: 8 })
 *   ]),
 *   controller.create
 * );
 */
export const runValidations = (validations: ValidationChain[]) => {
  return [...validations, validate];
};

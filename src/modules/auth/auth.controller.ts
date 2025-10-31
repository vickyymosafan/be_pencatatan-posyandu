import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { successResponse } from '../../utils/response.util';
import { LoginDTO, RegisterDTO } from './auth.types';

/**
 * Auth Controller
 * 
 * Request handlers untuk auth endpoints.
 * Extract data dari request, call service, return response.
 * Requirements: 1.1
 */

/**
 * Login handler
 * POST /api/auth/login
 * 
 * @body email - User email
 * @body password - User password
 * @returns 200 dengan token dan user data
 * @throws 401 jika credentials invalid
 */
export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loginData: LoginDTO = req.body;

    const result = await authService.login(loginData);

    res.status(200).json(
      successResponse('Login berhasil', result, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Register handler
 * POST /api/auth/register
 * 
 * @body nama - User name
 * @body email - User email
 * @body password - User password
 * @body role - User role (ADMIN/PETUGAS)
 * @returns 201 dengan user data
 * @throws 409 jika email sudah terdaftar
 */
export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const registerData: RegisterDTO = req.body;

    const user = await authService.register(registerData);

    res.status(201).json(
      successResponse('Registrasi berhasil', user, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user handler
 * GET /api/auth/me
 * 
 * @header Authorization - Bearer token
 * @returns 200 dengan user data
 * @throws 401 jika tidak terautentikasi
 * @throws 404 jika user tidak ditemukan
 */
export const getCurrentUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.user sudah di-set oleh auth middleware
    const userId = req.user!.userId;

    const user = await authService.getCurrentUser(userId);

    res.status(200).json(
      successResponse('User data berhasil diambil', user, req.path)
    );
  } catch (error) {
    next(error);
  }
};

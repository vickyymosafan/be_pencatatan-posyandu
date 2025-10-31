import { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';
import { successResponse, paginatedResponse } from '../../utils/response.util';
import { CreateUserDTO, UpdateUserDTO, PaginationDTO } from './users.types';

/**
 * Users Controller
 * 
 * Request handlers untuk users management endpoints.
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

/**
 * Get all users handler
 * GET /api/users
 * 
 * @query page - Page number (default: 1)
 * @query limit - Items per page (default: 10)
 * @returns 200 dengan paginated users data
 */
export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pagination: PaginationDTO = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const result = await usersService.getAllUsers(pagination);

    res.status(200).json(
      paginatedResponse(
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Users berhasil diambil'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID handler
 * GET /api/users/:id
 * 
 * @param id - User ID
 * @returns 200 dengan user data
 * @throws 404 jika user tidak ditemukan
 */
export const getUserByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await usersService.getUserById(id);

    res.status(200).json(
      successResponse('User berhasil diambil', user, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create user handler
 * POST /api/users
 * 
 * @body nama - User name
 * @body email - User email
 * @body password - User password
 * @body role - User role
 * @returns 201 dengan created user data
 * @throws 409 jika email sudah terdaftar
 */
export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData: CreateUserDTO = req.body;

    const user = await usersService.createUser(userData);

    res.status(201).json(
      successResponse('User berhasil dibuat', user, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user handler
 * PUT /api/users/:id
 * 
 * @param id - User ID
 * @body nama - User name (optional)
 * @body email - User email (optional)
 * @body password - User password (optional)
 * @body role - User role (optional)
 * @returns 200 dengan updated user data
 * @throws 404 jika user tidak ditemukan
 * @throws 409 jika email baru sudah terdaftar
 */
export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userData: UpdateUserDTO = req.body;

    const user = await usersService.updateUser(id, userData);

    res.status(200).json(
      successResponse('User berhasil diupdate', user, req.path)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user handler
 * DELETE /api/users/:id
 * 
 * @param id - User ID
 * @returns 200 dengan success message
 * @throws 404 jika user tidak ditemukan
 * @throws 409 jika user masih memiliki pemeriksaan
 */
export const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await usersService.deleteUser(id);

    res.status(200).json(
      successResponse('User berhasil dihapus', undefined, req.path)
    );
  } catch (error) {
    next(error);
  }
};

import { Role } from '../../../generated/prisma';

/**
 * Users Module Types
 * 
 * Type definitions untuk users management module.
 */

/**
 * Create User DTO
 * Data Transfer Object untuk create user request
 */
export interface CreateUserDTO {
  nama: string;
  email: string;
  password: string;
  role: Role;
}

/**
 * Update User DTO
 * Data Transfer Object untuk update user request
 * Semua fields optional untuk partial update
 */
export interface UpdateUserDTO {
  nama?: string;
  email?: string;
  password?: string;
  role?: Role;
}

/**
 * Pagination DTO
 * Query parameters untuk pagination
 */
export interface PaginationDTO {
  page: number;
  limit: number;
}

/**
 * User Response
 * Re-export dari auth module untuk consistency
 */
export { UserResponse } from '../auth/auth.types';

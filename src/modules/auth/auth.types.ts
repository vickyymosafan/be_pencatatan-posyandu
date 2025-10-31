import { Role } from '../../../generated/prisma';

/**
 * Auth Module Types
 * 
 * Type definitions untuk authentication module.
 */

/**
 * Login DTO
 * Data Transfer Object untuk login request
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Register DTO
 * Data Transfer Object untuk register request
 */
export interface RegisterDTO {
  nama: string;
  email: string;
  password: string;
  role: Role;
}

/**
 * User Response
 * User data yang dikembalikan ke client (tanpa password)
 */
export interface UserResponse {
  id: string;
  nama: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Login Response
 * Response untuk successful login
 */
export interface LoginResponse {
  token: string;
  user: UserResponse;
}

/**
 * JWT Payload
 * Re-export dari jwt.util untuk consistency
 */
export { JWTPayload } from '../../utils/jwt.util';

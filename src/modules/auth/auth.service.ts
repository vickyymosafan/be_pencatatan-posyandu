import prisma from '../../config/database';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { generateToken } from '../../utils/jwt.util';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../utils/errors';
import { LoginDTO, RegisterDTO, LoginResponse, UserResponse } from './auth.types';

/**
 * Auth Service
 * 
 * Business logic untuk authentication operations.
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

/**
 * Login user
 * Find user by email, compare password, generate JWT token
 * 
 * @param loginData - Email dan password
 * @returns Login response dengan token dan user data
 * @throws UnauthorizedError jika email tidak ditemukan atau password salah
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export const login = async (loginData: LoginDTO): Promise<LoginResponse> => {
  const { email, password } = loginData;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Jika user tidak ditemukan, return error yang sama dengan password salah
  // untuk security (tidak expose apakah email terdaftar atau tidak)
  if (!user) {
    throw new UnauthorizedError('Email atau password salah');
  }

  // Compare password dengan hash
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Email atau password salah');
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Return token dan user data (tanpa password)
  return {
    token,
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

/**
 * Register new user
 * Hash password dan create user baru
 * 
 * @param registerData - User data untuk registrasi
 * @returns User data (tanpa password)
 * @throws ConflictError jika email sudah terdaftar
 * 
 * Requirements: 1.4
 */
export const register = async (registerData: RegisterDTO): Promise<UserResponse> => {
  const { nama, email, password, role } = registerData;

  // Check apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError('Email sudah terdaftar');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user baru
  const user = await prisma.user.create({
    data: {
      nama,
      email,
      password: hashedPassword,
      role,
    },
  });

  // Return user data tanpa password
  return {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Get current user by ID
 * 
 * @param userId - User ID dari JWT token
 * @returns User data (tanpa password)
 * @throws NotFoundError jika user tidak ditemukan
 */
export const getCurrentUser = async (userId: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

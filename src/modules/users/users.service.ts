import prisma from '../../config/database';
import { hashPassword } from '../../utils/password.util';
import { ConflictError, NotFoundError } from '../../utils/errors';
import { CreateUserDTO, UpdateUserDTO, PaginationDTO, UserResponse } from './users.types';

/**
 * Users Service
 * 
 * Business logic untuk users management operations.
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

/**
 * Get all users dengan pagination
 * 
 * @param pagination - Page dan limit untuk pagination
 * @returns Paginated users data tanpa password
 * 
 * Requirements: 3.2
 */
export const getAllUsers = async (pagination: PaginationDTO) => {
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  // Get total count untuk pagination info
  const total = await prisma.user.count();

  // Get users dengan pagination
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // Exclude password
    },
  });

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get user by ID
 * 
 * @param id - User ID
 * @returns User data tanpa password
 * @throws NotFoundError jika user tidak ditemukan
 * 
 * Requirements: 3.2
 */
export const getUserById = async (id: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
};

/**
 * Create new user
 * 
 * @param userData - User data untuk create
 * @returns Created user data tanpa password
 * @throws ConflictError jika email sudah terdaftar
 * 
 * Requirements: 3.1, 3.5
 */
export const createUser = async (userData: CreateUserDTO): Promise<UserResponse> => {
  const { nama, email, password, role } = userData;

  // Check email uniqueness
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError('Email sudah terdaftar');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      nama,
      email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * Update user
 * 
 * @param id - User ID
 * @param userData - User data untuk update (partial)
 * @returns Updated user data tanpa password
 * @throws NotFoundError jika user tidak ditemukan
 * @throws ConflictError jika email baru sudah terdaftar
 * 
 * Requirements: 3.3, 3.5
 */
export const updateUser = async (
  id: string,
  userData: UpdateUserDTO
): Promise<UserResponse> => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundError('User');
  }

  // Check email uniqueness jika email diubah
  if (userData.email && userData.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (emailExists) {
      throw new ConflictError('Email sudah terdaftar');
    }
  }

  // Prepare update data
  const updateData: any = {
    nama: userData.nama,
    email: userData.email,
    role: userData.role,
  };

  // Hash password jika diubah
  if (userData.password) {
    updateData.password = await hashPassword(userData.password);
  }

  // Update user
  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * Delete user
 * 
 * @param id - User ID
 * @throws NotFoundError jika user tidak ditemukan
 * 
 * Requirements: 3.4
 */
export const deleteUser = async (id: string): Promise<void> => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundError('User');
  }

  // Delete user
  // Note: Akan throw error jika user masih memiliki pemeriksaan (foreign key constraint)
  await prisma.user.delete({
    where: { id },
  });
};

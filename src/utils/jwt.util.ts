import jwt from 'jsonwebtoken';
import { Role } from '../../generated/prisma';

/**
 * JWT Utility
 * 
 * Utility functions untuk generate dan verify JWT tokens.
 * Token berisi userId, email, dan role dengan expiry 24 jam.
 */

/**
 * JWT Payload Interface
 * Struktur data yang disimpan dalam JWT token
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

/**
 * Get JWT secret from environment variable
 * @throws Error jika JWT_SECRET tidak di-set
 */
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

/**
 * Get JWT expiration time from environment variable
 * Default to 24h if not set
 */
const getJWTExpiresIn = (): string => {
  return process.env.JWT_EXPIRES_IN || '24h';
};

/**
 * Generate JWT token dari payload
 * 
 * @param payload - Data yang akan disimpan dalam token (userId, email, role)
 * @returns JWT token string
 * @throws Error jika JWT_SECRET tidak di-set atau token generation gagal
 * 
 * @example
 * const token = generateToken({
 *   userId: '123',
 *   email: 'user@example.com',
 *   role: Role.PETUGAS
 * });
 */
export const generateToken = (payload: JWTPayload): string => {
  try {
    const secret = getJWTSecret();
    const expiresIn = getJWTExpiresIn();
    
    const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
    
    return token;
  } catch (error) {
    throw new Error('Failed to generate JWT token');
  }
};

/**
 * Verify dan decode JWT token
 * 
 * @param token - JWT token string yang akan diverifikasi
 * @returns Decoded JWT payload
 * @throws Error jika token invalid, expired, atau JWT_SECRET tidak di-set
 * 
 * @example
 * try {
 *   const payload = verifyToken(token);
 *   console.log('User ID:', payload.userId);
 * } catch (error) {
 *   console.error('Invalid token');
 * }
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const secret = getJWTSecret();
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Failed to verify token');
  }
};

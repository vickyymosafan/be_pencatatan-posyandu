import bcrypt from 'bcryptjs';

/**
 * Password Utility
 * 
 * Utility functions untuk hashing dan comparing password menggunakan bcryptjs.
 * Menggunakan salt rounds 10 sesuai dengan requirement 1.4.
 */

const SALT_ROUNDS = 10;

/**
 * Hash password menggunakan bcrypt
 * 
 * @param password - Plain text password yang akan di-hash
 * @returns Promise yang resolve ke hashed password
 * @throws Error jika hashing gagal
 * 
 * @example
 * const hashedPassword = await hashPassword('MyPassword123');
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

/**
 * Compare plain text password dengan hashed password
 * 
 * @param password - Plain text password untuk diverifikasi
 * @param hash - Hashed password dari database
 * @returns Promise yang resolve ke boolean (true jika match, false jika tidak)
 * @throws Error jika comparison gagal
 * 
 * @example
 * const isValid = await comparePassword('MyPassword123', hashedPassword);
 * if (isValid) {
 *   console.log('Password correct');
 * }
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    throw new Error('Failed to compare password');
  }
};

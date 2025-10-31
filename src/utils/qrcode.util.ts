import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

/**
 * QR Code Utility
 * 
 * Utility functions untuk generate QR Code images.
 * QR Code di-generate dalam format PNG dengan ukuran 300x300 pixel.
 */

/**
 * Ensure directory exists, create if not
 * @param dirPath - Path to directory
 */
const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Generate QR Code dan simpan sebagai PNG file
 * 
 * @param data - Data yang akan di-encode dalam QR Code (biasanya ID lansia)
 * @param outputPath - Path lengkap untuk menyimpan file QR Code (termasuk nama file)
 * @returns Promise yang resolve ke URL path relatif untuk disimpan di database
 * @throws Error jika QR Code generation atau file write gagal
 * 
 * @example
 * const qrUrl = await generateQRCode(
 *   'lansia-id-123',
 *   './uploads/qr/lansia-id-123.png'
 * );
 * // Returns: '/uploads/qr/lansia-id-123.png'
 */
export const generateQRCode = async (
  data: string,
  outputPath: string
): Promise<string> => {
  try {
    // Ensure directory exists
    const directory = path.dirname(outputPath);
    ensureDirectoryExists(directory);

    // Generate QR Code dengan options
    await QRCode.toFile(outputPath, data, {
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      type: 'png',
    });

    // Return relative URL path untuk disimpan di database
    // Convert absolute path ke relative path dari project root
    const relativePath = outputPath.replace(/\\/g, '/').replace(/^\./, '');
    return relativePath;
  } catch (error) {
    throw new Error(`Failed to generate QR Code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate QR Code untuk lansia berdasarkan ID
 * Helper function yang menggunakan naming convention standar
 * 
 * @param lansiaId - ID lansia dari database
 * @returns Promise yang resolve ke URL path QR Code
 * @throws Error jika QR Code generation gagal
 * 
 * @example
 * const qrUrl = await generateLansiaQRCode('abc-123-def');
 * // QR Code akan disimpan di ./uploads/qr/abc-123-def.png
 */
export const generateLansiaQRCode = async (lansiaId: string): Promise<string> => {
  const qrDir = process.env.QR_CODE_DIR || './uploads/qr';
  const outputPath = path.join(qrDir, `${lansiaId}.png`);
  return generateQRCode(lansiaId, outputPath);
};

/**
 * Check if QR Code file exists
 * 
 * @param filePath - Path to QR Code file
 * @returns Boolean indicating if file exists
 */
export const qrCodeExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

/**
 * Delete QR Code file
 * 
 * @param filePath - Path to QR Code file to delete
 * @returns Promise that resolves when file is deleted
 * @throws Error if deletion fails
 */
export const deleteQRCode = async (filePath: string): Promise<void> => {
  try {
    if (qrCodeExists(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    throw new Error(`Failed to delete QR Code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

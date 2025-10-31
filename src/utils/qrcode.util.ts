import QRCode from 'qrcode';
import { supabase, STORAGE_BUCKET } from '../config/supabase';

/**
 * QR Code Utility - Supabase Storage Version
 * 
 * Utility functions untuk generate QR Code dan upload ke Supabase Storage.
 * QR Code di-generate dalam format PNG dengan ukuran 300x300 pixel.
 */

/**
 * Generate QR Code dan upload ke Supabase Storage
 * 
 * @param data - Data yang akan di-encode dalam QR Code (biasanya ID lansia)
 * @param fileName - Nama file untuk storage (tanpa extension, akan ditambahkan .png)
 * @returns Promise yang resolve ke public URL dari Supabase Storage
 * @throws Error jika QR Code generation atau upload gagal
 * 
 * @example
 * const qrUrl = await generateQRCode('lansia-id-123', 'lansia-id-123');
 * // Returns: 'https://your-project.supabase.co/storage/v1/object/public/qr-codes/lansia-id-123.png'
 */
export const generateQRCode = async (
  data: string,
  fileName: string
): Promise<string> => {
  try {
    // Generate QR Code sebagai buffer
    const qrBuffer = await QRCode.toBuffer(data, {
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      type: 'png',
    });

    // Upload ke Supabase Storage
    const filePath = `${fileName}.png`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, qrBuffer, {
        contentType: 'image/png',
        upsert: true, // Overwrite jika file sudah ada
      });

    if (uploadError) {
      throw new Error(`Failed to upload QR Code to Supabase: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    throw new Error(`Failed to generate QR Code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate QR Code untuk lansia berdasarkan ID
 * Helper function yang menggunakan naming convention standar
 * 
 * @param lansiaId - ID lansia dari database
 * @returns Promise yang resolve ke public URL QR Code dari Supabase
 * @throws Error jika QR Code generation gagal
 * 
 * @example
 * const qrUrl = await generateLansiaQRCode('abc-123-def');
 * // QR Code akan diupload ke Supabase Storage dengan nama abc-123-def.png
 */
export const generateLansiaQRCode = async (lansiaId: string): Promise<string> => {
  return generateQRCode(lansiaId, lansiaId);
};

/**
 * Check if QR Code exists in Supabase Storage
 * 
 * @param fileName - File name (dengan atau tanpa .png extension)
 * @returns Boolean indicating if file exists
 */
export const qrCodeExists = async (fileName: string): Promise<boolean> => {
  try {
    const filePath = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('', {
        search: filePath,
      });

    if (error) {
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Delete QR Code from Supabase Storage
 * 
 * @param fileName - File name (dengan atau tanpa .png extension)
 * @returns Promise that resolves when file is deleted
 * @throws Error if deletion fails
 */
export const deleteQRCode = async (fileName: string): Promise<void> => {
  try {
    const filePath = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete QR Code: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`Failed to delete QR Code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get public URL for QR Code
 * 
 * @param fileName - File name (dengan atau tanpa .png extension)
 * @returns Public URL dari Supabase Storage
 */
export const getQRCodeUrl = (fileName: string): string => {
  const filePath = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

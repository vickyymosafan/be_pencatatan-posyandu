import prisma from '../../config/database';
import { Role } from '../../../generated/prisma';
import { NotFoundError } from '../../utils/errors';
import {
  DashboardStats,
  MonthlyTrend,
  ReportFilterDTO,
  PemeriksaanReport,
} from './laporan.types';

/**
 * Laporan Service
 * 
 * Business logic untuk laporan dan dashboard operations.
 * Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.4
 */

/**
 * Helper: Parse tekanan darah format "120/80" ke systolic dan diastolic
 */
const parseTekananDarah = (tekananDarah: string): { systolic: number; diastolic: number } | null => {
  const parts = tekananDarah.split('/');
  if (parts.length !== 2) return null;
  
  const systolic = parseInt(parts[0]);
  const diastolic = parseInt(parts[1]);
  
  if (isNaN(systolic) || isNaN(diastolic)) return null;
  
  return { systolic, diastolic };
};

/**
 * Helper: Get start of month
 */
const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Helper: Get end of month
 */
const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * Helper: Get start of day
 */
const getStartOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};

/**
 * Helper: Get end of day
 */
const getEndOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
};

/**
 * Get dashboard statistics
 * 
 * @returns Dashboard stats dengan aggregated data
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const now = new Date();
  const startOfMonth = getStartOfMonth(now);
  const endOfMonth = getEndOfMonth(now);
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const startOfYesterday = getStartOfDay(yesterday);
  const endOfYesterday = getEndOfDay(yesterday);

  // Get total lansia
  const totalLansia = await prisma.lansia.count();

  // Get total petugas (users with role PETUGAS)
  const totalPetugas = await prisma.user.count({
    where: { role: Role.PETUGAS },
  });

  // Get pemeriksaan bulan ini
  const pemeriksaanBulanIni = await prisma.pemeriksaan.count({
    where: {
      tanggal: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  // Get pemeriksaan kemarin
  const pemeriksaanKemarin = await prisma.pemeriksaan.count({
    where: {
      tanggal: {
        gte: startOfYesterday,
        lte: endOfYesterday,
      },
    },
  });

  // Get all pemeriksaan bulan ini untuk calculate averages
  const pemeriksaanData = await prisma.pemeriksaan.findMany({
    where: {
      tanggal: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      tekanan_darah: true,
      gula_darah: true,
      kolesterol: true,
    },
  });

  // Calculate averages
  let totalSystolic = 0;
  let totalDiastolic = 0;
  let totalGulaDarah = 0;
  let totalKolesterol = 0;
  let validTekananDarahCount = 0;
  let validGulaDarahCount = 0;
  let validKolesterolCount = 0;

  pemeriksaanData.forEach((p) => {
    // Parse tekanan darah
    const tekananDarah = parseTekananDarah(p.tekanan_darah);
    if (tekananDarah) {
      totalSystolic += tekananDarah.systolic;
      totalDiastolic += tekananDarah.diastolic;
      validTekananDarahCount++;
    }

    // Parse gula darah
    const gulaDarah = parseInt(p.gula_darah);
    if (!isNaN(gulaDarah)) {
      totalGulaDarah += gulaDarah;
      validGulaDarahCount++;
    }

    // Parse kolesterol
    const kolesterol = parseInt(p.kolesterol);
    if (!isNaN(kolesterol)) {
      totalKolesterol += kolesterol;
      validKolesterolCount++;
    }
  });

  // Calculate rata-rata
  const avgSystolic = validTekananDarahCount > 0 
    ? Math.round(totalSystolic / validTekananDarahCount) 
    : 0;
  const avgDiastolic = validTekananDarahCount > 0 
    ? Math.round(totalDiastolic / validTekananDarahCount) 
    : 0;
  const avgGulaDarah = validGulaDarahCount > 0 
    ? Math.round(totalGulaDarah / validGulaDarahCount) 
    : 0;
  const avgKolesterol = validKolesterolCount > 0 
    ? Math.round(totalKolesterol / validKolesterolCount) 
    : 0;

  // Get monthly trends (6 months)
  const trendPemeriksaan = await getMonthlyTrends(6);

  return {
    totalLansia,
    totalPetugas,
    pemeriksaanBulanIni,
    pemeriksaanKemarin,
    rataRataTekananDarah: `${avgSystolic}/${avgDiastolic}`,
    rataRataGulaDarah: avgGulaDarah.toString(),
    rataRataKolesterol: avgKolesterol.toString(),
    trendPemeriksaan,
  };
};

/**
 * Get monthly trends untuk N bulan terakhir
 * 
 * @param months - Jumlah bulan yang ingin diambil
 * @returns Array of monthly trends
 * 
 * Requirements: 8.2
 */
export const getMonthlyTrends = async (months: number = 6): Promise<MonthlyTrend[]> => {
  const now = new Date();
  const trends: MonthlyTrend[] = [];

  // Loop through last N months
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = getStartOfMonth(date);
    const endOfMonth = getEndOfMonth(date);

    // Count pemeriksaan in this month
    const count = await prisma.pemeriksaan.count({
      where: {
        tanggal: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Format month as "YYYY-MM"
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    trends.push({ month, count });
  }

  return trends;
};

/**
 * Get pemeriksaan report dengan filtering
 * 
 * @param filters - Filter parameters (startDate, endDate, lansiaId)
 * @returns Pemeriksaan report dengan summary
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */
export const getPemeriksaanReport = async (
  filters: ReportFilterDTO
): Promise<PemeriksaanReport> => {
  const { startDate, endDate, lansiaId } = filters;

  // Build where clause
  const whereClause: any = {
    tanggal: {
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  };

  if (lansiaId) {
    // Validate lansiaId exists
    const lansia = await prisma.lansia.findUnique({
      where: { id: lansiaId },
    });

    if (!lansia) {
      throw new NotFoundError('Lansia');
    }

    whereClause.lansiaId = lansiaId;
  }

  // Get pemeriksaan data dengan lansia info
  const data = await prisma.pemeriksaan.findMany({
    where: whereClause,
    include: {
      lansia: true,
    },
    orderBy: {
      tanggal: 'desc',
    },
  });

  // Get total count
  const totalPemeriksaan = data.length;

  return {
    data,
    summary: {
      totalPemeriksaan,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    },
  };
};

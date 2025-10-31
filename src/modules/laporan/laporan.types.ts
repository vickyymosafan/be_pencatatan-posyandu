import { Pemeriksaan, Lansia } from '../../../generated/prisma';

/**
 * Laporan Module Types
 * 
 * Type definitions untuk laporan dan dashboard module.
 */

/**
 * Monthly Trend
 * Data trend pemeriksaan per bulan
 */
export interface MonthlyTrend {
  month: string; // Format: "YYYY-MM" (e.g., "2024-01")
  count: number; // Jumlah pemeriksaan di bulan tersebut
}

/**
 * Dashboard Stats
 * Statistik agregat untuk dashboard
 */
export interface DashboardStats {
  totalLansia: number;
  totalPetugas: number;
  pemeriksaanBulanIni: number;
  pemeriksaanKemarin: number;
  rataRataTekananDarah: string; // Format: "120/80"
  rataRataGulaDarah: string; // Format: "100"
  rataRataKolesterol: string; // Format: "200"
  trendPemeriksaan: MonthlyTrend[];
}

/**
 * Report Filter DTO
 * Query parameters untuk filtering laporan
 */
export interface ReportFilterDTO {
  startDate: string;
  endDate: string;
  lansiaId?: string;
}

/**
 * Pemeriksaan Report Item
 * Pemeriksaan data dengan lansia info untuk laporan
 */
export interface PemeriksaanReportItem extends Pemeriksaan {
  lansia: Lansia;
}

/**
 * Pemeriksaan Report
 * Response type untuk laporan pemeriksaan
 */
export interface PemeriksaanReport {
  data: PemeriksaanReportItem[];
  summary: {
    totalPemeriksaan: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

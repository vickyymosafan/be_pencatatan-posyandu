import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middleware/logger.middleware';
import { apiLimiter } from './middleware/rate-limit.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import prisma from './config/database';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import lansiaRoutes from './modules/lansia/lansia.routes';
import pemeriksaanRoutes from './modules/pemeriksaan/pemeriksaan.routes';
import laporanRoutes from './modules/laporan/laporan.routes';

/**
 * Express Application Setup
 * 
 * Konfigurasi Express app dengan middleware dan routes.
 * Requirements: 12.1, 12.3, 12.4, 11.1, 11.5
 */

const app: Application = express();

/**
 * Security Middleware
 * Helmet helps secure Express apps by setting various HTTP headers
 */
app.use(helmet());

/**
 * CORS Configuration
 * Allow requests from specified origins
 */
const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['https://pencatatan-posyandu-ilju.vercel.app'];
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/**
 * Body Parser Middleware
 * Parse incoming request bodies
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logger Middleware
 * Log all incoming requests
 */
app.use(requestLogger);

/**
 * Health Check Endpoint
 * GET /health
 * Returns server status and database connection status
 */
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * API Routes
 * Mount all module routes with /api prefix
 */
app.use('/api', apiLimiter); // Apply rate limiter to all API routes

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/lansia', lansiaRoutes);
app.use('/api/pemeriksaan', pemeriksaanRoutes);
app.use('/api/laporan', laporanRoutes);

/**
 * Root Endpoint
 * GET /
 * Returns API information
 */
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Posyandu Lansia API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
  });
});

/**
 * 404 Handler
 * Handle requests to undefined routes
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 * Must be registered as the last middleware
 */
app.use(errorHandler);

export default app;

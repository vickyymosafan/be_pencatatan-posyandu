import dotenv from 'dotenv';
import app from './app';
import prisma from './config/database';

/**
 * Server Entry Point
 * 
 * Load environment variables, validate configuration,
 * connect to database, and start the server.
 * Requirements: 13.4
 */

// Load environment variables
dotenv.config();

/**
 * Validate required environment variables
 */
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'CORS_ORIGIN',
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach((envVar) => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease check your .env file and ensure all required variables are set.');
  process.exit(1);
}

/**
 * Get PORT from environment or use default
 */
const PORT = process.env.PORT || 5000;

/**
 * Test database connection
 */
const testDatabaseConnection = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('\nPlease check your DATABASE_URL in .env file.');
    process.exit(1);
  }
};

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await testDatabaseConnection();

    // Start listening
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('🚀 Server is running!');
      console.log(`   - Environment: ${process.env.NODE_ENV}`);
      console.log(`   - Port: ${PORT}`);
      console.log(`   - URL: http://localhost:${PORT}`);
      console.log(`   - Health: http://localhost:${PORT}/health`);
      console.log(`   - API: http://localhost:${PORT}/api`);
      console.log('');
    });

    /**
     * Graceful shutdown handler
     * Handle SIGTERM and SIGINT signals
     */
    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        console.log('✅ HTTP server closed');

        try {
          // Disconnect from database
          await prisma.$disconnect();
          console.log('✅ Database disconnected');

          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Register shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      console.error('❌ Unhandled Rejection:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

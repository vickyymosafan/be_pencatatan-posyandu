import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter Middleware
 * 
 * Middleware untuk membatasi jumlah request dari IP address tertentu.
 * Mencegah brute force attacks dan abuse.
 * 
 * Requirements: 12.2
 */

/**
 * Login rate limiter
 * Limits login attempts to 5 requests per 15 minutes per IP
 * 
 * @example
 * router.post('/auth/login', loginLimiter, controller.login);
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip successful requests (only count failed login attempts)
  skipSuccessfulRequests: true,
});

/**
 * General API rate limiter
 * Limits API requests per IP address
 * 
 * Development: 1000 requests per 15 minutes (for testing)
 * Production: 500 requests per 15 minutes (reasonable for normal usage)
 * 
 * @example
 * app.use('/api', apiLimiter);
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 500, // Adjust based on environment
  message: {
    success: false,
    message: 'Terlalu banyak request. Silakan coba lagi dalam beberapa menit.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for sensitive operations
 * Limits to 10 requests per 15 minutes per IP
 * 
 * @example
 * router.post('/users', strictLimiter, controller.create);
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    message: 'Terlalu banyak request untuk operasi ini. Silakan coba lagi nanti.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Lenient rate limiter for public endpoints
 * Limits to 200 requests per 15 minutes per IP
 * 
 * @example
 * router.get('/public/data', lenientLimiter, controller.getData);
 */
export const lenientLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  message: {
    success: false,
    message: 'Terlalu banyak request. Silakan coba lagi nanti.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

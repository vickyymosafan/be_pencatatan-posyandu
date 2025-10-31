import { Request, Response, NextFunction } from 'express';

/**
 * Request Logger Middleware
 * 
 * Middleware untuk logging setiap HTTP request.
 * Format: [timestamp] METHOD /path - STATUS - RESPONSE_TIME ms
 * 
 * Requirements: 11.5
 */

/**
 * Get colored status code untuk console output
 */
const getColoredStatus = (statusCode: number): string => {
  if (statusCode >= 500) return `\x1b[31m${statusCode}\x1b[0m`; // Red
  if (statusCode >= 400) return `\x1b[33m${statusCode}\x1b[0m`; // Yellow
  if (statusCode >= 300) return `\x1b[36m${statusCode}\x1b[0m`; // Cyan
  if (statusCode >= 200) return `\x1b[32m${statusCode}\x1b[0m`; // Green
  return `${statusCode}`;
};

/**
 * Get colored method untuk console output
 */
const getColoredMethod = (method: string): string => {
  const colors: Record<string, string> = {
    GET: '\x1b[32m',    // Green
    POST: '\x1b[33m',   // Yellow
    PUT: '\x1b[34m',    // Blue
    DELETE: '\x1b[31m', // Red
    PATCH: '\x1b[35m',  // Magenta
  };
  const color = colors[method] || '\x1b[0m';
  return `${color}${method}\x1b[0m`;
};

/**
 * Request logger middleware
 * Logs setiap request dengan timestamp, method, path, status, dan response time
 * 
 * @example
 * app.use(requestLogger);
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Record start time
  const startTime = Date.now();

  // Store original end function
  const originalEnd = res.end;

  // Override res.end untuk capture response
  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Get timestamp
    const timestamp = new Date().toISOString();

    // Build log message
    const method = getColoredMethod(req.method);
    const path = req.path;
    const status = getColoredStatus(res.statusCode);
    const time = `${responseTime}ms`;

    // Log format: [timestamp] METHOD /path - STATUS - TIME
    console.log(`[${timestamp}] ${method} ${path} - ${status} - ${time}`);

    // Call original end function
    return originalEnd.call(this, chunk, encoding, callback);
  };

  next();
};

/**
 * Detailed request logger (optional)
 * Logs additional information seperti IP, user agent, body size
 * 
 * @example
 * app.use(detailedRequestLogger);
 */
export const detailedRequestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  const originalEnd = res.end;

  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    const responseTime = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    // Additional info
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('user-agent') || 'unknown';
    const contentLength = res.get('content-length') || '0';

    console.log({
      timestamp,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip,
      userAgent,
      contentLength: `${contentLength} bytes`,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
    });

    return originalEnd.call(this, chunk, encoding, callback);
  };

  next();
};

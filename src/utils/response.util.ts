/**
 * Response Utility
 * 
 * Utility functions untuk membuat standardized API responses.
 * Memastikan semua response memiliki format yang konsisten.
 */

/**
 * Validation Error Interface
 * Struktur untuk validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * API Response Interface
 * Struktur standar untuk semua API responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  timestamp: string;
  path?: string;
}

/**
 * Create success response
 * 
 * @param message - Success message
 * @param data - Optional data payload
 * @param path - Optional request path
 * @returns Standardized success response object
 * 
 * @example
 * return res.json(successResponse('User created successfully', user));
 */
export const successResponse = <T>(
  message: string,
  data?: T,
  path?: string
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    path,
  };
};

/**
 * Create error response
 * 
 * @param message - Error message
 * @param errors - Optional array of validation errors
 * @param path - Optional request path
 * @returns Standardized error response object
 * 
 * @example
 * return res.status(400).json(errorResponse('Validation failed', validationErrors));
 */
export const errorResponse = (
  message: string,
  errors?: ValidationError[],
  path?: string
): ApiResponse<null> => {
  return {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
    path,
  };
};

/**
 * Create paginated response
 * 
 * @param data - Array of data items
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @param message - Optional success message
 * @returns Standardized paginated response
 * 
 * @example
 * return res.json(paginatedResponse(users, 1, 10, 100, 'Users retrieved'));
 */
export const paginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Data retrieved successfully'
): ApiResponse<{
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    message,
    data: {
      data: data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
    timestamp: new Date().toISOString(),
  };
};

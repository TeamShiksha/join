import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/utils/env';

// Types for error handling
interface ErrorResponse {
    success: boolean;
    error: string;
    status: number;
}

// Middleware to validate file uploads
export async function validateFileUpload(request: NextRequest): Promise<{ error: ErrorResponse | null; formData?: FormData }> {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return {
                error: {
                    success: false,
                    error: 'No file provided',
                    status: 400
                }
            };
        }

        // Check file size
        if (file.size > env.maxFileSize()) {
            return {
                error: {
                    success: false,
                    error: `File size exceeds limit (${env.maxFileSize() / 1024 / 1024}MB)`,
                    status: 400
                }
            };
        }

        // Check file type
        if (!env.allowedFileTypes().includes(file.type)) {
            return {
                error: {
                    success: false,
                    error: `Invalid file type. Supported types: ${env.allowedFileTypes().join(', ')}`,
                    status: 400
                }
            };
        }

        return { error: null, formData };
    } catch (error:any) {
        return {
            error: {
                success: false,
                error: 'Invalid request format',
                status: 400
            }
        };
    }
}

// Error handler wrapper for API routes
export function withErrorHandler(handler: Function) {
    return async function(request: NextRequest) {
        try {
            return await handler(request);
        } catch (error) {
            console.error('API Error:', error);
            
            return NextResponse.json({
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error'
            }, {
                status: error instanceof Error ? 400 : 500
            });
        }
    };
}

// Rate limiting middleware (simple implementation)
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const windowMs = env.rateLimit.windowMs();
    const maxRequests = env.rateLimit.requests();

    const current = rateLimit.get(ip) || { count: 0, timestamp: now };

    // Reset if window has passed
    if (now - current.timestamp > windowMs) {
        current.count = 0;
        current.timestamp = now;
    }

    // Increment count
    current.count++;
    rateLimit.set(ip, current);

    return current.count <= maxRequests;
}

// Validate pagination parameters
export function validatePagination(page?: string, limit?: string) {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || env.imagesPerPage().toString());
    const maxLimit = env.imagesPerPage() * 2; // Allow up to double the default limit

    if (isNaN(pageNum) || pageNum < 1) {
        return {
            error: {
                success: false,
                error: 'Invalid page number',
                status: 400
            }
        };
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > maxLimit) {
        return {
            error: {
                success: false,
                error: `Invalid limit. Must be between 1 and ${maxLimit}`,
                status: 400
            }
        };
    }

    return null;
}
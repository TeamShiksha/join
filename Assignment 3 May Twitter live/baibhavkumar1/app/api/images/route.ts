import { NextRequest, NextResponse } from 'next/server';
import { getImageList } from '@/lib/storage';
import { ApiResponse, ImageMetadata, PaginatedResponse } from '@/types';
import { withErrorHandler, checkRateLimit, validatePagination } from '@/lib/middleware';

export const GET = withErrorHandler(async (request: NextRequest) => {
    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { success: false, error: 'Rate limit exceeded' },
            { status: 429 }
        );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '6';
    const search = searchParams.get('search') || '';

    // Validate pagination parameters
    const paginationError = validatePagination(page, limit);
    if (paginationError) {
        return NextResponse.json(paginationError, { status: paginationError.error.status });
    }

    // Add search validation
    if (search && search.length > 100) {
        return NextResponse.json(
            { 
                success: false, 
                error: 'Search query too long. Maximum 100 characters allowed.' 
            },
            { status: 400 }
        );
    }

    try {
        // Get paginated and filtered image list
        const result = await getImageList({
            page: parseInt(page),
            limit: parseInt(limit),
            search: search.trim()
        });

        // Set cache control headers for better performance
        const headers = new Headers({
            'Cache-Control': 'public, max-age=10, stale-while-revalidate=59',
            'X-Total-Count': result.total.toString(),
            'X-Total-Pages': result.totalPages.toString()
        });

        return NextResponse.json({
            success: true,
            data: result
        }, { headers });

    } catch (error) {
        console.error('List images error:', error);
        throw new Error('Failed to retrieve images');
    }
});

export const HEAD = withErrorHandler(async (request: NextRequest) => {
    try {
        const result = await getImageList({
            page: 1,
            limit: 1
        });

        // Return count headers for pagination
        return new NextResponse(null, {
            status: 200,
            headers: {
                'X-Total-Count': result.total.toString(),
                'X-Total-Pages': Math.ceil(result.total / 6).toString(),
                'Cache-Control': 'public, max-age=10, stale-while-revalidate=59'
            }
        });

    } catch (error) {
        console.error('Count images error:', error);
        throw new Error('Failed to count images');
    }
});

// Optional: DELETE endpoint for cleanup (if needed)
export const DELETE = withErrorHandler(async (request: NextRequest) => {
    // This would require admin authentication in production
    const imageId = request.nextUrl.searchParams.get('imageId');
    
    if (!imageId) {
        return NextResponse.json(
            { success: false, error: 'Image ID is required' },
            { status: 400 }
        );
    }

    // Implementation would go here
    // For now, return not implemented
    return NextResponse.json(
        { success: false, error: 'Not implemented' },
        { status: 501 }
    );
});
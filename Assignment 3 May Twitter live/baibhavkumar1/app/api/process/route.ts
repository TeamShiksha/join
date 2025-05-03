import { NextRequest, NextResponse } from 'next/server';
import { processImage } from '@/lib/imageProcessing';
import { getImageMetadata, updateImageMetadata } from '@/lib/storage';
import { ApiResponse, ImageMetadata } from '@/types';
import { withErrorHandler, checkRateLimit } from '@/lib/middleware';

// Validate request body
async function validateRequest(body: any): Promise<string | null> {
    if (!body?.imageId) {
        return 'Image ID is required';
    }
    
    const metadata = await getImageMetadata(body.imageId);
    if (!metadata) {
        return 'Image not found';
    }
    
    if (metadata.status === 'processed') {
        return 'Image is already processed';
    }
    
    return null;
}

export const POST = withErrorHandler(async (request: NextRequest) => {
    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { success: false, error: 'Rate limit exceeded' },
            { status: 429 }
        );
    }

    // Parse and validate request body
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, error: 'Invalid JSON payload' },
            { status: 400 }
        );
    }

    // Validate request
    const validationError = await validateRequest(body);
    if (validationError) {
        return NextResponse.json(
            { success: false, error: validationError },
            { status: 400 }
        );
    }

    const metadata = await getImageMetadata(body.imageId);
    if (!metadata) {
        throw new Error('Image metadata not found');
    }

    try {
        // Process the image
        const processedPath = await processImage(body.imageId, metadata.originalPath);

        // Update metadata
        const updatedMetadata = await updateImageMetadata(body.imageId, {
            processedPath,
            status: 'processed'
        });

        if (!updatedMetadata) {
            throw new Error('Failed to update metadata');
        }

        return NextResponse.json({
            success: true,
            data: updatedMetadata
        });

    } catch (error) {
        // Update metadata to reflect processing failure
        await updateImageMetadata(body.imageId, {
            status: 'failed'
        });

        throw new Error(error instanceof Error ? error.message : 'Failed to process image');
    }
});

export const GET = withErrorHandler(async (request: NextRequest) => {
    const imageId = request.nextUrl.searchParams.get('imageId');

    if (!imageId) {
        return NextResponse.json(
            { success: false, error: 'Image ID is required' },
            { status: 400 }
        );
    }

    const metadata = await getImageMetadata(imageId);
    if (!metadata) {
        return NextResponse.json(
            { success: false, error: 'Image not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({
        success: true,
        data: metadata
    });
});
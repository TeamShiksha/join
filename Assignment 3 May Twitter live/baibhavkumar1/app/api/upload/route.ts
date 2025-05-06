import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile, validateImage } from '@/lib/imageProcessing';
import { saveImageMetadata } from '@/lib/storage';
import { ApiResponse, UploadResponse } from '@/types';
import { validateFileUpload, withErrorHandler, checkRateLimit } from '@/lib/middleware';

export const POST = withErrorHandler(async (request: NextRequest) => {
    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { success: false, error: 'Rate limit exceeded' },
            { status: 429 }
        );
    }

    // Validate file upload and get formData
    const { error: validationError, formData } = await validateFileUpload(request);
    if (validationError) {
        return NextResponse.json(validationError, { status: validationError.status });
    }

    if (!formData) {
        return NextResponse.json(
            { success: false, error: 'Invalid request format' },
            { status: 400 }
        );
    }

    const file = formData.get('file') as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Additional image validation using Sharp
    const isValid = await validateImage(buffer);
    if (!isValid) {
        return NextResponse.json(
            { 
                success: false, 
                error: 'Invalid image format or corrupted file' 
            },
            { status: 400 }
        );
    }

    // Save file and metadata
    const metadata = await saveUploadedFile(buffer, file.name);
    await saveImageMetadata(metadata);

    // Return success response
    return NextResponse.json({
        success: true,
        data: {
            imageId: metadata.id,
            originalName: metadata.originalName,
            status: 'success'
        } as UploadResponse
    });
});

// Configure request size limit
export const config = {
    api: {
        bodyParser: false,
    },
};
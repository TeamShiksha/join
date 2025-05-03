// Helper functions for environment variables
export const env = {
    maxFileSize: () => parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'),
    allowedFileTypes: () => process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp'],
    imagesPerPage: () => parseInt(process.env.NEXT_PUBLIC_IMAGES_PER_PAGE || '6'),
    rateLimit: {
        requests: () => parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_REQUESTS || '100'),
        windowMs: () => parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS || '900000')
    }
} as const;
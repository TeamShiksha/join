declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_MAX_FILE_SIZE: string;
        NEXT_PUBLIC_ALLOWED_FILE_TYPES: string;
        NEXT_PUBLIC_IMAGES_PER_PAGE: string;
        NEXT_PUBLIC_RATE_LIMIT_REQUESTS: string;
        NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS: string;
    }
}
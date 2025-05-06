# Image Gallery Application

A modern Next.js application for uploading, processing, and displaying images with search functionality and pagination.

## Features

- Image upload with drag-and-drop support
- Image processing and optimization
- Paginated image gallery
- Search functionality
- Rate limiting for API endpoints
- File type and size validation
- Responsive design

## Environment Configuration

The application uses the following environment variables:

```env
NEXT_PUBLIC_MAX_FILE_SIZE=5242880        # Max file size in bytes (default: 5MB)
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp  # Allowed file types
NEXT_PUBLIC_IMAGES_PER_PAGE=6            # Number of images per page
NEXT_PUBLIC_RATE_LIMIT_REQUESTS=100      # Rate limit requests per window
NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS=900000  # Rate limit window in milliseconds (15 minutes)
```

## Project Structure

```
baibhavkumar1/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── images/       # Image listing and search
│   │   ├── process/      # Image processing
│   │   └── upload/       # File upload handling
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   └── ui/               # UI components
├── lib/                   # Core functionality
│   ├── imageProcessing.ts # Image processing logic
│   ├── middleware.ts     # API middleware (validation, rate limiting)
│   └── storage.ts        # Storage operations
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── public/              # Static assets
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features Implementation

### Upload Area
- Drag and drop file upload
- File type validation
- Size limits enforcement
- Progress indication

### Image Processing
- Automatic image optimization
- Metadata extraction
- Format conversion if needed

### Gallery
- Paginated image display
- Search functionality
- Responsive grid layout
- Image metadata display

### API Features
- Rate limiting
- Error handling
- Response caching
- Type validation

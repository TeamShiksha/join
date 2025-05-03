# Image Processing Application

This is an implementation of the image processing application assignment for Team.shiksha.

## Features

### Frontend
- Image upload functionality
- Display of uploaded images
- Download processed images (512x512)
- Responsive design for both desktop and mobile

### Backend
- RESTful API endpoints for:
  - Image upload
  - Image conversion (resize to 512x512)
  - Retrieving uploaded images
  - Downloading converted images


## Setup Instructions
1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install
   ```
3. Start the development servers:
   ```bash
   # Frontend
   npm start

   # Backend
   npm start
   ```

## API Documentation
- `POST /api/upload` - Upload an image
- `GET /api/images` - Get list of uploaded images
- `GET /api/images/:id` - Download converted image

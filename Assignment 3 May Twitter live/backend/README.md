# Image Management Service Backend

A Flask-based RESTful API service that provides user authentication and image management capabilities. The service allows users to upload images, compress them automatically, and manage their image collection.

## Features

- User Authentication
  - Registration
  - Login with JWT tokens
  - Token refresh mechanism
- Image Management
  - Upload images with automatic compression
  - List user's images
  - Download original images
  - Download compressed images
- Security
  - Password hashing
  - JWT-based authentication
  - Secure file handling

## Prerequisites

- Python 3.x
- PostgreSQL database
- Required Python packages (add to requirements.txt):
  - Flask
  - Flask-JWT-Extended
  - psycopg2
  - Pillow
  - Werkzeug

## Environment Variables

The application requires the following environment variables:

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=your_database_port
```

## API Endpoints

### Authentication

#### Register - `POST /auth/register`
```json
{
    "username": "string",
    "password": "string",
    "name": "string (optional)"
}
```

#### Login - `POST /auth/login`
```json
{
    "username": "string",
    "password": "string"
}
```

#### Refresh Token - `POST /auth/refresh`
Requires a valid refresh token in the Authorization header.

### Image Management

#### Upload Image - `POST /image/upload`
- Method: POST
- Authentication: Required
- Content-Type: multipart/form-data
- Field: file

#### List Images - `GET /image/list`
- Authentication: Required
- Returns list of user's uploaded images

#### Download Original Image - `GET /image/download_original/<image_id>`
- Authentication: Required
- Returns the original image file

#### Download Compressed Image - `GET /image/download_compressed/<image_id>`
- Authentication: Required
- Returns the compressed version of the image

## Security Features

- Password hashing using Werkzeug's security functions
- JWT-based authentication with access and refresh tokens
- Secure filename handling
- Image size validation
- File type restriction (JPG/JPEG only)
- Automatic image compression

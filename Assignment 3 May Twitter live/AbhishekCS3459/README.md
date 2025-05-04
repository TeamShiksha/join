# 📸 Image Resizer Backend - Developer Documentation 

> A Node.js + TypeScript backend service that enables users to upload images, automatically resize them to 512x512, and manage them via AWS S3. Includes features for image search, listing, and download, along with robust API documentation and Docker support.

---

## 🚀 Tech Stack

* **Node.js** + **Express.js**
* **TypeScript**
* **AWS S3** – for image storage
* **Multer** – for handling file uploads
* **Sharp** – for image processing
* **Swagger** (OpenAPI 3.0) – for API documentation
* **Jest** + **Supertest** – for unit and integration testing
* **Docker** – for containerization and deployment

---

## 📁 Folder Structure

```
├── src
│   ├── controllers          # Request handlers
│   ├── routes               # API routes
│   ├── services             # Business logic and S3 handling
│   ├── middlewares          # File upload configurations
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entrypoint
├── test                     # Jest test cases
├── openapi.yaml             # OpenAPI 3.0 specification
├── .env                     # Environment config
├── Dockerfile
├── tsconfig.json
├── jest.config.js
└── package.json
```

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AbhishekCS3459/join.git
cd Assignment 3 May Twitter live/AbhishekCS3459/image-resizer-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file at the root and add your credentials:

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=image-resizer-abhishek
PORT=5000
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

### 6. Run Production Server

```bash
node dist/server.js
```

---

## 📘 API Documentation (Swagger)

This project includes comprehensive API documentation powered by Swagger UI.

🖥️ Open your browser and navigate to:

```
http://localhost:5000/api-docs
```

> Includes schemas, request/response samples, and interactive "Try it out" options.

---

## 🧪 Running Tests

Run unit and integration tests using Jest and Supertest:

```bash
npm run test
```

> Covers all critical endpoints (`/upload`, `/images`, `/download`, etc.)

---

## 🐳 Docker Support

### Build Docker Image

```bash
docker build -t image-resizer-app .
```

### Run Container

```bash
docker run -p 5000:5000 image-resizer-app
```

> Ensure the server is binding to `0.0.0.0` inside the container.

---

## 📬 Postman Collection

Use this for manual API testing:

🔗 [Postman Workspace (Click Here)](https://orange-meadow-804292.postman.co/workspace/Abhishek~8e56b974-9e66-4ef0-becb-74a9260c20a4/collection/28276728-9938f7f0-74fc-40d4-8df4-21aa8522d26c?action=share&creator=28276728)

---

## 📚 Available API Endpoints

All APIs are also documented via Swagger.

### 1. Upload an Image

`POST /upload`
– Uploads a file via `multipart/form-data`

### 2. Resize an Image

`POST /convert`
– Accepts: `{ "fileKey": "original/filename.jpg" }`

### 3. List All Images

`GET /images`
– Returns metadata of all uploaded images

### 4. Download a Resized Image

`GET /download/:filename`
– Downloads a resized image from S3

### 5. Search Images

`GET /search?query=<name>&page=<number>`
– Supports pagination and fuzzy search

---

## 🔒 Error Handling

Graceful handling of common error scenarios:

* Invalid/missing files → `400 Bad Request`
* File not found in S3 → `404 Not Found`
* Missing parameters → `400 Bad Request`

---

## ✅ Completed Features

| Feature                   | Status |
| ------------------------- | ------ |
| Upload to AWS S3          | ✅      |
| Resize image to 512x512   | ✅      |
| Download resized image    | ✅      |
| List all uploaded images  | ✅      |
| Search images (paginated) | ✅      |
| Jest + Supertest Coverage | ✅      |
| Swagger API Docs          | ✅      |
| Docker Support            | ✅      |

---

## 🧾 License

This project is licensed under the **MIT License**.


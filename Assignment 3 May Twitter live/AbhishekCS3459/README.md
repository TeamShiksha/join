```md
# 📸 Image Resizer Backend - Developer Documentation

> A Node.js + TypeScript backend for uploading images, resizing to 512x512, searching, listing, and downloading them via AWS S3.

---

## 🚀 Tech Stack

* **Node.js** + **Express.js**
* **TypeScript**
* **AWS S3** (image storage)
* **Multer** (file uploads)
* **Sharp** (image resizing)
* **Jest** + **Supertest** (API tests)
* **Swagger** + **OpenAPI 3.0** (API documentation)
* **Docker**

---

## 📁 Folder Structure

```

├── src
│   ├── controllers
│   │   └── imageController.ts
│   ├── routes
│   │   └── imageRoutes.ts
│   ├── services
│   │   └── s3Service.ts
│   ├── middlewares
│   │   └── upload.ts
│   ├── app.ts
│   └── server.ts
├── test
│   └── imageRoutes.test.ts
├── openapi.yaml              # ✅ OpenAPI 3.0 spec
├── .env
├── Dockerfile
├── tsconfig.json
├── jest.config.js
└── package.json

````

---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone <your-repo-url>
cd image-resizer-backend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Environment Variables

Create a `.env` file:

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=image-resizer-abhishek
PORT=5000
```

---

### 4. Run the Dev Server

```bash
npm run dev
```

---

### 5. Build for Production

```bash
npm run build
```

### 6. Run with Node

```bash
node dist/server.js
```

---

## 📘 Swagger API Documentation

> Automatically generated from `openapi.yaml` and served via Swagger UI.

### 🔗 Access API Docs at:

```
http://localhost:5000/api-docs
```

> ✅ Swagger UI provides request/response schemas, examples, and try-it-now buttons for each endpoint.

---

## 🧪 Running Tests

We use **Jest + Supertest** to test the endpoints.

### Run tests:

```bash
npm run test
```

> ✅ Test passes indicate the core APIs (`/images`, `/search`, etc.) are working.

---

## 🐳 Run with Docker

```bash
docker build -t image-resizer-app .
docker run -p 5000:5000 image-resizer-app
```

Ensure `server.ts` binds to `0.0.0.0`.

---

## 📬 Postman Collection

> **📎 Collection Link:**
> [Postman Workspace (Click Here)](https://orange-meadow-804292.postman.co/workspace/Abhishek~8e56b974-9e66-4ef0-becb-74a9260c20a4/collection/28276728-9938f7f0-74fc-40d4-8df4-21aa8522d26c?action=share&creator=28276728)

---

## 📚 API Endpoints Overview

Each of these is now documented in **Swagger UI** as well.

### 1. **Upload Image**

* **POST /upload**
* Multipart file upload

### 2. **Convert Image**

* **POST /convert**
* JSON body: `{ "fileKey": "original/filename.jpg" }`

### 3. **List All Images**

* **GET /images**

### 4. **Download Resized Image**

* **GET /download/\:filename**

### 5. **Search Images**

* **GET /search?query=<name>\&page=<number>**

---

## 🔒 Error Handling

* Invalid file uploads → `400 Bad Request`
* Missing keys → `400 Bad Request`
* Non-existent files → `404 Not Found`

---

## ✅ Done & Optional Features

| Feature                       | Status ✅ |
| ----------------------------- | -------- |
| Upload to AWS S3              | ✅        |
| Resize image to 512x512       | ✅        |
| Download resized image        | ✅        |
| Get all uploaded images       | ✅        |
| Search images with pagination | ✅        |
| Jest API Testing              | ✅        |
| Docker Support                | ✅        |
| Swagger/OpenAPI Docs          | ✅        |

---

## 🧾 License

MIT

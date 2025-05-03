# Image Processor

A modern web application that allows users to upload, process, and manage images. Built with Next.js and Express, this application automatically converts uploaded images to 512×512 dimensions while maintaining a clean and intuitive user interface.

## ✨ Features

- 🖼️ Automatic image processing to 512×512 dimensions
- 🔍 Search functionality for uploaded images
- 📱 Responsive design for all devices
- 📄 Pagination for image gallery
- ⬇️ Easy download of processed images
- 💨 Real-time upload progress tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Allan2000-Git/team-shiksha/blob/main/Assignment%203%20May%20Twitter%20live/Allan2000-Git
cd image-processor
```

2. Install dependencies:

   ```bash
   cd client
   npm install
   cd ..
   cd server
   npm install
   cd ..
   ```

The application will be available at:

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:8080>

## 💻 Usage

### Uploading Images

1. Click the upload area or drag and drop an image
2. Supported formats: JPEG, PNG
3. Maximum file size: 10MB
4. The image will be automatically processed to 512×512

```javascript
// Example API call for uploading
const formData = new FormData();
formData.append('image', file);

const response = await fetch('http://localhost:8080/upload', {
  method: 'POST',
  body: formData
});
```

### Searching Images

Use the search bar to filter images by name:

```javascript
// Example API call for searching
const response = await fetch('http://localhost:8080/images?name=vacation&page=1&limit=6');
const data = await response.json();
```

### Downloading Images

Click the download button on any image card to get the processed version:

```javascript
// Example API call for downloading
const downloadUrl = `http://localhost:8080/download/${imageId}`;
window.open(downloadUrl, '_blank');
```

## ⚙️ Configuration

The application uses the following environment variables:

```env
PORT=8080                 # Backend server port
NEXT_PUBLIC_API_URL=http://localhost:8080  # Backend API URL
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Express](https://expressjs.com/) - Backend Framework
- [Sharp](https://sharp.pixelplumbing.com/) - Image Processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

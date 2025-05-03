### Backend (Node.js with Express)

* **Description:** The backend is a Node.js application built with Express.js. It handles image uploads, stores them in Cloudinary, and saves the image URLs in a Firestore database.
* **Technologies:** Node.js, Express.js, Firebase Admin SDK, Cloudinary API
* **Deployment:** Deployed on Render.
* **Backend URL:** [https://imagestorerback.onrender.com](https://imagestorerback.onrender.com)
* **Key Features**
    * Handles image uploads from the frontend
    * Stores images in Cloudinary
    * Saves Cloudinary URLs and metadata in Firestore
    * Provides an API endpoint to retrieve image URLs from Firestore
* **Setup Instructions (For Development - if applicable):**
    1.  Clone the repository.
    2.  Navigate to the `backend` directory: `cd backend`
    3.  Install dependencies: `npm install`
    4.  Configure Firebase Admin SDK:
        * Download your service account key JSON file from the Firebase console.
        * Place the service account key file in the `backend` directory.
        * Rename the service account key file to `serviceAccountKey.json`
    5.  Configure Cloudinary: Create a `.env` file in the `backend` directory and add your Cloudinary credentials:
        ```
        CLOUD_NAME=your_cloud_name
        CLOUD_API_KEY=your_api_key
        CLOUD_API_SECRET=your_api_secret
        ```
    6.  Run the application: `npm run start`  (or `node index.js`, depending on your setup)

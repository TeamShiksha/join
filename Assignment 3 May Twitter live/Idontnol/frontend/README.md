## Project README

This project comprises a frontend and backend application for image storage and retrieval.

### Frontend (React)

* **Description:** The frontend is a React application that provides a user interface for uploading images. It allows users to select an image, sends it to the backend, and displays the uploaded image URL.
* **Technologies:** React, JavaScript, HTML, CSS
* **Key Features**
    * Image selection and preview
    * Base64 encoding before sending to the backend
    * Display of uploaded image URL
    * Error Handling
    * converting to 512*512 resizing
* **Setup Instructions (For Development - if applicable):**
    1.  Clone the repository.
    2.  Navigate to the `frontend` directory: `cd frontend`
    3.  Install dependencies: `npm install`
    4.  Configure Firebase: Create a `.env` file in the `frontend` directory and add your Firebase configuration variables (REACT_APP_FIREBASE_API_KEY, etc.).  Example:
        ```
        REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
        REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
        ...
        ```
    5.  Run the application: `npm start`

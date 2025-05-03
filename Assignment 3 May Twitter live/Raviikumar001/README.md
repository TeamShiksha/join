


Prerequisites

Git: https://git-scm.com/downloads
Node.js and npm: https://nodejs.org/
Project Setup

Clone the Repository:

Bash
```
https://github.com/Raviikumar001/ravikumar-dobby.git
```
Navigate to Project Directory:

Bash
```
cd ravikumar-dobby
```
Frontend Setup

Change Directory:

Bash
```
cd frontend
```
Install Dependencies:

Bash
```
yarn install  # Or use 'npm install'
```
Create .env file:

Create a file named .env.

Add the following variable:

VITE_REACT_APP_API_URL = "http://localhost:5000" or your backend api
Start Frontend Server:

Bash
```
yarn run dev  # Or use 'npm run dev'
```
Backend Setup

Change Directory (Back to Root):

Bash
cd .. 

Install Dependencies:

Bash
```
cd backend
npm install  # Or use 'yarn install'
```
Create .env file:
Since you will need acces keys for AWS s3 bucket do get the first.
Create a file named .env.
```
PORT =5000
MONGODB_URL = 
SECRET_KEY = 


BUCKET_NAME =
BUCKET_REGION=
ACCESS_KEY =
SECRET_ACCESS_KEY =

```

Bash
```
npm start 
```
Important Note: The database credentials might be temporary. If you face connection issues, you might need to get new credentials

# Assignment 3rd May Twitter Live

Deadline: 2 hours by 11:00 PM.

- Submit the PR after 11:00 PM to prevent others from copying your assignment.
- If you have completed both frontend and backend, please go ahead and integrate the APIs or check the `Additional if time permits` section.
- You can use any database or json as DB.
- When you raise the PR, make sure you add description in proper manner.
- Once you have submitted the PR, please fill [this](https://docs.google.com/forms/d/1EFIbD4b9ShQjTj0yiaa8OQE35JG98fmLCzi9Ss4av0s) google form.

## Frontend Development

Create a user interface for the image processing APIs. Your interface should:

- `Upload Image`: Allow users to upload an image for processing.
- `Display Uploaded Images`: Show a list of images uploaded by the user.
- `Download Processed Image`: Provide a download button for the converted 512x512 image.
- `Responsive Design`: Ensure the UI works well on desktop and mobile devices.

## Backend Development

Create API endpoints for image processing. Implement the following endpoints:

- `Upload Image`: Accept an image file from the user and store it.
- `Convert Image`: Resize the uploaded image to 512x512 dimensions and store the converted version.
- `Get Uploaded Images`: Retrieve a list of all images uploaded by the user.
- `Download Converted Image`: Provide the converted 512x512 image for download.

## Additional if time permits

- Write tests for the APIs you have developed.
- Deploy the backend on free platforms like Render, vercel, netlify or Railway. 
- API for search by image name for backend with page limit.
- Pagination in frontend 6 images per page.
- Dockerfile (for expericenced developers only)
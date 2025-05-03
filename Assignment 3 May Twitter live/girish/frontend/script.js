// Configuration
const API_URL = 'http://localhost:3000/api';
const IMAGES_PER_PAGE = 6;

// DOM Elements
const uploadForm = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');
const fileLabel = document.getElementById('file-label');
const fileName = document.getElementById('file-name');
const uploadButton = document.getElementById('upload-button');
const uploadProgress = document.getElementById('upload-progress');
const uploadSuccess = document.getElementById('upload-success');
const uploadError = document.getElementById('upload-error');
const imagesContainer = document.getElementById('images-container');
const noImagesMessage = document.getElementById('no-images');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// State variables
let allImages = [];
let currentPage = 1;
let totalPages = 1;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    fetchImages();
    
    // Handle file input change
    imageInput.addEventListener('change', handleFileInputChange);
    
    // Handle form submission
    uploadForm.addEventListener('submit', handleFormSubmit);
    
    // Pagination event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderImages();
            updatePaginationControls();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderImages();
            updatePaginationControls();
        }
    });
});

// Handle file input change
function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (file) {
        fileName.textContent = file.name;
    } else {
        fileName.textContent = 'No file chosen';
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const file = imageInput.files[0];
    if (!file) {
        alert('Please select an image to upload');
        return;
    }
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('image', file);
    
    // Show loader and hide other status elements
    uploadProgress.classList.remove('hidden');
    uploadSuccess.classList.add('hidden');
    uploadError.classList.add('hidden');
    uploadButton.disabled = true;
    
    try {
        // Send the request
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        
        // Handle success
        const data = await response.json();
        console.log('Upload successful:', data);
        
        // Reset form
        uploadForm.reset();
        fileName.textContent = 'No file chosen';
        
        // Show success message
        uploadProgress.classList.add('hidden');
        uploadSuccess.classList.remove('hidden');
        uploadButton.disabled = false;
        
        // Refresh the images list
        fetchImages();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            uploadSuccess.classList.add('hidden');
        }, 3000);
        
    } catch (error) {
        console.error('Error uploading image:', error);
        
        // Show error message
        uploadProgress.classList.add('hidden');
        uploadError.classList.remove('hidden');
        uploadButton.disabled = false;
        
        // Hide error message after 3 seconds
        setTimeout(() => {
            uploadError.classList.add('hidden');
        }, 3000);
    }
}

// Fetch all images from API
async function fetchImages() {
    try {
        const response = await fetch(`${API_URL}/images`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }
        
        const data = await response.json();
        allImages = data.images || [];
        
        // Calculate total pages
        totalPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);
        
        // Reset to page 1 if we have new images
        currentPage = 1;
        
        // Render images and update controls
        renderImages();
        updatePaginationControls();
        
    } catch (error) {
        console.error('Error fetching images:', error);
        imagesContainer.innerHTML = `<p class="text-center">Error loading images. Please try again later.</p>`;
    }
}

// Render images for current page
function renderImages() {
    if (allImages.length === 0) {
        noImagesMessage.classList.remove('hidden');
        imagesContainer.innerHTML = '';
        return;
    }
    
    noImagesMessage.classList.add('hidden');
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
    const endIndex = Math.min(startIndex + IMAGES_PER_PAGE, allImages.length);
    const currentImages = allImages.slice(startIndex, endIndex);
    
    // Clear container
    imagesContainer.innerHTML = '';
    
    // Add images to container
    currentImages.forEach(image => {
        const imageCard = createImageCard(image);
        imagesContainer.appendChild(imageCard);
    });
}

// Create image card element
function createImageCard(image) {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    
    const img = document.createElement('img');
    img.src = `${API_URL}/images/${image.id}/processed`;
    img.alt = image.originalFilename;
    img.loading = 'lazy';
    
    const imageInfo = document.createElement('div');
    imageInfo.className = 'image-info';
    
    const title = document.createElement('h3');
    title.textContent = image.originalFilename;
    title.title = image.originalFilename; // Tooltip on hover
    
    const uploadDate = document.createElement('p');
    uploadDate.textContent = `Uploaded: ${formatDate(image.uploadedAt)}`;
    
    const imageActions = document.createElement('div');
    imageActions.className = 'image-actions';
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.textContent = 'Download (512x512)';
    downloadBtn.addEventListener('click', () => {
        window.location.href = `${API_URL}/images/${image.id}/download`;
    });
    
    // Assemble the card
    imageContainer.appendChild(img);
    card.appendChild(imageContainer);
    
    imageInfo.appendChild(title);
    imageInfo.appendChild(uploadDate);
    
    imageActions.appendChild(downloadBtn);
    imageInfo.appendChild(imageActions);
    
    card.appendChild(imageInfo);
    
    return card;
}

// Update pagination controls
function updatePaginationControls() {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage >= totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
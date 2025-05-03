import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [imageData, setImageData] = useState('');
  const [uploadedImageURL, setUploadedImageURL] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImage = (event) => {
    const file = event.target.files[0];
    console.log(file);

    if (!file?.type.startsWith('image/')) {
      console.log("Please insert a valid image file.");
      setUploadError("Please insert a valid image file.");
      return;
    } else {
      setUploadError('');
    }

    if (file?.size >= 50 * 1024 * 1024) {
      console.log("file is very large cannot upload (>50 mb)");
      alert("file is very large cannot upload (>50 mb)");
      setUploadError("File is very large cannot upload (>50 mb)");
      return;
    } else {
      setUploadError('');
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1]; // Extract base64 data
      setImageData(base64Data);
      console.log("Base64 data stored in state");
    };
  };

  const sendImageToBackend = async () => {
    if (!imageData) {
      alert("Please select an image first.");
      return;
    }

    try {
      // const response = await fetch('http://localhost:5001/api/getimageurl', {
        const response = await fetch('https://imagestorerback.onrender.com/api/getimageurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: imageData }), // Send the base64 data in the body
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Backend response:", data);
        setUploadedImageURL(data.fileUrl);
        alert("Image uploaded successfully! URL: " + data.fileUrl);
        setUploadError('');
      } else {
        const errorData = await response.json();
        console.error("Error sending image to backend:", errorData);
        setUploadError(`Upload failed: ${errorData['unknown error from backend'] || 'Unknown error'}`);
        setUploadedImageURL('');
      }
    } catch (error) {
      console.error("Error sending image to backend:", error);
      setUploadError(`Upload failed: ${error.message}`);
      setUploadedImageURL('');
    }
  };
  const fetchImageUrls = async () => {
    setLoading(true);
    try {
      //const response = await fetch('http://localhost:5001/api/imageurls');
      const response = await fetch('https://imagestorerback.onrender.com/api/imageurls');
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched image URLs:", data);
        setImageUrls(data);
        setUploadError('');
      } else {
        const errorData = await response.json();
        console.error("Error fetching image URLs:", errorData);
        setUploadError(`Failed to fetch images: ${errorData.error || 'Unknown error'}`);
        setImageUrls([]);
      }
    } catch (error) {
      console.error("Error fetching image URLs:", error);
      setUploadError(`Failed to fetch images: ${error.message}`);
      setImageUrls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //fetchImageUrls(); // Fetch images when the component mounts
  }, []);

  return (
    <div className="App">
      <h1>Image Uploader</h1>
      <input type="file" onChange={handleImage} accept="image/*" />
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
      {imageData && <p>Image selected and base64 data stored.</p>}
      <button onClick={sendImageToBackend} disabled={!imageData}>
        Upload Image to Backend
      </button>

      {uploadedImageURL && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={uploadedImageURL} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}

<h2>All Uploaded Images</h2>
<button onClick={fetchImageUrls} disabled={loading}>
            {loading ? 'Loading Images...' : 'Show All Images'}
        </button>
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div>
          {imageUrls.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {imageUrls.map((item) => (
                <div key={item.id} style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}>
                  <img src={item.url} alt={`Uploaded ${item.id}`} style={{ maxWidth: '200px' }} />
                  <p>Uploaded At: {new Date(item.uploadedAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No images uploaded yet.</p>
          )}
        </div>
      )}


    </div>
  );
}

export default App;

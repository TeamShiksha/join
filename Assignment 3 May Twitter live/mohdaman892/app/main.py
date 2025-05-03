from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from PIL import Image
import os

app = FastAPI()

UPLOAD_DIR = "uploads"
CONVERTED_DIR = "converted"


os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(CONVERTED_DIR, exist_ok=True)


@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"filename": file.filename, "status": "uploaded"}


@app.post("/convert-image/")
def convert_image(filename):
    input_path = os.path.join(UPLOAD_DIR, filename)
    output_path = os.path.join(CONVERTED_DIR, filename)

    if not os.path.exists(input_path):
        raise HTTPException(status_code=404, detail="Image not found.")

    try:
        with Image.open(input_path) as img:
            resized = img.resize((512, 512))
            resized.save(output_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"filename": filename, "status": "converted"}


@app.get("/uploaded-images/")
def get_uploaded_images():
    return os.listdir(UPLOAD_DIR)


@app.get("/download-converted-image/")
def download_converted_image(filename):
    file_path = os.path.join(CONVERTED_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Converted image not found.")
    return FileResponse(file_path, media_type="image/jpeg", filename=filename)

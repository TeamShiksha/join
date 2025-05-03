import request from "supertest";
import express from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Your Express app
import app from "./src/index"; // Ensure you import your app

describe("Image Processing API", () => {
  it("should upload an image", async () => {
    const res = await request(app)
      .post("/upload")
      .attach("image", path.join(__dirname, "test-image.jpg")); // Ensure you use a real test image path
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Image uploaded");
    expect(res.body).toHaveProperty("filename");
  });

  it("should convert an image", async () => {
    const filename = "uploaded-file-name"; // Replace with actual filename after upload
    const res = await request(app)
      .post("/convert")
      .send({ filename });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Image converted");
    expect(res.body).toHaveProperty("convertedPath");
  });

  it("should return the list of uploaded images", async () => {
    const res = await request(app).get("/images");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Ensure there are images
  });

  it("should download a converted image", async () => {
    const filename = "converted-file-name"; // Replace with a converted file name
    const res = await request(app).get(`/download/${filename}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/image/);
  });

  it("should return 404 for non-existing image", async () => {
    const res = await request(app).get("/download/non-existing-image");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Converted image not found");
  });
});

package com.upload.image.ImageUpload.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.upload.image.ImageUpload.service.ImageService;

@RestController
@RequestMapping("/image")
public class ImageController {

	@Autowired
	private ImageService imageService;

	@PostMapping("/addImage")
	public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
		return imageService.addImageToDirectory(file);
	}

	@PostMapping("/resize")
	public ResponseEntity<String> resizeAndSaveImage(@RequestParam("file") MultipartFile file) {
		return imageService.resizeAndUpdateImage(file);
	}

	@GetMapping("/list")
	public ResponseEntity<List<String>> listUploadedImages() {
		return imageService.getAllUploadedImages();
	}

	@GetMapping("/download/resized/{fileName}")
	public ResponseEntity<byte[]> downloadResizedImage(@PathVariable String fileName) {
		return imageService.downloadResizedImageByName(fileName);
	}
}

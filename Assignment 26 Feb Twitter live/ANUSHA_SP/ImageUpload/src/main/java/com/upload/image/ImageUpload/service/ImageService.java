package com.upload.image.ImageUpload.service;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {
	private static final String UPLOAD_PATH = "uploads/";
	private static final String RESIZED_PATH = "uploads/resized";

	public ResponseEntity<String> addImageToDirectory(MultipartFile file) {
		if (file.isEmpty()) {
			return ResponseEntity.badRequest().body("No Image File to Upload");
		}
		try {
			Files.createDirectories(Paths.get(UPLOAD_PATH));

			Path filePath = Paths.get(UPLOAD_PATH);
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			return ResponseEntity.ok("File Uploaded Successfully " + filePath.getFileName());
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Upload Failed " + e.getMessage());
		}

	}

	public ResponseEntity<String> resizeAndUpdateImage(MultipartFile file) {
		if (file.isEmpty()) {
			return ResponseEntity.badRequest().body("No file selected.");
		}
		try {
			BufferedImage image = resizeImage(file.getInputStream(), 512, 512);
			File output = new File("uploads/resized/resized_" + file.getOriginalFilename());
			ImageIO.write(image, ".jpg", output);
			return ResponseEntity.ok("Resized image saved ");
		} catch (IOException e) {
			return ResponseEntity.status(500).body("Image resize failed: " + e.getMessage());
		}

	}

	public ResponseEntity<List<String>> getAllUploadedImages() {
		try {
			Path dirPath = Paths.get("uploads/");
			if (!Files.exists(dirPath)) {
				return ResponseEntity.ok(Collections.emptyList());
			}
			List<String> imageNames = Files.list(dirPath).filter(Files::isRegularFile)
					.map(path -> path.getFileName().toString()).toList();
			return ResponseEntity.ok(imageNames);
		} catch (IOException e) {
			return ResponseEntity.status(500).body(Collections.singletonList("Error to fetch files " + e.getMessage()));
		}

	}

	public ResponseEntity<byte[]> downloadResizedImageByName(String fileName) {
		Path filePath = Paths.get("uploads/resized/" + fileName);
		if (!Files.exists(filePath)) {
			return ResponseEntity.notFound().build();
		}
		try {
			byte[] fileBytes = Files.readAllBytes(filePath);
			return ResponseEntity.ok().header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
					.body(fileBytes);
		} catch (IOException e) {
			return ResponseEntity.status(500).body(null);
		}
	}

	private BufferedImage resizeImage(InputStream inputStream, int width, int height) throws IOException {
		BufferedImage orignal = ImageIO.read(inputStream);
		BufferedImage resized = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics2D g = resized.createGraphics();
		g.drawImage(orignal, 0, 0, width, height, null);
		g.dispose();
		return resized;
	}
}

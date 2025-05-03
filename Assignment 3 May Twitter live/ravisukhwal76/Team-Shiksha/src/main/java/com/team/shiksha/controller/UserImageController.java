package com.team.shiksha.controller;

import com.team.shiksha.entity.UserImage;
import com.team.shiksha.service.UserImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/images")
public class UserImageController {

    private final UserImageService userImageService;

    public UserImageController(UserImageService userImageService) {
        this.userImageService = userImageService;
    }


        @PostMapping("/add")
        public ResponseEntity<?> addImage(@RequestParam("image") MultipartFile imageFile) {
            try {
                String imageName = imageFile.getOriginalFilename();
                String imageType = imageFile.getContentType();

                BufferedImage originalImage = ImageIO.read(imageFile.getInputStream());

                BufferedImage resizedImage = new BufferedImage(512, 512, BufferedImage.TYPE_INT_RGB);
                Graphics2D g = resizedImage.createGraphics();
                g.drawImage(originalImage, 0, 0, 512, 512, null);
                g.dispose();

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(resizedImage, "jpg", baos);
                byte[] resizedBytes = baos.toByteArray();

                String base64Image = Base64.getEncoder().encodeToString(resizedBytes);

                userImageService.saveImage(imageName, imageType, base64Image);

                return ResponseEntity.ok("Image uploaded and resized successfully.");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error processing image: " + e.getMessage());
            }
        }


    @GetMapping("/{id}")
    public ResponseEntity<?> getImageById(@PathVariable Long id) {
        Optional<UserImage> image = userImageService.getImageById(id);

        if (image.isPresent()) {
            return ResponseEntity.ok(image.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Image not found with ID: " + id);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserImage>> getAllImages() {
        List<UserImage> images = userImageService.getAllImages();
        return ResponseEntity.ok(images);
    }


}

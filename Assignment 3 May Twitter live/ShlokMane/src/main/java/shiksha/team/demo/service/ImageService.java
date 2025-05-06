package shiksha.team.demo.service;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.web.multipart.*;
import shiksha.team.demo.entity.*;
import shiksha.team.demo.entity.Image;
import shiksha.team.demo.repository.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.*;
import java.io.*;
import java.util.List;

@Service
public class ImageService {
    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ImageDataRepository imageDataRepository;

    public void saveImage(MultipartFile file) throws IOException {
        String originalName = file.getOriginalFilename();
        String contentType = file.getContentType();

        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        int width = 512;
        int height = 512;

        java.awt.Image scaledImage = originalImage.getScaledInstance(width, height, java.awt.Image.SCALE_SMOOTH);
        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

        Graphics2D g2d = bufferedImage.createGraphics();
        g2d.drawImage(scaledImage, 0, 0, null);
        g2d.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", outputStream);

        byte[] resizedBytes = outputStream.toByteArray();

        Image image = new Image();
        image.setName(originalName);
        image.setType(contentType);

        ImageData imageData = new ImageData();
        imageData.setImageData(resizedBytes);
        imageData.setImage(image);

        imageRepository.save(image);
        imageDataRepository.save(imageData);

        image.setImageData(imageData);
        imageRepository.save(image);
    }

    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    public byte[] downloadImage(Long id) throws Exception {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        return image.getImageData().getImageData();
    }
}

package com.team.shiksha.service;

import com.team.shiksha.entity.UserImage;
import com.team.shiksha.repository.UserImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserImageService {
    @Autowired
    private UserImageRepository userImageRepository;

    public void saveImage(String name, String type, String base64Data) {
        UserImage image = new UserImage();
        image.setImageName(name);
        image.setImageType(type);
        image.setImage(base64Data);
        userImageRepository.save(image);
    }
    public Optional<UserImage> getImageById(Long id) {
        return userImageRepository.findById(id);
    }

    public List<UserImage> getAllImages() {
        return userImageRepository.findAll();
    }
}

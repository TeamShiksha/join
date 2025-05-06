package shiksha.team.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class ImageData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private byte[] imageData;

    @OneToOne
    @JoinColumn(name = "image_id")
    private Image image;
}


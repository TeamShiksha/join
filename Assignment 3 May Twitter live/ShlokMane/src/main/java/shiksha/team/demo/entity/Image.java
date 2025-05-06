package shiksha.team.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;

    @OneToOne(mappedBy = "image", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ImageData imageData;
}

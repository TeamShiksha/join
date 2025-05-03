package com.team.shiksha.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class UserImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "LONGTEXT")
    private String image;
    private String imageName;
    private String imageType;
}

package shiksha.team.demo.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;
import shiksha.team.demo.entity.*;

import java.util.*;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
}

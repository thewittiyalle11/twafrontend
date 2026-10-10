package com.twa.userservice.repository;

import com.twa.userservice.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, String> {
    List<Testimonial> findAllByOrderByIdAsc();
}

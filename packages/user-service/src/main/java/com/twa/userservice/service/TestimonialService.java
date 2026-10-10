package com.twa.userservice.service;

import com.twa.userservice.dto.TestimonialResponse;
import com.twa.userservice.model.Testimonial;
import com.twa.userservice.repository.TestimonialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestimonialService {
    private final TestimonialRepository testimonialRepository;

    public TestimonialService(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    public List<TestimonialResponse> getTestimonials() {
        return testimonialRepository.findAllByOrderByIdAsc().stream()
                .map(TestimonialResponse::fromEntity)
                .toList();
    }
}

package com.twa.userservice.controller;

import com.twa.userservice.dto.TestimonialResponse;
import com.twa.userservice.service.TestimonialService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TestimonialController {
    private final TestimonialService testimonialService;

    public TestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @GetMapping("/testimonials")
    public List<TestimonialResponse> getTestimonials() {
        return testimonialService.getTestimonials();
    }
}

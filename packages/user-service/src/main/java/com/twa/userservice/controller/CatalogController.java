package com.twa.userservice.controller;

import com.twa.userservice.dto.CategoryResponse;
import com.twa.userservice.dto.BannerResponse;
import com.twa.userservice.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogController {
    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/categories")
    public List<CategoryResponse> getCategories() {
        return catalogService.getCategories();
    }

    @GetMapping("/banners")
    public List<BannerResponse> getBanners() {
        return catalogService.getBanners();
    }
}

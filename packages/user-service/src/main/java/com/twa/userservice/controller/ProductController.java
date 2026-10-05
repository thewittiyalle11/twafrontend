package com.twa.userservice.controller;

import com.twa.userservice.dto.PaginatedResponse;
import com.twa.userservice.dto.ProductResponse;
import com.twa.userservice.model.ProductSize;
import com.twa.userservice.service.ProductService;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@Validated
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public PaginatedResponse<ProductResponse> list(
        @RequestParam(required = false) String category,
        @RequestParam(required = false)
        @Pattern(regexp = "new-arrival|best-seller|season-top-pick") String tag,
        @RequestParam(required = false) ProductSize.Size size,
        @RequestParam(required = false) @DecimalMin("0.0") BigDecimal minPrice,
        @RequestParam(required = false) @DecimalMin("0.0") BigDecimal maxPrice,
        @RequestParam(required = false) String search,
        @RequestParam(required = false, defaultValue = "newest")
        @Pattern(regexp = "price_asc|price_desc|newest|popular") String sort,
        @RequestParam(defaultValue = "1") @Min(1) int page,
        @RequestParam(defaultValue = "12") @Min(1) @Max(100) int limit
    ) {
        return productService.search(category, tag, size == null ? null : size.name(), minPrice, maxPrice, search, sort, page, limit);
    }

    @GetMapping("/{slug}")
    public ProductResponse getBySlug(@PathVariable String slug) {
        return productService.findBySlug(slug);
    }
}

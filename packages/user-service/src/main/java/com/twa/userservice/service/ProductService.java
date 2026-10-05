package com.twa.userservice.service;

import com.twa.userservice.dto.PaginatedResponse;
import com.twa.userservice.dto.ProductResponse;
import com.twa.userservice.model.Product;
import com.twa.userservice.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Locale;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<ProductResponse> search(
        String category,
        String tag,
        String size,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String search,
        String sort,
        int page,
        int limit
    ) {
        String normalizedSearch = normalize(search);
        Page<Product> result = productRepository.searchActiveProducts(
            normalize(category),
            normalize(tag),
            normalize(size),
            minPrice,
            maxPrice,
            normalizedSearch == null ? null : normalizedSearch.toLowerCase(Locale.ROOT),
            sort,
            PageRequest.of(page - 1, limit)
        );
        List<ProductResponse> data = result.getContent().stream().map(ProductResponse::from).toList();
        return new PaginatedResponse<>(
            data,
            result.getNumber() + 1,
            result.getSize(),
            result.getTotalElements(),
            result.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public ProductResponse findBySlug(String slug) {
        Product product = productRepository.findBySlugAndActiveTrue(slug)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));
        return ProductResponse.from(product);
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}

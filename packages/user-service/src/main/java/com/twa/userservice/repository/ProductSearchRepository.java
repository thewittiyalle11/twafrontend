package com.twa.userservice.repository;

import com.twa.userservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductSearchRepository {
    Page<Product> searchActiveProducts(
        String category,
        String tag,
        String size,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String search,
        String sort,
        Pageable pageable
    );
}

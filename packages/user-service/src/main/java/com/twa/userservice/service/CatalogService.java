package com.twa.userservice.service;

import com.twa.userservice.dto.CategoryResponse;
import com.twa.userservice.repository.CatalogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CatalogService {
    private final CatalogRepository catalogRepository;

    public CatalogService(CatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories() {
        return catalogRepository.findAllByOrderBySortOrderAsc().stream()
            .map(CategoryResponse::from)
            .toList();
    }
}

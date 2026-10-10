package com.twa.userservice.service;

import com.twa.userservice.dto.CategoryResponse;
import com.twa.userservice.dto.BannerResponse;
import com.twa.userservice.repository.BannerRepository;
import com.twa.userservice.repository.CatalogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CatalogService {
    private final CatalogRepository catalogRepository;
    private final BannerRepository bannerRepository;

    public CatalogService(CatalogRepository catalogRepository, BannerRepository bannerRepository) {
        this.catalogRepository = catalogRepository;
        this.bannerRepository = bannerRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories() {
        return catalogRepository.findAllByOrderBySortOrderAsc().stream()
            .map(CategoryResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> getBanners() {
        return bannerRepository.findAllByOrderBySortOrderAsc().stream()
            .map(BannerResponse::from)
            .toList();
    }
}

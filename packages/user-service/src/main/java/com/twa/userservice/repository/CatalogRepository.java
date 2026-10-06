package com.twa.userservice.repository;

import com.twa.userservice.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatalogRepository extends JpaRepository<Category, String> {
    List<Category> findAllByOrderBySortOrderAsc();
}

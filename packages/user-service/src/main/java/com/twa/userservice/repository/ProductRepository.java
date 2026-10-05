package com.twa.userservice.repository;

import com.twa.userservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String>, ProductSearchRepository {
    Optional<Product> findBySlugAndActiveTrue(String slug);
}

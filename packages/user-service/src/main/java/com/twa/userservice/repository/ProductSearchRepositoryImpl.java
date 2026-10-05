package com.twa.userservice.repository;

import com.twa.userservice.model.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Repository
public class ProductSearchRepositoryImpl implements ProductSearchRepository {
    private static final String EFFECTIVE_PRICE = "ROUND(p.base_price * (1 - p.discount_percent / 100), 2)";

    private static final Map<String, String> SORT_ORDERS = Map.of(
        "price_asc", EFFECTIVE_PRICE + " ASC, p.id ASC",
        "price_desc", EFFECTIVE_PRICE + " DESC, p.id ASC",
        "newest", "p.created_at DESC, p.id ASC",
        "popular", "JSON_CONTAINS(p.tags, JSON_QUOTE('best-seller')) DESC, p.id ASC"
    );

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Product> searchActiveProducts(
        String category,
        String tag,
        String size,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String search,
        String sort,
        Pageable pageable
    ) {
        StringBuilder predicates = new StringBuilder(" WHERE p.is_active = TRUE");
        Map<String, Object> parameters = new java.util.HashMap<>();

        if (category != null) {
            predicates.append(" AND EXISTS (SELECT 1 FROM categories c WHERE c.id = p.category_id AND (c.slug = :category OR c.id = :category))");
            parameters.put("category", category);
        }
        if (tag != null) {
            predicates.append(" AND JSON_CONTAINS(p.tags, JSON_QUOTE(:tag))");
            parameters.put("tag", tag);
        }
        if (size != null) {
            predicates.append(" AND EXISTS (SELECT 1 FROM product_sizes ps WHERE ps.product_id = p.id AND ps.size = :size)");
            parameters.put("size", size);
        }
        if (minPrice != null) {
            predicates.append(" AND ").append(EFFECTIVE_PRICE).append(" >= :minPrice");
            parameters.put("minPrice", minPrice);
        }
        if (maxPrice != null) {
            predicates.append(" AND ").append(EFFECTIVE_PRICE).append(" <= :maxPrice");
            parameters.put("maxPrice", maxPrice);
        }
        if (search != null) {
            predicates.append(" AND (LOWER(p.name) LIKE :search OR LOWER(p.description) LIKE :search)");
            parameters.put("search", "%" + search.toLowerCase(Locale.ROOT) + "%");
        }

        Query countQuery = entityManager.createNativeQuery("SELECT COUNT(*) FROM products p" + predicates);
        Query productsQuery = entityManager.createNativeQuery(
            "SELECT p.id FROM products p" + predicates + " ORDER BY "
                + SORT_ORDERS.getOrDefault(sort, "p.id ASC")
                + " LIMIT :limit OFFSET :offset"
        );
        parameters.forEach((name, value) -> {
            countQuery.setParameter(name, value);
            productsQuery.setParameter(name, value);
        });

        long total = ((Number) countQuery.getSingleResult()).longValue();
        List<?> resultIds = productsQuery
            .setParameter("limit", pageable.getPageSize())
            .setParameter("offset", pageable.getOffset())
            .getResultList();
        if (resultIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, total);
        }

        List<String> ids = resultIds.stream().map(Object::toString).toList();
        List<Product> products = new ArrayList<>(entityManager.createQuery(
            "SELECT p FROM Product p WHERE p.id IN :ids", Product.class
        ).setParameter("ids", ids).getResultList());
        Map<String, Product> productsById = products.stream()
            .collect(java.util.stream.Collectors.toMap(Product::getId, product -> product));
        List<Product> orderedProducts = ids.stream().map(productsById::get).toList();

        return new PageImpl<>(orderedProducts, pageable, total);
    }
}

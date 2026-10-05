package com.twa.userservice.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("dev")
class ProductControllerTest {
    private static final String PRODUCT_ID = "product_test";

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUpProduct() {
        jdbcTemplate.update("DELETE FROM product_sizes WHERE product_id = ?", PRODUCT_ID);
        jdbcTemplate.update("DELETE FROM product_images WHERE product_id = ?", PRODUCT_ID);
        jdbcTemplate.update("DELETE FROM products WHERE id = ?", PRODUCT_ID);
        jdbcTemplate.update("DELETE FROM categories WHERE id = ?", "category_test");

        jdbcTemplate.update(
            "INSERT INTO categories (id, slug, name, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            "category_test",
            "test-category",
            "Test category",
            1,
            Timestamp.valueOf(LocalDateTime.of(2026, 1, 15, 0, 0)),
            Timestamp.valueOf(LocalDateTime.of(2026, 8, 1, 0, 0))
        );
        jdbcTemplate.update(
            """
                INSERT INTO products (
                    id, slug, category_id, name, description, short_description,
                    base_price, discount_percent, estimated_delivery_days, is_active,
                    tags, customization_options, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), ?, ?)
                """,
            PRODUCT_ID,
            "test-product",
            "category_test",
            "Test linen kurta",
            "A searchable test product",
            "Test product",
            new BigDecimal("200.00"),
            new BigDecimal("10.00"),
            4,
            true,
            "[\"best-seller\"]",
            "[{\"key\":\"monogram\",\"label\":\"Monogram\",\"type\":\"text\",\"maxLength\":8}]",
            Timestamp.valueOf(LocalDateTime.of(2026, 1, 15, 0, 0)),
            Timestamp.valueOf(LocalDateTime.of(2026, 8, 1, 0, 0))
        );
        jdbcTemplate.update(
            "INSERT INTO product_images (id, product_id, url, alt, sort_order) VALUES (?, ?, ?, ?, ?)",
            "image_test", PRODUCT_ID, "https://example.com/product.jpg", "Test product image", 1
        );
        jdbcTemplate.update(
            "INSERT INTO product_sizes (id, product_id, size, sku, stock) VALUES (?, ?, ?, ?, ?)",
            "size_test", PRODUCT_ID, "M", "TEST-M", 8
        );
    }

    @Test
    void listsProductsUsingFiltersAndSharedProductShape() {
        assertProductCount("category=test-category", 1);
        assertProductCount("size=M", 1);
        assertProductCount("minPrice=180", 1);
        assertProductCount("maxPrice=180", 1);
        assertProductCount("search=linen", 1);

        ResponseEntity<JsonNode> response = restTemplate.getForEntity(
            "/api/products?category=test-category&size=M&minPrice=180&maxPrice=180&search=linen&sort=price_asc&page=1&limit=5",
            JsonNode.class
        );

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        JsonNode body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.path("page").asInt()).isEqualTo(1);
        assertThat(body.path("limit").asInt()).isEqualTo(5);
        assertThat(body.path("total").asLong()).as(body.toString()).isEqualTo(1);
        assertThat(body.path("totalPages").asInt()).isEqualTo(1);

        JsonNode product = body.path("data").get(0);
        assertThat(product.path("id").asText()).isEqualTo(PRODUCT_ID);
        assertThat(product.path("categoryId").asText()).isEqualTo("category_test");
        assertThat(product.path("effectivePrice").decimalValue()).isEqualByComparingTo("180.00");
        assertThat(product.path("isActive").asBoolean()).isTrue();
        assertThat(product.path("tags").isArray()).as(product.toString()).isTrue();
        assertThat(product.path("tags").get(0).asText()).isEqualTo("best-seller");
        assertThat(product.path("customizationOptions").get(0).path("key").asText()).isEqualTo("monogram");
        assertThat(product.path("images").get(0).path("sortOrder").asInt()).isEqualTo(1);
        assertThat(product.path("sizes").get(0).path("size").asText()).isEqualTo("M");
        assertThat(product.path("sizes").get(0).path("stock").asInt()).isEqualTo(8);
    }

    private void assertProductCount(String query, long expected) {
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(
            "/api/products?" + query, JsonNode.class
        );
        assertThat(response.getStatusCode().value()).as(query).isEqualTo(200);
        assertThat(response.getBody().path("total").asLong()).as(query).isEqualTo(expected);
    }

    @Test
    void productDetailIsPublicAndFindsProductBySlug() {
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(
            "/api/products/test-product", JsonNode.class
        );

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().path("slug").asText()).isEqualTo("test-product");
    }
}

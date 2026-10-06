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

import java.sql.Timestamp;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("dev")
class CatalogControllerTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUpCategories() {
        jdbcTemplate.update("DELETE FROM categories WHERE id IN (?, ?)", "category_second", "category_first");
        jdbcTemplate.update(
            "INSERT INTO categories (id, slug, name, description, image_url, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            "category_second", "second-category", "Second category", "Second description",
            "https://example.com/second.jpg", 2,
            Timestamp.valueOf(LocalDateTime.of(2026, 1, 15, 0, 0)),
            Timestamp.valueOf(LocalDateTime.of(2026, 8, 1, 0, 0))
        );
        jdbcTemplate.update(
            "INSERT INTO categories (id, slug, name, description, image_url, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            "category_first", "first-category", "First category", "First description",
            "https://example.com/first.jpg", 1,
            Timestamp.valueOf(LocalDateTime.of(2026, 1, 15, 0, 0)),
            Timestamp.valueOf(LocalDateTime.of(2026, 8, 1, 0, 0))
        );
    }

    @Test
    void listsCategoriesPubliclyInSortOrderUsingSharedCategoryShape() {
        ResponseEntity<JsonNode> response = restTemplate.getForEntity("/api/categories", JsonNode.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        JsonNode categories = response.getBody();
        assertThat(categories).isNotNull();
        assertThat(categories).hasSize(2);
        assertThat(categories.get(0).path("id").asText()).isEqualTo("category_first");
        assertThat(categories.get(0).path("slug").asText()).isEqualTo("first-category");
        assertThat(categories.get(0).path("name").asText()).isEqualTo("First category");
        assertThat(categories.get(0).path("description").asText()).isEqualTo("First description");
        assertThat(categories.get(0).path("imageUrl").asText()).isEqualTo("https://example.com/first.jpg");
        assertThat(categories.get(0).path("sortOrder").asInt()).isEqualTo(1);
    }
}

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
        jdbcTemplate.update("DELETE FROM banners WHERE id IN (?, ?)", "banner_second", "banner_first");
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

    @Test
    void listsBannersPubliclyInSortOrderUsingSharedBannerShape() {
        jdbcTemplate.update(
            "INSERT INTO banners (id, title, subtitle, type, media_url, thumbnail_url, link_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            "banner_second", "Second banner", null, "video", "https://example.com/second.mp4",
            "https://example.com/second-thumbnail.jpg", null, 2
        );
        jdbcTemplate.update(
            "INSERT INTO banners (id, title, subtitle, type, media_url, thumbnail_url, link_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            "banner_first", "First banner", "First subtitle", "image", "https://example.com/first.jpg",
            null, "/products", 1
        );

        ResponseEntity<JsonNode> response = restTemplate.getForEntity("/api/banners", JsonNode.class);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        JsonNode banners = response.getBody();
        assertThat(banners).isNotNull();
        assertThat(banners).hasSize(2);
        assertThat(banners.get(0).path("id").asText()).isEqualTo("banner_first");
        assertThat(banners.get(0).path("title").asText()).isEqualTo("First banner");
        assertThat(banners.get(0).path("subtitle").asText()).isEqualTo("First subtitle");
        assertThat(banners.get(0).path("type").asText()).isEqualTo("image");
        assertThat(banners.get(0).path("mediaUrl").asText()).isEqualTo("https://example.com/first.jpg");
        assertThat(banners.get(0).path("linkUrl").asText()).isEqualTo("/products");
        assertThat(banners.get(0).path("sortOrder").asInt()).isEqualTo(1);
        assertThat(banners.get(1).has("subtitle")).isFalse();
        assertThat(banners.get(1).path("thumbnailUrl").asText()).isEqualTo("https://example.com/second-thumbnail.jpg");
    }
}

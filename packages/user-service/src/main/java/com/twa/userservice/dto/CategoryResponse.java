package com.twa.userservice.dto;

import com.twa.userservice.model.Category;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CategoryResponse(
    String id,
    String slug,
    String name,
    String description,
    String imageUrl,
    int sortOrder
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
            category.getId().trim(),
            category.getSlug(),
            category.getName(),
            category.getDescription(),
            category.getImageUrl() == null ? "" : category.getImageUrl(),
            category.getSortOrder()
        );
    }
}

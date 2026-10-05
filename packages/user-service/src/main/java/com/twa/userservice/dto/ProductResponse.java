package com.twa.userservice.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.twa.userservice.model.Product;
import com.twa.userservice.model.ProductImage;
import com.twa.userservice.model.ProductSize;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

public record ProductResponse(
    String id,
    String slug,
    String name,
    String description,
    String shortDescription,
    List<ProductImageResponse> images,
    String categoryId,
    BigDecimal basePrice,
    BigDecimal discountPercent,
    BigDecimal effectivePrice,
    List<ProductSizeResponse> sizes,
    int estimatedDeliveryDays,
    JsonNode tags,
    JsonNode customizationOptions,
    boolean isActive,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();
    private static final Map<ProductSize.Size, Integer> SIZE_ORDER = Map.of(
        ProductSize.Size.XS, 0,
        ProductSize.Size.S, 1,
        ProductSize.Size.M, 2,
        ProductSize.Size.L, 3,
        ProductSize.Size.XL, 4,
        ProductSize.Size.XXL, 5
    );

    public static ProductResponse from(Product product) {
        BigDecimal effectivePrice = product.getBasePrice()
            .multiply(BigDecimal.ONE.subtract(product.getDiscountPercent().movePointLeft(2)))
            .setScale(2, RoundingMode.HALF_UP);

        List<ProductImageResponse> images = product.getImages().stream()
            .sorted(Comparator.comparingInt(ProductImage::getSortOrder))
            .map(image -> new ProductImageResponse(
                image.getId().trim(),
                image.getUrl(),
                image.getAlt() == null ? "" : image.getAlt(),
                image.getSortOrder()
            ))
            .toList();
        List<ProductSizeResponse> sizes = product.getSizes().stream()
            .sorted(Comparator.comparingInt(size -> SIZE_ORDER.get(size.getSize())))
            .map(size -> new ProductSizeResponse(size.getSize().name(), size.getSku(), size.getStock()))
            .toList();

        return new ProductResponse(
            product.getId().trim(),
            product.getSlug(),
            product.getName(),
            product.getDescription(),
            product.getShortDescription(),
            images,
            product.getCategoryId().trim(),
            product.getBasePrice(),
            product.getDiscountPercent(),
            effectivePrice,
            sizes,
            product.getEstimatedDeliveryDays(),
            decodeJsonColumn(product.getTags()),
            decodeJsonColumn(product.getCustomizationOptions()),
            product.isActive(),
            product.getCreatedAt(),
            product.getUpdatedAt()
        );
    }

    private static JsonNode decodeJsonColumn(JsonNode value) {
        if (value == null || !value.isTextual()) {
            return value;
        }
        try {
            return JSON_MAPPER.readTree(value.textValue());
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Product JSON column contains invalid JSON", exception);
        }
    }

    public record ProductImageResponse(String id, String url, String alt, int sortOrder) {}
    public record ProductSizeResponse(String size, String sku, int stock) {}
}

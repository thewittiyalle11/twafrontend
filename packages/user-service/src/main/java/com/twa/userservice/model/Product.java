package com.twa.userservice.model;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @Column(nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String id;

    @Column(nullable = false, unique = true, length = 160)
    private String slug;

    @Column(name = "category_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String categoryId;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "short_description", length = 512)
    private String shortDescription;

    @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "discount_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal discountPercent;

    @Column(name = "estimated_delivery_days", nullable = false)
    private int estimatedDeliveryDays;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String tags;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "customization_options", nullable = false, columnDefinition = "LONGTEXT")
    private String customizationOptions;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ProductSize> sizes = new ArrayList<>();

    public String getId() { return id; }
    public String getSlug() { return slug; }
    public String getCategoryId() { return categoryId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getShortDescription() { return shortDescription; }
    public BigDecimal getBasePrice() { return basePrice; }
    public BigDecimal getDiscountPercent() { return discountPercent; }
    public int getEstimatedDeliveryDays() { return estimatedDeliveryDays; }
    public boolean isActive() { return active; }
    public String getTags() { return tags; }
    public String getCustomizationOptions() { return customizationOptions; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<ProductImage> getImages() { return images; }
    public List<ProductSize> getSizes() { return sizes; }
}

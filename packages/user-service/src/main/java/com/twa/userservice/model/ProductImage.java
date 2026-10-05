package com.twa.userservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @Column(nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 1024)
    private String url;

    @Column(length = 255)
    private String alt;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    public String getId() { return id; }
    public String getUrl() { return url; }
    public String getAlt() { return alt; }
    public int getSortOrder() { return sortOrder; }
}

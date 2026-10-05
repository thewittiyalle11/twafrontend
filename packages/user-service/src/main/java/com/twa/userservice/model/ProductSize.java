package com.twa.userservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product_sizes")
public class ProductSize {
    @Id
    @Column(nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 3)
    private Size size;

    @Column(nullable = false, length = 80)
    private String sku;

    @Column(nullable = false)
    private int stock;

    public Size getSize() { return size; }
    public String getSku() { return sku; }
    public int getStock() { return stock; }

    public enum Size {
        XS, S, M, L, XL, XXL
    }
}

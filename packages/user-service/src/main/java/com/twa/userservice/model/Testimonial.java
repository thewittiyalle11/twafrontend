package com.twa.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "testimonials")
public class Testimonial {
    @Id
    @Column(nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String id;

    @Column(name = "customer_name", nullable = false, length = 140)
    private String customerName;

    @Column(nullable = false, length = 140)
    private String location;

    @Column(nullable = false, columnDefinition = "TINYINT")
    private int rating;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(name = "avatar_url", length = 1024)
    private String avatarUrl;

    public String getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getLocation() { return location; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public String getAvatarUrl() { return avatarUrl; }
}

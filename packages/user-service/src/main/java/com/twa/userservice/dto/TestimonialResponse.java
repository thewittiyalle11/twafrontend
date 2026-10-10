package com.twa.userservice.dto;

import org.hibernate.type.descriptor.jdbc.TinyIntAsSmallIntJdbcType;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TestimonialResponse {
    @JsonProperty("id")
    private String id;

    @JsonProperty("customerName")
    private String customerName;

    @JsonProperty("location")
    private String location;

    @JsonProperty("rating")
    private int rating;

    @JsonProperty("comment")
    private String comment;

    @JsonProperty("avatarUrl")
    private String avatarUrl;

    public static TestimonialResponse fromEntity(com.twa.userservice.model.Testimonial entity) {
        TestimonialResponse response = new TestimonialResponse();
        response.id = entity.getId();
        response.customerName = entity.getCustomerName();
        response.location = entity.getLocation();
        response.rating = entity.getRating();
        response.comment = entity.getComment();
        response.avatarUrl = entity.getAvatarUrl();
        return response;
    }

    public String getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getLocation() { return location; }
    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public String getAvatarUrl() { return avatarUrl; }
}

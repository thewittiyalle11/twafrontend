package com.twa.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "banners")
public class Banner {
    @Id
    @Column(nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String id;

    @Column(nullable = false, length = 220)
    private String title;

    @Column(length = 512)
    private String subtitle;

    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(nullable = false, length = 16)
    private String type;

    @Column(name = "media_url", nullable = false, length = 1024)
    private String mediaUrl;

    @Column(name = "thumbnail_url", length = 1024)
    private String thumbnailUrl;

    @Column(name = "link_url", length = 1024)
    private String linkUrl;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getSubtitle() { return subtitle; }
    public String getType() { return type; }
    public String getMediaUrl() { return mediaUrl; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public String getLinkUrl() { return linkUrl; }
    public int getSortOrder() { return sortOrder; }
}

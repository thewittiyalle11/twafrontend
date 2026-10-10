package com.twa.userservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.twa.userservice.model.Banner;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record BannerResponse(
    String id,
    String title,
    String subtitle,
    String type,
    String mediaUrl,
    String thumbnailUrl,
    String linkUrl,
    int sortOrder
) {
    public static BannerResponse from(Banner banner) {
        return new BannerResponse(
            banner.getId().trim(),
            banner.getTitle(),
            banner.getSubtitle(),
            banner.getType().trim(),
            banner.getMediaUrl(),
            banner.getThumbnailUrl(),
            banner.getLinkUrl(),
            banner.getSortOrder()
        );
    }
}

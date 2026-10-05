package com.twa.userservice.dto;

import java.util.List;

public record PaginatedResponse<T>(
    List<T> data,
    int page,
    int limit,
    long total,
    int totalPages
) {}

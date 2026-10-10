package com.twa.userservice.repository;

import com.twa.userservice.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, String> {
    List<Banner> findAllByOrderBySortOrderAsc();
}

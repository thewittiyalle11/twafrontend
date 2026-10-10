  -- MySQL schema for TWA Fashion Ecommerce
  -- Designed for the monorepo shared storefront and future backend

  CREATE DATABASE IF NOT EXISTS twa_storefront;
  USE twa_storefront;

  CREATE TABLE users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    role ENUM('customer','admin','staff') NOT NULL DEFAULT 'customer',
    admin_role ENUM('super_admin','catalog_manager','fulfillment','marketing'),
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  CREATE TABLE categories (
    id CHAR(36) NOT NULL PRIMARY KEY,
    slug VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(140) NOT NULL,
    description TEXT,
    image_url VARCHAR(1024),
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  CREATE TABLE products (
    id CHAR(36) NOT NULL PRIMARY KEY,
    slug VARCHAR(160) NOT NULL UNIQUE,
    category_id CHAR(36) NOT NULL,
    name VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(512),
    video_url VARCHAR(1024) NULL,
    base_price DECIMAL(12,2) NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    estimated_delivery_days INT NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    tags JSON NOT NULL,
    customization_options JSON NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
  );

  CREATE TABLE product_images (
    id CHAR(36) NOT NULL PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    url VARCHAR(1024) NOT NULL,
    alt VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE product_sizes (
    id CHAR(36) NOT NULL PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    size ENUM('XS','S','M','L','XL','XXL') NOT NULL,
    sku VARCHAR(80) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY product_size_unique (product_id, size)
  );

  CREATE TABLE banners (
    id CHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(220) NOT NULL,
    subtitle VARCHAR(512),
    type ENUM('image','video') NOT NULL DEFAULT 'image',
    media_url VARCHAR(1024) NOT NULL,
    thumbnail_url VARCHAR(1024),
    link_url VARCHAR(1024),
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE testimonials (
    id CHAR(36) NOT NULL PRIMARY KEY,
    customer_name VARCHAR(140) NOT NULL,
    location VARCHAR(140) NOT NULL,
    rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    avatar_url VARCHAR(1024),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE policies (
    id CHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(220) NOT NULL,
    content TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE addresses (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36),
    full_name VARCHAR(140) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(140) NOT NULL,
    state VARCHAR(140) NOT NULL,
    state_code VARCHAR(8) NOT NULL,
    pincode VARCHAR(32) NOT NULL,
    country VARCHAR(120) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE orders (
    id CHAR(36) NOT NULL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id CHAR(36) NOT NULL,
    shipping_address_id CHAR(36) NOT NULL,
    billing_address_id CHAR(36) NOT NULL,
    status ENUM('pending','confirmed','processing','shipped','delivered','cancelled','returned') NOT NULL DEFAULT 'pending',
    payment_status ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
    coupon_code VARCHAR(80),
    gstin VARCHAR(32),
    tracking_number VARCHAR(120),
    invoice_id CHAR(36),
    summary JSON NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE CASCADE,
    FOREIGN KEY (billing_address_id) REFERENCES addresses(id) ON DELETE CASCADE
  );

  CREATE TABLE order_items (
    id CHAR(36) NOT NULL PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    product_slug VARCHAR(160) NOT NULL,
    name VARCHAR(180) NOT NULL,
    image_url VARCHAR(1024) NOT NULL,
    size ENUM('XS','S','M','L','XL','XXL') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    customization JSON,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
  );

  CREATE TABLE invoices (
    id CHAR(36) NOT NULL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    order_id CHAR(36) NOT NULL,
    seller JSON NOT NULL,
    buyer JSON NOT NULL,
    line_items JSON NOT NULL,
    hsn_summary JSON NOT NULL,
    tax_breakdown JSON NOT NULL,
    total_in_words VARCHAR(512) NOT NULL,
    issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE campaigns (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    code VARCHAR(80) NOT NULL UNIQUE,
    type ENUM('percentage','flat','bogo') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(12,2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    banner_id CHAR(36),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE SET NULL
  );

  CREATE TABLE campaign_products (
    campaign_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    PRIMARY KEY (campaign_id, product_id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE shipping_carriers (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    base_rate DECIMAL(12,2) NOT NULL,
    estimated_days INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE social_settings (
    id CHAR(36) NOT NULL PRIMARY KEY,
    instagram_handle VARCHAR(140) NOT NULL,
    instagram_url VARCHAR(1024) NOT NULL,
    facebook_url VARCHAR(1024),
    twitter_url VARCHAR(1024),
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  CREATE TABLE brand_settings (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    logo_url VARCHAR(1024) NOT NULL,
    support_email VARCHAR(255) NOT NULL,
    support_phone VARCHAR(80) NOT NULL,
    social_id CHAR(36) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (social_id) REFERENCES social_settings(id) ON DELETE CASCADE
  );
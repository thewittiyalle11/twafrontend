# Database Setup for TWA Fashion Ecommerce

This monorepo currently contains a frontend storefront with mock APIs. The SQL schema in `schema.sql` is designed for a future backend service that uses the shared `@twa/shared` contracts.

## What is included

- `users`: customer, admin, and staff accounts
- `categories`: product categories
- `products`: product records with JSON support for tags and customization options
- `product_images`, `product_sizes`: product media and inventory details
- `orders`, `order_items`: order, shipping, billing, and item details
- `addresses`: reusable shipping and billing addresses
- `invoices`: invoice payloads derived from orders
- `campaigns`, `campaign_products`: promotional campaigns and product associations
- `banners`, `testimonials`, `policies`, `shipping_carriers`, `social_settings`, `brand_settings`

## Setup Instructions

1. Install MySQL 8 or compatible server.
2. Create the schema:

   ```sql
   SOURCE db/schema.sql;
   ```

3. Use the database from your backend connection string:

   ```text
   mysql://user:password@localhost:3306/twa_storefront
   ```

## Notes for integration

- `products.tags` and `products.customization_options` are stored as JSON so the frontend can preserve arrays objects defined in shared contracts.
- `orders.summary` is stored as JSON to preserve calculated cart totals and tax breakdowns.
- `users.password_hash` is a placeholder for backend password hashing; do not store plain text passwords.
- `campaign_products` is the join table for many-to-many campaign/product relationships.

## Recommended next step

Build a backend service that exposes the same REST endpoints defined in `packages/shared/src/openapi.yaml` and maps requests to this schema.

# user-service

Spring Boot service providing user registration API.

Build & run:

```bash
cd packages/user-service
mvn package
java -jar target/user-service-0.1.0.jar
```

API:
- POST /api/users/register
  - payload: { "name":"...","email":"...","password":"...","phone":"..." }
- GET /api/products
  - returns a paginated product collection matching the shared `Paginated<Product>` contract
  - optional query parameters: `category`, `tag`, `size`, `minPrice`, `maxPrice`, `search`, `sort`, `page`, and `limit`
  - `category` accepts a category slug or ID; `sort` accepts `price_asc`, `price_desc`, `newest`, or `popular`
- GET /api/products/{slug}
  - returns the active product matching the slug in the shared `Product` contract

Product reads are public and use the `products`, `product_images`, `product_sizes`, and `categories` tables.

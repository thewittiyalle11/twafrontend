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

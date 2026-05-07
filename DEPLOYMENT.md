# HireScript Deployment

This workspace is set up as two deployable services:

```text
frontend -> backend-java -> hosted Python AI API
```

The hosted Python API base URL is:

```text
https://hirescript-api-python.onrender.com
```

## Backend Java Service

Deploy `backend-java` as a Spring Boot web service.

Recommended service settings if you create it manually:

```text
Root directory: backend-java
Runtime: Docker
Dockerfile path: ./Dockerfile
```

Required environment variables:

```env
SPRING_PROFILES_ACTIVE=ai
PYTHON_API_BASE_URL=https://hirescript-api-python.onrender.com
PYTHON_API_INTERNAL_SECRET=replace-with-python-internal-secret
```

The `ai` profile calls the hosted Python API and skips database persistence. That keeps the first deployment simple while preserving the public Java API contract.

After deployment, verify:

```text
GET https://your-java-backend-url/api/health
POST https://your-java-backend-url/api/jd/generate
```

## Frontend Service

Deploy this frontend after the Java backend is live.

Required environment variables:

```env
HIRESCRIPT_API_BASE_URL=https://your-java-backend-url
HIRESCRIPT_API_TIMEOUT_MS=30000
```

The frontend browser submits to its own `/api/jd/generate` route. That server route forwards requests to the Java backend URL above.

## Render Blueprint

This repo includes `render.yaml`, which can create both Render services from the same repo.

When Render asks for the unsynced secret, enter:

```env
PYTHON_API_INTERNAL_SECRET=dev-secret-123
```

The blueprint passes the Java service's private `host:port` to the frontend as `HIRESCRIPT_API_BASE_URL`.

## Local Run

Run Java:

```bash
cd backend-java
SPRING_PROFILES_ACTIVE=ai \
PYTHON_API_BASE_URL=https://hirescript-api-python.onrender.com \
PYTHON_API_INTERNAL_SECRET=replace-with-python-internal-secret \
./mvnw spring-boot:run
```

Run frontend in another terminal:

```bash
HIRESCRIPT_API_BASE_URL=http://localhost:9097 bun run dev
```

or:

```bash
HIRESCRIPT_API_BASE_URL=http://localhost:9097 npm run dev
```

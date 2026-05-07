# HireScript Deployment

This repo now deploys only the frontend. The Java backend should be deployed separately by the backend owner.

```text
frontend -> externally deployed Java backend -> hosted Python AI API
```

The hosted Python API base URL is:

```text
https://hirescript-api-python.onrender.com
```

## Java Backend

The Java backend is not deployed from this frontend repo. Ask the backend owner for the deployed Java base URL, then verify its health endpoint:

```text
GET https://their-java-backend-url/api/health
```

## Frontend Service

Required environment variables:

```env
HIRESCRIPT_API_BASE_URL=https://your-java-backend-url
HIRESCRIPT_API_TIMEOUT_MS=30000
```

The frontend browser submits to its own `/api/jd/generate` route. That server route forwards requests to the Java backend URL above.

## Render Blueprint

This repo includes `render.yaml`, which creates only the frontend service.

When Render asks for the unsynced env var, enter your friend's deployed Java backend base URL:

```env
HIRESCRIPT_API_BASE_URL=https://your-java-backend-url
```

## Local Run

Run the frontend with the Java backend URL:

```bash
HIRESCRIPT_API_BASE_URL=http://localhost:9097 bun run dev
```

or:

```bash
HIRESCRIPT_API_BASE_URL=http://localhost:9097 npm run dev
```

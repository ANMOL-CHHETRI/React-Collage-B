# REST API Documentation — React-Collage-B

Base URL:
* **Production**: `https://us-central1-shopease-nepal-anmol-196e7.cloudfunctions.net/api/api/v1`
* **Local Emulator**: `http://127.0.0.1:5001/shopease-nepal-anmol-196e7/us-central1/api/api/v1`

---

## 1. Authentication & Headers

All protected endpoints require a Firebase ID Token in the standard `Authorization` header:

```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

---

## 2. Standard Response Envelopes

### Success Envelope (Single Entity)
```json
{
  "data": { ... }
}
```

### Success Envelope (Paginated Collection)
```json
{
  "data": [ ... ],
  "pagination": {
    "limit": 20,
    "nextCursor": "doc_id_xyz",
    "hasMore": true
  }
}
```

### Error Envelope
```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [
      {
        "path": "title",
        "message": "Title must be at least 2 characters"
      }
    ]
  }
}
```

---

## 3. Endpoints

### ── Health Check ──
* `GET /health`
  * **Auth**: Public
  * **Response**: `{ "status": "healthy", "service": "...", "version": "1.0.0" }`

---

### ── Users ──
* `GET /api/v1/users/me`
  * **Auth**: Authenticated (Bearer Token)
  * **Response**: User profile data with role (`viewer`, `editor`, `admin`).
* `PATCH /api/v1/users/me`
  * **Auth**: Authenticated
  * **Body**: `{ "displayName": "string", "photoURL": "https://..." }`
* `GET /api/v1/users/admin/list`
  * **Auth**: `admin` role required
  * **Query**: `?limit=50`
* `PATCH /api/v1/users/admin/:id/role`
  * **Auth**: `admin` role required
  * **Body**: `{ "role": "editor" | "admin" | "viewer", "isActive": true }`

---

### ── Projects ──
* `GET /api/v1/projects`
  * **Auth**: Public (returns public projects) or Authenticated (returns public + user's private projects)
* `POST /api/v1/projects`
  * **Auth**: `editor` or `admin`
  * **Body**: `{ "name": "...", "description": "...", "visibility": "public" | "private" }`
* `GET /api/v1/projects/:id`
  * **Auth**: Public for public projects; owner/admin for private.
* `PATCH /api/v1/projects/:id`
  * **Auth**: Owner or Admin.
* `DELETE /api/v1/projects/:id`
  * **Auth**: Owner or Admin.

---

### ── Collages ──
* `GET /api/v1/collages`
  * **Auth**: Public (or authenticated)
  * **Query**: `?limit=20&cursor=...&visibility=public&ownerId=...&projectId=...`
* `POST /api/v1/collages`
  * **Auth**: `editor` or `admin`
  * **Body**: `{ "title": "...", "description": "...", "visibility": "public" | "private", "projectId": "..." }`
* `GET /api/v1/collages/:id`
  * **Auth**: Public for public collages; owner/admin for private.
* `PATCH /api/v1/collages/:id`
  * **Auth**: Owner or Admin.
* `DELETE /api/v1/collages/:id`
  * **Auth**: Owner or Admin (Recursively deletes images, Storage objects, comments, and reactions).

---

### ── Images ──
* `GET /api/v1/collages/:id/images`
  * **Auth**: Public
* `POST /api/v1/collages/:id/images`
  * **Auth**: Collage Owner or Admin
  * **Body**:
    ```json
    {
      "storagePath": "collages/col-123/img_01.jpg",
      "downloadUrl": "https://firebasestorage.googleapis.com/...",
      "contentType": "image/jpeg",
      "size": 1048576,
      "width": 1920,
      "height": 1080,
      "position": 0
    }
    ```
* `PATCH /api/v1/collages/:id/images/:imageId/position`
  * **Auth**: Collage Owner or Admin
  * **Body**: `{ "position": 2 }`
* `DELETE /api/v1/collages/:id/images/:imageId`
  * **Auth**: Collage Owner or Admin

---

### ── Comments ──
* `GET /api/v1/collages/:id/comments`
  * **Auth**: Public
* `POST /api/v1/collages/:id/comments`
  * **Auth**: Authenticated (Viewer, Editor, Admin)
  * **Body**: `{ "content": "..." }`
* `PATCH /api/v1/collages/:id/comments/:commentId`
  * **Auth**: Comment Author or Admin
  * **Body**: `{ "content": "..." }`
* `DELETE /api/v1/collages/:id/comments/:commentId`
  * **Auth**: Comment Author or Admin (Soft-deletes content to `[Comment deleted]`).

---

### ── Audit Logs ──
* `GET /api/v1/audit-logs`
  * **Auth**: `admin` role required
  * **Rate Limit**: Strict (30 req/min)
  * **Query**: `?limit=20&startAfter=doc_id_xyz`
  * **Response**:
    ```json
    {
      "data": [
        {
          "id": "log-123",
          "actorId": "admin-uid",
          "action": "UPDATE_USER_ROLE",
          "targetType": "user",
          "targetId": "target-uid",
          "metadata": { "previousRole": "viewer", "newRole": "editor" },
          "createdAt": "2026-08-21T10:00:00.000Z"
        }
      ],
      "hasMore": false
    }
    ```

---

## 4. Observability & Rate Limiting Headers

Every API response includes:
* `X-Request-ID`: Client-provided or server-generated UUID for end-to-end request tracing.
* `X-RateLimit-Limit`: Maximum allowable requests per 60-second window (120 for standard, 30 for mutations).
* `X-RateLimit-Remaining`: Remaining request quota for the active client IP/user.
* `X-RateLimit-Reset`: Seconds remaining until window reset.


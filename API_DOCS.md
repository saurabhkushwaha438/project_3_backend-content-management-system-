## API Documentation

This file contains the full API reference for the CMS backend.

### Authentication & Common Rules

- **Auth mechanism**: JWT in `Authorization` header: `Bearer <token>`.
- **Token payload**: `{ userId: "<mongo_user_id>" }`.
- **Roles**: `admin` and `user` (see `role` field on `User` model).
- Some endpoints require:
  - Logged-in user (`Authorization` required).
  - Admin only (`role: "admin"`).
  - Owner of the content (backend checks `content.userId === req.user.id`).

---

### Auth APIs

#### `POST /api/auth/signup`

- **Description**: Register a new user.
- **Auth**: Public (no token required).
- **Request body (JSON)**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123",
  "role": "admin"
}
```

- **Successful response** `201`:

```json
{
  "success": true,
  "message": "user registered successfully",
  "data": {
    "token": "jwt-token-string",
    "userdata": {
      "_id": "65f0...",
      "name": "John Doe",
      "email": "john@example.com",
      "date": "2025-01-01T10:00:00.000Z",
      "role": "admin"
    }
  }
}
```

- **Error cases**:
  - `400` – user already exists or validation error.

#### `POST /api/auth/signin`

- **Description**: Login existing user.
- **Auth**: Public.
- **Request body (JSON)**:

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

- **Successful response** `201`:

```json
{
  "success": true,
  "message": "user signin successfully",
  "data": {
    "token": "jwt-token-string",
    "userdata": {
      "_id": "65f0...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "date": "2025-01-01T10:00:00.000Z"
    }
  }
}
```

- **Error cases**:
  - `404` – wrong credentials / invalid password.

---

### Content APIs

All content documents follow the `Content` model:

```json
{
  "_id": "6600...",
  "userId": "65f0...",
  "title": "My first post",
  "body": "Long text...",
  "imgUrl": "https://...cloudinary.com/...",
  "status": "draft",
  "tags": ["news", "tech"],
  "expiresAt": null,
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

#### `POST /api/content/`

- **Description**: Create new content.
- **Auth**: **Required** (`Authorization: Bearer <token>`).
- **Role**: **Admin only**.
- **Body type**: `multipart/form-data`.

- **Form fields**:
  - `title` (string, required)
  - `body` (string, required)
  - `tags` (string, optional – comma-separated)
  - `status` (string, optional: `"draft"` or `"published"`)
  - `image` (file, optional)

- **Successful response** `201`:

```json
{
  "success": true,
  "data": {
    "_id": "6600...",
    "userId": "65f0...",
    "title": "My first post",
    "body": "Long text...",
    "imgUrl": "https://...",
    "tags": ["news", "tech"],
    "status": "published",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z",
    "__v": 0
  }
}
```

- **Error cases**:
  - `400` – missing `title` or `body`.
  - `401/403` – not authenticated or not admin.

#### `GET /api/content/`

- **Description**: Get all **published** content (public feed).
- **Auth**: Public.

- **Successful response** `200`:

```json
{
  "success": true,
  "data": [
    {
      "_id": "6600...",
      "title": "My first post",
      "status": "published"
    }
  ]
}
```

#### `GET /api/content/:contentId`

- **Description**: Get a single **published** content by id.
- **Auth**: Public.

- **Successful response** `200`:

```json
{
  "success": true,
  "data": {
    "_id": "6600...",
    "title": "My first post",
    "status": "published"
  }
}
```

#### `PATCH /api/content/:contentId`

- **Description**: Update existing content (partial update).
- **Auth**: **Required**.
- **Role**: Owner of the content + passes `onlyValidAdmin`.
- **Body type**: `multipart/form-data` if sending an image, otherwise `application/json`.

- **Fields**:
  - `title` (string)
  - `body` (string)
  - `status` (string)
  - `tags` (string, comma-separated)
  - `image` (file)

- **Successful response** `200`:

```json
{
  "success": true,
  "message": "Content updated successfully",
  "data": {
    "_id": "6600...",
    "title": "Updated title",
    "body": "Updated body",
    "status": "published",
    "tags": ["news", "tech"],
    "imgUrl": "https://..."
  }
}
```

#### `DELETE /api/content/:contentId`

- **Description**: Delete a content document.
- **Auth**: **Required**.
- **Role**: `onlyValidAdmin` (admin/owner depending on middleware).

- **Successful response** `200`:

```json
{
  "success": true,
  "message": "this content deleted successfully"
}
```

---

### User Content APIs

#### `GET /api/user/:userId/contents`

- **Description**: Get all **published** contents for a specific user.
- **Auth**: Public.

- **Successful response** `200`:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6600...",
      "userId": "65f0...",
      "title": "Post 1",
      "status": "published"
    },
    {
      "_id": "6601...",
      "userId": "65f0...",
      "title": "Post 2",
      "status": "published"
    }
  ]
}
```

Use this for user profile pages like “All posts by this user”.



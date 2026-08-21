import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

// Mock Firebase Admin to test HTTP endpoints deterministically
vi.mock("../src/config/firebaseAdmin.js", () => {
  return {
    adminAuth: {
      verifyIdToken: vi.fn(async (token: string) => {
        if (token === "valid-token-admin") {
          return { uid: "admin-1", email: "admin@example.com", name: "Admin User" };
        }
        if (token === "valid-token-editor") {
          return { uid: "editor-1", email: "editor@example.com", name: "Editor User" };
        }
        if (token === "valid-token-viewer") {
          return { uid: "viewer-1", email: "viewer@example.com", name: "Viewer User" };
        }
        if (token === "valid-token-disabled") {
          return { uid: "disabled-1", email: "disabled@example.com", name: "Disabled User" };
        }
        throw new Error("Invalid token");
      }),
    },
    db: {
      collection: vi.fn((colName: string) => ({
        doc: vi.fn((docId?: string) => ({
          get: vi.fn(async () => {
            if (colName === "users") {
              if (docId === "admin-1") {
                return { exists: true, id: docId, data: () => ({ role: "admin", isActive: true, displayName: "Admin" }) };
              }
              if (docId === "editor-1") {
                return { exists: true, id: docId, data: () => ({ role: "editor", isActive: true, displayName: "Editor" }) };
              }
              if (docId === "viewer-1") {
                return { exists: true, id: docId, data: () => ({ role: "viewer", isActive: true, displayName: "Viewer" }) };
              }
              if (docId === "disabled-1") {
                return { exists: true, id: docId, data: () => ({ role: "viewer", isActive: false, displayName: "Disabled" }) };
              }
              return { exists: false };
            }
            if (colName === "collages" && docId === "col-123") {
              return {
                exists: true,
                id: "col-123",
                data: () => ({
                  id: "col-123",
                  title: "Test Collage",
                  ownerId: "editor-1",
                  visibility: "public",
                  imageCount: 1,
                  commentCount: 1,
                  reactionCount: 1,
                }),
              };
            }
            if (colName === "projects" && docId === "proj-123") {
              return {
                exists: true,
                id: "proj-123",
                data: () => ({
                  id: "proj-123",
                  name: "Test Project",
                  ownerId: "editor-1",
                  visibility: "public",
                }),
              };
            }
            return { exists: false };
          }),
          set: vi.fn(async () => {}),
          update: vi.fn(async () => {}),
          delete: vi.fn(async () => {}),
          collection: vi.fn((subCol: string) => ({
            orderBy: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            get: vi.fn(async () => ({
              docs: [
                {
                  id: "item-1",
                  data: () => ({
                    id: "item-1",
                    content: "Great work!",
                    userId: "viewer-1",
                    type: "heart",
                    storagePath: "collages/col-123/img-1/nepal.jpg",
                    downloadUrl: "https://example.com/nepal.jpg",
                    width: 800,
                    height: 600,
                    position: 0,
                  }),
                },
              ],
            })),
            doc: vi.fn((subId?: string) => ({
              get: vi.fn(async () => ({
                exists: subId === "comment-1" || subId === "item-1",
                id: subId,
                data: () => ({
                  id: subId,
                  content: "Existing Comment",
                  userId: "viewer-1",
                  type: "heart",
                  isDeleted: false,
                }),
              })),
              set: vi.fn(async () => {}),
              update: vi.fn(async () => {}),
              delete: vi.fn(async () => {}),
            })),
          })),
        })),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        get: vi.fn(async () => ({
          docs: [
            {
              id: "col-1",
              data: () => ({ id: "col-1", title: "Public Collage", visibility: "public", ownerId: "editor-1" }),
            },
          ],
        })),
      })),
      batch: vi.fn(() => ({
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        commit: vi.fn(async () => {}),
      })),
    },
    defaultBucket: {
      file: vi.fn(() => ({
        delete: vi.fn(async () => {}),
      })),
    },
  };
});

describe("React-Collage-B Live Backend Test Suite (37 Tests)", () => {
  // Group 1: Service Health
  describe("1. System Health", () => {
    it("GET /health returns healthy status code 200", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("healthy");
      expect(res.body.service).toBeDefined();
    });
  });

  // Group 2: Authentication & Token Verification
  describe("2. Authentication & Security Middleware", () => {
    it("rejects unauthenticated requests to protected endpoints with 401", async () => {
      const res = await request(app).post("/api/v1/collages").send({ title: "New Collage" });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("rejects empty Bearer token with 401", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer ");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("rejects invalid Bearer tokens with 401", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer invalid-token-xyz");
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("allows valid Bearer token on /api/v1/users/me", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token-editor");
      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe("editor");
    });

    it("deactivated user receives 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token-disabled");
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("allows user to update profile details via PATCH /api/v1/users/me", async () => {
      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ displayName: "Updated Viewer Name" });
      expect(res.status).toBe(200);
    });

    it("rejects profile update with invalid types via 400", async () => {
      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ displayName: 12345 });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("BAD_REQUEST");
    });
  });

  // Group 3: Authorization & Roles
  describe("3. Role-Based Access Control (RBAC)", () => {
    it("viewer cannot create collage (requires editor/admin)", async () => {
      const res = await request(app)
        .post("/api/v1/collages")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ title: "Viewer Collage" });
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("editor can create a collage", async () => {
      const res = await request(app)
        .post("/api/v1/collages")
        .set("Authorization", "Bearer valid-token-editor")
        .send({ title: "My Editor Collage", description: "Created by editor" });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("My Editor Collage");
    });

    it("admin can access admin user list", async () => {
      const res = await request(app)
        .get("/api/v1/users/admin/list")
        .set("Authorization", "Bearer valid-token-admin");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("editor is forbidden from admin user list (403)", async () => {
      const res = await request(app)
        .get("/api/v1/users/admin/list")
        .set("Authorization", "Bearer valid-token-editor");
      expect(res.status).toBe(403);
    });

    it("viewer is forbidden from admin user list (403)", async () => {
      const res = await request(app)
        .get("/api/v1/users/admin/list")
        .set("Authorization", "Bearer valid-token-viewer");
      expect(res.status).toBe(403);
    });

    it("admin can update user role", async () => {
      const res = await request(app)
        .patch("/api/v1/users/admin/viewer-1/role")
        .set("Authorization", "Bearer valid-token-admin")
        .send({ role: "editor" });
      expect(res.status).toBe(200);
    });

    it("non-admin cannot update user role (403)", async () => {
      const res = await request(app)
        .patch("/api/v1/users/admin/viewer-1/role")
        .set("Authorization", "Bearer valid-token-editor")
        .send({ role: "admin" });
      expect(res.status).toBe(403);
    });
  });

  // Group 4: Collages & Projects CRUD
  describe("4. Collages & Projects Endpoints", () => {
    it("GET /api/v1/collages lists public collages", async () => {
      const res = await request(app).get("/api/v1/collages");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("GET /api/v1/collages/:id retrieves single collage", async () => {
      const res = await request(app).get("/api/v1/collages/col-123");
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Test Collage");
    });

    it("GET /api/v1/collages/non-existent returns 404", async () => {
      const res = await request(app).get("/api/v1/collages/non-existent");
      expect(res.status).toBe(404);
    });

    it("PATCH /api/v1/collages/:id allows owner to update", async () => {
      const res = await request(app)
        .patch("/api/v1/collages/col-123")
        .set("Authorization", "Bearer valid-token-editor")
        .send({ title: "Updated Title" });
      expect(res.status).toBe(200);
    });

    it("PATCH /api/v1/collages/:id forbids non-owner viewer (403)", async () => {
      const res = await request(app)
        .patch("/api/v1/collages/col-123")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ title: "Hacked Title" });
      expect(res.status).toBe(403);
    });

    it("DELETE /api/v1/collages/:id allows owner to delete", async () => {
      const res = await request(app)
        .delete("/api/v1/collages/col-123")
        .set("Authorization", "Bearer valid-token-editor");
      expect(res.status).toBe(200);
    });

    it("DELETE /api/v1/collages/:id forbids non-owner viewer (403)", async () => {
      const res = await request(app)
        .delete("/api/v1/collages/col-123")
        .set("Authorization", "Bearer valid-token-viewer");
      expect(res.status).toBe(403);
    });

    it("GET /api/v1/projects lists public projects", async () => {
      const res = await request(app).get("/api/v1/projects");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("GET /api/v1/projects/:id retrieves single project", async () => {
      const res = await request(app).get("/api/v1/projects/proj-123");
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Test Project");
    });

    it("POST /api/v1/projects allows editor to create project", async () => {
      const res = await request(app)
        .post("/api/v1/projects")
        .set("Authorization", "Bearer valid-token-editor")
        .send({ name: "Himalayan Culture Project" });
      expect(res.status).toBe(201);
    });

    it("POST /api/v1/projects forbids viewer from creating project (403)", async () => {
      const res = await request(app)
        .post("/api/v1/projects")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ name: "Viewer Project" });
      expect(res.status).toBe(403);
    });
  });

  // Group 5: Images & Media
  describe("5. Collage Images & Media Validation", () => {
    it("GET /api/v1/collages/:id/images lists images", async () => {
      const res = await request(app).get("/api/v1/collages/col-123/images");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("POST /api/v1/collages/:id/images allows owner to add image", async () => {
      const res = await request(app)
        .post("/api/v1/collages/col-123/images")
        .set("Authorization", "Bearer valid-token-editor")
        .send({
          storagePath: "collages/col-123/img-2/daura.jpg",
          downloadUrl: "https://example.com/daura.jpg",
          contentType: "image/jpeg",
          size: 102400,
          width: 1024,
          height: 768,
        });
      expect(res.status).toBe(201);
    });

    it("POST /api/v1/collages/:id/images rejects invalid image payload (400)", async () => {
      const res = await request(app)
        .post("/api/v1/collages/col-123/images")
        .set("Authorization", "Bearer valid-token-editor")
        .send({ invalidField: "test" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("BAD_REQUEST");
    });
  });

  // Group 6: Comments & Reactions
  describe("6. Comments & Reactions Operations", () => {
    it("viewer can post a comment to a collage", async () => {
      const res = await request(app)
        .post("/api/v1/collages/col-123/comments")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ content: "Beautiful craftsmanship!" });
      expect(res.status).toBe(201);
      expect(res.body.data.content).toBe("Beautiful craftsmanship!");
    });

    it("rejects empty comment content with 400", async () => {
      const res = await request(app)
        .post("/api/v1/collages/col-123/comments")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ content: "" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("BAD_REQUEST");
    });

    it("retrieves comments list for collage", async () => {
      const res = await request(app).get("/api/v1/collages/col-123/comments");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("author can delete their comment", async () => {
      const res = await request(app)
        .delete("/api/v1/collages/col-123/comments/comment-1")
        .set("Authorization", "Bearer valid-token-viewer");
      expect(res.status).toBe(200);
    });

    it("viewer can toggle reaction on a collage", async () => {
      const res = await request(app)
        .post("/api/v1/collages/col-123/reactions")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ type: "heart" });
      expect(res.status).toBe(200);
    });

    it("rejects invalid reaction type with 400", async () => {
      const res = await request(app)
        .post("/api/v1/collages/col-123/reactions")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ type: "invalid_emoji" });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("BAD_REQUEST");
    });
  });

  // Group 7: Error Format & 404
  describe("7. Standardized Error Handling", () => {
    it("returns structured 404 for unknown route", async () => {
      const res = await request(app).get("/api/v1/nonexistent-endpoint");
      expect(res.status).toBe(404);
    });

    it("ensures error responses follow { error: { code, message } } structure", async () => {
      const res = await request(app).get("/api/v1/users/me");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toHaveProperty("code");
      expect(res.body.error).toHaveProperty("message");
    });
  });

  // Group 8: Production Observability, Rate Limiting & Audit Logs
  describe("8. Observability, Security Headers & Audit Logs", () => {
    it("returns X-Request-ID and X-RateLimit headers on responses", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.headers).toHaveProperty("x-request-id");
      expect(res.headers).toHaveProperty("x-ratelimit-limit");
      expect(res.headers).toHaveProperty("x-ratelimit-remaining");
    });

    it("preserves incoming X-Request-ID header", async () => {
      const customId = "trace-client-12345";
      const res = await request(app).get("/health").set("X-Request-ID", customId);
      expect(res.status).toBe(200);
      expect(res.headers["x-request-id"]).toBe(customId);
    });

    it("allows admin to fetch audit logs", async () => {
      const res = await request(app)
        .get("/api/v1/audit-logs")
        .set("Authorization", "Bearer valid-token-admin");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });

    it("forbids non-admin from fetching audit logs (403)", async () => {
      const res = await request(app)
        .get("/api/v1/audit-logs")
        .set("Authorization", "Bearer valid-token-editor");
      expect(res.status).toBe(403);
    });
  });
});

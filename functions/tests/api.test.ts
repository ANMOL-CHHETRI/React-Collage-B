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
                  imageCount: 0,
                  commentCount: 0,
                  reactionCount: 0,
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
                    type: "like",
                    position: 0,
                  }),
                },
              ],
            })),
            doc: vi.fn((subId?: string) => ({
              get: vi.fn(async () => ({
                exists: subId === "comment-1",
                id: subId,
                data: () => ({
                  id: "comment-1",
                  content: "Existing Comment",
                  userId: "viewer-1",
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

describe("Express API & Cloud Functions Suite", () => {
  it("GET /health returns healthy status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
  });

  describe("Authentication & User Profile", () => {
    it("rejects unauthenticated requests to protected endpoints with 401", async () => {
      const res = await request(app).post("/api/v1/collages").send({ title: "New Collage" });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("rejects invalid Bearer tokens with 401", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer invalid-token");
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
  });

  describe("Authorization & Roles", () => {
    it("viewer role cannot create collage (requires editor/admin)", async () => {
      const res = await request(app)
        .post("/api/v1/collages")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ title: "Viewer Collage" });
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("editor role can create a collage", async () => {
      const res = await request(app)
        .post("/api/v1/collages")
        .set("Authorization", "Bearer valid-token-editor")
        .send({ title: "My Special Collage", description: "Memories" });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("My Special Collage");
    });

    it("admin can access admin user list", async () => {
      const res = await request(app)
        .get("/api/v1/users/admin/list")
        .set("Authorization", "Bearer valid-token-admin");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("non-admin cannot access admin user list", async () => {
      const res = await request(app)
        .get("/api/v1/users/admin/list")
        .set("Authorization", "Bearer valid-token-editor");
      expect(res.status).toBe(403);
    });
  });

  describe("Collages & Projects", () => {
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

    it("GET /api/v1/projects lists public projects", async () => {
      const res = await request(app).get("/api/v1/projects");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Comments & Reactions", () => {
    it("viewer can post a comment to a collage", async () => {
      const res = await request(app)
        .post("/api/v1/collages/col-123/comments")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ content: "This is a wonderful collage!" });
      expect(res.status).toBe(201);
      expect(res.body.data.content).toBe("This is a wonderful collage!");
    });

    it("viewer can toggle a reaction on a collage", async () => {
      const res = await request(app)
        .post("/api/v1/collages/col-123/reactions")
        .set("Authorization", "Bearer valid-token-viewer")
        .send({ type: "heart" });
      expect(res.status).toBe(200);
    });

    it("retrieves list of comments for collage", async () => {
      const res = await request(app).get("/api/v1/collages/col-123/comments");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});

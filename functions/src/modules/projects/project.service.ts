import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../config/firebaseAdmin.js";
import { AppError } from "../../utils/errors.js";
import { CreateProjectInput, UpdateProjectInput } from "./project.schema.js";

export interface ProjectDocument {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  status: "active" | "archived";
  visibility: "public" | "private";
  createdAt: any;
  updatedAt: any;
}

export class ProjectService {
  private collection = db.collection("projects");

  async create(ownerId: string, data: CreateProjectInput): Promise<ProjectDocument> {
    const docRef = this.collection.doc();
    const project: ProjectDocument = {
      id: docRef.id,
      ownerId,
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await docRef.set(project);
    return project;
  }

  async list(currentUserId?: string, limit = 20) {
    let query = this.collection.where("visibility", "==", "public");
    const snap = await query.limit(limit).get();
    return snap.docs.map((d) => ({ ...(d.data() as any), id: d.id }));
  }

  async getById(projectId: string, currentUserId?: string, role?: string): Promise<ProjectDocument> {
    const doc = await this.collection.doc(projectId).get();
    if (!doc.exists) {
      throw AppError.notFound("Project not found");
    }
    const data = doc.data()!;
    if (data.visibility === "private" && data.ownerId !== currentUserId && role !== "admin") {
      throw AppError.forbidden("Access to private project denied");
    }
    return { ...(data as any), id: doc.id };
  }

  async update(projectId: string, currentUserId: string, role: string, data: UpdateProjectInput) {
    const project = await this.getById(projectId, currentUserId, role);
    if (project.ownerId !== currentUserId && role !== "admin") {
      throw AppError.forbidden("You cannot modify another user's project");
    }

    const updates = {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    };
    await this.collection.doc(projectId).update(updates);
    return this.getById(projectId, currentUserId, role);
  }

  async delete(projectId: string, currentUserId: string, role: string) {
    const project = await this.getById(projectId, currentUserId, role);
    if (project.ownerId !== currentUserId && role !== "admin") {
      throw AppError.forbidden("You cannot delete another user's project");
    }
    await this.collection.doc(projectId).delete();
    return { success: true };
  }
}

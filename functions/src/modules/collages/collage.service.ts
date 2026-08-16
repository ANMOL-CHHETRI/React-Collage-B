import { FieldValue } from "firebase-admin/firestore";
import { db, defaultBucket } from "../../config/firebaseAdmin.js";
import { AppError } from "../../utils/errors.js";
import { CreateCollageInput, UpdateCollageInput, ListCollagesQueryInput } from "./collage.schema.js";

export interface CollageDocument {
  id: string;
  ownerId: string;
  projectId?: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  coverImageUrl?: string;
  imageCount: number;
  commentCount: number;
  reactionCount: number;
  createdAt: any;
  updatedAt: any;
}

export class CollageService {
  private collection = db.collection("collages");

  async create(ownerId: string, data: CreateCollageInput): Promise<CollageDocument> {
    const docRef = this.collection.doc();
    const collage: CollageDocument = {
      id: docRef.id,
      ownerId,
      ...data,
      imageCount: 0,
      commentCount: 0,
      reactionCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await docRef.set(collage);
    return collage;
  }

  async list(currentUserId?: string, queryParams: ListCollagesQueryInput = { limit: 20 }) {
    const { limit, cursor, visibility, ownerId, projectId } = queryParams;

    let query: FirebaseFirestore.Query = this.collection;

    if (ownerId) {
      query = query.where("ownerId", "==", ownerId);
      if (ownerId !== currentUserId) {
        query = query.where("visibility", "==", "public");
      }
    } else if (visibility) {
      if (visibility === "private") {
        if (!currentUserId) {
          return { data: [], pagination: { limit, nextCursor: null, hasMore: false } };
        }
        query = query.where("ownerId", "==", currentUserId).where("visibility", "==", "private");
      } else {
        query = query.where("visibility", "==", "public");
      }
    } else {
      query = query.where("visibility", "==", "public");
    }

    if (projectId) {
      query = query.where("projectId", "==", projectId);
    }

    query = query.orderBy("createdAt", "desc");

    if (cursor) {
      const cursorDoc = await this.collection.doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snap = await query.limit(limit + 1).get();
    const hasMore = snap.docs.length > limit;
    const docs = hasMore ? snap.docs.slice(0, limit) : snap.docs;
    const nextCursor = hasMore && docs.length > 0 ? docs[docs.length - 1].id : null;

    const data = docs.map((doc) => ({ ...(doc.data() as any), id: doc.id }));

    return {
      data,
      pagination: {
        limit,
        nextCursor,
        hasMore,
      },
    };
  }

  async getById(collageId: string, currentUserId?: string, role?: string): Promise<CollageDocument> {
    const doc = await this.collection.doc(collageId).get();
    if (!doc.exists) {
      throw AppError.notFound("Collage not found");
    }

    const data = doc.data()!;
    if (data.visibility === "private" && data.ownerId !== currentUserId && role !== "admin") {
      throw AppError.forbidden("Access to private collage denied");
    }

    return { ...(data as any), id: doc.id };
  }

  async update(collageId: string, currentUserId: string, role: string, data: UpdateCollageInput) {
    const collage = await this.getById(collageId, currentUserId, role);

    if (collage.ownerId !== currentUserId && role !== "admin") {
      throw AppError.forbidden("You cannot modify another user's collage");
    }

    const updates = {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await this.collection.doc(collageId).update(updates);
    return this.getById(collageId, currentUserId, role);
  }

  async delete(collageId: string, currentUserId: string, role: string) {
    const collage = await this.getById(collageId, currentUserId, role);

    if (collage.ownerId !== currentUserId && role !== "admin") {
      throw AppError.forbidden("You cannot delete another user's collage");
    }

    const collageRef = this.collection.doc(collageId);

    const imagesSnap = await collageRef.collection("images").get();
    const deleteBatch = db.batch();

    for (const imageDoc of imagesSnap.docs) {
      deleteBatch.delete(imageDoc.ref);
      const imgData = imageDoc.data();
      if (imgData.storagePath) {
        try {
          await defaultBucket.file(imgData.storagePath).delete({ ignoreNotFound: true });
        } catch (e) {
          console.warn(`[Storage Cleanup Warning] Failed to delete file: ${imgData.storagePath}`, e);
        }
      }
    }

    const commentsSnap = await collageRef.collection("comments").get();
    for (const commentDoc of commentsSnap.docs) {
      deleteBatch.delete(commentDoc.ref);
    }

    const reactionsSnap = await collageRef.collection("reactions").get();
    for (const reactionDoc of reactionsSnap.docs) {
      deleteBatch.delete(reactionDoc.ref);
    }

    deleteBatch.delete(collageRef);

    await deleteBatch.commit();
    return { success: true };
  }
}

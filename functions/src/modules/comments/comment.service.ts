import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../config/firebaseAdmin.js";
import { AppError } from "../../utils/errors.js";
import { CreateCommentInput, UpdateCommentInput } from "./comment.schema.js";

export class CommentService {
  private getCommentsCollection(collageId: string) {
    return db.collection("collages").doc(collageId).collection("comments");
  }

  async list(collageId: string) {
    const collageSnap = await db.collection("collages").doc(collageId).get();
    if (!collageSnap.exists) throw AppError.notFound("Collage not found");

    const snap = await this.getCommentsCollection(collageId).orderBy("createdAt", "asc").get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async create(collageId: string, user: { uid: string; displayName?: string; photoURL?: string }, data: CreateCommentInput) {
    const collageRef = db.collection("collages").doc(collageId);
    const collageSnap = await collageRef.get();
    if (!collageSnap.exists) throw AppError.notFound("Collage not found");

    const commentRef = this.getCommentsCollection(collageId).doc();
    const comment = {
      id: commentRef.id,
      userId: user.uid,
      userDisplayName: user.displayName || "Anonymous",
      userPhotoURL: user.photoURL || null,
      content: data.content,
      isDeleted: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const batch = db.batch();
    batch.set(commentRef, comment);
    batch.update(collageRef, {
      commentCount: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    return comment;
  }

  async update(collageId: string, commentId: string, userId: string, role: string, data: UpdateCommentInput) {
    const commentRef = this.getCommentsCollection(collageId).doc(commentId);
    const commentSnap = await commentRef.get();
    if (!commentSnap.exists) throw AppError.notFound("Comment not found");

    const comment = commentSnap.data()!;
    if (comment.userId !== userId && role !== "admin") {
      throw AppError.forbidden("You cannot edit another user's comment");
    }

    if (comment.isDeleted) {
      throw AppError.badRequest("Cannot edit a deleted comment");
    }

    const updates = {
      content: data.content,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await commentRef.update(updates);
    return { ...comment, ...updates };
  }

  async delete(collageId: string, commentId: string, userId: string, role: string) {
    const collageRef = db.collection("collages").doc(collageId);
    const commentRef = this.getCommentsCollection(collageId).doc(commentId);
    const commentSnap = await commentRef.get();
    if (!commentSnap.exists) throw AppError.notFound("Comment not found");

    const comment = commentSnap.data()!;
    if (comment.userId !== userId && role !== "admin") {
      throw AppError.forbidden("You cannot delete another user's comment");
    }

    const batch = db.batch();
    // Soft delete comment
    batch.update(commentRef, {
      isDeleted: true,
      content: "[Comment deleted by author or moderator]",
      updatedAt: FieldValue.serverTimestamp(),
    });
    batch.update(collageRef, {
      commentCount: FieldValue.increment(-1),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    return { success: true };
  }
}

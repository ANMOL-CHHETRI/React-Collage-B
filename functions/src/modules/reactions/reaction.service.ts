import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../config/firebaseAdmin.js";
import { AppError } from "../../utils/errors.js";
import { ToggleReactionInput } from "./reaction.schema.js";

export class ReactionService {
  private getReactionsCollection(collageId: string) {
    return db.collection("collages").doc(collageId).collection("reactions");
  }

  async list(collageId: string) {
    const snap = await this.getReactionsCollection(collageId).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async toggleReaction(collageId: string, userId: string, data: ToggleReactionInput) {
    const collageRef = db.collection("collages").doc(collageId);
    const collageSnap = await collageRef.get();
    if (!collageSnap.exists) throw AppError.notFound("Collage not found");

    const reactionRef = this.getReactionsCollection(collageId).doc(userId);
    const existingSnap = await reactionRef.get();

    const batch = db.batch();

    // If reaction exists and matches requested type: toggle off (remove)
    if (existingSnap.exists && existingSnap.data()?.type === data.type) {
      batch.delete(reactionRef);
      batch.update(collageRef, {
        reactionCount: FieldValue.increment(-1),
        updatedAt: FieldValue.serverTimestamp(),
      });
      await batch.commit();
      return { reacted: false, type: null };
    }

    // If reaction exists but different type: update type
    if (existingSnap.exists) {
      batch.update(reactionRef, {
        type: data.type,
        updatedAt: FieldValue.serverTimestamp(),
      });
      await batch.commit();
      return { reacted: true, type: data.type };
    }

    // Otherwise create new reaction
    batch.set(reactionRef, {
      id: userId,
      userId,
      type: data.type,
      createdAt: FieldValue.serverTimestamp(),
    });
    batch.update(collageRef, {
      reactionCount: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    return { reacted: true, type: data.type };
  }

  async removeReaction(collageId: string, userId: string) {
    const collageRef = db.collection("collages").doc(collageId);
    const reactionRef = this.getReactionsCollection(collageId).doc(userId);
    const existingSnap = await reactionRef.get();

    if (!existingSnap.exists) {
      return { success: true, removed: false };
    }

    const batch = db.batch();
    batch.delete(reactionRef);
    batch.update(collageRef, {
      reactionCount: FieldValue.increment(-1),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    return { success: true, removed: true };
  }
}

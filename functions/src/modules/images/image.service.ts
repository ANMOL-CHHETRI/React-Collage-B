import { FieldValue } from "firebase-admin/firestore";
import { db, defaultBucket } from "../../config/firebaseAdmin.js";
import { AppError } from "../../utils/errors.js";
import { RegisterImageInput, UpdateImagePositionInput } from "./image.schema.js";

export class ImageService {
  private getImagesCollection(collageId: string) {
    return db.collection("collages").doc(collageId).collection("images");
  }

  async list(collageId: string) {
    const collageDoc = await db.collection("collages").doc(collageId).get();
    if (!collageDoc.exists) {
      throw AppError.notFound("Collage not found");
    }

    const snap = await this.getImagesCollection(collageId).orderBy("position", "asc").get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async registerImage(collageId: string, userId: string, role: string, data: RegisterImageInput) {
    const collageRef = db.collection("collages").doc(collageId);
    const collageSnap = await collageRef.get();

    if (!collageSnap.exists) {
      throw AppError.notFound("Collage not found");
    }

    const collage = collageSnap.data()!;
    if (collage.ownerId !== userId && role !== "admin") {
      throw AppError.forbidden("You cannot upload images to this collage");
    }

    // Verify storage path begins with collages/{collageId}
    if (!data.storagePath.startsWith(`collages/${collageId}/`)) {
      throw AppError.badRequest("Invalid storage path: must reside in collage folder");
    }

    const imageRef = this.getImagesCollection(collageId).doc();
    const imageDoc = {
      id: imageRef.id,
      ...data,
      uploadedBy: userId,
      createdAt: FieldValue.serverTimestamp(),
    };

    const batch = db.batch();
    batch.set(imageRef, imageDoc);

    const collageUpdates: Record<string, any> = {
      imageCount: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Auto-set cover image if not set yet
    if (!collage.coverImageUrl) {
      collageUpdates.coverImageUrl = data.downloadUrl;
    }

    batch.update(collageRef, collageUpdates);
    await batch.commit();

    return imageDoc;
  }

  async updatePosition(collageId: string, imageId: string, userId: string, role: string, data: UpdateImagePositionInput) {
    const collageSnap = await db.collection("collages").doc(collageId).get();
    if (!collageSnap.exists) throw AppError.notFound("Collage not found");
    if (collageSnap.data()!.ownerId !== userId && role !== "admin") {
      throw AppError.forbidden("You cannot modify images in this collage");
    }

    const imageRef = this.getImagesCollection(collageId).doc(imageId);
    const imageSnap = await imageRef.get();
    if (!imageSnap.exists) throw AppError.notFound("Image not found");

    await imageRef.update({ position: data.position });
    return { id: imageId, ...imageSnap.data(), position: data.position };
  }

  async delete(collageId: string, imageId: string, userId: string, role: string) {
    const collageRef = db.collection("collages").doc(collageId);
    const collageSnap = await collageRef.get();

    if (!collageSnap.exists) throw AppError.notFound("Collage not found");
    if (collageSnap.data()!.ownerId !== userId && role !== "admin") {
      throw AppError.forbidden("You cannot delete images from this collage");
    }

    const imageRef = this.getImagesCollection(collageId).doc(imageId);
    const imageSnap = await imageRef.get();
    if (!imageSnap.exists) throw AppError.notFound("Image not found");

    const imgData = imageSnap.data()!;

    // 1. Delete Storage object
    if (imgData.storagePath) {
      try {
        await defaultBucket.file(imgData.storagePath).delete({ ignoreNotFound: true });
      } catch (e) {
        console.warn(`[Storage Warning] Failed to delete file: ${imgData.storagePath}`, e);
      }
    }

    // 2. Delete Firestore doc & decrement imageCount
    const batch = db.batch();
    batch.delete(imageRef);
    batch.update(collageRef, {
      imageCount: FieldValue.increment(-1),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    return { success: true };
  }
}

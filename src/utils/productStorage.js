/**
 * ShopEase Nepal — Firebase Storage Product Image Service
 * 
 * Handles authenticated, collision-safe product image uploads to Firebase Storage
 * with automatic client-side compression, progress tracking, download URL extraction,
 * and safe rollback capabilities.
 */

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { compressProductImage } from "./imageCompression";

/**
 * Generates a collision-safe, deterministic storage path for a product image.
 * @param {string} productId - Product ID or temporary staging ID
 * @param {string} [extension="webp"] - File extension
 * @returns {string} Safe storage path (e.g. `products/prod_123/1787465000_a1b2c3d4.webp`)
 */
export function generateProductStoragePath(productId = "catalog", extension = "webp") {
  const cleanId = String(productId || "catalog").replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const cleanExt = extension.replace(/^\./, "") || "webp";
  return `products/${cleanId}/${timestamp}_${randomSuffix}.${cleanExt}`;
}

/**
 * Compresses an image file on the client and uploads it to Firebase Storage.
 * 
 * @param {File|Blob} file - The original user-selected file
 * @param {object} [options]
 * @param {string} [options.productId="catalog"] - Target product ID
 * @param {function} [options.onProgress] - Callback (progressPercent, stage: 'compressing'|'uploading'|'done')
 * @returns {Promise<{
 *   downloadUrl: string,
 *   storagePath: string,
 *   compressionStats: object
 * }>}
 */
export async function uploadProductImageToStorage(file, options = {}) {
  const { productId = "catalog", onProgress } = options;

  if (typeof onProgress === "function") {
    onProgress(10, "compressing");
  }

  // 1. Run adaptive client-side compression
  const compressionResult = await compressProductImage(file, {
    maxDimension: 2048,
    targetSizeBytes: 1024 * 1024, // 1 MB target
  });

  if (typeof onProgress === "function") {
    onProgress(35, "uploading");
  }

  // 2. If storage is not initialized (e.g. mock or local environment without storage bucket)
  if (!storage) {
    console.warn("[productStorage] Firebase Storage is not initialized, falling back to local Object URL.");
    const fallbackUrl = URL.createObjectURL(compressionResult.blob);
    if (typeof onProgress === "function") {
      onProgress(100, "done");
    }
    return {
      downloadUrl: fallbackUrl,
      storagePath: `local/${file.name}`,
      compressionStats: compressionResult,
    };
  }

  // 3. Prepare storage reference
  const ext = compressionResult.format === "image/webp" ? "webp" : compressionResult.format === "image/png" ? "png" : "jpg";
  const storagePath = generateProductStoragePath(productId, ext);
  const storageRef = ref(storage, storagePath);

  const metadata = {
    contentType: compressionResult.format,
    cacheControl: "public, max-age=31536000, immutable",
    customMetadata: {
      originalSize: String(compressionResult.originalSize),
      compressedSize: String(compressionResult.compressedSize),
      compressionRatio: compressionResult.compressionRatio,
      dimensions: `${compressionResult.compressedDimensions.width}x${compressionResult.compressedDimensions.height}`,
      uploadedAt: new Date().toISOString(),
    },
  };

  // 4. Upload with progress tracking
  const uploadTask = uploadBytesResumable(storageRef, compressionResult.blob, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.totalBytes > 0 
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 65) + 35
          : 50;
        if (typeof onProgress === "function") {
          onProgress(Math.min(progress, 95), "uploading");
        }
      },
      (error) => {
        console.error("[productStorage] Upload error:", error);
        reject(new Error(error.message || "Failed to upload image to Firebase Storage."));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (typeof onProgress === "function") {
            onProgress(100, "done");
          }
          resolve({
            downloadUrl,
            storagePath,
            compressionStats: compressionResult,
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Safely deletes an image from Firebase Storage by URL or storage path (e.g. for rollbacks).
 * @param {string} storageUrlOrPath
 */
export async function deleteProductImageFromStorage(storageUrlOrPath) {
  if (!storage || !storageUrlOrPath) return false;

  try {
    let storageRef;
    if (storageUrlOrPath.startsWith("gs://") || storageUrlOrPath.startsWith("https://")) {
      // Direct URL reference
      storageRef = ref(storage, storageUrlOrPath);
    } else {
      // Path reference
      storageRef = ref(storage, storageUrlOrPath);
    }
    await deleteObject(storageRef);
    return true;
  } catch (err) {
    console.warn("[productStorage] Could not delete storage object (may have already been removed):", err.message);
    return false;
  }
}

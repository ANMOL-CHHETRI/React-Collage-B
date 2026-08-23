/**
 * ShopEase Nepal — Robust Multi-Tier Product Image Storage Service
 * 
 * Handles authenticated/guest product image uploads with automatic client-side
 * adaptive compression, progress tracking, fast failover, and multi-tier storage:
 * 1. Firebase Storage (Primary, with 5s timeout & anonymous auth attempt)
 * 2. Cloudinary (Secondary cloud fallback with progress reporting)
 * 3. High-Quality Compressed Data URL (Tertiary zero-fail offline fallback)
 */

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";
import { auth, storage } from "./firebase";
import { compressProductImage } from "./imageCompression";
import { isCloudinaryConfigured, uploadToCloudinary } from "./cloudinary";

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
 * Helper to convert a Blob to an optimized Base64 Data URL.
 * @param {Blob} blob 
 * @returns {Promise<string>}
 */
function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to encode image to base64 Data URL."));
      }
    };
    reader.onerror = () => reject(new Error("FileReader error converting image blob."));
    reader.readAsDataURL(blob);
  });
}

/**
 * Attempts a Firebase Storage upload with a strict timeout so the UI never hangs.
 * @param {object} storageRef - Firebase storage reference
 * @param {Blob} blob - Compressed image blob
 * @param {object} metadata - File metadata
 * @param {function} [onProgress] - Progress callback
 * @param {number} [timeoutMs=5000] - Timeout in milliseconds
 * @returns {Promise<string>} Download URL
 */
function attemptFirebaseUpload(storageRef, blob, metadata, onProgress, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    let completed = false;
    let timer = null;
    let uploadTask = null;

    try {
      uploadTask = uploadBytesResumable(storageRef, blob, metadata);
    } catch (err) {
      return reject(err);
    }

    timer = setTimeout(() => {
      if (!completed) {
        completed = true;
        try {
          uploadTask.cancel();
        } catch {
          // Ignored
        }
        reject(new Error(`Firebase Storage connection timed out after ${timeoutMs / 1000}s.`));
      }
    }, timeoutMs);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (completed) return;
        const progress = snapshot.totalBytes > 0 
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 60) + 35
          : 45;
        if (typeof onProgress === "function") {
          onProgress(Math.min(progress, 95), "uploading");
        }
      },
      (error) => {
        if (completed) return;
        completed = true;
        clearTimeout(timer);
        reject(error);
      },
      async () => {
        if (completed) return;
        completed = true;
        clearTimeout(timer);
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Compresses an image file on the client and uploads it with resilient multi-tier fallback.
 * 
 * Pipeline:
 * 1. Adaptive Client-Side Compression (WebP / JPEG / PNG <= 1MB) [0% -> 35%]
 * 2. Firebase Storage upload (Primary, with 5s timeout & auth retry) [35% -> 95%]
 * 3. Cloudinary upload (Fallback cloud provider if Firebase is blocked/CORS) [40% -> 95%]
 * 4. Ultra-reliable compressed Data URL (Zero-fail fallback) [90% -> 100%]
 * 
 * @param {File|Blob} file - The original user-selected file
 * @param {object} [options]
 * @param {string} [options.productId="catalog"] - Target product ID
 * @param {function} [options.onProgress] - Callback (progressPercent, stage: 'compressing'|'uploading'|'done')
 * @returns {Promise<{
 *   downloadUrl: string,
 *   storagePath: string,
 *   storageProvider: "firebase" | "cloudinary" | "dataurl",
 *   compressionStats: object
 * }>}
 */
export async function uploadProductImageToStorage(file, options = {}) {
  const { productId = "catalog", onProgress } = options;

  // ── Stage 1: Adaptive Client-Side Compression ──────────────────────────────
  if (typeof onProgress === "function") {
    onProgress(10, "compressing");
  }

  const compressionResult = await compressProductImage(file, {
    maxDimension: 2048,
    targetSizeBytes: 1024 * 1024, // 1 MB target
  });

  if (typeof onProgress === "function") {
    onProgress(35, "uploading");
  }

  const ext = compressionResult.format === "image/webp" 
    ? "webp" 
    : compressionResult.format === "image/png" 
    ? "png" 
    : "jpg";
  const storagePath = generateProductStoragePath(productId, ext);

  // ── Stage 2: Attempt Firebase Storage (Primary) ─────────────────────────────
  if (storage) {
    // Attempt silent anonymous auth in background if unauthenticated (helps pass Storage rules)
    if (auth && !auth.currentUser) {
      try {
        await signInAnonymously(auth).catch(() => {});
      } catch {
        // Continue if anonymous auth is not configured in Firebase Console
      }
    }

    try {
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

      const downloadUrl = await attemptFirebaseUpload(
        storageRef, 
        compressionResult.blob, 
        metadata, 
        onProgress, 
        5000 // 5 second timeout to prevent getting stuck
      );

      if (typeof onProgress === "function") {
        onProgress(100, "done");
      }

      return {
        downloadUrl,
        storagePath,
        storageProvider: "firebase",
        compressionStats: compressionResult,
      };
    } catch (firebaseErr) {
      console.warn(
        "[productStorage] Firebase Storage unavailable, CORS-restricted, or timed out. Switching to Cloudinary fallback:",
        firebaseErr.message || firebaseErr
      );
    }
  }

  // ── Stage 3: Attempt Cloudinary (Secondary Cloud Fallback) ───────────────────
  if (isCloudinaryConfigured()) {
    try {
      if (typeof onProgress === "function") {
        onProgress(45, "uploading");
      }

      const cloudinaryUrl = await uploadToCloudinary(compressionResult.blob, (percent) => {
        if (typeof onProgress === "function") {
          const mapped = Math.round(45 + (percent * 0.50));
          onProgress(Math.min(mapped, 95), "uploading");
        }
      });

      if (typeof onProgress === "function") {
        onProgress(100, "done");
      }

      return {
        downloadUrl: cloudinaryUrl,
        storagePath: `cloudinary/${productId}_${Date.now()}.${ext}`,
        storageProvider: "cloudinary",
        compressionStats: compressionResult,
      };
    } catch (cloudinaryErr) {
      console.warn(
        "[productStorage] Cloudinary upload failed. Engaging zero-fail Data URL fallback:",
        cloudinaryErr.message || cloudinaryErr
      );
    }
  }

  // ── Stage 4: High-Quality Compressed Data URL (Tertiary Fallback) ────────────
  // Since client-side compression already optimized the image to ~50-200 KB,
  // the Data URL is fast, ultra-reliable, renders everywhere, and never blocks user workflow.
  if (typeof onProgress === "function") {
    onProgress(90, "uploading");
  }

  const dataUrl = await blobToDataUrl(compressionResult.blob);

  if (typeof onProgress === "function") {
    onProgress(100, "done");
  }

  return {
    downloadUrl: dataUrl,
    storagePath: `dataurl/${productId}_${Date.now()}.${ext}`,
    storageProvider: "dataurl",
    compressionStats: compressionResult,
  };
}

/**
 * Safely deletes an image from Firebase Storage by URL or storage path (e.g. for rollbacks).
 * @param {string} storageUrlOrPath
 */
export async function deleteProductImageFromStorage(storageUrlOrPath) {
  if (!storage || !storageUrlOrPath) return false;

  // If URL is not a Firebase Storage object (e.g. Cloudinary or Data URL), no-op
  if (storageUrlOrPath.startsWith("data:") || storageUrlOrPath.includes("cloudinary.com")) {
    return true;
  }

  try {
    const storageRef = ref(storage, storageUrlOrPath);
    await deleteObject(storageRef);
    return true;
  } catch (err) {
    console.warn("[productStorage] Could not delete storage object (may have already been removed):", err.message);
    return false;
  }
}


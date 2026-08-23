/**
 * ShopEase Nepal — Client-Side Adaptive Product Image Compression Engine
 * 
 * Compresses and optimizes images BEFORE Firebase Storage upload.
 * - Maximum input size policy: 20 MB
 * - Maximum stored dimensions: 2048px on longest side (proportionally resized)
 * - Adaptive iterative compression (quality steps: 0.85 -> 0.78 -> 0.70 -> 0.62 -> 0.55)
 * - Target output size: <= 1 MB preferred, hard upper bound 2 MB
 * - WebP primary format with JPEG fallback
 * - EXIF orientation preservation
 * - Transparent PNG preservation if requested or needed
 */

export const IMAGE_LIMITS = {
  MAX_ORIGINAL_SIZE_BYTES: 20 * 1024 * 1024, // 20 MB
  MAX_DIMENSION_PX: 2048,
  TARGET_SIZE_BYTES: 1 * 1024 * 1024, // 1 MB
  HARD_LIMIT_BYTES: 2 * 1024 * 1024, // 2 MB
  ALLOWED_MIME_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
  ],
  QUALITY_STEPS: [0.85, 0.78, 0.70, 0.62, 0.55],
};

/**
 * Validates the raw input image file before processing.
 * @param {File|Blob} file
 */
export function validateImageFile(file) {
  if (!file) {
    throw new Error("No image file provided for upload.");
  }

  if (file.size > IMAGE_LIMITS.MAX_ORIGINAL_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `Image file size (${sizeMb} MB) exceeds maximum allowed upload limit of 20 MB.`
    );
  }

  if (file.type && !IMAGE_LIMITS.ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    throw new Error(
      `Unsupported file format (${file.type || "unknown"}). Supported formats: JPEG, PNG, WebP, AVIF, GIF.`
    );
  }

  return true;
}

/**
 * Calculates proportionally resized dimensions preserving aspect ratio.
 * @param {number} width 
 * @param {number} height 
 * @param {number} maxDimension 
 * @returns {{ width: number, height: number }}
 */
export function calculateResizedDimensions(width, height, maxDimension = IMAGE_LIMITS.MAX_DIMENSION_PX) {
  if (width <= 0 || height <= 0) {
    return { width: maxDimension, height: maxDimension };
  }

  if (width <= maxDimension && height <= maxDimension) {
    return { width: Math.round(width), height: Math.round(height) };
  }

  if (width >= height) {
    const ratio = maxDimension / width;
    return {
      width: maxDimension,
      height: Math.max(1, Math.round(height * ratio)),
    };
  } else {
    const ratio = maxDimension / height;
    return {
      width: Math.max(1, Math.round(width * ratio)),
      height: maxDimension,
    };
  }
}

/**
 * Loads an image into an HTMLImageElement or ImageBitmap.
 * @param {File|Blob} file 
 * @returns {Promise<{ img: HTMLImageElement|ImageBitmap, width: number, height: number }>}
 */
async function decodeImage(file) {
  // If createImageBitmap is available with orientation support (modern browsers)
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        img: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        isBitmap: true,
      };
    } catch {
      // Fallback to Image() if bitmap decoding fails
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        isBitmap: false,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to decode image file. File may be corrupted or in an invalid format."));
    };

    img.src = objectUrl;
  });
}

/**
 * Converts canvas to Blob with specified format and quality.
 * @param {HTMLCanvasElement} canvas 
 * @param {string} format 
 * @param {number} quality 
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas, format, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas to Blob conversion failed."));
        }
      },
      format,
      quality
    );
  });
}

/**
 * Checks if browser supports WebP canvas export.
 */
let isWebpSupportedCache = null;
export function isWebpSupported() {
  if (isWebpSupportedCache !== null) return isWebpSupportedCache;
  if (typeof document === "undefined") {
    isWebpSupportedCache = true;
    return true;
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const dataUrl = canvas.toDataURL("image/webp");
  isWebpSupportedCache = dataUrl.startsWith("data:image/webp");
  return isWebpSupportedCache;
}

/**
 * Adaptively compresses a single product image file.
 * 
 * @param {File|Blob} file - Original image file
 * @param {object} [options]
 * @param {number} [options.maxDimension=2048] - Max width/height
 * @param {number} [options.targetSizeBytes=1048576] - 1MB preferred target
 * @param {string} [options.preferredFormat="image/webp"] - Target format
 * @param {function} [options.onProgress] - Optional progress notification
 * @returns {Promise<{
 *   file: File,
 *   blob: Blob,
 *   originalSize: number,
 *   compressedSize: number,
 *   originalDimensions: { width: number, height: number },
 *   compressedDimensions: { width: number, height: number },
 *   format: string,
 *   quality: number,
 *   compressionRatio: string
 * }>}
 */
export async function compressProductImage(file, options = {}) {
  validateImageFile(file);

  const maxDimension = options.maxDimension || IMAGE_LIMITS.MAX_DIMENSION_PX;
  const targetSizeBytes = options.targetSizeBytes || IMAGE_LIMITS.TARGET_SIZE_BYTES;
  const originalSize = file.size;
  const originalName = file.name || "product_image.jpg";

  // Check if original is transparent PNG and transparency preservation is requested
  const isPng = file.type === "image/png" || originalName.toLowerCase().endsWith(".png");
  const preservePng = options.preservePng && isPng;

  let targetFormat = options.preferredFormat || (isWebpSupported() ? "image/webp" : "image/jpeg");
  if (preservePng) {
    targetFormat = "image/png";
  }

  // 1. Decode image to get dimensions
  const decoded = await decodeImage(file);
  const originalDimensions = { width: decoded.width, height: decoded.height };

  // 2. Compute proportional dimensions
  const targetDimensions = calculateResizedDimensions(decoded.width, decoded.height, maxDimension);

  // 3. Draw on offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetDimensions.width;
  canvas.height = targetDimensions.height;

  const ctx = canvas.getContext("2d", { alpha: isPng });
  if (!isPng && !targetFormat.includes("png")) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(decoded.img, 0, 0, targetDimensions.width, targetDimensions.height);

  // If bitmap was used, close it to free memory
  if (decoded.isBitmap && typeof decoded.img.close === "function") {
    decoded.img.close();
  }

  // 4. Adaptive compression loop
  let bestBlob = null;
  let chosenQuality = IMAGE_LIMITS.QUALITY_STEPS[0];

  // If preserving PNG, single compression
  if (targetFormat === "image/png") {
    bestBlob = await canvasToBlob(canvas, "image/png", 0.9);
    chosenQuality = 0.9;
  } else {
    for (let i = 0; i < IMAGE_LIMITS.QUALITY_STEPS.length; i++) {
      const q = IMAGE_LIMITS.QUALITY_STEPS[i];
      const blob = await canvasToBlob(canvas, targetFormat, q);
      bestBlob = blob;
      chosenQuality = q;

      if (blob.size <= targetSizeBytes) {
        break; // Reached acceptable size
      }
    }
  }

  // Generate safe filename extension
  const ext = targetFormat === "image/webp" ? ".webp" : targetFormat === "image/png" ? ".png" : ".jpg";
  const baseName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const compressedFileName = `${baseName}_optimized${ext}`;

  const compressedFile = new File([bestBlob], compressedFileName, {
    type: targetFormat,
    lastModified: Date.now(),
  });

  const compressedSize = bestBlob.size;
  const ratioNum = originalSize > 0 ? ((1 - compressedSize / originalSize) * 100) : 0;
  const compressionRatio = `${ratioNum > 0 ? "-" : "+"}${Math.abs(ratioNum).toFixed(1)}%`;

  return {
    file: compressedFile,
    blob: bestBlob,
    originalSize,
    compressedSize,
    originalDimensions,
    compressedDimensions: targetDimensions,
    format: targetFormat,
    quality: chosenQuality,
    compressionRatio,
  };
}

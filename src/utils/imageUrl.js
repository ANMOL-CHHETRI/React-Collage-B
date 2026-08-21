/**
 * Canonical Image URL and Asset Resolution Helper for React-Collage-B
 * 
 * Provides deterministic image resolution across:
 * - Firebase Storage download URLs and storage paths
 * - Direct URLs (Pinterest, Cloudinary, CDNs, external https)
 * - Local static assets in /public (with filename typo corrections)
 * - Objects containing { downloadUrl, imageUrl, image, photoURL, coverImage, avatar, storagePath }
 * - Graceful fallback hierarchy with fallback fallbacks
 */

export const DEFAULT_PRODUCT_FALLBACK = "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg";
export const DEFAULT_AVATAR_FALLBACK = "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg";
export const DEFAULT_CATEGORY_FALLBACK = "https://i.pinimg.com/736x/89/47/66/8947664cc2390cac2bdac2b4e9ee030b.jpg";

// Static asset alias mapping to gracefully resolve historical typos in file names
const ASSET_TYPO_MAP = {
  "/pashmina_closeup.png": "/pashima_closeup.png",
  "pashmina_closeup.png": "/pashima_closeup.png",
  "/pashima_closeup.png": "/pashima_closeup.png",
  "pashima_closeup.png": "/pashima_closeup.png"
};

/**
 * Resolves any image source to a valid, clean image URL string.
 * @param {string | object | Array} source - The raw image reference or entity
 * @param {"product" | "avatar" | "category" | string} [fallbackType="product"] - Fallback strategy or custom URL
 * @returns {string} Fully resolved image URL
 */
export function resolveImageUrl(source, fallbackType = "product") {
  if (!source) {
    return getFallbackUrl(fallbackType);
  }

  // 1. If source is an array (e.g. product.images), resolve the first item
  if (Array.isArray(source)) {
    if (source.length === 0) return getFallbackUrl(fallbackType);
    return resolveImageUrl(source[0], fallbackType);
  }

  // 2. If source is an object with image fields
  if (typeof source === "object") {
    const candidate =
      source.downloadUrl ||
      source.downloadURL ||
      source.imageUrl ||
      source.imageURL ||
      source.image ||
      source.photoURL ||
      source.photoUrl ||
      source.coverImageUrl ||
      source.coverImage ||
      source.avatar ||
      (Array.isArray(source.images) && source.images.length > 0 ? source.images[0] : null) ||
      source.url ||
      source.src;

    if (candidate) {
      return resolveImageUrl(candidate, fallbackType);
    }
    return getFallbackUrl(fallbackType);
  }

  // 3. If source is a string URL / path
  if (typeof source === "string") {
    let clean = source.trim();
    if (!clean) return getFallbackUrl(fallbackType);

    // Check typo map first
    if (ASSET_TYPO_MAP[clean]) {
      return ASSET_TYPO_MAP[clean];
    }

    // Base64 data URL
    if (clean.startsWith("data:image/")) {
      return clean;
    }

    // Blob URL
    if (clean.startsWith("blob:")) {
      return clean;
    }

    // Full HTTP / HTTPS URL
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }

    // Root relative path
    if (clean.startsWith("/")) {
      return clean;
    }

    // Relative path without leading slash
    return `/${clean}`;
  }

  return getFallbackUrl(fallbackType);
}

/**
 * Returns the fallback URL for a given type or custom string.
 */
export function getFallbackUrl(fallbackType) {
  if (typeof fallbackType === "string" && fallbackType.startsWith("http")) {
    return fallbackType;
  }
  switch (fallbackType) {
    case "avatar":
      return DEFAULT_AVATAR_FALLBACK;
    case "category":
      return DEFAULT_CATEGORY_FALLBACK;
    case "product":
    default:
      return DEFAULT_PRODUCT_FALLBACK;
  }
}

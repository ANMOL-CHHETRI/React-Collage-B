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

export const DEFAULT_PRODUCT_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Cpath d='M160 140h80v120h-80z' fill='%23cbd5e1'/%3E%3Ccircle cx='180' cy='170' r='15' fill='%2394a3b8'/%3E%3Cpath d='M160 240l30-40 25 30 25-35 20 45z' fill='%2394a3b8'/%3E%3Ctext x='50%25' y='75%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%2364748b'%3ENo Image Available%3C/text%3E%3C/svg%3E";
export const DEFAULT_AVATAR_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e2e8f0'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%2394a3b8'/%3E%3Cpath d='M20 85c0-16.5 13.5-30 30-30s30 13.5 30 30' fill='%2394a3b8'/%3E%3C/svg%3E";
export const DEFAULT_CATEGORY_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='100%25' height='100%25' fill='%23f8fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold' fill='%2364748b'%3ENepal Category%3C/text%3E%3C/svg%3E";

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
 * Resolves the primary canonical image URL for a product entity.
 * Handles product.image, product.images[0], product.imageUrl, product.downloadUrl, etc.
 * @param {object|string} product
 * @returns {string} Fully resolved renderable image URL
 */
export function resolveProductImage(product) {
  if (!product) return DEFAULT_PRODUCT_FALLBACK;
  if (typeof product === "string") return resolveImageUrl(product, "product");
  const raw =
    product.image ||
    (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
    product.imageUrl ||
    product.downloadUrl;
  return resolveImageUrl(raw, "product");
}

/**
 * Resolves an array of canonical image URLs for a product gallery.
 * @param {object} product
 * @returns {string[]} Array of fully resolved image URLs
 */
export function resolveProductImages(product) {
  if (!product) return [DEFAULT_PRODUCT_FALLBACK];
  if (Array.isArray(product.images) && product.images.length > 0) {
    const list = product.images.map((img) => resolveImageUrl(img, "product")).filter(Boolean);
    if (list.length > 0) return list;
  }
  const single = resolveProductImage(product);
  return [single];
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


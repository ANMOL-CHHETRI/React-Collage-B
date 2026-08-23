/**
 * ShopEase Nepal — Cloudinary Image Upload Utility
 * 
 * Provides authenticated/unauthenticated preset-based upload to Cloudinary
 * with progress tracking, timeout protection, and Blob/File support.
 */

export const isCloudinaryConfigured = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  return Boolean(
    cloudName &&
    uploadPreset &&
    cloudName !== "undefined" &&
    uploadPreset !== "undefined" &&
    cloudName.trim() !== "" &&
    uploadPreset.trim() !== ""
  );
};

export const uploadToCloudinary = async (fileOrBlob, onProgress) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET) are missing.");
  }

  const formData = new FormData();
  if (fileOrBlob instanceof File) {
    formData.append("file", fileOrBlob);
  } else if (fileOrBlob instanceof Blob) {
    const ext = (fileOrBlob.type || "").includes("webp")
      ? "webp"
      : (fileOrBlob.type || "").includes("png")
      ? "png"
      : "jpg";
    formData.append("file", fileOrBlob, `product_${Date.now()}.${ext}`);
  } else {
    formData.append("file", fileOrBlob);
  }
  formData.append("upload_preset", uploadPreset);

  if (typeof onProgress === "function") {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.secure_url) {
              resolve(data.secure_url);
            } else {
              reject(new Error("Cloudinary did not return a secure URL."));
            }
          } catch {
            reject(new Error("Failed to parse Cloudinary response JSON."));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error?.message || `Cloudinary upload failed (HTTP ${xhr.status})`));
          } catch {
            reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error("Network error during Cloudinary upload."));
      xhr.ontimeout = () => reject(new Error("Cloudinary upload request timed out after 25s."));
      xhr.timeout = 25000;
      xhr.send(formData);
    });
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to upload image to Cloudinary (HTTP ${response.status}).`);
  }

  const data = await response.json();
  return data.secure_url;
};


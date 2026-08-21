import { useState, useEffect, useRef } from "react";
import { resolveImageUrl, getFallbackUrl } from "../utils/imageUrl";

/**
 * Reusable image component with skeleton placeholder, automatic cache detection,
 * referrerPolicy="no-referrer", and standardized fallback handling.
 */
export const ImageWithSkeleton = ({
  src,
  alt = "Image",
  className = "w-full h-full object-cover",
  containerClassName = "relative w-full h-full",
  fallbackSrc,
  fallbackType = "product",
  loading = "lazy",
  onClick,
  onLoad: customOnLoad,
  onError: customOnError,
  draggable = false,
  ...props
}) => {
  const resolvedSrc = resolveImageUrl(src, fallbackSrc || fallbackType);
  const fallbackUrl = fallbackSrc || getFallbackUrl(fallbackType);

  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Check if the image was already cached by the browser
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [resolvedSrc]);

  // Reset load state when src changes
  useEffect(() => {
    setHasError(false);
    setLoaded(false);
  }, [src]);

  const handleLoad = (e) => {
    setLoaded(true);
    if (typeof customOnLoad === "function") {
      customOnLoad(e);
    }
  };

  const handleError = (e) => {
    setHasError(true);
    setLoaded(true);
    if (typeof customOnError === "function") {
      customOnError(e);
    }
  };

  const activeSrc = hasError ? fallbackUrl : resolvedSrc;

  return (
    <div className={`${containerClassName} bg-slate-100 dark:bg-slate-850 overflow-hidden`}>
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-inherit" />
      )}
      <img
        ref={imgRef}
        src={activeSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        draggable={draggable}
        onClick={onClick}
        className={`${className} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
};

export default ImageWithSkeleton;

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect, useRef } from "react";

const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(!src);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 animate-pulse rounded-xl" />
      )}
      <img
        ref={imgRef}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        src={
          error
            ? fallbackSrc ||
              "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg"
            : src ||
              "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg"
        }
        alt={alt}
        className={`${className} transition-opacity duration-300 ${loaded || error ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
      />
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const getBadge = () => {
    if (product.id === 1) return { label: "👑 Most Sold", cls: "bg-amber-400 text-slate-900" };
    if (product.badge === "Hot Deal") return { label: "🔥 Hot Deal", cls: "bg-red-500 text-white" };
    if (product.badge === "New") return { label: "✨ New", cls: "bg-emerald-500 text-white" };
    if (product.badge === "Organic") return { label: "🌿 Organic", cls: "bg-green-600 text-white" };
    if (product.badge) return { label: product.badge, cls: "bg-slate-900 text-white" };
    return null;
  };

  const badge = getBadge();

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/70 dark:hover:shadow-slate-950/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group relative">
      {/* Image Area */}
      <div className="relative overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-900 shrink-0">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <ImageWithSkeleton
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badge */}
        {badge && (
          <span className={`absolute top-3 left-3 ${badge.cls} text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wide`}>
            {badge.label}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer ${
            inWishlist 
              ? "bg-red-500 text-white scale-110 shadow-red-300 dark:shadow-red-900" 
              : "bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-red-500 hover:scale-110 hover:bg-white dark:hover:bg-slate-700"
          }`}
        >
          <svg className={`w-4 h-4 transition-transform duration-200 ${inWishlist ? "scale-110 fill-current" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Hover overlay CTA */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-3">
          <button
            onClick={handleAddToCart}
            className={`w-full font-bold py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              added
                ? "bg-green-500 text-white"
                : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white"
            }`}
          >
            {added ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Info Area */}
      <div className="flex flex-col flex-1 p-4">
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest block mb-1">
          {product.category}
        </span>
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className={`w-3 h-3 ${s <= 4 ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">4.4 (128)</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800/80">
          <div>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
              added
                ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
                : "bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-white flex items-center gap-1"
            }`}
          >
            {added ? "✓ Added" : (
              <>
                <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {" "}Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

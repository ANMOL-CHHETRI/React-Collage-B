import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";
import { ImageWithSkeleton } from "./ImageWithSkeleton";
import { resolveProductImage } from "../utils/imageUrl";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const getBadge = () => {
    if (product.stock === 0) {
      return { label: "Out of Stock", cls: "bg-rose-600 text-white" };
    }
    if (product.id === 1 || product.id === "1") {
      return { label: "👑 Most Sold", cls: "bg-amber-500 text-white font-extrabold shadow-xs" };
    }
    if (product.badge === "Hot Deal") {
      return { label: "Hot Deal", cls: "bg-amber-600 text-white font-bold" };
    }
    if (product.badge === "New") {
      return { label: "New Arrival", cls: "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold" };
    }
    if (product.badge === "Organic") {
      return { label: "Organic", cls: "bg-emerald-600 text-white font-bold" };
    }
    if (product.badge) {
      return { label: product.badge, cls: "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold" };
    }
    return null;
  };

  const badge = getBadge();
  const hasRating = typeof product.rating === "number" && !isNaN(product.rating) && product.rating > 0;
  const ratingValue = hasRating ? Number(product.rating) : null;
  const productImgSrc = resolveProductImage(product);

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative focus-within:ring-2 focus-within:ring-amber-500">
      
      {/* Image Area */}
      <div className="relative overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-800 shrink-0">
        <Link to={`/product/${product.id}`} className="block w-full h-full focus:outline-none" tabIndex={0}>
          <ImageWithSkeleton
            src={productImgSrc}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out ${product.stock === 0 ? "grayscale opacity-80" : "group-hover:scale-105"}`}
          />
        </Link>

        {/* Top Badge */}
        {badge && (
          <span className={`absolute top-3 left-3 ${badge.cls} text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full z-10 select-none`}>
            {badge.label}
          </span>
        )}

        {/* Wishlist Button - 44px min hit target */}
        <button
          type="button"
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 min-w-[40px] min-h-[40px] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-10 cursor-pointer shadow-xs ${
            inWishlist 
              ? "bg-red-500 text-white shadow-xs" 
              : "bg-white/90 dark:bg-slate-900/90 text-slate-400 hover:text-red-500 border border-slate-200/80 dark:border-slate-700 hover:scale-105"
          }`}
        >
          <svg className={`w-4.5 h-4.5 transition-transform duration-150 ${inWishlist ? "fill-current scale-110" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Desktop Hover Quick Add */}
        <div className="hidden sm:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <button
            type="button"
            onClick={product.stock === 0 ? undefined : handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-150 flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
              product.stock === 0
                ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white active:scale-98"
            }`}
          >
            {product.stock === 0 ? (
              "Out of Stock"
            ) : added ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Added to Cart
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
      
      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider truncate">
            {product.category || "Authentic Nepal"}
          </span>
          <span className={`text-[11px] font-medium shrink-0 ${product.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
            {product.stock > 0 ? "In Stock" : "Unavailable"}
          </span>
        </div>

        <Link to={`/product/${product.id}`} className="block mb-2 group/title focus:outline-none min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover/title:text-amber-600 dark:group-hover/title:text-amber-400 transition-colors line-clamp-2 break-words">
            {product.name}
          </h3>
        </Link>

        {/* Rating Presentation (Only rendered when real rating data exists) */}
        {hasRating ? (
          <div className="flex items-center gap-1.5 mb-3.5" aria-label={`Rated ${ratingValue} out of 5 stars`}>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg 
                  key={s} 
                  className={`w-3.5 h-3.5 ${s <= Math.round(ratingValue) ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {ratingValue.toFixed(1)}
            </span>
          </div>
        ) : (
          <div className="mb-3.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Handcrafted Local Item
          </div>
        )}

        {/* Pricing & Mobile Action Row */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-tight">Price</span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Rs. {product.price?.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={product.stock === 0 ? undefined : handleAddToCart}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              product.stock === 0
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            {product.stock === 0 ? (
              "Out"
            ) : added ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

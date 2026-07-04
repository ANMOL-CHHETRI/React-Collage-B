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
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
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
  
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative">
      <div className="relative rounded-xl overflow-hidden aspect-[3/4] mb-4 bg-slate-100 dark:bg-slate-900 shrink-0">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <ImageWithSkeleton
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        {product.id === 1 ? (
          <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-amber-300 animate-pulse">
            <svg
              referrerPolicy="no-referrer"
              className="w-3 h-3 fill-current text-slate-950"
              viewBox="0 0 24 24"
            >
              <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 14h14v2H5v-2z" />
            </svg>
            Most Sold
          </span>
        ) : product.badge ? (
          <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {product.badge}
          </span>
        ) : null}
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer ${
            inWishlist 
              ? "bg-red-50 text-red-500 hover:bg-red-100" 
              : "bg-white/70 text-slate-400 hover:text-red-500 hover:bg-white"
          }`}
        >
          <svg className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col flex-1">
        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
          {product.category}
        </span>
        <Link to={`/product/${product.id}`} className="block mt-1 mb-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Star Rating Display */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className={`w-3 h-3 ${s <= 4 ? "text-amber-400" : "text-slate-200 dark:text-slate-800"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">4.4</span>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            Rs. {product.price.toLocaleString()}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-white font-bold px-3.5 py-2 rounded-xl text-xs transition duration-200 flex items-center gap-1 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

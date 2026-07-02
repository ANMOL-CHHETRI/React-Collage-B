import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router"
import { useProducts } from "../context/ProductContext"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { ProductDetailSkeleton } from "../components/Skeleton"
import ProductCard from "../components/ProductCard"
const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(!src)
  const imgRef = useRef(null)

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true)
    }
  }, [src])

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
        src={error ? (fallbackSrc || "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg") : (src || "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg")}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${(loaded || error) ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
      />
    </div>
  )
}

const ProductDetailPage = () => {
  const { id } = useParams()
  const { products } = useProducts()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  
  const product = products.find((p) => p.id === Number(id))
  const [loading, setLoading] = useState(true)
  const [activeImgIndex, setActiveImgIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <ProductDetailSkeleton />

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-700 mb-2">Product Not Found</h1>
          <Link to="/" className="text-amber-600 hover:underline">Back to Store</Link>
        </div>
      </div>
    )
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/" className="text-sm text-amber-600 hover:underline font-medium inline-flex items-center gap-1 mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Store
        </Link>

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="flex flex-col gap-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <ImageWithSkeleton src={product.images ? product.images[activeImgIndex] : product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImgIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${activeImgIndex === idx ? 'border-amber-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <ImageWithSkeleton src={img} alt={`${product.name} ${idx+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-6">
              {product.id === 1 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-extrabold rounded-full border border-amber-300 dark:border-amber-500/30 animate-pulse">
                  <svg referrerPolicy="no-referrer" className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 14h14v2H5v-2z"/>
                  </svg>
                  Most Sold (Best Seller)
                </span>
              ) : product.badge ? (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{product.badge}</span>
              ) : null}
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{product.name}</h1>
              <p className="text-3xl font-bold text-amber-600">Rs. {product.price.toLocaleString()}</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{product.description}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                <span className="font-medium">Category:</span>{" "}
                <Link to={`/category/${encodeURIComponent(product.category)}`} className="text-amber-600 dark:text-amber-400 hover:underline">
                  {product.category}
                </Link>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => addToCart(product)} className="flex-1 px-8 py-3.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Add to Cart
                </button>
                <button 
                  onClick={() => toggleWishlist(product)} 
                  className={`px-8 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                    isInWishlist(product.id) 
                      ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:border-red-900" 
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <svg className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {isInWishlist(product.id) ? "Wishlisted" : "Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage;

import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import { useCart } from "../context/CartContext"
import { ProductDetailSkeleton } from "../components/Skeleton"

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
  const product = products.find((p) => p.id === Number(id))
  const [loading, setLoading] = useState(true)

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
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
              <ImageWithSkeleton src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
              <button onClick={() => addToCart(product)} className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition cursor-pointer">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 p-4 hover:shadow-md transition">
                  <ImageWithSkeleton src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-lg mb-3" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{p.name}</h3>
                  <p className="text-amber-600 font-bold text-sm mt-1">Rs. {p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage;

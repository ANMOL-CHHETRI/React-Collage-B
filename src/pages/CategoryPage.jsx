import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import { ProductCardSkeleton } from "../components/Skeleton"
import ProductCard from "../components/ProductCard"
import { ImageWithSkeleton } from "../components/ImageWithSkeleton"

const CategoryPage = () => {
  const { categoryName } = useParams()
  const decodedCategory = decodeURIComponent(categoryName || "")
  const { products } = useProducts()

  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const [prevCategoryName, setPrevCategoryName] = useState(categoryName)
  if (categoryName !== prevCategoryName) {
    setPrevCategoryName(categoryName)
    setLoading(true)
  }

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [categoryName])

  const categoryProducts = products.filter(
    (p) => (p?.category || "").toLowerCase() === (decodedCategory || "").toLowerCase()
  )

  const maxCategoryPrice = categoryProducts.length 
    ? Math.max(...categoryProducts.map(p => p.price || 0)) 
    : 50000;

  const [priceRange, setPriceRange] = useState(50000)
  const [selectedBadges, setSelectedBadges] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Reset filters when category changes
  useEffect(() => {
    if (categoryProducts.length) {
      setPriceRange(maxCategoryPrice)
    }
    setSelectedBadges([])
    setMinRating(0)
    setIsFilterOpen(false)
  }, [categoryName, maxCategoryPrice, categoryProducts.length])

  // Handle Escape key to close mobile filter modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFilterOpen) {
        setIsFilterOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFilterOpen])

  const availableBadges = Array.from(
    new Set(categoryProducts.map(p => p.badge).filter(Boolean))
  )

  const getProductRating = (productId) => {
    const stored = localStorage.getItem(`shopease_reviews_${productId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length) {
          return parsed.reduce((sum, r) => sum + r.rating, 0) / parsed.length;
        }
      } catch {
        // Ignore invalid storage json
      }
    }
    return 0;
  };

  const filteredProducts = categoryProducts
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price <= priceRange;
      const matchesBadge = selectedBadges.length === 0 || selectedBadges.includes(p.badge);
      const rating = getProductRating(p.id);
      const matchesRating = minRating === 0 || (rating > 0 && rating >= minRating);
      return matchesSearch && matchesPrice && matchesBadge && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        const badgePriority = {
          "Best Seller": 1,
          "New Arrival": 2,
        }

        const priorityA = badgePriority[a.badge] || 3
        const priorityB = badgePriority[b.badge] || 3

        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }

        return a.name.localeCompare(b.name)
      }

      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price

      return 0
    })

  // Visual header details based on category
  const categoryMeta = {
    "Traditional Apparel": {
      image: "/traditional_apparel.jpg",
      fallbackImage: "/traditional_apparel.jpg",
      gradient: "from-amber-950/85 via-orange-950/70 to-black/85",
      badgeText: "Handwoven Textiles",
      description: "Authentic, handwoven Palpa Dhaka clothing, Newari Haku Patasi, and pure Himalayan Pashmina shawls from local master artisans.",
    },
    "Organic Tea & Coffee": {
      image: "/organic_tea.jpg",
      fallbackImage: "/organic_tea.jpg",
      gradient: "from-emerald-950/85 via-teal-950/70 to-black/85",
      badgeText: "100% Organic Himalayan Harvest",
      description: "Fragrant Himalayan orthodox golden teas and single-origin Arabica coffee beans sourced from high-altitude plantations in Ilam and Nuwakot.",
    },
    "Local Handicrafts": {
      image: "/singing_bowl.jpg",
      fallbackImage: "/singing_bowl.jpg",
      gradient: "from-amber-950/85 via-stone-950/70 to-black/85",
      badgeText: "Authentic Masterpieces",
      description: "Exquisite gold-gilded bronze statues from Patan, meditating Tibetan singing bowls, hand-carved peacock windows, and traditional steel Khukuris.",
    },
    "Herbs & Spices": {
      image: "/shilajit.jpg",
      fallbackImage: "/shilajit.jpg",
      gradient: "from-red-950/85 via-orange-950/70 to-black/85",
      badgeText: "Pure Mountain Wellness",
      description: "Aromatic mountain large cardamom, wild cliff honey harvested from the Annapurna foothills, and mineral-rich pure Himalayan Shilajit resin.",
    },
  }

  const meta = categoryMeta[decodedCategory] || {
    image: categoryProducts[0]?.image || "/traditional_apparel.jpg",
    fallbackImage: "/traditional_apparel.jpg",
    gradient: "from-amber-950/85 via-black/70 to-black/85",
    badgeText: "Regional Collection",
    description: "Browse authentic Nepalese goods and regional specialties sourced directly from verified local producers.",
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      {/* Category Banner — Full Bleed Immersive Photo Hero */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden bg-slate-950">
        {/* Background Category Photography */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ImageWithSkeleton
            src={meta.image || categoryProducts[0]?.image}
            fallbackSrc={meta.fallbackImage}
            alt={decodedCategory}
            className="w-full h-full object-cover object-center scale-105"
            containerClassName="w-full h-full"
          />
          {/* Multi-tier gradient overlay for crystal clear contrast & rich atmospheric depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
          <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-35 mix-blend-overlay`} />
        </div>

        {/* Ambient glowing orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-amber-300 font-bold">{decodedCategory}</span>
          </div>

          <div className="max-w-3xl">
            {meta.badgeText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {meta.badgeText}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-3 text-white drop-shadow-md">
              {decodedCategory}
            </h1>
            <p className="text-sm md:text-base text-slate-200/95 font-normal leading-relaxed mb-8 drop-shadow-xs">
              {meta.description}
            </p>
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" /></svg>
              {categoryProducts.length} Products
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              4.9 Avg Rating
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs">
              🚚 Free Delivery Available
            </span>
          </div>
        </div>
      </section>

      {/* Catalog Controls — Sticky */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-sm">
              <input
                type="text"
                placeholder="Search in this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-2 px-4 pl-10 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 dark:text-slate-100 transition"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-slate-400 font-semibold">{filteredProducts.length} items</span>
              
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 border rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isFilterOpen 
                    ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/15" 
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.43 8.05 1.254A2.237 2.237 0 0122 6.418v1.166a2.237 2.237 0 01-.66 1.585l-5.68 5.68a2.237 2.237 0 00-.66 1.585v3.167a2.237 2.237 0 01-1.254 2.015l-2.007 1.003A1.118 1.118 0 0110 20.007V15.54a2.237 2.237 0 00-.66-1.585l-5.68-5.68A2.237 2.237 0 013 7.584V6.418a2.237 2.237 0 011.61-2.164C7.205 3.43 9.905 3 12 3z" />
                </svg>
                {isFilterOpen ? "Hide Filters" : "Filters"}
                {(selectedBadges.length > 0 || minRating > 0 || priceRange < maxCategoryPrice) && (
                  <span className="w-2 h-2 bg-red-500 rounded-full inline-block animate-pulse" />
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-2 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition cursor-pointer"
              >
                <option value="name">Name (A–Z)</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Collapsible filters panel */}
          {isFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 animate-fade-in-down pb-2">
              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-650 dark:text-slate-400">
                  <span>Price Range</span>
                  <span className="text-amber-600 dark:text-amber-400">Up to Rs. {priceRange.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={maxCategoryPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Rs. 0</span>
                  <span>Rs. {maxCategoryPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Badges checklist */}
              {availableBadges.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-650 dark:text-slate-400 block">Product Badges</span>
                  <div className="flex flex-wrap gap-2">
                    {availableBadges.map((badge) => {
                      const isSelected = selectedBadges.includes(badge);
                      return (
                        <button
                          key={badge}
                          onClick={() => {
                            setSelectedBadges(
                              isSelected 
                                ? selectedBadges.filter(b => b !== badge) 
                                : [...selectedBadges, badge]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-900/40"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {badge}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rating Threshold */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-650 dark:text-slate-400 block">Customer Rating</span>
                <div className="flex gap-2">
                  {[0, 3, 4].map((ratingVal) => (
                    <button
                      key={ratingVal}
                      onClick={() => setMinRating(ratingVal)}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        minRating === ratingVal 
                          ? "bg-amber-500 border-amber-500 text-white"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850"
                      }`}
                    >
                      {ratingVal === 0 ? (
                        "All Stars"
                      ) : (
                        <>{ratingVal}★ & Up</>
                      )}
                    </button>
                  ))}
                </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12 pb-24 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <svg className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No products found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 max-w-sm mx-auto">
              We couldn't find any products in this category matching your search. Try adjusting your query or return home.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-amber-500 text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-amber-600 transition shadow-md shadow-amber-500/15"
            >
              Back to Store
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-4 sm:gap-6 items-stretch">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-8 font-medium">
              Showing {filteredProducts.length} of {categoryProducts.length} items in {decodedCategory}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default CategoryPage

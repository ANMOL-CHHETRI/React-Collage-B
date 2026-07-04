import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import { ProductCardSkeleton } from "../components/Skeleton"

import ProductCard from "../components/ProductCard"

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
    (p) => p.category.toLowerCase() === decodedCategory.toLowerCase()
  )

  const filteredProducts = categoryProducts
  .filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )
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
      gradient: "from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700",
      description: "Authentic, handwoven Dhaka clothing and pure Pashmina shawls from local artisans.",
    },
    "Organic Tea & Coffee": {
      gradient: "from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700",
      description: "Fragrant Himalayan orthodox teas and organic coffee sourced from high-altitude plantations.",
    },
    "Local Handicrafts": {
      gradient: "from-amber-600 to-amber-800 dark:from-amber-700 dark:to-amber-900",
      description: "Exquisite hand-carved wooden crafts, stone sculptures, and traditional Nepalese pottery.",
    },
    "Herbs & Spices": {
      gradient: "from-red-500 to-orange-600 dark:from-red-600 dark:to-orange-700",
      description: "Aromatic mountain spices, wild honey, and natural herbs harvested sustainably from Nepalese hills.",
    },
  }

  const meta = categoryMeta[decodedCategory] || {
    gradient: "from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700",
    description: "Browse authentic Nepalese goods sourced directly from local producers.",
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Category Banner */}
      <section className={`relative py-16 text-white bg-gradient-to-r ${meta.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-black/15 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-bold text-white">{decodedCategory}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-2">{decodedCategory}</h1>
            <p className="text-sm md:text-base text-white/90 max-w-2xl font-medium mt-1 leading-relaxed">
              {meta.description}
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Controls */}
      <section className="py-8 max-w-7xl mx-auto px-6">
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search products in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-4 pl-10 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 transition"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase shrink-0">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition cursor-pointer"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
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

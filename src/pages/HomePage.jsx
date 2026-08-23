import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import NepalDeliveryMap from "../components/NepalDeliveryMap";
import { ProductCardSkeleton } from "../components/Skeleton";
import ProductCard from "../components/ProductCard";
import { ImageWithSkeleton } from "../components/ImageWithSkeleton";
import { resolveProductImage } from "../utils/imageUrl";

// ── Category Definitions ───────────────────────────────────────────────────────
const categories = [
  {
    name: "Traditional Apparel",
    image: "https://i.pinimg.com/736x/d4/16/12/d41612e4db1ef4157d6e3f11e4b832c0.jpg",
    fallbackImage: "/dhakasaree.jpg",
    gradient: "from-amber-900/80 to-orange-950/90",
    iconPath: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
    subtitle: "Dhaka Topis, Saree & Traditional Attire",
    count: "Handwoven",
  },
  {
    name: "Organic Tea & Coffee",
    image: "https://i.pinimg.com/736x/56/d0/7f/56d07fba8ab764c361db3999425b48f1.jpg",
    fallbackImage: "https://i.pinimg.com/736x/63/0d/01/630d013345d875610fec89f4c28dd2b6.jpg",
    gradient: "from-emerald-950/80 to-teal-950/90",
    iconPath: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    subtitle: "Ilam Orthodox Tea & Himalayan Beans",
    count: "100% Organic",
  },
  {
    name: "Local Handicrafts",
    image: "https://i.pinimg.com/736x/f2/df/28/f2df28734e8b2f896da2e4c7cad2f354.jpg",
    fallbackImage: "/singing_bowl.jpg",
    gradient: "from-amber-950/80 to-stone-950/90",
    iconPath: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    subtitle: "Patan Statues, Singing Bowls & Woodwork",
    count: "Artisan Made",
  },
  {
    name: "Herbs & Spices",
    image: "https://i.pinimg.com/736x/aa/a0/66/aaa066bd92f5721e603358173e219353.jpg",
    fallbackImage: "/shilajit.jpg",
    gradient: "from-red-950/80 to-orange-950/90",
    iconPath: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    subtitle: "Wild Himalayan Honey, Shilajit & Spices",
    count: "Pure Natural",
  },
];


// ── Testimonials ───────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Aarav Sharma",
    location: "Kathmandu",
    text: "Ordered a handwoven Dhaka Topi and Himalayan Coffee. Delivery arrived promptly in Lalitpur with pristine packaging and genuine artisan quality.",
    rating: 5,
    avatar: "AS",
  },
  {
    name: "Prerana Giri",
    location: "Pokhara",
    text: "The Himalayan Orthodox tea is exceptionally fragrant. Chose Cash on Delivery and the entire ordering process was smooth and reliable.",
    rating: 5,
    avatar: "PG",
  },
  {
    name: "Sonam Sherpa",
    location: "Namche Bazaar",
    text: "Arrived safely in Solukhumbu within 4 days. Sturdy packaging and authentic handcrafted metalwork.",
    rating: 5,
    avatar: "SS",
  },
  {
    name: "Dinesh Chaudhary",
    location: "Birgunj",
    text: "Clear product details, transparent delivery times, and accurate descriptions. A dependable platform for authentic Nepali products.",
    rating: 5,
    avatar: "DC",
  },
];

// ── FAQs ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "How does Cash on Delivery (COD) work?",
    a: "You can place your order online without paying anything upfront. Once our courier partner delivers the package to your doorstep anywhere in Nepal, you pay the total order amount in cash directly to the delivery rider.",
  },
  {
    q: "What is your delivery coverage area?",
    a: "We deliver across all 7 provinces of Nepal, spanning major metropolitan hubs to regional districts. You can use our interactive delivery map below to check delivery speeds and estimated rates for your province.",
  },
  {
    q: "Can I pay online using eSewa, Khalti, or Fonepay?",
    a: "We are currently integrating local Nepalese digital wallets (eSewa, Khalti, IPS, Fonepay). In the meantime, we offer verified Cash on Delivery (COD) across all service areas.",
  },
  {
    q: "Are the products sold on ShopEase Nepal authentic?",
    a: "Yes. We source our handicrafts, teas, spices, and textiles directly from verified local artisan cooperatives, high-altitude farmers, and traditional workshops in Palpa, Ilam, Patan, and Taplejung.",
  },
  {
    q: "How can I track my order status?",
    a: "Upon placing a Cash on Delivery order, you will receive an order confirmation ID. You can track your package progress in real-time from your User Dashboard at any time.",
  },
];

// ── Trust Bar Items ────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l4-2 4 2zM16 6v10l4 2V6a1 1 0 00-1-1h-2", label: "Free Delivery Over Rs. 1,500" },
  { icon: "M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z", label: "Cash on Delivery Nationwide" },
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Authentic Handcrafted Items" },
  { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Serving All 7 Provinces" },
  { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "7-Day Return Policy" },
  { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Supporting Himalayan Artisans" },
];

const TrustBar = () => (
  <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-3.5 no-print select-none">
    <div className="relative flex items-center" style={{ animation: "trustScroll 45s linear infinite", whiteSpace: "nowrap" }}>
      {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-2 mx-2 sm:mx-4 px-3.5 py-1.5 rounded-full
            bg-slate-50 dark:bg-slate-800/80
            border border-slate-200 dark:border-slate-700
            text-xs font-semibold tracking-wide
            text-slate-700 dark:text-slate-300
            flex-shrink-0"
        >
          <svg className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
          </svg>
          {item.label}
        </span>
      ))}
    </div>
    <style>{`@keyframes trustScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
  </div>
);

// ── Hero Section with Carousel & Direct Discovery ─────────────────────────────
const HeroSection = ({ products, addToCart, onSearchSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [heroSearch, setHeroSearch] = useState("");

  const heroProducts = useMemo(() => {
    if (!products.length) return [];
    return products.slice(0, 5);
  }, [products]);

  useEffect(() => {
    if (isDragging || heroProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [currentIndex, heroProducts.length, isDragging]);

  const handlePrev = () => {
    if (!heroProducts.length) return;
    setCurrentIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
  };

  const handleNext = () => {
    if (!heroProducts.length) return;
    setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
  };

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    setDragStart(e.clientX);
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || dragStart === null) return;
    setDragOffset(e.clientX - dragStart);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const minSwipeDistance = 45;
    if (dragOffset < -minSwipeDistance) {
      handleNext();
    } else if (dragOffset > minSwipeDistance) {
      handlePrev();
    }
    setDragStart(null);
    setDragOffset(0);
  };

  const activeProduct = heroProducts[currentIndex] || heroProducts[0];

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && onSearchSubmit) {
      onSearchSubmit(heroSearch);
      const catalogEl = document.getElementById("catalog");
      if (catalogEl) catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickTags = ["Dhaka Topi", "Orthodox Tea", "Handicrafts", "Wild Honey", "Khukuri"];

  return (
    <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20 bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Statement, Value, Quick Search & CTA */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Authentic Nepali Craft & Goods</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Celebrate Himalayan Heritage,{" "}
              <span className="text-amber-600 dark:text-amber-400">
                Woven by Local Artisans
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Shop authentic handwoven Dhaka textiles, single-origin Ilam teas, sacred Patan bronze sculptures, and pure Himalayan herbs with 100% Cash on Delivery across Nepal.
            </p>

            {/* Quick Hero Search Experience */}
            <div className="max-w-xl mx-auto lg:mx-0 pt-1">
              <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all">
                <div className="pl-4 text-slate-400 dark:text-slate-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products, teas, Dhaka items..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  aria-label="Search ShopEase products"
                  className="w-full py-3.5 pl-3 pr-24 text-sm bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                />
                {heroSearch && (
                  <button
                    type="button"
                    onClick={() => setHeroSearch("")}
                    aria-label="Clear search"
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer mr-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (onSearchSubmit) onSearchSubmit(heroSearch);
                    const el = document.getElementById("catalog");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mr-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* Keyword Quick Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 mt-2.5">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1">Popular:</span>
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setHeroSearch(tag);
                      if (onSearchSubmit) onSearchSubmit(tag);
                      const el = document.getElementById("catalog");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#catalog"
                className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Explore Catalog</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              <a
                href="#delivery"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Delivery Coverage Map</span>
              </a>
            </div>

          </div>

          {/* Right Column: Featured Product Card Slider */}
          <div className="lg:col-span-5 relative">
            {activeProduct ? (
              <div 
                className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs select-none touch-pan-y"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {/* Top status bar inside card */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wide">
                    <span>👑 Featured Spotlight</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    {currentIndex + 1} / {heroProducts.length}
                  </span>
                </div>

                {/* Product Showcase Image */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-slate-100 dark:bg-slate-800 mb-4">
                  <ImageWithSkeleton
                    src={resolveProductImage(activeProduct)}
                    alt={activeProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {activeProduct.badge && (
                    <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-xs">
                      {activeProduct.badge}
                    </span>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-950/85 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/15">
                    Rs. {activeProduct.price?.toLocaleString()}
                  </div>
                </div>

                {/* Info & Action */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                    {activeProduct.category}
                  </span>
                  <Link to={`/product/${activeProduct.id}`} className="block">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1">
                      {activeProduct.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {activeProduct.description}
                  </p>

                  <div className="pt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => addToCart(activeProduct)}
                      className="flex-1 min-h-[44px] bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${activeProduct.id}`}
                      className="min-h-[44px] px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center"
                    >
                      Details
                    </Link>
                  </div>
                </div>

                {/* Arrow Controls */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous featured product"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-amber-500 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next featured product"
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-amber-500 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-1.5 pt-3">
                  {heroProducts.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                        i === currentIndex ? "bg-amber-500 w-6" : "bg-slate-200 dark:bg-slate-700 w-2 hover:bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-100 dark:to-slate-900 rounded-2xl border border-amber-200/60 dark:border-slate-800 p-6 sm:p-8 shadow-xs text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wide">
                    👑 Direct Artisan Marketplace
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-1">
                    Authentic Himalayan Crafts
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Connecting Nepali traditional weavers, organic tea plantations, and generational bronze sculptors directly with customers nationwide.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ 100% Cash on Delivery</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ 7 Provinces Covered</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

// ── Main HomePage Component ───────────────────────────────────────────────────
const HomePage = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("bagmati");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  
  const maxProductPrice = useMemo(() => {
    return products.length ? Math.max(...products.map(p => p.price || 0)) : 50000;
  }, [products]);

  const [priceRange, setPriceRange] = useState(50000);

  useEffect(() => {
    if (products.length && maxProductPrice > 0) {
      setPriceRange(maxProductPrice);
    }
  }, [products.length, maxProductPrice]);

  const availableCategories = useMemo(() => {
    return ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          (p.category && p.category.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query));
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesPrice = (p.price || 0) <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return (a.id || 0) - (b.id || 0);
      });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleHeroSearch = (query) => {
    setSearchQuery(query);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange(maxProductPrice);
    setSortBy("featured");
  };

  const isFiltered = searchQuery !== "" || selectedCategory !== "All" || priceRange < maxProductPrice || sortBy !== "featured";

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-amber-500 selection:text-white overflow-x-hidden transition-colors duration-300">
      
      {/* 1. Hero Section with Carousel & Direct Search */}
      <HeroSection products={products} addToCart={addToCart} onSearchSubmit={handleHeroSearch} />

      {/* 2. Trust Bar Marquee */}
      <TrustBar />

      {/* 3. Curated Category Discovery */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1.5">
                <span className="w-4 h-0.5 bg-amber-500 rounded-full" />
                Curated Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Shop by Regional Category
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Handcrafted textiles, organic Himalayan harvests, and artisanal traditions.
              </p>
            </div>

            <Link
              to="/category/Traditional%20Apparel"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors group mt-3 md:mt-0"
            >
              <span>View All Categories</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] sm:grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] block cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between"
              >
                {/* Background Sample Photo with Smooth Scale */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
                  <ImageWithSkeleton
                    src={cat.image}
                    fallbackSrc={cat.fallbackImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    containerClassName="w-full h-full"
                  />
                  {/* Multi-tier gradient overlay for crystal clear typography and vibrant colors */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 group-hover:via-black/50 transition-colors duration-300" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-30 mix-blend-overlay`} />
                </div>

                {/* Glowing hover accent orb */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 z-0 pointer-events-none" />

                {/* Top Badge & Vector Icon */}
                <div className="relative z-10 flex items-start justify-between">
                  <span className="inline-block bg-black/40 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs border border-white/25">
                    {cat.count}
                  </span>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/25 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xs">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={cat.iconPath} />
                    </svg>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 text-left">
                  <h3 className="text-sm sm:text-base md:text-lg font-black text-white leading-tight drop-shadow-xs group-hover:text-amber-300 transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-200/95 hidden sm:block line-clamp-2 mt-1 font-medium leading-snug drop-shadow-xs">
                    {cat.subtitle}
                  </p>
                  <div className="mt-2.5 hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <span>Explore Collection</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Product Catalog & Live Filter Discovery Suite */}
      <section
        id="catalog"
        className="py-16 sm:py-20 bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 border border-amber-200 dark:border-amber-900/60">
              Authentic Nepali Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Products & Local Crafts
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2">
              Every order supports local artisan families and verified farmers across Nepal.
            </p>
          </div>

          {/* Discovery Control Center */}
          <div className="mb-10 max-w-5xl mx-auto space-y-4">
            
            {/* Category Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {availableCategories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = cat === "All" ? products.length : products.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Secondary Filter Row */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search catalog by product name, category, or region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filter catalog products"
                  className="w-full pl-11 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear product filter query"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 items-center">
                {/* Max Price Range Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span className="uppercase tracking-wider text-[10px] text-slate-400">Max Budget</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">Rs. {priceRange.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxProductPrice}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Sort Option */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                    Sort Products
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl focus:ring-2 focus:ring-amber-500 p-2.5 transition-colors cursor-pointer"
                  >
                    <option value="featured">Featured / Default</option>
                    <option value="name">Product Name (A-Z)</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Status Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Showing <strong className="text-slate-800 dark:text-slate-200">{filteredProducts.length}</strong> of {products.length} products
                </span>
                {isFiltered && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Reset All Filters</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No products match your criteria
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                Try widening your price range, searching with fewer terms, or clearing your category filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-4 sm:gap-6 items-stretch">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 5. Artisan Heritage Feature Banner */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <span>Artisan Empowerment</span>
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                From Nepal's High Hills Directly to Your Doorstep
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                By purchasing through ShopEase Nepal, you directly support generational weavers in Palpa, organic tea pickers in Ilam, and bronze artisans in Patan with fair compensation and safe nationwide delivery.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-white">Highland Organics</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Single-origin orthodox teas and wild Himalayan harvests from organic estates.
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-white">Handwoven Dhaka</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Traditional geometric patterns loomed with authentic natural fibers.
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-white">Doorstep COD</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Inspect your goods upon delivery and pay cash directly to the courier rider.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. Interactive Nationwide Delivery Map */}
      <section
        id="delivery"
        className="py-16 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NepalDeliveryMap
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
          />
        </div>
      </section>

      {/* 7. Verified Customer Testimonials */}
      <section className="py-16 sm:py-20 bg-slate-50/60 dark:bg-slate-900/30 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 border border-amber-200 dark:border-amber-900/60">
              Customer Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Loved by Shoppers Across Nepal
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
              Authentic experiences from Kathmandu to regional mountain districts.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 sm:gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3" aria-label={`Rating: ${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{t.name}</h3>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{t.location}, Nepal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Frequently Asked Questions & Support CTA */}
      <section
        id="faq"
        className="py-16 sm:py-20 bg-white dark:bg-slate-950 transition-colors duration-300"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 border border-amber-200 dark:border-amber-900/60">
              Help & Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
              Clear answers regarding Cash on Delivery, shipping, and authentic products.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.q;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : faq.q)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-4 px-5 py-4 sm:px-6 sm:py-4.5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                  >
                    <span className="flex-1 leading-snug">{faq.q}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-amber-500 text-white rotate-180" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4.5 sm:px-6 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Support Contact Callout */}
          <div className="mt-10 sm:mt-12 text-center p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
              Have questions about your order or customized bulk gifts?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
              Our Kathmandu support team is available Sunday–Friday from 9:00 AM to 6:00 PM.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Contact Support Team</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;

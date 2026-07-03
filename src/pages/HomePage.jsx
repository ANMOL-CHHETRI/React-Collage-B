import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import NepalDeliveryMap from "../components/NepalDeliveryMap";
import { ProductCardSkeleton } from "../components/Skeleton";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

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

const categories = [
  {
    name: "Traditional Apparel",
    image:
      "https://i.pinimg.com/736x/89/47/66/8947664cc2390cac2bdac2b4e9ee030b.jpg",
    count: "12 Items",
  },
  {
    name: "Organic Tea & Coffee",
    image:
      "https://i.pinimg.com/736x/56/d0/7f/56d07fba8ab764c361db3999425b48f1.jpg",
    count: "8 Items",
  },
  {
    name: "Local Handicrafts",
    image:
      "https://i.pinimg.com/736x/f2/df/28/f2df28734e8b2f896da2e4c7cad2f354.jpg",
    count: "15 Items",
  },
  {
    name: "Herbs & Spices",
    image:
      "https://i.pinimg.com/736x/28/c6/48/28c648b0a74979111f737955b05d05cd.jpg",
    count: "10 Items",
  },
];

const testimonials = [
  {
    name: "Aarav Sharma",
    location: "Kathmandu",
    text: "Ordered a handwoven Dhaka Topi and Himalayan Coffee. The delivery took just 4 hours in Lalitpur. Outstanding quality and pure Nepalese authenticity!",
    rating: 5,
    avatar: "/testimonials/arav.jpg",
  },
  {
    name: "Prerana Giri",
    location: "Pokhara",
    text: "The Himalayan Orthodox tea is incredibly fragrant. I chose Cash on Delivery, and the courier rider was polite. Will order again!",
    rating: 5,
    avatar: "/testimonials/prerana.jpg",
  },
  {
    name: "Sonam Sherpa",
    location: "Namche Bazaar",
    text: "Even out here, the Gorkha Khukuri was delivered within 4 days. Packaged beautifully and extremely sturdy.",
    rating: 5,
    avatar: "/testimonials/sonam.jpg",
  },
  {
    name: "Dinesh Chaudhary",
    location: "Birgunj",
    text: "Best online shopping experience in Nepal. Genuine products, accurate descriptions, and transparent shipping charges. 5 stars!",
    rating: 5,
    avatar: "/testimonials/dinesh.jpg",
  },
];

const faqs = [
  {
    q: "How does Cash on Delivery (COD) work?",
    a: "You can place your order online without paying anything upfront. Once our courier partner delivers the package to your doorstep anywhere in Nepal, you pay the total order amount in cash to the delivery rider.",
  },
  {
    q: "What is your delivery coverage area?",
    a: "We deliver to all major cities and towns across Nepal's 7 provinces. You can use our interactive delivery map to check delivery times and shipping rates for your province.",
  },
  {
    q: "Can I pay online using eSewa, Khalti, or Fonepay?",
    a: "We are currently integrating local Nepalese payment gateways (eSewa, Khalti, IPS, Fonepay). For now, we only support Cash on Delivery (COD) to ensure a safe shopping experience.",
  },
  {
    q: "Are the products sold on ShopEase Nepal authentic?",
    a: "Yes, 100%. We source our handicraft, tea, spices, and clothing items directly from local artisans, farmers, and certified cooperatives in districts like Palpa, Ilam, Patan, and Taplejung.",
  },
  {
    q: "How can I track my order status?",
    a: "Upon placing a Cash on Delivery order, you will receive an order confirmation ID (e.g. #ORD-NP-10824). Our support team will call you to confirm your address, and you can view your shipping progress in your Account Dashboard.",
  },
];


const HeroCarousel = ({ products, addToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [products.length]);

  if (!products.length) return null;
  const product = products[currentIndex];

  return (
    <section className="relative pt-24 pb-24 md:pt-32 md:pb-32 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
       <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={product.image || "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg"} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover opacity-15 dark:opacity-20 blur-2xl scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white dark:from-slate-950/80 dark:to-slate-950" />
       </div>
       <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Featured Product
                </span>
             </div>
             <h1 className="text-[44px] md:text-[60px] font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight line-clamp-2">
               {product.name}
             </h1>
             <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-xl line-clamp-3 mx-auto md:mx-0">
               {product.description}
             </p>
             <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-500 pt-2">
                Rs. {product.price.toLocaleString()}
             </div>
             <div className="pt-4 flex justify-center md:justify-start gap-4">
               <button onClick={() => addToCart(product)} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer transform hover:-translate-y-0.5">
                 Add to Cart
               </button>
               <Link to={`/product/${product.id}`} className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold px-8 py-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition duration-200 cursor-pointer">
                 View Details
               </Link>
             </div>
          </div>
          <div className="flex-1 w-full max-w-md mx-auto">
             <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                 <ImageWithSkeleton src={product.image} alt={product.name} className="w-full h-full object-cover transform hover:scale-105 transition duration-700" />
                 {product.badge && (
                    <div className="absolute top-6 left-6 bg-red-600 text-white text-xs font-extrabold px-4 py-1.5 rounded-full uppercase shadow-md shadow-red-900/20">
                       {product.badge}
                    </div>
                 )}
             </div>
          </div>
       </div>

       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 overflow-x-auto max-w-[90vw] px-4 py-2 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {products.map((_, i) => (
             <button 
               key={i} 
               onClick={() => setCurrentIndex(i)} 
               className={`h-2.5 shrink-0 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${i === currentIndex ? 'bg-amber-500 w-8' : 'bg-slate-300 dark:bg-slate-700 w-2.5 hover:bg-slate-400 dark:hover:bg-slate-600'}`} 
               aria-label={`Go to slide ${i + 1}`}
             />
          ))}
       </div>
    </section>
  );
};

const HomePage = () => {

  const { products } = useProducts();

  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("bagmati");

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Cart context states
  const { addToCart } = useCart();

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  });


  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans selection:bg-amber-500 selection:text-white overflow-x-hidden transition-colors duration-300">
      <HeroCarousel products={products} addToCart={addToCart} />

      <section className="bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          {/* <div className="text-center mb-12 space-y-2"> */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
                Shop By Category
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Curated Local Collections
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition text-left group cursor-pointer block"
              >
                <div className="rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-slate-200 dark:bg-slate-800">
                  <ImageWithSkeleton
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="catalog"
        className="py-20 bg-slate-50/50 dark:bg-slate-900/20 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
              Our Products
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Nepalese Goods
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              Handpicked, sustainable items supporting rural communities across
              Nepal.
            </p>
          </div>

          <div className="mb-12 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 border border-slate-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm shadow-sm transition-all duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                >
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <svg
                className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                No products found
              </h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                Try resetting the filters or modifying your search query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                }}
                className="mt-4 bg-amber-500 text-white font-semibold text-xs px-4.5 py-2 rounded-full hover:bg-amber-600 transition shadow cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        id="delivery"
        className="py-20 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          <NepalDeliveryMap
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
          />
        </div>
      </section>

      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
              Reviews
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Customer Testimonials
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">
              Real feedback from shoppers across Nepal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition duration-200"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed mb-6 font-medium">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {t.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                      {t.location}, Nepal
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300"
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
              Help Desk
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">
              Everything you need to know about our service
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                  className="w-full flex items-center justify-between px-6 py-4.5 text-left font-bold text-slate-800 dark:text-slate-200 text-sm cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition"
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-250 ${
                      openFaq === faq.q
                        ? "rotate-180 text-amber-600 dark:text-amber-400"
                        : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === faq.q && (
                  <div className="px-6 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800 pt-3 animate-in slide-in-from-top-1 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      
    </div>
  );
};

export default HomePage;

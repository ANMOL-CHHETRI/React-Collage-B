import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { provincesData } from "../data/provincesData";
import NepalDeliveryMap from "../components/NepalDeliveryMap";
import { ProductCardSkeleton } from "../components/Skeleton";

const categories = [
  {
    name: "Traditional Apparel",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80",
    count: "12 Items",
  },
  {
    name: "Organic Tea & Coffee",
    image:
      "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&auto=format&fit=crop&q=80",
    count: "8 Items",
  },
  {
    name: "Local Handicrafts",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80",
    count: "15 Items",
  },
  {
    name: "Herbs & Spices",
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format&fit=crop&q=80",
    count: "10 Items",
  },
];

const testimonials = [
  {
    name: "Aarav Sharma",
    location: "Kathmandu",
    text: "Ordered a handwoven Dhaka Topi and Himalayan Coffee. The delivery took just 4 hours in Lalitpur. Outstanding quality and pure Nepalese authenticity!",
    rating: 5,
    avatar: "AS",
  },
  {
    name: "Prerana Giri",
    location: "Pokhara",
    text: "The Himalayan Orthodox tea is incredibly fragrant. I chose Cash on Delivery, and the courier rider was polite. Will order again!",
    rating: 5,
    avatar: "PG",
  },
  {
    name: "Sonam Sherpa",
    location: "Namche Bazaar",
    text: "Even out here, the Gorkha Khukuri was delivered within 4 days. Packaged beautifully and extremely sturdy.",
    rating: 5,
    avatar: "SS",
  },
  {
    name: "Dinesh Chaudhary",
    location: "Birgunj",
    text: "Best online shopping experience in Nepal. Genuine products, accurate descriptions, and transparent shipping charges. 5 stars!",
    rating: 5,
    avatar: "DC",
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

const HomePage = () => {
  const { products } = useProducts();

  const featuredProduct = products.find((p) => p.id === 1) || products[0];

  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProvince, setSelectedProvince] = useState("bagmati");

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Cart context states
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
  } = useCart();

  // Checkout form state
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Kathmandu");

  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState("");

  const provinceValue = selectedProvince;


  const filteredProducts = products.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !city) {
      setOrderError("Please fill in all the shipping details.");
      return;
    }
    setOrderError("");

    const shippingCost = provincesData[provinceValue].shippingFee;

    const grandTotal = cartSubtotal + shippingCost;
    const orderId = `ORD-NP-${Math.floor(100000 + Math.random() * 900000)}`;

    const simulatedOrder = {
      orderId,
      fullName,
      phone,
      address,
      city,
      provinceName: provincesData[provinceValue].name,

      items: [...cartItems],
      subtotal: cartSubtotal,
      shipping: shippingCost,
      total: grandTotal,
      estDays: provincesData[provinceValue].deliveryTime,

    };

    setOrderSuccess(simulatedOrder);
    clearCart();
    setCheckoutStep(false);
    setIsCartOpen(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-105 font-sans selection:bg-amber-500 selection:text-white overflow-x-hidden transition-colors duration-300">
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute top-0 right-0 w-137.5 h-137.5 bg-gradient-to-br from-amber-200/20 to-orange-200/20 dark:from-amber-500/10 dark:to-orange-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-112.5 h-112.5 bg-slate-50 dark:bg-slate-900/50 rounded-full blur-3xl -z-10 transform -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ShopEase Nepal
                </span>
                <span className="text-xs text-slate-300 dark:text-slate-700">|</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Home Delivery Across 7 Provinces
                </span>
              </div>

              <h1 className="text-[44px] md:text-[60px] font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight">
                Authentic Goods.
                <br />
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  Direct to Your Door.
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-xl">
                Sourcing genuine handwoven garments, organic teas, spices, and
                artisanal crafts directly from local cooperatives in Nepal. Pay
                with cash only when it reaches you.
              </p>

              <div className="pt-2 space-y-4 max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search traditional Dhaka, Ilam tea, organic honey..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-full py-4 px-6 pr-12 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-slate-100 text-sm shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#catalog"
                    className="bg-slate-950 dark:bg-slate-100 dark:text-slate-950 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-250 shadow-md shadow-slate-950/15 flex items-center gap-2 group hover:shadow-lg"
                  >
                    Browse Catalog
                    <svg
                      className="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform"
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
                  </a>

                  <a
                    href="#delivery"
                    className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-305 border border-slate-200 dark:border-slate-800 font-semibold px-7 py-3.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-250 flex items-center gap-2"
                  >
                    View Shipping Map
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center relative">
              <div className="absolute -inset-4 bg-slate-100/50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 -z-20 pointer-events-none" />

              <div className="w-full max-w-115 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-5 relative overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden aspect-square shadow-inner">
                  <img
                    src={featuredProduct?.image}
                    alt={featuredProduct?.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-max mb-2">
                      Featured Craft
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">Palpali Dhaka Topi</h3>
                    <p className="text-xs text-slate-200 dark:text-slate-300">
                      Woven by hand in traditional wooden looms. 100% Cotton.
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                      <span className="text-lg font-extrabold text-white">
                        Rs. {featuredProduct?.price?.toLocaleString?.()}
                      </span>
                      <button
                        onClick={() => addToCart(featuredProduct)}
                        className="bg-white dark:bg-slate-900 text-slate-955 dark:text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition duration-200 flex items-center gap-1.5 shadow cursor-pointer hover:bg-amber-500 hover:text-white"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-955 border-y border-slate-100 dark:border-slate-800 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
                Shop By Category
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Curated Local Collections
              </h2>
            </div>
            <button
              onClick={() => setSelectedCategory("All")}
              className={`text-sm font-semibold transition mt-3 md:mt-0 ${
                selectedCategory === "All"
                  ? "text-amber-600 underline"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Clear Filter
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border transition text-left group cursor-pointer ${
                  selectedCategory === cat.name
                    ? "border-amber-500 bg-amber-50/30 dark:bg-amber-955/20 ring-1 ring-amber-500"
                    : "border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700"
                }`}
              >
                <div className="rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-slate-200 dark:bg-slate-800">
                  <img
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
              </button>
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
              Handpicked, sustainable items supporting rural communities across Nepal.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800 p-6">
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
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 bg-amber-500 text-white font-semibold text-xs px-4.5 py-2 rounded-full hover:bg-amber-600 transition shadow cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative rounded-xl overflow-hidden aspect-square mb-4 bg-slate-100 dark:bg-slate-900">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                      {p.badge && (
                        <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                      {p.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1 mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      Rs. {p.price.toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(p);
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add
                    </button>
                  </div>
                </Link>
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
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">Reviews</span>
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed mb-6 font-medium">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-950/40 rounded-full flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{t.name}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-505 block">{t.location}, Nepal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">Help Desk</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">Everything you need to know about our service</p>
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
                    className={`w-4 h-4 text-slate-400 dark:text-slate-505 transition-transform duration-250 ${
                      openFaq === faq.q
                        ? "rotate-180 text-amber-600 dark:text-amber-400"
                        : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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

      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => {
              if (!checkoutStep) setIsCartOpen(false);
            }}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-slate-955 border-l border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col transform transition duration-300 animate-in slide-in-from-right duration-300">
              <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {checkoutStep ? "Shipping Details (COD)" : `My Cart (${cartCount})`}
                </h2>
                <button
                  onClick={() => {
                    if (checkoutStep) setCheckoutStep(false);
                    else setIsCartOpen(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  <svg
                    className="w-5.5 h-5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {checkoutStep ? (
                  <form onSubmit={handlePlaceOrder} className="space-y-4 pt-2">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed font-medium mb-4">
                      <strong>Payment Mode: Cash on Delivery (COD)</strong>
                      <br />
                      You will pay cash to the courier agent upon receiving your order at your shipping address.
                    </div>

                    {orderError && (
                      <div className="bg-red-50 text-red-700 border border-red-150 p-2.5 rounded-lg text-xs font-semibold">
                        {orderError}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full text-xs border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 bg-slate-50 focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block">Phone Number (Nepal)</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="w-full text-xs border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 bg-slate-50 focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-505 dark:text-slate-400 uppercase block">Delivery Province</label>
                      <select
                        value={provinceValue}

                        onChange={(e) => {
                          setSelectedProvince(e.target.value);

                        }}
                        className="w-full text-xs border border-slate-202 dark:border-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition cursor-pointer"
                      >
                        {Object.values(provincesData).map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-505 dark:text-slate-400 uppercase block">City / Town</label>
                        <select
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-955 transition cursor-pointer"
                        >
                          {provincesData[provinceValue]?.cities?.map((c) => (

                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-505 dark:text-slate-400 uppercase block">Zip / Postcode</label>
                        <input
                          type="text"
                          placeholder="e.g. 44600"
                          className="w-full text-xs border border-slate-202 dark:border-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-505 dark:text-slate-400 uppercase block">Street Address</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House no, Street name, Tole, Landmark"
                        className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-955 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 mt-6 cursor-pointer"
                    >
                      Confirm Order (Cash on Delivery)
                    </button>
                  </form>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <svg className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Your cart is empty</h3>
                    <p className="text-slate-400 dark:text-slate-505 text-xs max-w-[240px] mx-auto">
                      Explore Nepalese crafts, garments, and tea to add them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:shadow-sm transition">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-50 dark:bg-slate-900 shrink-0"
                        />

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-1">
                              {item.name}
                            </h4>
                            <span className="text-xs font-extrabold text-amber-600 block mt-0.5">
                              Rs. {item.price.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-0.5 text-slate-505 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold hover:bg-slate-55 dark:hover:bg-slate-900 rounded-l-lg transition cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-0.5 text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 rounded-r-lg transition cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[10px] font-bold text-red-500 hover:text-red-700 transition cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && !checkoutStep && (
                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-505 dark:text-slate-400 font-semibold">Subtotal</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-450 dark:text-slate-500 font-medium">
                    <span>Shipping calculated at checkout. Delivery across Nepal.</span>
                  </div>
                  <button
                    onClick={() => setCheckoutStep(true)}
                    className="w-full bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-955 font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Proceed to Delivery (COD)
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )}

              {checkoutStep && (
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-505 dark:text-slate-400 font-medium">Cart Subtotal:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-550 dark:text-slate-400 font-medium">
                      Shipping ({provincesData[provinceValue].name}):

                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Rs. {provincesData[provinceValue].shippingFee}</span>

                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800/80 pt-2 text-sm font-extrabold">
                    <span className="text-slate-800 dark:text-slate-200">Grand Total (COD):</span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                      Rs.{" "}
                      {(cartSubtotal + provincesData[provinceValue].shippingFee).toLocaleString()}

                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setOrderSuccess(null)}
          />

          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative transform transition duration-300 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white text-center leading-tight">
              Order Placed Successfully!
            </h3>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold">
              Order ID:{" "}
              <span className="text-amber-600 dark:text-amber-400 font-bold">{orderSuccess.orderId}</span>
            </p>

            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4.5 border border-slate-100 dark:border-slate-800 text-xs space-y-2 mt-5">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800 pb-1.5 mb-2.5">
                Shipping & Delivery Summary
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-650 dark:text-slate-400">
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">Recipient Name</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{orderSuccess.fullName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">Contact Phone</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{orderSuccess.phone}</span>
                </div>
              </div>
              <div className="pt-2 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">Delivery Location</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {orderSuccess.address}, {orderSuccess.city}, {orderSuccess.provinceName}
                </span>
              </div>
              <div className="pt-2 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">Payment Method</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Cash on Delivery (COD)</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">Estimated Delivery</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{orderSuccess.estDays}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold pt-4 px-1 border-t border-slate-150 dark:border-slate-800 mt-5">
              <span className="text-slate-700 dark:text-slate-300">Total Invoice (NPR)</span>
              <span className="text-amber-600 dark:text-amber-400 text-base font-extrabold">
                Rs. {orderSuccess.total.toLocaleString()}
              </span>
            </div>

            <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal text-center mt-6">
              Our support desk will call you at {" "}
              <strong className="text-slate-605 dark:text-slate-300">{orderSuccess.phone}</strong>
              {" "}within 12 hours to verify your delivery address before dispatching the rider.
            </p>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition duration-200 mt-5 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/25">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  ShopEase <span className="text-amber-500">Nepal</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Your premium destination for authentic Nepalese handicrafts, garments,
                organic tea, and mountain coffee. Sourced directly from local cooperatives
                supporting micro-enterprises.
              </p>
              <div className="flex gap-2.5 pt-2">
                <a
                  href="#"
                  className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Catalog</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setSelectedCategory("Traditional Apparel")}
                    className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                  >
                    Apparel
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedCategory("Organic Tea & Coffee")}
                    className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                  >
                    Tea & Coffee
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedCategory("Local Handicrafts")}
                    className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                  >
                    Handicrafts
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedCategory("Herbs & Spices")}
                    className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                  >
                    Herbs & Spices
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <NavLink to="/about" className="hover:text-amber-500 transition-colors">
                    About Us
                  </NavLink>
                </li>
                <li>
                  <a href="#delivery" className="hover:text-amber-500 transition-colors">
                    Delivery Coverage
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-amber-500 transition-colors">
                    Help FAQ
                  </a>
                </li>
                <li>
                  <Link to="/user-login" className="hover:text-amber-500 transition-colors">
                    User Login
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/policy#privacy" className="hover:text-amber-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/policy#terms" className="hover:text-amber-500 transition-colors">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link to="/policy#cod" className="hover:text-amber-500 transition-colors">
                    COD Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Office Address</h4>
              <p className="text-xs text-slate-500 leading-normal">
                ShopEase Nepal Pvt. Ltd.
                <br />
                New Baneshwor, Kathmandu
                <br />
                Bagmati, Nepal
                <br />
                support@shopease.com.np
              </p>
            </div>
          </div>

          <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
            <p>© 2026 ShopEase Nepal. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/policy#privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link to="/policy#terms" className="hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;


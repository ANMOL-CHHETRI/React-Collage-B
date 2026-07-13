import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ProductDetailSkeleton } from "../components/Skeleton";
import ContactSuccessModal from "../components/ContactSuccessModal";
import ProductCard from "../components/ProductCard";
import CheckoutModal from "../components/CheckoutModal";

// ── Skeleton image loader ───────────────────────────────────────────────────
const ImageWithSkeleton = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(!src);
  const imgRef = useRef(null);
  

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) setLoaded(true);
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
            ? "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg"
            : src
        }
        alt={alt}
        className={`${className} transition-opacity duration-300 ${loaded || error ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
      />
    </div>
  );
};

// ── Star display ────────────────────────────────────────────────────────────
const Stars = ({ rating, size = "w-4 h-4" }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        className={`${size} ${s <= rating ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ── Mock reviews per product ────────────────────────────────────────────────
const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    date: "June 12, 2025",
    verified: true,
    title: "Absolutely love it!",
    text: "The quality is outstanding. Exactly as described and beautifully packaged. Will definitely buy again!",
    helpful: 24,
  },
  {
    id: 2,
    name: "Rohan Thapa",
    avatar: "RT",
    rating: 4,
    date: "May 28, 2025",
    verified: true,
    title: "Great product, fast delivery",
    text: "Very happy with this purchase. The craftsmanship is excellent. Shipping was quicker than expected.",
    helpful: 18,
  },
  {
    id: 3,
    name: "Anita Gurung",
    avatar: "AG",
    rating: 5,
    date: "May 15, 2025",
    verified: false,
    title: "Authentic Nepali quality",
    text: "This is exactly what I was looking for. The authenticity and detail is remarkable. Highly recommend!",
    helpful: 31,
  },
  {
    id: 4,
    name: "Bikram Rai",
    avatar: "BR",
    rating: 3,
    date: "April 30, 2025",
    verified: true,
    title: "Good but slightly small",
    text: "Quality is good but the size was a little smaller than I expected. Still a good buy for the price.",
    helpful: 7,
  },
  {
    id: 5,
    name: "Sushma Karki",
    avatar: "SK",
    rating: 5,
    date: "April 10, 2025",
    verified: true,
    title: "Perfect gift!",
    text: "Bought this as a gift and the recipient absolutely loved it. Beautiful packaging and premium feel.",
    helpful: 42,
  },
];

// ── Rating summary with bars ────────────────────────────────────────────────
const RatingSummary = ({ reviews }) => {
  const avg = (
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  ).toFixed(1);
  const counts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
      <div className="text-center shrink-0">
        <div className="text-6xl font-extrabold text-slate-900 dark:text-white leading-none">
          {avg}
        </div>
        <Stars rating={Math.round(avg)} size="w-5 h-5" />
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
          {reviews.length} reviews
        </div>
      </div>
      <div className="flex-1 w-full space-y-1.5">
        {counts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2.5 text-xs">
            <span className="w-3 text-right text-slate-500 dark:text-slate-400 font-bold shrink-0">
              {star}
            </span>
            <svg
              className="w-3.5 h-3.5 text-amber-400 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                style={{
                  width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="w-4 text-slate-400 dark:text-slate-500 font-medium shrink-0">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Individual review card ──────────────────────────────────────────────────
const ReviewCard = ({ review }) => {
  const { user, reportUserAvatar } = useAuth();
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);
  
  const isImageAvatar = review.avatar && (review.avatar.startsWith('data:') || review.avatar.startsWith('http'));
  
  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className="relative group">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-extrabold flex items-center justify-center shrink-0 shadow-md">
            {isImageAvatar ? (
              <img src={review.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              review.avatar
            )}
          </div>
          {isImageAvatar && (!user || user.name !== review.name) && (
            <button 
              onClick={() => {
                reportUserAvatar(review.name, review.avatar);
                alert("Avatar reported for admin review.");
              }}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm text-red-500 hover:text-red-600 border border-slate-200 dark:border-slate-700"
              title="Report offensive picture"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
            </button>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {review.name}
            </span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold border border-green-100 dark:border-green-900/30">
                <svg
                  className="w-2.5 h-2.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified Buyer
              </span>
            )}
            <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto">
              {review.date}
            </span>
          </div>
          <Stars rating={review.rating} />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2 mb-1">
            {review.title}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {review.text}
          </p>
          <button
            onClick={() => {
              if (!voted) {
                setHelpful((h) => h + 1);
                setVoted(true);
              }
            }}
            className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              voted
                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"
                : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
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
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 1.881L7 12.5V20m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            Helpful ({helpful})
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Write-a-review form ─────────────────────────────────────────────────────
const WriteReviewForm = ({ productName, onAddReview }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !text.trim()) return;

    const reviewerName = user ? user.name || user.username : "Guest User";
    const initials = reviewerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newReview = {
      id: Date.now(),
      name: reviewerName,
      avatar: user?.avatar || initials || "GU",
      rating,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      verified: !!user,
      title: title.trim() || "Customer Review",
      text: text.trim(),
      helpful: 0,
    };

    onAddReview(newReview);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-4 shadow-md">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h4 className="text-base font-bold text-green-800 dark:text-green-300">
          Thank you for your review!
        </h4>
        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
          Your feedback helps other customers make better decisions.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-5"
    >
      <div>
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Write a Review
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Share your experience with{" "}
          <span className="font-semibold text-amber-600">{productName}</span>
        </p>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
          Your Rating *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
              className="cursor-pointer transition-transform hover:scale-125"
            >
              <svg
                className={`w-8 h-8 ${s <= (hovered || rating) ? "text-amber-400" : "text-slate-300 dark:text-slate-600"} transition-colors duration-150`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-3 text-sm font-bold text-amber-600">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
          Review Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Summarize your experience..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
          Your Review *
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Tell others what you think about this product..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-205 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={rating === 0 || !text.trim()}
        className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer"
      >
        Submit Review
      </button>
    </form>
  );
};

// ── Main Page Component ──────────────────────────────────────────────────────
const ProductDetailPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const product = products.find((p) => p.id === Number(id));
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  // Quantity selected by the customer
  const [quantity, setQuantity] = useState(1);
  // Active tab on product details page
  const [activeTab, setActiveTab] = useState("description");
  const [contactForm, setContactForm] = useState({
    email: "",
    name: "",
    phone: "",
    message: "",
  });
  const [contactModal, setContactModal] = useState(false);
  
  // Quick Buy state
  const [quickPhone, setQuickPhone] = useState("");
  const [quickPromo, setQuickPromo] = useState("");
  const [quickPromoError, setQuickPromoError] = useState("");
  const [appliedQuickPromo, setAppliedQuickPromo] = useState(null);
  const [quickCheckoutModal, setQuickCheckoutModal] = useState(false);
  const { error: toastError } = useToast();
  const navigate = useNavigate();

  const handleApplyQuickPromo = () => {
    if (!quickPromo.trim()) return;
    const rawCoupons = localStorage.getItem("shopease_coupons");
    const coupons = rawCoupons ? JSON.parse(rawCoupons) : [{ code: "FESTIVAL20", percent: 20, creator: "admin" }];
    const found = coupons.find(c => c.code === quickPromo.trim().toUpperCase());
    if (found) {
      if (found.creator === "admin" || product.addedBy === found.creator) {
        setAppliedQuickPromo(found);
        setQuickPromoError("");
      } else {
        setAppliedQuickPromo(null);
        setQuickPromoError("Coupon doesn't apply to this product.");
      }
    } else {
      setAppliedQuickPromo(null);
      setQuickPromoError("Invalid promo code.");
    }
  };

  const calculateQuickDiscount = () => {
    if (!appliedQuickPromo) return 0;
    return Math.floor((product.price * quantity) * (appliedQuickPromo.percent / 100));
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!product) return;
    const stored = localStorage.getItem(`shopease_reviews_${product.id}`);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (error) {
        setReviews(MOCK_REVIEWS);
      }
    } else {
      setReviews(MOCK_REVIEWS);
      localStorage.setItem(
        `shopease_reviews_${product.id}`,
        JSON.stringify(MOCK_REVIEWS),
      );
    }
  }, [id, product]);
  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleContactSubmit = (e) => {
    e.preventDefault();

    setContactModal(true);

    setContactForm({
      email: "",
      name: "",
      phone: "",
      message: "",
    });
  };

  if (loading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
            Product Not Found
          </h1>
          <Link to="/" className="text-amber-600 hover:underline">
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const handleAddReview = (newReview) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(
      `shopease_reviews_${product.id}`,
      JSON.stringify(updated),
    );
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          to="/"
          className="text-sm text-amber-600 hover:underline font-medium inline-flex items-center gap-1 mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Store
        </Link>

        {/* ── Product Card ─────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div className="flex flex-col gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                <ImageWithSkeleton
                  src={
                    product.images
                      ? product.images[activeImgIndex]
                      : product.image
                  }
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-zoom-in"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 shadow-sm transition-all duration-300 cursor-pointer ${
                        activeImgIndex === idx
                          ? "border-amber-500 ring-2 ring-amber-300 scale-105 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <ImageWithSkeleton
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-5">
              {product.id === 1 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-extrabold rounded-full border border-amber-300 dark:border-amber-500/30 animate-pulse">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 14h14v2H5v-2z" />
                  </svg>
                  Most Sold (Best Seller)
                </span>
              ) : product.badge ? (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  {product.badge}
                </span>
              ) : null}

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {product.name}
              </h1>

              {/* Inline rating */}
              <div className="flex items-center gap-2">
                <Stars rating={Math.round(avgRating)} />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {avgRating}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  ({reviews.length} reviews)
                </span>
              </div>

              <p className="text-3xl font-bold text-amber-600">
                Rs. {product.price.toLocaleString()}
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                <span className="font-medium text-slate-700">Category:</span>{" "}
                <Link
                  to={`/category/${encodeURIComponent(product.category)}`}
                  className="text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {product.category}
                </Link>
              </p>

              {/* Product Information */}
              <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-500 p-4 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">✔</span>
                  <span className="font-medium">
                    Availability:
                    <span className="text-green-600 ml-1">In Stock</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span>🚚</span>
                  <span>Delivery: 2–4 Business Days</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>🏪</span>
                  <span>Sold By: ShopEase Nepal</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>100% Secure Checkout</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden h-11 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white">
                  {/* Decrease quantity */}
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-11 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    −
                  </button>

                  {/* Current quantity */}
                  <span className="w-10 text-center font-bold">
                    {quantity}
                  </span>

                  {/* Increase quantity */}
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-11 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
                {/*Add to cart button*/}
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 h-11 px-6 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Add to Cart
                </button>
                {/*wishlist button*/}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`h-11 px-6 rounded-xl font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                    isInWishlist(product.id)
                      ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:border-red-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {isInWishlist(product.id) ? "Wishlisted" : "Wishlist"}
                </button>
              </div>

              {/* Quick Buy directly on Product Page */}
              <div className="mt-8 p-5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-2xl space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/></svg>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 relative z-10">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Buy It Now
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Phone (Required)</label>
                    <input 
                      type="text" 
                      maxLength={10} 
                      placeholder="98XXXXXXXX" 
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-950 border ${quickPhone && quickPhone.length > 0 && quickPhone.length < 10 ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-orange-500'} rounded-xl focus:ring-2 outline-none text-sm font-bold text-slate-900 dark:text-white transition-all`}
                    />
                    {quickPhone && quickPhone.length > 0 && quickPhone.length < 10 && <p className="text-red-500 text-[10px] mt-1 font-bold">Exactly 10 digits required.</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Coupon (Optional)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="CODE" 
                        value={quickPromo}
                        onChange={(e) => { setQuickPromo(e.target.value.toUpperCase()); setQuickPromoError(""); }}
                        className="flex-1 min-w-0 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold text-slate-900 dark:text-white uppercase transition-all"
                      />
                      <button onClick={handleApplyQuickPromo} className="px-3 shrink-0 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold text-xs transition cursor-pointer">
                        Apply
                      </button>
                    </div>
                    {quickPromoError && <p className="text-red-500 text-[10px] mt-1 font-bold">{quickPromoError}</p>}
                    {appliedQuickPromo && calculateQuickDiscount() > 0 && <p className="text-emerald-600 dark:text-emerald-400 text-[10px] mt-1 font-bold">Applied: -Rs. {calculateQuickDiscount()}</p>}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (!user) {
                      toastError("Please log in to buy this product.");
                      navigate("/user-login");
                      return;
                    }
                    if (!quickPhone || quickPhone.length < 10) {
                      toastError("Please enter a valid 10-digit phone number.");
                      return;
                    }
                    // Temporarily store quick checkout info in session for the modal
                    sessionStorage.setItem("shopease_quick_checkout_phone", quickPhone);
                    setQuickCheckoutModal(true);
                  }}
                  disabled={!quickPhone || quickPhone.length < 10}
                  className="w-full h-12 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 relative z-10"
                >
                  Confirm Quick Purchase (Rs. {((product.price * quantity) - calculateQuickDiscount()).toLocaleString()})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-3 text-sm font-semibold transition ${
                activeTab === "description"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-slate-500"
              }`}
            >
              DESCRIPTION
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 text-sm font-semibold transition ${
                activeTab === "reviews"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-slate-500"
              }`}
            >
              REVIEWS
            </button>

            <button
              onClick={() => setActiveTab("contact")}
              className={`pb-3 text-sm font-semibold transition ${
                activeTab === "contact"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-slate-500"
              }`}
            >
              CONTACT US
            </button>
          </div>
        </div>

        {/* Description Tab Content */}
        {activeTab === "description" && (
          <div className="mt-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg min-h-[200px] p-8">
              <p className="text-slate-700 dark:text-slate-300 leading-8 text-justify">
                {product.longDescription || product.description}
              </p>
            </div>
          </div>
        )}

        {/* Reviews Tab Content */}
        {activeTab === "reviews" && (
          <div className="mt-14">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Customer Reviews
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Real feedback from verified buyers
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                <Stars rating={Math.round(avgRating)} size="w-4 h-4" />
                <span className="text-sm font-extrabold text-amber-700 dark:text-amber-400">
                  {avgRating} / 5
                </span>
              </div>
            </div>

            {/* Rating summary bars */}
            <RatingSummary reviews={reviews} />

            {/* Review cards */}
            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Write a review */}
            <div className="mt-8">
              {!user ? (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">
                    Please log in to write a review for this product.
                  </p>
                  <div className="flex items-center justify-center">
                    <Link
                      to="/user-login"
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition shadow-md shadow-amber-500/10"
                    >
                      Log In to Review
                    </Link>
                  </div>
                </div>
              ) : product.addedBy === user.username ||
                (user.role === "admin" && product.addedBy === "admin") ? (
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-950/30 p-6 text-center text-amber-800 dark:text-amber-400">
                  <p className="text-sm font-medium">
                    You cannot write a review for a product you have added
                    yourself.
                  </p>
                </div>
              ) : (
                <WriteReviewForm
                  productName={product.name}
                  onAddReview={handleAddReview}
                />
              )}
            </div>
          </div>
        )}

        {/* Contact Us Tab Content */}
        {activeTab === "contact" && (
          <div className="mt-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact the Seller
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Have questions about {product.name}? Need custom sizing or bulk
                orders? Send a message directly to the seller.
              </p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className="w-full border rounded-lg px-4 py-3"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Related Products ─────────────────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <ContactSuccessModal
        open={contactModal}
        product={product}
        onClose={() => setContactModal(false)}
      />

      {/* Quick Buy Checkout Modal Wrapper */}
      {quickCheckoutModal && (
        <QuickCheckoutWrapper 
          isOpen={quickCheckoutModal} 
          onClose={() => {
            setQuickCheckoutModal(false);
            sessionStorage.removeItem("shopease_quick_checkout_phone");
          }} 
          product={product}
          quantity={quantity}
          appliedQuickPromo={appliedQuickPromo}
          calculateQuickDiscount={calculateQuickDiscount}
        />
      )}
    </div>
  );
};

// Wrapper component to render CheckoutModal for a single product bypassing the cart context
const QuickCheckoutWrapper = ({ isOpen, onClose, product, quantity, appliedQuickPromo, calculateQuickDiscount }) => {
  const quickTotal = product.price * quantity;
  const quickDiscount = calculateQuickDiscount();

  return (
    <CheckoutModal 
      isOpen={isOpen} 
      onClose={onClose} 
      grandTotal={quickTotal}
      discountAmount={quickDiscount}
      discountPercent={appliedQuickPromo?.percent || 0}
      promoCode={appliedQuickPromo?.code || ""}
      singleProduct={{...product, quantity}}
    />
  );
};

export default ProductDetailPage;

import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

// Local ImageWithSkeleton as per architecture invariants
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
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/60 animate-pulse rounded-lg" />
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
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
      />
    </div>
  );
};

const CoworkingPage = () => {
  const { addToCart } = useCart();
  const { success: toastSuccess, error: toastError } = useToast();

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    plan: "hot-desk",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTourModal, setShowTourModal] = useState(null);

  const coworkingPlans = [
    {
      id: 1001,
      name: "Shared Hot Desk",
      price: 250,
      badge: "Day Pass",
      period: "day",
      category: "Co-Working Space",
      image: "/nepal_coworking_open.png",
      description: "A comfortable seat in our open area. Perfect for working on your laptop and meeting other creative people.",
      features: [
        "Super fast WiFi internet",
        "Free warm Himalayan coffee",
        "Cozy sofas and common areas",
        "Power backup during outages",
      ],
    },
    {
      id: 1002,
      name: "Dedicated Desk",
      price: 4999,
      badge: "Monthly Pass",
      period: "month",
      category: "Co-Working Space",
      image: "/nepal_coworking_meeting.png",
      description: "Your own personal desk that belongs only to you. You can safely leave your computer and notes overnight.",
      features: [
        "Your own locked drawer",
        "Free meeting room use (5 hours)",
        "Comfortable chair for long days",
        "Receive letters and packages here",
      ],
    },
    {
      id: 1003,
      name: "Private Office Suite",
      price: 14999,
      badge: "Team Cabin",
      period: "month",
      category: "Co-Working Space",
      image: "/nepal_coworking_lounge.png",
      description: "A private, lockable room for your team. Fits 4 to 6 people comfortably with access to all shared spaces.",
      features: [
        "Private room with lock and key",
        "Unlimited meeting room bookings",
        "Free printing and scanning",
        "Set up the desks anyway you like",
      ],
    },
  ];

  const amenities = [
    {
      title: "Fast & Reliable WiFi",
      desc: "High-speed internet with backup lines so your connection never drops.",
      icon: (
        <svg className="w-5 h-5 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856a9.75 9.75 0 0113.788 0M1.924 8.674a14.25 14.25 0 0120.152 0M12 18.75h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      title: "Fresh Local Coffee",
      desc: "Warm Nepalese coffee brewed fresh daily to keep you energized.",
      icon: (
        <svg className="w-5 h-5 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Private Work Booths",
      desc: "Quiet, soundproof booths for making phone calls or focus work.",
      icon: (
        <svg className="w-5 h-5 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ),
    },
    {
      title: "Team Meeting Rooms",
      desc: "Clean rooms with TV screens and video cameras for meeting your team.",
      icon: (
        <svg className="w-5 h-5 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    {
      title: "Power Backup",
      desc: "Continuous electricity backup so your work never gets interrupted by power cuts.",
      icon: (
        <svg className="w-5 h-5 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
    {
      title: "Printing & Scanning",
      desc: "Easy printing and scanning services whenever you need them.",
      icon: (
        <svg className="w-5 h-5 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.82l-.24 2.25H5.25m3-.75l-.24 2.25H6.75M9 13.5l-.24 2.25H7.5m3-.75l-.24 2.25H9m3-1.5l-.24 2.25h-1.5m3-.75l-.24 2.25H12m3-1.5l-.24 2.25h-1.5m3-.75l-.24 2.25H15M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.date) {
      toastError("Please fill out all required details.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toastSuccess(`Tour request successfully booked for ${bookingForm.date}! We will call you shortly.`);
      setBookingForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        plan: "hot-desk",
        message: "",
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const handleBookNow = (plan) => {
    addToCart({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      image: plan.image,
      badge: plan.badge,
      category: plan.category,
      description: plan.description,
      addedBy: "admin",
    });
  };

  const tours = [
    {
      title: "Open Workspace",
      desc: "Bright open layouts designed with neutral colors, clean desk dividers, and natural lighting.",
      img: "/nepal_coworking_open.png",
    },
    {
      title: "Meeting Pods",
      desc: "Acoustically soundproof boardrooms featuring premium conference systems for up to 8 team members.",
      img: "/nepal_coworking_meeting.png",
    },
    {
      title: "Lounge & Cafe",
      desc: "A relaxed, breakout area with modular seating for networking, lunches, and premium coffee tastings.",
      img: "/nepal_coworking_lounge.png",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen font-sans selection:bg-amber-500 selection:text-white transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-32 md:pb-24 border-b border-slate-100 dark:border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Our Workspaces
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
              Why a Coworking Space?
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xl">
              We believe in helping local creators grow. We built a friendly workspace in Kathmandu where freelancers, craftsmakers, and small teams can work, share ideas, and enjoy fresh local coffee under one roof.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <a href="#plans" className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold px-6 py-3.5 rounded-xl transition duration-150 cursor-pointer text-sm">
                View Workspace Plans
              </a>
              <a href="#book" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition duration-150 cursor-pointer text-sm">
                Schedule Site Visit
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 w-full max-w-lg mx-auto">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-50 dark:bg-slate-900">
              <ImageWithSkeleton 
                src="/nepal_coworking_hero.png" 
                alt="Kathmandu Office Interior" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar strip */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-4 border-b border-slate-100 dark:border-slate-900 overflow-hidden relative">
        <div className="flex items-center" style={{ animation: "marquee 35s linear infinite", whiteSpace: "nowrap" }}>
          {Array.from({ length: 4 }).flatMap(() => [
            "Fast & Reliable WiFi Internet",
            "Fresh Nepalese Coffee Everyday",
            "Power Backup for Continuous Work",
            "Private Meeting Rooms for Teams",
          ]).map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs font-semibold px-8 text-slate-500 dark:text-slate-400">
              {item}
              <span className="text-slate-300 dark:text-slate-800 ml-4 font-light">/</span>
            </span>
          ))}
        </div>
      </section>

      {/* Tour Preview Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-b border-slate-100 dark:border-slate-900">
        <div className="text-left mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Layout Preview</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white mt-1">Virtual Workspace Tour</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mt-2">
            Click on any zone below to examine specific design dimensions and active environment assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.map((t) => (
            <div
              key={t.title}
              onClick={() => setShowTourModal(t)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition duration-200"
            >
              <ImageWithSkeleton src={t.img} alt={t.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-base font-bold text-white leading-tight">{t.title}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Space Tour Modal */}
      {showTourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs" onClick={() => setShowTourModal(null)} />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowTourModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 border border-slate-150 dark:border-slate-800">
              <ImageWithSkeleton src={showTourModal.img} alt={showTourModal.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{showTourModal.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">{showTourModal.desc}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTourModal(null)}
                className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amenities Showcase */}
      <section className="bg-slate-50/50 dark:bg-slate-900/10 py-20 border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-left mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Amenities</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white mt-1">Productive Environment</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mt-2">
              Every detail is engineered to support seamless office operations and daily corporate focus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((a) => (
              <div
                key={a.title}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-start gap-4"
              >
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/80 shrink-0">
                  {a.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{a.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans Section (Integrated with Checkout) */}
      <section id="plans" className="max-w-7xl mx-auto px-6 py-20 border-b border-slate-100 dark:border-slate-900">
        <div className="text-left mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Memberships</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white mt-1">Select Workspace Plan</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mt-2">
            Select a plan below to add it directly to your shopping cart. Purchases can be verified instantly via Cash on Delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {coworkingPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition duration-150 group"
            >
              <div>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-5 border border-slate-150 dark:border-slate-800">
                  <ImageWithSkeleton src={plan.image} alt={plan.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-slate-900/90 dark:bg-slate-950/90 border border-slate-850 text-[9px] font-bold uppercase px-2 py-0.5 rounded text-white dark:text-slate-300">
                    {plan.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-amber-600 dark:text-amber-500">Rs. {plan.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 font-medium">/ {plan.period}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-3 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  {plan.description}
                </p>

                <ul className="mt-5 space-y-2 text-xs">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  onClick={() => handleBookNow(plan)}
                  className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-850 dark:hover:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl text-xs transition duration-150 cursor-pointer"
                >
                  Book Workspace Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form CTA Section */}
      <section id="book" className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 shadow-sm">
          
          <div className="text-left mb-8">
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">Request Site Tour</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              Provide your scheduling preference below to arrange a physical space view or corporate walkthrough.
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 transition cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Workspace Category</label>
              <select
                value={bookingForm.plan}
                onChange={(e) => setBookingForm({ ...bookingForm, plan: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                <option value="hot-desk">Daily Shared Hot Desk Pass</option>
                <option value="dedicated-desk">Monthly Dedicated Fixed Desk</option>
                <option value="private-suite">Monthly Corporate Private Suite</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Message Details</label>
              <textarea
                placeholder="Details regarding team layout or custom scheduling..."
                value={bookingForm.message}
                onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                rows="3"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 transition resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-850 dark:hover:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl text-xs transition duration-150 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4.5 w-4.5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Tour Schedule...
                  </>
                ) : (
                  "Request Site Visit Schedule"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CoworkingPage;

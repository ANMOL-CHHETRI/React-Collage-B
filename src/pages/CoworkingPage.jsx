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
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
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
      name: "Shared Hot Desk (Daily Pass)",
      price: 999,
      badge: "Flex Space",
      category: "Co-Working Space",
      image: "https://i.pinimg.com/736x/2b/9e/7b/2b9e7b2354c4146a8cd24d7db8f3cc3b.jpg",
      description: "Get 1-day flex access to high-speed WiFi, hot desks, unlimited high-altitude organic coffee, and printing facilities.",
      features: [
        "Aromatic organic tea & coffee",
        "1000 Mbps blazing fiber internet",
        "Comfortable lounge access",
        "Power backup system",
      ],
    },
    {
      id: 1002,
      name: "Dedicated Desk (Monthly Pass)",
      price: 14999,
      badge: "Fixed Desk",
      category: "Co-Working Space",
      image: "https://i.pinimg.com/736x/8f/c9/7b/8fc97bcd7dc23c8a980ebc4abdfd5a23.jpg",
      description: "Your own permanent desk setup in a shared room. Best for remote builders and creators looking for structural focus.",
      features: [
        "Ergonomic desk & chair",
        "Free 5 hours meeting room credits",
        "Secure locker storage cabinet",
        "Business address mail service",
      ],
    },
    {
      id: 1003,
      name: "Premium Private Suite (Monthly)",
      price: 49999,
      badge: "Private Office",
      category: "Co-Working Space",
      image: "https://i.pinimg.com/736x/5e/5c/7e/5e5c7e0988e404b9e28f3cb29dfbfcd0.jpg",
      description: "Fully furnished modern glass cabins custom-built for high-performance squads of 4-6 members.",
      features: [
        "Private lockable secure suite",
        "Unlimited meeting room credits",
        "Dedicated corporate assistant",
        "Company branding on directory",
      ],
    },
  ];

  const amenities = [
    {
      title: "Gigabit Fiber WiFi",
      desc: "Dual-redundant high speed internet line keeping you online no matter what.",
      icon: (
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10.5 10.5 0 0114.14 0M1.414 7.05a16.5 16.5 0 0121.172 0" />
        </svg>
      ),
    },
    {
      title: "Organic Cafe Lounge",
      desc: "Free orthodox tea from Ilam and micro-lot Arabica coffee beans brewed fresh.",
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707" />
        </svg>
      ),
    },
    {
      title: "Silent Focus Cabins",
      desc: "Soundproof phone booths and quiet study areas for optimal deep focus sessions.",
      icon: (
        <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      title: "Smart Meeting Rooms",
      desc: "Equipped with large presentation displays, whiteboards, and high-res conferencing camera.",
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "24/7 Power & Generator",
      desc: "Full automatic load shedding generator protection keeping you productive.",
      icon: (
        <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Print & Tech Hub",
      desc: "Access scanning, secure heavy-duty laser printing, and tech accessories.",
      icon: (
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
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
      title: "Hot Desking Zone",
      desc: "Dynamic open space with high ceilings, plenty of direct natural light, and modern modular shared desks.",
      img: "https://i.pinimg.com/736x/2b/9e/7b/2b9e7b2354c4146a8cd24d7db8f3cc3b.jpg",
    },
    {
      title: "Conference & Meeting Pod",
      desc: "Acoustically soundproofed, premium presentation display, and seating for teams of up to 10.",
      img: "https://i.pinimg.com/736x/8f/c9/7b/8fc97bcd7dc23c8a980ebc4abdfd5a23.jpg",
    },
    {
      title: "Premium Lounge & Cafe",
      desc: "Perfect place to unwind, network, and enjoy free loose-leaf teas and fresh coffees.",
      img: "https://i.pinimg.com/736x/5e/5c/7e/5e5c7e0988e404b9e28f3cb29dfbfcd0.jpg",
    },
  ];

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans selection:bg-purple-500 selection:text-white overflow-hidden pb-16">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 md:pt-36 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 shadow-inner backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                High-Performance Spaces
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-400">
              Co-Work & Build <br />
              In Kathmandu
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Elevate your workspace. Settle into premium shared workspaces, dedicated offices, and high-tech meeting pods in the heart of Nepal. Complete with high-speed fiber internet and free organic local tea.
            </p>

            {/* Quick stats board */}
            <div className="grid grid-cols-3 gap-4 max-w-md pt-4 mx-auto lg:mx-0">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-3 border border-slate-700/40 text-center">
                <span className="text-xl sm:text-2xl font-black text-indigo-400 block">1000M</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fiber WiFi</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-3 border border-slate-700/40 text-center">
                <span className="text-xl sm:text-2xl font-black text-purple-400 block">77</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Districts Open</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-3 border border-slate-700/40 text-center">
                <span className="text-xl sm:text-2xl font-black text-amber-500 block">Free</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Local Coffee</span>
              </div>
            </div>

            <div className="pt-6 flex justify-center lg:justify-start gap-4">
              <a href="#plans" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer transform hover:-translate-y-0.5 active:scale-95">
                Explore Plans
              </a>
              <a href="#book" className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-8 py-4 rounded-xl shadow-sm border border-slate-700/60 hover:text-white transition duration-200 cursor-pointer active:scale-95">
                Book a Free Tour
              </a>
            </div>
          </div>

          {/* Floating glass dashboard on right */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-xl animate-pulse" />
            <div className="relative bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-bold text-slate-500">Live Space Monitor</span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Daily Active Builders</span>
                    <span className="text-emerald-400 font-black flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      42 Online
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
                  <span className="text-xs text-slate-400 font-medium block">Himalayan Coffee Brewer</span>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-xs text-amber-500 font-bold">Ilam Tea & Arabica beans</span>
                    <span className="text-xs text-slate-500">Unlimited supply</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Office Location</span>
                    <span className="text-xs font-bold text-slate-200">New Baneshwor, Kathmandu</span>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">
                    Map Pin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar scrolling marquee strip */}
      <section className="bg-slate-950 py-4 border-y border-slate-800/60 overflow-hidden relative">
        <div className="flex items-center" style={{ animation: "marquee 25s linear infinite", whiteSpace: "nowrap" }}>
          {Array.from({ length: 4 }).flatMap(() => [
            "⚡ Redundant Gigabit Fiber Lines",
            "⚡ Free Unlimited Organic Tea & Coffee",
            "⚡ 24/7 Power Generator Backup",
            "⚡ Smart Meeting Rooms Sized 4-12",
          ]).map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs font-bold px-8 text-slate-400">
              {item}
              <span className="text-slate-800 ml-4">|</span>
            </span>
          ))}
        </div>
      </section>

      {/* Tour Preview Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Explore the environment</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">Virtual Space Tour</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
            Click on any space below to reveal its architectural specifications and active workspace features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.map((t, idx) => (
            <div
              key={t.title}
              onClick={() => setShowTourModal(t)}
              className="group relative rounded-2xl overflow-hidden aspect-video md:aspect-[4/3] shadow-lg border border-slate-800 bg-slate-900 cursor-pointer hover:border-indigo-500/50 hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              <ImageWithSkeleton src={t.img} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Preview Zone 0{idx+1}</span>
                <h3 className="text-lg font-bold text-white leading-tight mt-1">{t.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Space Tour Modal */}
      {showTourModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowTourModal(null)} />
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowTourModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4">
              <ImageWithSkeleton src={showTourModal.img} alt={showTourModal.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-white">{showTourModal.title}</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">{showTourModal.desc}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTourModal(null)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amenities Showcase */}
      <section className="bg-slate-950/40 py-20 border-y border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Amenities Showcase</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">Built For Peak Builders</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
              Every detail is engineered to support seamless corporate execution and individual deep focus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((a) => (
              <div
                key={a.title}
                className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 hover:border-slate-700/60 hover:bg-slate-800/50 hover:-translate-y-1.5 transition-all duration-300 shadow-lg flex items-start gap-4"
              >
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  {a.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200">{a.title}</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans Section (Integrated with Checkout) */}
      <section id="plans" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Membership options</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">Select Your Plan</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
            Select a plan to add it directly to your shopping cart. You can complete the booking instantly using Cash on Delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {coworkingPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-slate-800/20 border border-slate-700/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 hover:-translate-y-1 transition duration-300 relative overflow-hidden group"
            >
              {plan.badge === "Fixed Desk" && (
                <div className="absolute -top-3.5 -right-12 w-32 h-10 bg-indigo-500 text-slate-900 flex items-center justify-center font-bold text-[9px] uppercase tracking-wider rotate-45" />
              )}
              
              <div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-5 border border-slate-700/30">
                  <ImageWithSkeleton src={plan.image} alt={plan.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md text-slate-300">
                    {plan.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-500">Rs. {plan.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-500">/ pass</span>
                </div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed border-t border-slate-800 pt-3">
                  {plan.description}
                </p>

                <ul className="mt-5 space-y-2 text-xs">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => handleBookNow(plan)}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-xs transition duration-200 active:scale-95 shadow-md shadow-indigo-500/10 cursor-pointer"
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
        <div className="relative bg-slate-800/20 border border-slate-700/40 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
          <div className="absolute top-0 right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
          
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Request Private Consultation</h2>
            <p className="text-slate-400 text-xs mt-1.5">
              Fill out the schedule below to coordinate a physical tour or corporate presentation.
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-600 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-600 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-600 transition cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Selected Plan interest</label>
              <select
                value={bookingForm.plan}
                onChange={(e) => setBookingForm({ ...bookingForm, plan: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-indigo-500 text-slate-300 transition cursor-pointer"
              >
                <option value="hot-desk">Daily Shared Hot Desk Pass</option>
                <option value="dedicated-desk">Monthly Dedicated Fixed Desk</option>
                <option value="private-suite">Monthly Corporate Private Suite</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Optional Message</label>
              <textarea
                placeholder="Let us know if you have specific team size requirements..."
                value={bookingForm.message}
                onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                rows="3"
                className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-600 transition resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition duration-200 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4.5 w-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scheduling consultation...
                  </>
                ) : (
                  "Request Free Tour Schedule"
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

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    title: "Authentic Goods",
    description:
      "Sourced directly from local cooperatives and rural artisans across all 7 provinces of Nepal.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-100 dark:border-amber-900/30",
  },
  {
    title: "Fast Nepal Delivery",
    description:
      "Express shipping to all 77 districts. Free delivery on orders over Rs. 2,000.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    color: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-100 dark:border-blue-900/30",
  },
  {
    title: "Cash on Delivery",
    description:
      "Pay safely in cash at your door. No card required — shop with complete peace of mind.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-100 dark:border-emerald-900/30",
  },
];

const stats = [
  {
    value: "500+",
    label: "Products",
    icon: (
      <svg
        className="w-6 h-6 text-amber-600 dark:text-amber-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
  {
    value: "100+",
    label: "Local Sellers",
    icon: (
      <svg
        className="w-6 h-6 text-amber-600 dark:text-amber-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    value: "77",
    label: "Districts Served",
    icon: (
      <svg
        className="w-6 h-6 text-amber-600 dark:text-amber-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
  {
    value: "24/7",
    label: "Customer Support",
    icon: (
      <svg
        className="w-6 h-6 text-amber-600 dark:text-amber-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
];

const team = [
  {
    name: "Bikram Thapa",
    role: "Founder & CEO",
    avatar: "BT",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Sita Gurung",
    role: "Head of Operations",
    avatar: "SG",
    color: "from-rose-400 to-pink-500",
  },
  {
    name: "Anil Rai",
    role: "Chief Technology Officer",
    avatar: "AR",
    color: "from-blue-400 to-indigo-500",
  },
];

const AboutPage = () => {
  const navigate = useNavigate();
  const { theme } = useAuth();

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white">
        {/* background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-5 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            About ShopEase Nepal
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Connecting Nepal Through
            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mt-2">
              Local Commerce
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed mb-12">
            ShopEase Nepal is an online marketplace that connects customers with
            authentic Nepali products. From traditional clothing and handmade
            crafts to fresh organic products, we empower local businesses while
            providing customers with a trusted shopping experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-amber-900/40 hover:shadow-amber-900/60 hover:scale-105"
            >
              Explore Products
            </button>
            <button
              onClick={() => navigate("/delivery-coverage")}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              View Delivery Map
            </button>
          </div>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </section>

      {/* ── Mission & Vision ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
            Our Purpose
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            What Drives Us Forward
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="group relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 rounded-3xl p-8 border border-amber-100 dark:border-amber-900/30 overflow-hidden hover:shadow-xl hover:shadow-amber-100/60 dark:hover:shadow-amber-950/40 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-300/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-200 dark:shadow-amber-950/50">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                To empower local farmers, artisans, and small businesses by
                providing an easy-to-use online marketplace where they can reach
                customers across Nepal and grow their livelihoods digitally.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/30 overflow-hidden hover:shadow-xl hover:shadow-blue-100/60 dark:hover:shadow-blue-950/40 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-200 dark:shadow-blue-950/50">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Our Vision
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                A future where every local producer has equal opportunities to
                grow digitally while preserving Nepal's rich cultural heritage
                and traditions for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Statistics ── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-900 py-20 relative overflow-hidden transition-colors duration-300">
        <div
          className="absolute inset-0 opacity-15 dark:opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
              By The Numbers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              ShopEase at a Glance
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/30 flex items-center justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text mb-2">
                  {stat.value}
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="inline-block text-md font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
            Why Us
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Why Choose ShopEase Nepal?
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            We're built for Nepal — by Nepalis, for Nepalis.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative ${feature.bg} border ${feature.border} rounded-3xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}
            >
              <div
                className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700`}
              />
              <div
                className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-lg`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-md font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
              The People
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Meet Our Team
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              A passionate team dedicated to uplifting Nepal's local economy
              through technology.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <div
                key={i}
                className="text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-slate-800/50 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xl font-extrabold mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {member.avatar}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                  {member.name}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Support Local. Shop Smart.
          </h2>
          <p className="text-white/85 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            Every purchase helps local farmers, artisans, and small businesses
            grow while bringing authentic Nepali products to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-10 py-4 bg-white text-orange-600 font-extrabold rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:scale-105"
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate("/user-login")}
              className="px-10 py-4 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-2xl border border-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

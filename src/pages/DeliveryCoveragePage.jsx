import { useState } from "react"
import { Link } from "react-router-dom"
import NepalDeliveryMap from "../components/NepalDeliveryMap"
import Footer from "../components/Footer"

const DeliveryCoveragePage = () => {
  const [selectedProvince, setSelectedProvince] = useState("bagmati")

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Page Header Banner */}
      <section className="relative py-14 text-white bg-gradient-to-r from-amber-500 to-orange-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-black/15 rounded-full blur-2xl" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-bold text-white">Delivery Coverage</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            🗺 Nepal Delivery Coverage
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl font-medium mt-2 leading-relaxed">
            We deliver to all 7 provinces of Nepal with Cash on Delivery. Click a province on the map
            to check delivery speed, shipping fees, and logistics hubs in your region.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-10">
          <NepalDeliveryMap
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
            showDetails={true}
            compact={false}
          />
        </div>
      </section>

      {/* Info Cards */}
      <section className="pb-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Same-Day Delivery",
              desc: "Available in Kathmandu Valley. Orders placed before 2 PM are delivered the same evening.",
              badge: "Express",
              badgeColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: "Cash on Delivery",
              desc: "Pay only when your order arrives. No advance payment required. 100% safe and convenient.",
              badge: "COD",
              badgeColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              ),
              title: "7 Provinces Covered",
              desc: "We ship to every province in Nepal — from Sudurpashchim to Koshi, including remote hill districts.",
              badge: "Nationwide",
              badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{card.title}</h3>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  )
}

export default DeliveryCoveragePage

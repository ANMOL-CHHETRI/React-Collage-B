import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Footer = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const year = new Date().getFullYear()

  return (
    <>
      <footer className="bg-slate-950 text-slate-400 relative overflow-hidden">
        {/* Subtle mesh background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          
          {/* Top section: Brand + Links */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-14">
            
            {/* Brand column */}
            <div className="col-span-2 md:col-span-4 space-y-5">
              <Link to="/" className="flex items-center gap-2.5 group w-fit">
                <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Shop<span className="text-amber-500">Ease</span> <span className="text-slate-400 font-medium">Nepal</span>
                </span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Your premium destination for authentic Nepalese handicrafts, organic tea, and traditional apparel. Sourced directly from local cooperatives.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
              {[
                  { label: "Facebook", href: "https://www.facebook.com/", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                  { label: "Instagram", href: "https://www.instagram.com/", path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:text-amber-400 text-slate-500 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-slate-800 hover:border-amber-500/30">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                    </svg>
                  </a>
                ))}
                {/* TikTok */}
                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:text-amber-400 text-slate-500 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-slate-800 hover:border-amber-500/30">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.28 8.28 0 004.84 1.54V7.05a4.85 4.85 0 01-1.07-.36z" />
                  </svg>
                </a>
              </div>

              {/* Payment methods */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-600">We Accept</p>
                <div className="flex items-center gap-2">
                  <Link
                    to="/policy#cod"
                    className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200 cursor-pointer"
                  >
                    COD
                  </Link>
                  <a
                    href="https://esewa.com.np"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200 cursor-pointer"
                  >
                    eSewa
                  </a>
                  <a
                    href="https://khalti.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200 cursor-pointer"
                  >
                    Khalti
                  </a>
                </div>
              </div>
            </div>

            {/* Catalog column */}
            <div className="md:col-span-2 md:col-start-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Catalog</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "Apparel", cat: "Traditional Apparel" },
                  { label: "Tea & Coffee", cat: "Organic Tea & Coffee" },
                  { label: "Handicrafts", cat: "Local Handicrafts" },
                  { label: "Herbs & Spices", cat: "Herbs & Spices" },
                ].map(({ label, cat }) => (
                  <li key={label}>
                    <Link to={`/category/${encodeURIComponent(cat)}`} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-amber-500 transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "About Us", to: "/about" },
                  { label: "Delivery Coverage", to: "/delivery-coverage" },
                  { label: "FAQ", to: "/faq" },
                  { label: "Contact", to: "/contact" },
                  { label: "User Login", to: "/user-login" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <NavLink to={to} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-amber-500 transition-colors" />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal + Contact */}
            {!isAdmin && (
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal</h4>
                <ul className="space-y-2.5 text-sm">
                  {user && (
                    <li>
                      <Link to="/policy#privacy" className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-amber-500 transition-colors" />
                        Privacy Policy
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/policy#terms" className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-amber-500 transition-colors" />
                      Terms of Use
                    </Link>
                  </li>
                  <li>
                    <Link to="/policy#cod" className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-amber-500 transition-colors" />
                      COD Policy
                    </Link>
                  </li>
                </ul>

                <div className="pt-3 space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Address</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    New Baneshwor, Kathmandu<br />
                    Bagmati, Nepal<br />
                    <a href="mailto:support@shopease.com.np" className="hover:text-amber-400 transition-colors">support@shopease.com.np</a>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800/70 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              © {year} <span className="text-slate-500 font-semibold">ShopEase Nepal Pvt. Ltd.</span> All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </div>
            {!isAdmin && (
              <div className="flex gap-5 text-xs text-slate-600">
                {user && (
                  <Link to="/policy#privacy" className="hover:text-amber-400 transition-colors">Privacy</Link>
                )}
                <Link to="/policy#terms" className="hover:text-amber-400 transition-colors">Terms</Link>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">Support</Link>
              </div>
            )}
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer

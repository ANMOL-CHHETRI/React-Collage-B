import { Link, NavLink } from "react-router-dom"

const Footer = () => {

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-950 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-10 gap-8 mb-12">
            
            {/* Brand column */}
            <div className="col-span-2 md:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Shop<span className="text-amber-500">Ease</span>
                </span>
              </Link>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your premium destination for authentic Nepalese handicrafts, garments,
                organic tea, and mountain coffee. Sourced directly from local cooperatives
                supporting micro-enterprises.
              </p>
            </div>

            {/* Catalog column */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Catalog</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to={`/category/${encodeURIComponent("Traditional Apparel")}`}
                    className="hover:text-amber-500 transition-colors text-left block"
                  >
                    Apparel
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/category/${encodeURIComponent("Organic Tea & Coffee")}`}
                    className="hover:text-amber-500 transition-colors text-left block"
                  >
                    Tea & Coffee
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/category/${encodeURIComponent("Local Handicrafts")}`}
                    className="hover:text-amber-500 transition-colors text-left block"
                  >
                    Handicrafts
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/category/${encodeURIComponent("Herbs & Spices")}`}
                    className="hover:text-amber-500 transition-colors text-left block"
                  >
                    Herbs & Spices
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links column */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <NavLink to="/about" className="hover:text-amber-500 transition-colors">
                    About Us
                  </NavLink>
                </li>
                <li>
                  <Link to="/delivery-coverage" className="hover:text-amber-500 transition-colors">
                    Delivery Coverage
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-amber-500 transition-colors">
                    Help FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/user-login" className="hover:text-amber-500 transition-colors">
                    User Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal column */}
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

            {/* Office Address column */}
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

          {/* Bottom Bar */}
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
    </>
  )
}

export default Footer

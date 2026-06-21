import { useState } from "react"
import { Link, NavLink } from "react-router"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const { cartCount, setIsCartOpen } = useCart()
  const { user, logout } = useAuth()

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 py-1.5 px-3 rounded-full ${
      isActive
        ? "text-orange-600 bg-orange-50/50"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ShopEase <span className="text-amber-600 font-semibold">Nepal</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            <NavLink to="/about" className={linkClass}>About</NavLink>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown("features")}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-1.5 px-3 rounded-full transition-colors duration-200 cursor-pointer"
              >
                Categories
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "features" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openDropdown === "features" && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">Catalog</div>
                    {[
                      { name: "Traditional Apparel", desc: "Dhaka clothes, Pashmina shawl", path: "/" },
                      { name: "Organic Tea & Coffee", desc: "Himalayan orthodox tea, local coffee", path: "/" },
                      { name: "Local Handicrafts", desc: "Handmade sculptures, pottery", path: "/" },
                      { name: "Herbs & Spices", desc: "Organic cardamom, honey, turmeric", path: "/" },
                    ].map((item) => (
                      <Link 
                        key={item.name} 
                        to={item.path} 
                        onClick={() => setOpenDropdown(null)}
                        className="block px-3 py-2 rounded-xl hover:bg-amber-50/50 group transition-colors"
                      >
                        <div className="text-sm font-medium text-slate-700 group-hover:text-amber-600 transition-colors">{item.name}</div>
                        <div className="text-xs text-slate-400 group-hover:text-amber-500/70 transition-colors">{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <a href="#delivery" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-1.5 px-3 rounded-full transition-all duration-200">Delivery Coverage</a>
            <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-1.5 px-3 rounded-full transition-all duration-200">FAQ</a>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-colors duration-200 relative cursor-pointer"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {user?.role === "user" ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">Hi, {user.name}</span>
                <Link to="/user/dashboard" className="text-sm text-amber-600 font-medium hover:underline">My Account</Link>
                <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600 transition cursor-pointer">Logout</button>
              </div>
            ) : (
              <Link
                to="/user-login"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:from-amber-600 hover:to-orange-700 transition-all duration-250 shadow-md shadow-amber-500/15 flex items-center gap-1.5 hover:shadow-lg hover:shadow-amber-500/25 group"
              >
                User Login
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2 animate-in fade-in duration-200">
            <NavLink to="/about" className="block py-2 px-3 text-base font-medium text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsOpen(false)}>About</NavLink>
            
            <button 
              onClick={() => toggleDropdown("mobile-features")} 
              className="flex items-center justify-between w-full py-2 px-3 text-base font-medium text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <span>Categories</span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${openDropdown === "mobile-features" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openDropdown === "mobile-features" && (
              <div className="pl-6 space-y-1 py-1 border-l-2 border-slate-100 ml-4">
                {[
                  { name: "Traditional Apparel", path: "/" },
                  { name: "Organic Tea & Coffee", path: "/" },
                  { name: "Local Handicrafts", path: "/" },
                  { name: "Herbs & Spices", path: "/" },
                ].map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    className="block py-2 px-3 text-sm text-slate-600 rounded-lg hover:bg-slate-50" 
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            
            <a href="#delivery" className="block py-2 px-3 text-base font-medium text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsOpen(false)}>Delivery Coverage</a>
            <a href="#faq" className="block py-2 px-3 text-base font-medium text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setIsOpen(false)}>FAQ</a>
            
            {/* Cart link for mobile */}
            <button 
              onClick={() => { setIsOpen(false); setIsCartOpen(true); }}
              className="flex items-center justify-between w-full py-2 px-3 text-base font-medium text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <span>My Cart</span>
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>

            {user?.role === "user" ? (
              <>
                <Link to="/user/dashboard" className="block py-2 px-3 text-base font-medium text-amber-600 rounded-xl hover:bg-slate-50" onClick={() => setIsOpen(false)}>My Account</Link>
                <div className="pt-4 border-t border-slate-100">
                  <div className="px-3 py-2 text-sm text-slate-500">Signed in as {user.name}</div>
                  <button onClick={() => { setIsOpen(false); logout() }} className="w-full text-center py-2.5 text-red-600 font-medium rounded-xl border border-red-200 hover:bg-red-50 cursor-pointer mt-2">Logout</button>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-slate-100">
                <Link to="/user-login" className="w-full text-center py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-700 shadow-md shadow-amber-500/10 block" onClick={() => setIsOpen(false)}>User Login</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

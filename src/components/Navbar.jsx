import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout, registeredUsers, theme, toggleTheme } = useAuth();
  const { wishlistCount } = useWishlist();

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-all duration-200 py-1.5 px-3 rounded-full group ${
      isActive
        ? "text-amber-600 dark:text-amber-400"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
    }`;

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const dbUser = user && (user.role === "user" || user.role === "sub-admin") ? (registeredUsers || []).find(u => u.username === user.username) : null;
  const hasViolations = dbUser && dbUser.violations > 0;

  return (
    <nav className={`sticky top-0 z-50 text-slate-800 dark:text-slate-100 transition-all duration-300 ${
      scrolled
        ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 border-b border-slate-200/60 dark:border-slate-800/60"
        : "bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100/80 dark:border-slate-800/50"
    }`}>
      {hasViolations && (
        <div className="bg-red-600 text-white text-center py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Warning: {dbUser.violations} violation(s) detected on your account! Please review our policies to avoid a permanent ban.</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img referrerPolicy="no-referrer" src="/logo.png" alt="ShopEase Nepal" className="w-8 h-8 rounded-lg object-cover shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-lg bg-amber-400/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ShopEase <span className="text-amber-600 font-semibold">Nepal</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("features")}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 py-1.5 px-3 rounded-full transition-colors duration-200 cursor-pointer"
              >
                Categories
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "features" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openDropdown === "features" && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpenDropdown(null)}
                  />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-3 py-1 uppercase tracking-wider">
                      Catalog
                    </div>
                    {[
                      {
                        name: "Traditional Apparel",
                        desc: "Dhaka clothes, Pashmina shawl",
                      },
                      {
                        name: "Organic Tea & Coffee",
                        desc: "Himalayan orthodox tea, local coffee",
                      },
                      {
                        name: "Local Handicrafts",
                        desc: "Handmade sculptures, pottery",
                      },
                      {
                        name: "Herbs & Spices",
                        desc: "Organic cardamom, honey, turmeric",
                      },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        to={`/category/${encodeURIComponent(item.name)}`}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-3 py-2 rounded-xl hover:bg-amber-50/50 dark:hover:bg-amber-950/20 group transition-colors"
                      >
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-amber-500/70 dark:group-hover:text-amber-400/75 transition-colors">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {user?.role !== "admin" && (
              <NavLink to="/contact" className={linkClass}>
                Contact
              </NavLink>
            )}
            <NavLink to="/delivery-coverage" className={linkClass}>
              Delivery Coverage
            </NavLink>
            <NavLink to="/faq" className={linkClass}>
              FAQ
            </NavLink>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-200 cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? (
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              ) : (
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <Link
              to="/wishlist"
              className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 relative cursor-pointer"
              title="Wishlist"
            >
              <svg className={`w-5.5 h-5.5 ${wishlistCount > 0 ? "animate-bounce" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-200 relative cursor-pointer"
            >
              <svg
                className="w-5.5 h-5.5"
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
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              to={
                user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
              }
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-200"
              title={
                user?.role === "admin" ? "Admin Dashboard" : "Account Dashboard"
              }
            >
              <svg
                className="w-5.5 h-5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Hi, {user.name}
                </span>
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : "/user/dashboard"
                  }
                  className="text-sm text-amber-600 font-medium hover:underline"
                >
                  {user.role === "admin" ? "Admin Panel" : "My Account"}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
                >
                  <svg
                    className="w-4.5 h-4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/user-login"
                  className="bg-slate-950 dark:bg-slate-100 dark:text-slate-950 text-white text-sm font-medium px-4.5 py-2 rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-250 hover:shadow-lg"
                >
                  Log in
                </Link>
                <Link
                  to="/user-login?signup=1"
                  className="bg-linear-to-r from-amber-500 to-orange-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:from-amber-600 hover:to-orange-700 transition-all duration-250 shadow-md shadow-amber-500/15 flex items-center gap-1.5 hover:shadow-lg group"
                >
                  Sign up
                  <svg
                    className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
            <NavLink
              to="/about"
              className="block py-2 px-3 text-base font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>

            <button
              onClick={() => toggleDropdown("mobile-features")}
              className="flex items-center justify-between w-full py-2 px-3 text-base font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
            >
              <span>Categories</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${openDropdown === "mobile-features" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openDropdown === "mobile-features" && (
              <div className="pl-6 space-y-1 py-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
                {[
                  { name: "Traditional Apparel" },
                  { name: "Organic Tea & Coffee" },
                  { name: "Local Handicrafts" },
                  { name: "Herbs & Spices" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={`/category/${encodeURIComponent(item.name)}`}
                    className="block py-2 px-3 text-sm text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <NavLink
              to="/delivery-coverage"
              className="block py-2 px-3 text-base font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => setIsOpen(false)}
            >
              Delivery Coverage
            </NavLink>
            <NavLink
              to="/faq"
              className="block py-2 px-3 text-base font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </NavLink>

            {/* Cart link for mobile */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCartOpen(true);
              }}
              className="flex items-center justify-between w-full py-2 px-3 text-base font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
            >
              <span>My Cart</span>
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>

            <Link
              to={
                user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
              }
              className="block py-2 px-3 text-base font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => setIsOpen(false)}
            >
              {user?.role === "admin" ? "Admin Panel" : "My Account"}
            </Link>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {/* Theme Mode Toggle for Mobile */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between py-2.5 px-3 text-base font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              >
                <span>Theme Mode</span>
                <span className="text-sm font-bold text-orange-600 capitalize">
                  {theme}
                </span>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2.5 text-red-600 font-medium rounded-xl border border-red-200 hover:bg-red-50 cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/user-login"
                    className="w-full text-center py-2.5 text-slate-700 dark:text-slate-300 font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/user-login?signup=1"
                    className="w-full text-center py-2.5 bg-linear-to-r from-amber-500 to-orange-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-700 shadow-md shadow-amber-500/10"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout, registeredUsers, theme, toggleTheme } = useAuth();
  const { wishlistCount } = useWishlist();

  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_read_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const getNotifications = () => {
    if (!user) return [];
    try {
      const raw = localStorage.getItem("shopease_orders");
      const orders = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];

      const userOrders = orders.filter(
        (o) =>
          o &&
          (o.username === user.username ||
            o.fullName === user.name ||
            user.role === "admin" ||
            user.username === "user"),
      );

      const list = [];
      userOrders.forEach((o) => {
        const orderId = o.orderId || o.id;
        if (o.adminMessage) {
          list.push({
            id: `msg-${orderId}-${o.adminMessage.substring(0, 10)}`,
            orderId,
            type: "message",
            title: "Support Message",
            description: `Order ${orderId}: "${o.adminMessage}"`,
            date: o.date || new Date().toISOString(),
          });
        }
        if (o.status && o.status !== "Pending") {
          list.push({
            id: `status-${orderId}-${o.status}`,
            orderId,
            type: "status",
            title: "Order Status Update",
            description: `Order ${orderId} is now "${o.status}".`,
            date: o.date || new Date().toISOString(),
          });
        }
      });
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch {
      return [];
    }
  };

  const allNotifications = getNotifications();
  const unreadCount = allNotifications.filter(
    (n) => !readNotifications.includes(n.id),
  ).length;

  const markAsRead = (id) => {
    setReadNotifications((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem("shopease_read_notifications", JSON.stringify(next));
      return next;
    });
  };

  const markAllAsRead = (notifications) => {
    const ids = notifications.map((n) => n.id);
    setReadNotifications((prev) => {
      const next = Array.from(new Set([...prev, ...ids]));
      localStorage.setItem("shopease_read_notifications", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-all duration-200 py-1.5 px-3 rounded-full group ${
      isActive
        ? "text-amber-600 dark:text-amber-400"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
    }`;

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const dbUser =
    user && (user.role === "user" || user.role === "sub-admin")
      ? (registeredUsers || []).find((u) => u.username === user.username)
      : null;
  const hasViolations = dbUser && dbUser.violations > 0;

  return (
    <nav
      className={`sticky top-0 z-50 text-slate-800 dark:text-slate-100 transition-all duration-300  ${
        scrolled
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 border-b border-slate-200/60 dark:border-slate-800/60"
          : "bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100/80 dark:border-slate-800/50"
      }`}
    >
      {hasViolations && (
        <div className="bg-red-600 text-white text-center py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            Warning: {dbUser.violations} violation(s) detected on your account!
            Please review our policies to avoid a permanent ban.
          </span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* <div className="relative">
              <img referrerPolicy="no-referrer" src="/logo.png" alt="ShopEase Nepal" className="w-8 h-8 rounded-lg object-cover shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-lg bg-amber-400/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
            </div> */}
            <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-5 h-5"
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
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              ShopEase{" "}
              <span className="text-amber-600 font-semibold">Nepal</span>
            </span>
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
            <NavLink to="/coworking" className={linkClass}>
              Coworking Space
            </NavLink>
            <NavLink to="/faq" className={linkClass}>
              FAQ
            </NavLink>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-48 lg:w-64 pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-800 dark:text-slate-200 placeholder-slate-400"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
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
            </form>
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
              <svg
                className={`w-5.5 h-5.5 ${wishlistCount > 0 ? "animate-bounce" : ""}`}
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

            {/* Desktop Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setOpenDropdown(null);
                  }}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-200 relative cursor-pointer"
                  title="Notifications"
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead(allNotifications)}
                            className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {allNotifications.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          allNotifications.map((notif) => {
                            const isUnread = !readNotifications.includes(
                              notif.id,
                            );
                            return (
                              <div
                                key={notif.id}
                                onClick={() => {
                                  markAsRead(notif.id);
                                  setNotificationsOpen(false);
                                }}
                                className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-2.5 ${
                                  isUnread
                                    ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100/50 dark:border-amber-900/30"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                                }`}
                              >
                                <div className="mt-0.5">
                                  {notif.type === "message" ? (
                                    <svg
                                      className="w-4 h-4 text-amber-500"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 text-emerald-500"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-2 4h.01M9 16h.01"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-800 dark:text-white">
                                      {notif.title}
                                    </span>
                                    {isUnread && (
                                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {notif.description}
                                  </p>
                                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-semibold">
                                    {new Date(notif.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      },
                                    )}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {!isDashboard && (
              <Link
                to={
                  user?.role === "admin"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                }
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-200"
                title={
                  user?.role === "admin"
                    ? "Admin Dashboard"
                    : "Account Dashboard"
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
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Hi, {user.name}
                </span>
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
                  Login
                </Link>
                <Link
                  to="/user-login?signup=1"
                  className="bg-linear-to-r from-amber-500 to-orange-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:from-amber-600 hover:to-orange-700 transition-all duration-250 shadow-md shadow-amber-500/15 flex items-center gap-1.5 hover:shadow-lg group"
                >
                  Signup
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

          {/* Mobile Actions and Toggle */}
          <div className="flex md:hidden items-center gap-1.5 relative">
            {/* Mobile Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setIsOpen(false);
                  }}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-200 relative cursor-pointer"
                  title="Notifications"
                >
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-[calc(100vw-2.5rem)] sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead(allNotifications)}
                            className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {allNotifications.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          allNotifications.map((notif) => {
                            const isUnread = !readNotifications.includes(
                              notif.id,
                            );
                            return (
                              <div
                                key={notif.id}
                                onClick={() => {
                                  markAsRead(notif.id);
                                  setNotificationsOpen(false);
                                }}
                                className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-2.5 ${
                                  isUnread
                                    ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100/50 dark:border-amber-900/30"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                                }`}
                              >
                                <div className="mt-0.5">
                                  {notif.type === "message" ? (
                                    <svg
                                      className="w-4 h-4 text-amber-500"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 text-emerald-500"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-2 4h.01M9 16h.01"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-800 dark:text-white">
                                      {notif.title}
                                    </span>
                                    {isUnread && (
                                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {notif.description}
                                  </p>
                                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-semibold">
                                    {new Date(notif.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      },
                                    )}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Profile Icon */}
            {user && (
              <Link
                to={
                  user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
                }
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-200 cursor-pointer"
                title="Account Dashboard"
                onClick={() => setIsOpen(false)}
              >
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setNotificationsOpen(false);
              }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
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
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
            {/* Mobile Search */}
            <div className="px-3 pb-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-800 dark:text-slate-200 placeholder-slate-400"
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
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
              </form>
            </div>
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
              to="/coworking"
              className="block py-2 px-3 text-base font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => setIsOpen(false)}
            >
              Coworking Space
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
                    Login
                  </Link>
                  <Link
                    to="/user-login?signup=1"
                    className="w-full text-center py-2.5 bg-linear-to-r from-amber-500 to-orange-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-700 shadow-md shadow-amber-500/10"
                    onClick={() => setIsOpen(false)}
                  >
                    Signup
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

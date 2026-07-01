import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { OrderCardUserSkeleton } from "../components/Skeleton"

const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(!src)
  const imgRef = useRef(null)

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true)
    }
  }, [src])

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
        src={error ? (fallbackSrc || "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg") : (src || "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg")}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${(loaded || error) ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
      />
    </div>
  )
}

const initialOrders = [
  {
    id: "#ORD-NP-92841",
    storeName: "Universal Mobile Zone",
    status: "Completed",
    date: "Jun 15, 2026",
    items: [
      {
        name: "Vivo V23E 4G/5G / Vivo Y75 4G (Same Size) Transparent Bumper Cover Case - Non-yellowing Soft TPU",
        attributes: "Compatibility By Model: Vivo V23e, Color Family: Black",
        price: 223,
        qty: 1,
        image: "https://i.pinimg.com/736x/3f/82/ff/3f82ff025c898c0d1279a557876a3e5c.jpg"
      }
    ]
  },
  {
    id: "#ORD-NP-81724",
    storeName: "Brothers Empire",
    status: "Completed",
    date: "Jun 10, 2026",
    items: [
      {
        name: "MAIBO Original Fashion Canvas Backpack College Bag Unisex Large Capacity Travel",
        attributes: "Color Family: Black",
        price: 1950,
        qty: 1,
        image: "https://i.pinimg.com/736x/11/49/74/114974246fa4d567c9c05e54d8ecdb2f.jpg"
      }
    ]
  },
  {
    id: "#ORD-NP-73918",
    storeName: "Patan Craft Cooperatives",
    status: "To Ship",
    date: "Jun 20, 2026",
    items: [
      {
        name: "Handmade Shakyamuni Buddha Statue (Gold Gilded)",
        attributes: "Material: Copper, Finish: 24k Gold Gilded",
        price: 18500,
        qty: 1,
        image: "https://i.pinimg.com/736x/8f/58/01/8f5801314672479768bada91c28c8dbb.jpg"
      }
    ]
  }
]

const UserDashboard = () => {
  const { user, updateProfile, changePassword, registeredUsers, theme, toggleTheme } = useAuth()
  const { addToCart, setIsCartOpen } = useCart()
  const navigate = useNavigate();

  const dbUser = user && user.role === "user" ? (registeredUsers || []).find(u => u.username === user.username) : null;
  const hasViolations = dbUser && dbUser.violations > 0;

  const [activeSection, setActiveSection] = useState("orders")
  const [activeTab, setActiveTab] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [orders] = useState(initialOrders)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const [profileName, setProfileName] = useState(user?.name || "Sahil Adhikari")
  const [profileEmail, setProfileEmail] = useState(user?.email || "user@test.com")
  const [profilePhone, setProfilePhone] = useState(user?.phone || "9841234567")
  const [profileAddress, setProfileAddress] = useState(user?.address || "New Baneshwor, Kathmandu")
  const [profileSaved, setProfileSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" })





  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      address: profileAddress,
    })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    setPasswordMessage({ type: "", text: "" })

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    const result = changePassword("user", currentPassword, newPassword)
    if (result.success) {
      setPasswordMessage({ type: "success", text: result.message })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setPasswordMessage({ type: "error", text: result.message })
    }
  }

  
  const handleBuyAgain = (items) => {
  items.forEach((item) => {
    addToCart({
      id: item.id || Math.floor(Math.random() * 1000000),
      name: item.name,
      price: item.price,
      image: item.image,
    });
  });

  alert("Items have been added to your cart successfully!");

  navigate("/");

  setTimeout(() => {
    setIsCartOpen(true);
  }, 100);
};
  

  // Filter orders based on active status tab and search query
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Tab filter
    if (activeTab === "All") return matchesSearch
    if (activeTab === "To Pay") return matchesSearch && order.status === "Pending"
    if (activeTab === "To Ship") return matchesSearch && order.status === "To Ship"
    if (activeTab === "To Receive") return matchesSearch && order.status === "Shipped"
    if (activeTab === "To Review(3)") return matchesSearch && order.status === "Completed"

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 p-6 flex flex-col shrink-0">
        
        {/* User Card */}
        <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-sm uppercase">
              {user?.name ? user.name[0] : "S"}
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">Hello,</span>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{user?.name || "Sahil Adhikari"}</h2>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Tree */}
        <nav className="space-y-6 flex-1 text-sm">
          
          {/* Group 1: Manage My Account */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Manage My Account</h3>
            <ul className={`space-y-1.5 pl-2 border-l-2 ${activeSection === "profile" ? "border-orange-500" : "border-slate-100 dark:border-slate-800"}`}>
              <li>
                <button 
                  onClick={() => setActiveSection("profile")} 
                  className={`w-full text-left font-medium block transition duration-200 cursor-pointer ${
                    activeSection === "profile" 
                      ? "text-orange-600 dark:text-orange-400 font-bold" 
                      : "text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400"
                  }`}
                >
                  My Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Group 2: My Orders */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">My Orders</h3>
            <ul className={`space-y-1.5 pl-2 border-l-2 ${activeSection === "orders" ? "border-orange-500" : "border-slate-100 dark:border-slate-800"}`}>
              <li>
                <button 
                  onClick={() => setActiveSection("orders")} 
                  className={`w-full text-left font-medium block transition duration-200 cursor-pointer ${
                    activeSection === "orders" 
                      ? "text-orange-600 dark:text-orange-400 font-bold" 
                      : "text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400"
                  }`}
                >
                  My Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Group 3: Settings */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Preferences</h3>
            <ul className={`space-y-1.5 pl-2 border-l-2 ${activeSection === "settings" ? "border-orange-500" : "border-slate-100 dark:border-slate-800"}`}>
              <li>
                <button
                  onClick={() => setActiveSection("settings")}
                  className={`w-full text-left font-medium block transition duration-200 cursor-pointer ${
                    activeSection === "settings"
                      ? "text-orange-600 dark:text-orange-400 font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400"
                  }`}
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Group 4: Sell on ShopEase */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <a href="#" className="font-bold text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 block flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sell On ShopEase
            </a>
          </div>
        </nav>

        {/* Back link */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 text-xs font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Store
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {hasViolations && (
          <div className="bg-red-600 text-white text-center py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shrink-0 animate-pulse">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Warning: You have {dbUser.violations} active violation(s) on your account. Please review our policies to avoid a permanent ban.</span>
          </div>
        )}

      {/* MAIN CONTENT AREA */}
      {activeSection === "orders" && (
        <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Orders</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Manage and track your delivery packages across Nepal.</p>
            </div>
          </div>

          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none">
            {["All", "To Pay", "To Ship", "To Receive", "To Review(3)"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-5 border-b-2 transition duration-200 cursor-pointer ${
                  activeTab === tab 
                    ? "border-orange-500 text-orange-600 dark:text-orange-400 font-bold" 
                    : "border-transparent hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by store name, order ID, or product name..."
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 pl-11 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500 transition shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-5">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <OrderCardUserSkeleton key={i} />
              ))
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <svg className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No orders found</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">There are no orders matching your current search or tab filter.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition duration-200 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{order.storeName}</h4>
                        <span className="text-[10px] text-slate-400 block">{order.id} • Order Date: {order.date}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      order.status === "Completed" 
                        ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30" 
                        : "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30"
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-1">
                        <img referrerPolicy="no-referrer" 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 rounded-xl object-cover bg-slate-50 dark:bg-slate-900 shrink-0 border border-slate-100 dark:border-slate-800"
                        />

                        <div className="flex-1 space-y-1">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer">
                            {item.name}
                          </h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {item.attributes}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto text-xs border-t border-slate-50 dark:border-slate-900 sm:border-0 pt-2 sm:pt-0">
                          <div className="text-slate-500 dark:text-slate-400">
                            <span className="text-[10px] text-slate-400 block uppercase">Quantity</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">Qty: {item.qty}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                            <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm">Rs. {item.price.toLocaleString()}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={() => alert("Thank you for contacting us! Seller will contact you shortly.")} className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl transition cursor-pointer">
                      Contact Seller
                    </button>
                    <button 
                      onClick={() => {
                        if (order.status === "Completed") {
                          handleBuyAgain(order.items)
                        } else {
                          alert(`Tracking order ${order.id}. Current status: ${order.status}`)
                        }
                      }} 
                      className="px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 text-[11px] font-bold rounded-xl transition shadow shadow-slate-950/10 cursor-pointer"
                    >
                      {order.status === "Completed" ? "Buy Again" : "Track Order"}
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </main>
      )}

      {activeSection === "profile" && (
        <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Edit your personal contact and delivery details.</p>
            </div>
          </div>

          {profileSaved && (
            <div className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Profile details updated successfully!
            </div>
          )}

          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 shadow-sm max-w-2xl space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Phone Number (Nepal)</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Default Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Change Password</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Must differ from your current password and the admin password.</p>

              {passwordMessage.text && (
                <div
                  className={`mb-4 p-3 rounded-xl text-xs font-semibold ${
                    passwordMessage.type === "success"
                      ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30"
                      : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Confirm Password</label>
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold py-3 px-6 rounded-xl transition cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      {activeSection === "settings" && (
        <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Manage your preferences and appearance.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 shadow-sm max-w-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Appearance</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Toggle between light and dark mode.</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  {theme === "dark" ? (
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Currently active</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer bg-gray-200 dark:bg-orange-500"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </main>
      )}

      </div>
    </div>
  )
}

export default UserDashboard

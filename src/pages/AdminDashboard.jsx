import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useProducts } from "../context/ProductContext"
import { useToast } from "../context/ToastContext"
import { ProductRowSkeleton, StatCardSkeleton } from "../components/Skeleton"
import { api } from "../utils/api"

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
        <div className="absolute inset-0 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-lg" />
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

const stats = [
  { label: "Total Revenue", value: "Rs. 4,82,500", change: "+12.5%", up: true, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Total Orders", value: "1,842", change: "+8.2%", up: true, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { label: "Total Products", value: "356", change: "+3.1%", up: true, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Total Users", value: "4,320", change: "-2.4%", up: false, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
]

const recentOrders = [
  { id: "#ORD-NP-001", customer: "Aarav Sharma", product: "Premium Dhaka Topi", amount: "Rs. 1,200", status: "Delivered" },
  { id: "#ORD-NP-002", customer: "Prerana Giri", product: "Himalayan Orthodox Tea", amount: "Rs. 850", status: "Processing" },
  { id: "#ORD-NP-003", customer: "Sonam Sherpa", product: "Pashmina Cashmere Shawl", amount: "Rs. 9,500", status: "Shipped" },
  { id: "#ORD-NP-004", customer: "Dinesh Chaudhary", product: "Wild Himalayan Honey", amount: "Rs. 1,500", status: "Pending" },
  { id: "#ORD-NP-005", customer: "Karan Adhikari", product: "Gorkha Khukuri", amount: "Rs. 4,500", status: "Delivered" },
]

const sidebarItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "users", label: "Users" },
  { id: "coupons", label: "Coupons" },
  { id: "reviews", label: "Reviews" },
  { id: "messages", label: "Messages" },
  { id: "settings", label: "Settings" },
]

const emptyForm = {
  name: "",
  price: "",
  category: "Traditional Apparel",

  image: "",
  image2: "",
  image3: "",
  image4: "",

  imageFile: null,

  description: "",
  stock: "0",
}

const AdminDashboard = () => {
  const { 
    user, 
    logoutAdmin, 
    registeredUsers, 
    updateUserViolations, 
    toggleUserBan, 
    theme,
    toggleTheme,
    changePassword,
    setExactUserViolations,
    autoCalculateViolations,
    adminResetUserPassword,
    updateAdminProfile,
    reportedAvatars,
    dismissAvatarReport,
    removeUserAvatar
  } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const { success, error: toastError } = useToast()

  const [activeSection, setActiveSection] = useState("dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" })

  // Product CRUD state
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("name")

  const handleAdminAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        updateAdminProfile({ avatar: dataUrl });
        success("Profile avatar updated successfully!");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }  // Dynamic Data state
  const [adminOrders, setAdminOrders] = useState([])
  const [adminMessages, setAdminMessages] = useState([])
  const [viewingOrder, setViewingOrder] = useState(null)
  const [adminNote, setAdminNote] = useState("")
  
  // Coupons state
  const [coupons, setCoupons] = useState([])
  const [couponForm, setCouponForm] = useState({ code: "", percent: "" })

  useEffect(() => {
    const fetchAdminData = async () => {
      let orders = [];
      let couponsList = [];
      try {
        const dbOrders = await api.getOrders();
        orders = dbOrders.map(o => ({
          orderId: o.id,
          username: o.username,
          storeName: o.storeName,
          status: o.status,
          date: o.date ? new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown Date",
          items: o.items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          total: o.amount
        }));
      } catch (err) {
        console.warn("Failed to fetch admin orders from API, checking local storage:", err);
        const rawOrders = JSON.parse(localStorage.getItem("shopease_orders"));
        orders = Array.isArray(rawOrders) ? rawOrders : [];
      }

      try {
        const dbCoupons = await api.getCoupons();
        couponsList = dbCoupons;
      } catch (err) {
        console.warn("Failed to fetch admin coupons from API, checking local storage:", err);
        const rawCoupons = JSON.parse(localStorage.getItem("shopease_coupons"));
        couponsList = Array.isArray(rawCoupons) ? rawCoupons : [{ code: "FESTIVAL20", percent: 20, creator: "admin" }];
      }

      setAdminOrders(orders);
      setCoupons(couponsList);
    };
    fetchAdminData();
  }, [activeSection]);

  // Loading state
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const getProductRating = (productId) => {
    const stored = localStorage.getItem(`shopease_reviews_${productId}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.length) {
          const avg = parsed.reduce((sum, r) => sum + r.rating, 0) / parsed.length
          return { avg: avg.toFixed(1), count: parsed.length }
        }
      } catch (e) {}
    }
    return { avg: "4.4", count: 3 }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setAdminOrders((prev) => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
      success(`Order ${orderId} updated to ${newStatus}`);
    } catch (err) {
      console.warn("Failed to update order status on backend, updating locally:", err);
      let currentOrders = JSON.parse(localStorage.getItem("shopease_orders"));
      const updated = (Array.isArray(currentOrders) ? currentOrders : []).map(order => {
        const id = order.orderId || order.id;
        if (id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      localStorage.setItem("shopease_orders", JSON.stringify(updated));
      setAdminOrders(updated);
      success(`Order ${orderId} updated to ${newStatus} (Local Mode)`);
    }
  }



  const handleChangePassword = (e) => {
    e.preventDefault()
    setPasswordMessage({ type: "", text: "" })

    if (newPassword !== confirmPassword) {
      toastError("New passwords do not match")
      return
    }

    const result = changePassword("admin", currentPassword, newPassword)
    if (result.success) {
      success(result.message)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      toastError(result.message)
    }
  }

  const isAdmin = user?.role === "admin"
  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "price") return a.price - b.price
      if (sort === "category") return a.category.localeCompare(b.category)
      return 0
    })

  const canModify = (product) => isAdmin || product.addedBy === "user"

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm({ ...form, image: ev.target.result, imageFile: file })
    reader.readAsDataURL(file)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const parsedPrice = parseFloat(form.price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toastError("Please enter a valid price.")
      return
    }
    
    const parsedStock = parseInt(form.stock, 10)
    if (isNaN(parsedStock) || parsedStock < 0) {
      toastError("Please enter a valid stock quantity.")
      return
    }

    const payload = {
    ...form,
    price: parsedPrice,
    stock: parsedStock,
    images: [
      form.image,
      form.image2,
      form.image3,
      form.image4,
    ].filter(Boolean),
  }
    if (editing) {
      updateProduct(editing.id, payload)
      success("Product updated successfully")
    } else {
      addProduct(payload)
      success("Product added successfully")
    }
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (product) => {
    setForm({
  name: product.name,
  price: String(product.price),
  category: product.category,

  image: product.images?.[0] || product.image,
  image2: product.images?.[1] || "",
  image3: product.images?.[2] || "",
  image4: product.images?.[3] || "",

  imageFile: null,
  description: product.description || "",
  stock: String(product.stock || 0),
})
    setEditing(product)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("Delete this product?")) {
      deleteProduct(id)
      success("Product deleted")
    }
  }

  const sectionTitles = {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    users: "Users",
    coupons: "Coupons",
    reviews: "Reviews",
    messages: "Messages",
    settings: "Settings",
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-gray-900 dark:bg-slate-900 text-white flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-700 dark:border-slate-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-sm">A</div>
            Admin Panel
          </h1>
          <p className="text-xs text-gray-400 mt-2">Signed in as {user?.username || "admin"}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left cursor-pointer ${
                activeSection === item.id
                  ? "bg-amber-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-slate-800"
              }`}
            >
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 dark:border-slate-700 space-y-2">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Store
          </Link>
          <button onClick={logoutAdmin} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-gray-800 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{sectionTitles[activeSection] || "Dashboard"}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-amber-600 hover:text-amber-700 font-medium hidden sm:flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Store
            </Link>
            <div className="w-9 h-9 bg-amber-600 rounded-full flex items-center justify-center text-white font-medium">A</div>
            <button onClick={logoutAdmin} className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer">
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* ===== DASHBOARD SECTION ===== */}
          {activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {loading ? (
                  <>
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                  </>
                ) : stats.map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</span>
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/40 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${stat.up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.up ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                      </svg>
                      {stat.change} from last month
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-800">
                        <th className="px-6 py-3 font-medium">Order</th>
                        <th className="px-6 py-3 font-medium">Customer</th>
                        <th className="px-6 py-3 font-medium">Product</th>
                        <th className="px-6 py-3 font-medium">Amount</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                    {(adminOrders.length > 0 ? adminOrders : recentOrders).slice(0, 5).filter(order => order).map((order) => {
                      const orderId = order.orderId || order.id || "#ORD-UNK";
                      const customer = order.fullName || order.customer || "Unknown Customer";
                        const product = order.product || (order.items && order.items[0] ? `${order.items[0].name}${order.items.length > 1 ? ` (+${order.items.length - 1} more)` : ''}` : "Unknown Product");
                        const amount = order.amount || `Rs. ${order.total?.toLocaleString()}`;
                        
                        return (
                        <tr key={orderId} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{orderId}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{customer}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{product}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{amount}</td>
                          <td className="px-6 py-4">
                           <select
                             value={order.status}
                             onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                             className={`px-2.5 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer border border-transparent transition-all duration-200
                               ${
                                 order.status === "Delivered"
                                   ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 hover:border-green-300"
                                   : order.status === "Processing"
                                     ? "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 hover:border-blue-300"
                                     : order.status === "Shipped"
                                       ? "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 hover:border-yellow-300"
                                       : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                               }`}
                           >
                             <option value="Pending" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Pending</option>
                             <option value="Processing" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Processing</option>
                             <option value="Shipped" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Shipped</option>
                             <option value="Delivered" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Delivered</option>
                           </select>
                         </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ===== PRODUCTS SECTION (CRUD) ===== */}
          {activeSection === "products" && (
            <>
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 mb-6 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role: <strong className="text-gray-900 dark:text-white">Admin</strong></span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400">Full CRUD Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none w-48 bg-white dark:bg-slate-950 text-gray-900 dark:text-white" />
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                    <option value="category">Sort by Category</option>
                  </select>
                  <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true) }} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition cursor-pointer">+ Add Product</button>
                </div>
              </div>

              {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editing ? "Edit Product" : "Add Product"}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₨)</label>
                          <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                          <input type="number" min="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
                            <option>Traditional Apparel</option>
                            <option>Organic Tea & Coffee</option>
                            <option>Local Handicrafts</option>
                            <option>Herbs & Spices</option>
                          </select>
                        </div>
                      </div>
                     <div className="space-y-4">
                    {/* Main Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Main Image
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 dark:file:bg-amber-950/40 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-100 dark:hover:file:bg-amber-950/60"
                      />

                      {form.image && (
                        <div className="mt-2 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border">
                            <ImageWithSkeleton
                              src={form.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Gallery Image 2 */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gallery Image 2
                      </label>

                      <input
                        type="text"
                        placeholder="/pashmina_side.png"
                        value={form.image2}
                        onChange={(e) =>
                          setForm({ ...form, image2: e.target.value })
                        }
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>

                    {/* Gallery Image 3 */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gallery Image 3
                      </label>

                      <input
                        type="text"
                        placeholder="/pashmina_closeup.png"
                        value={form.image3}
                        onChange={(e) =>
                          setForm({ ...form, image3: e.target.value })
                        }
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>

                    {/* Gallery Image 4 */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gallery Image 4
                      </label>

                      <input
                        type="text"
                        placeholder="/image4.png"
                        value={form.image4}
                        onChange={(e) =>
                          setForm({ ...form, image4: e.target.value })
                        }
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                  </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-amber-600 text-white py-2.5 rounded-lg font-medium hover:bg-amber-700 transition cursor-pointer">{editing ? "Update" : "Create"}</button>
                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-700 transition cursor-pointer">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
                        <th className="px-4 py-3 font-medium">Image</th>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">Stock</th>
                        <th className="px-4 py-3 font-medium">Added By</th>
                        <th className="px-4 py-3 font-medium">Rating</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <>
                          <ProductRowSkeleton />
                          <ProductRowSkeleton />
                          <ProductRowSkeleton />
                          <ProductRowSkeleton />
                          <ProductRowSkeleton />
                        </>
                      ) : filtered.length === 0 ? (
                        <tr><td colSpan="7" className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">No products found</td></tr>
                      ) : (
                        filtered.map((product) => {
                          const canEdit = canModify(product)
                          const ratingData = getProductRating(product.id)
                          return (
                            <tr key={product.id} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                              <td className="px-4 py-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden">
                                  <ImageWithSkeleton src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                              <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-md text-xs">{product.category}</span></td>
                              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">₨{product.price}</td>
                              <td className="px-4 py-3">
                                {product.stock === 0 ? (
                                  <span className="px-2 py-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-md text-xs font-bold whitespace-nowrap">Out of Stock</span>
                                ) : (
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">{product.stock || 0}</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-medium ${product.addedBy === "admin" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}>{product.addedBy}</span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="font-bold text-gray-900 dark:text-white text-xs">{ratingData.avg}</span>
                                  <span className="text-gray-400 dark:text-gray-500 text-xs">({ratingData.count})</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {canEdit ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => handleEdit(product)} className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/40 transition cursor-pointer">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition cursor-pointer">Delete</button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400 dark:text-gray-500">Read only</span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-800 text-sm text-gray-500 dark:text-gray-400">
                  Showing {filtered.length} of {products.length} products
                </div>
              </div>
            </>
          )}

          {/* ===== ORDERS SECTION ===== */}
          {activeSection === "orders" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
                      <th className="px-6 py-3 font-medium">Order</th>
                      <th className="px-6 py-3 font-medium">Customer</th>
                      <th className="px-6 py-3 font-medium">Product</th>
                      <th className="px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(adminOrders.length > 0 ? adminOrders : recentOrders).filter(order => order).map((order) => {
                      const orderId = order.orderId || order.id || "#ORD-UNK";
                      const customer = order.fullName || order.customer || "Unknown Customer";
                      const product = order.product || (order.items && order.items[0] ? `${order.items[0].name}${order.items.length > 1 ? ` (+${order.items.length - 1} more)` : ''}` : "Unknown Product");
                      const amount = order.amount || `Rs. ${order.total?.toLocaleString()}`;
                      
                      return (
                      <tr key={orderId} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{orderId}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{customer}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{product}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{amount}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer border border-transparent transition-all duration-200
                              ${
                                order.status === "Delivered"
                                  ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 hover:border-green-300"
                                  : order.status === "Processing"
                                    ? "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 hover:border-blue-300"
                                    : order.status === "Shipped"
                                      ? "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 hover:border-yellow-300"
                                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                              }`}
                          >
                            <option value="Pending" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Pending</option>
                            <option value="Processing" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Processing</option>
                            <option value="Shipped" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Shipped</option>
                            <option value="Delivered" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Delivered</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => { setViewingOrder(order); setAdminNote(order.adminMessage || ""); }}
                            className="px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-950/40 transition cursor-pointer"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== USERS SECTION ===== */}
          {activeSection === "users" && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Account</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative group w-16 h-16 bg-amber-100 dark:bg-amber-950/40 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-2xl overflow-hidden border-2 border-transparent hover:border-amber-500 transition-colors">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Admin Avatar" className="w-full h-full object-cover" />
                      ) : (
                        "A"
                      )}
                      <label className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[10px] font-bold">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={handleAdminAvatarUpload} onClick={(e) => (e.target.value = null)} />
                      </label>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-lg">{user?.username || "admin"}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "admin@shopease.com"}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-medium inline-block mt-1">Admin</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Registered Accounts</h3>
                <div className="space-y-4">
                  {registeredUsers.map((regUser) => (
                    <div key={regUser.username} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/40 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg">
                          {regUser.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{regUser.name}</p>
                            {regUser.role === "sub-admin" && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wider">Seller</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{regUser.email}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Username: <span className="font-mono font-medium">{regUser.username}</span></p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Reset Password Button */}
                        <button
                          onClick={() => {
                            if (confirm(`Reset password for ${regUser.username} to 'shopease123'?`)) {
                              adminResetUserPassword(regUser.username)
                              success("Password reset to shopease123")
                            }
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-950/60 shadow-sm"
                          title="Reset user password to default"
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {reportedAvatars && reportedAvatars.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6 border border-red-100 dark:border-red-900/30">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                    Reported Avatars
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reportedAvatars.map((report) => (
                      <div key={report.username} className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-100 dark:border-red-900/40 text-center flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-red-200 dark:border-red-800">
                          <img src={report.avatar} alt="Reported Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{report.username}</p>
                          <p className="text-xs text-red-500 mt-1">Reported on {new Date(report.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex w-full gap-2 mt-2">
                          <button
                            onClick={() => {
                              if (confirm(`Remove avatar for ${report.username}?`)) {
                                removeUserAvatar(report.username);
                                success("Avatar removed successfully.");
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => {
                              dismissAvatarReport(report.username);
                              success("Report dismissed.");
                            }}
                            className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-xs font-bold transition"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== COUPONS SECTION ===== */}
          {activeSection === "coupons" && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Coupon</h3>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!couponForm.code.trim() || !couponForm.percent) return;
                    
                    const code = couponForm.code.trim().toUpperCase();
                    if (coupons.some(c => c.code === code)) {
                      toastError("Coupon code already exists!");
                      return;
                    }
                    
                    const percent = parseInt(couponForm.percent, 10);
                    if (percent <= 0 || percent > 100) {
                      toastError("Percentage must be between 1 and 100");
                      return;
                    }

                    const newCoupon = {
                      code,
                      percent,
                      creator: user?.username || "admin"
                    };

                    try {
                      const dbCoupon = await api.createCoupon(newCoupon);
                      setCoupons((prev) => [...prev, dbCoupon]);
                      setCouponForm({ code: "", percent: "" });
                      success("Coupon created successfully!");
                    } catch (err) {
                      console.warn("Failed to save coupon to backend, saving locally:", err);
                      const updatedCoupons = [...coupons, newCoupon];
                      setCoupons(updatedCoupons);
                      localStorage.setItem("shopease_coupons", JSON.stringify(updatedCoupons));
                      setCouponForm({ code: "", percent: "" });
                      success("Coupon created locally (offline mode)");
                    }
                  }}
                  className="flex flex-wrap items-end gap-4"
                >
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coupon Code</label>
                    <input 
                      type="text" 
                      required
                      value={couponForm.code} 
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white" 
                      placeholder="e.g. SUMMER50"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount (%)</label>
                    <input 
                      type="number" 
                      min="1" max="100"
                      required
                      value={couponForm.percent} 
                      onChange={(e) => setCouponForm({ ...couponForm, percent: e.target.value })} 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white" 
                      placeholder="e.g. 20"
                    />
                  </div>
                  <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition cursor-pointer">
                    + Create Coupon
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Coupons</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
                        <th className="px-6 py-3 font-medium">Code</th>
                        <th className="px-6 py-3 font-medium">Discount</th>
                        <th className="px-6 py-3 font-medium">Created By</th>
                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon) => {
                        const isOwner = isAdmin || coupon.creator === user?.username;
                        return (
                          <tr key={coupon.code} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{coupon.code}</td>
                            <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold">{coupon.percent}%</td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {coupon.creator === "admin" ? (
                                <span className="text-amber-600 dark:text-amber-400 font-medium">Admin</span>
                              ) : (
                                <span className="text-blue-600 dark:text-blue-400 font-medium">{coupon.creator}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isOwner ? (
                                <button
                                  onClick={async () => {
                                    if (confirm(`Delete coupon ${coupon.code}?`)) {
                                      try {
                                        await api.deleteCoupon(coupon.code);
                                        setCoupons((prev) => prev.filter(c => c.code !== coupon.code));
                                        success("Coupon deleted.");
                                      } catch (err) {
                                        console.warn("Failed to delete coupon on backend, deleting locally:", err);
                                        const updated = coupons.filter(c => c.code !== coupon.code);
                                        setCoupons(updated);
                                        localStorage.setItem("shopease_coupons", JSON.stringify(updated));
                                        success("Coupon deleted (offline mode).");
                                      }
                                    }
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition cursor-pointer"
                                >
                                  Delete
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400">Read Only</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {coupons.length === 0 && (
                        <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No active coupons found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== SETTINGS SECTION ===== */}
          {activeSection === "settings" && (
            <div className="max-w-lg space-y-6">
              {/* Theme Toggle */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Appearance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Toggle between light and dark mode.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      {theme === "dark" ? (
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Currently active</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer bg-gray-200 dark:bg-amber-600"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Password Change */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your admin account password. Must differ from the user account password.</p>

                {passwordMessage.text && (
                  <div
                    className={`mb-4 p-3 rounded-lg text-sm ${
                      passwordMessage.type === "success"
                        ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30"
                        : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                    }`}
                  >
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-700 transition cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeSection === "reviews" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Store Reviews</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Review all customer feedback across your store catalog.</p>
              <div className="space-y-4">
                {products.map(product => {
                  const storedReviews = localStorage.getItem(`shopease_reviews_${product.id}`);
                  const productReviews = storedReviews ? JSON.parse(storedReviews) : [
                    { id: 1, name: "Priya Sharma", rating: 5, date: "June 12, 2025", title: "Absolutely love it!", text: "The quality is outstanding. Exactly as described and beautifully packaged." },
                    { id: 2, name: "Rohan Thapa", rating: 4, date: "May 28, 2025", title: "Great product", text: "Very happy with this purchase. The craftsmanship is excellent." }
                  ];
                  return (
                    <div key={product.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-6">
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{product.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{productReviews.length} Reviews</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {productReviews.length === 0 ? (
                          <p className="text-xs text-slate-500 dark:text-slate-400">No reviews yet for this product.</p>
                        ) : (
                          productReviews.map(review => (
                            <div key={review.id} className="bg-slate-50 dark:bg-slate-850 rounded-xl p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                    {review.avatar && (review.avatar.startsWith('data:') || review.avatar.startsWith('http')) ? (
                                      <img src={review.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                        {review.avatar || review.name.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{review.name}</span>
                                    <span className="text-[10px] text-slate-400 ml-2">{review.date}</span>
                                  </div>
                                </div>
                                <div className="flex text-amber-500">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-slate-700"}`} fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">{review.title}</h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{review.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === "messages" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Messages</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Review messages submitted by users through the Contact form.</p>

              {(!adminMessages || adminMessages.length === 0) ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No messages at this time.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-850 text-gray-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Sender</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-850">
                      {adminMessages.filter(msg => msg).map((msg, index) => (
                        <tr key={msg.id || index} className="hover:bg-gray-50/50 dark:hover:bg-slate-950/20 transition">
                          <td className="py-4 px-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {msg.date ? new Date(msg.date).toLocaleDateString() : "Unknown Date"}
                          </td>
                          <td className="py-4 px-4 font-bold text-gray-800 dark:text-white whitespace-nowrap">
                            <div>{msg.name || "Unknown"}</div>
                            <div className="text-[10px] text-amber-600 font-normal mt-0.5">
                              {msg.email || "No email"}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-gray-900 dark:text-white">{msg.subject || "No Subject"}</div>
                          </td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-400 max-w-md">
                            {msg.message || ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {viewingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setViewingOrder(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800 transition-all transform scale-100" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Order Details</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {viewingOrder.orderId || viewingOrder.id}
                </h3>
              </div>
              <button 
                onClick={() => setViewingOrder(null)} 
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Customer & Delivery */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Shipping Details</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Recipient</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {viewingOrder.fullName || viewingOrder.customer || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Phone Number</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {viewingOrder.phone || "N/A"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {viewingOrder.address ? `${viewingOrder.address}, ${viewingOrder.city || ""}, ${viewingOrder.provinceName || ""}` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ordered Items</h4>
                <div className="space-y-2">
                  {viewingOrder.items && Array.isArray(viewingOrder.items) && viewingOrder.items.length > 0 ? (
                    viewingOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-850 pb-2">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px]">Qty: {item.quantity || 1} × Rs. {item.price}</p>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Rs. {((item.quantity || 1) * item.price).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400">
                        {viewingOrder.product || "Demo Product"}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {viewingOrder.amount}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin message to customer */}
              <div className="bg-amber-50/40 dark:bg-amber-950/10 p-4 rounded-2xl border border-amber-100/50 dark:border-amber-900/20 space-y-3">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message to Customer
                </h4>
                <div className="space-y-2">
                  <textarea
                    rows="2"
                    placeholder="Type order updates, delivery notes, or support messages..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-950 text-gray-800 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const id = viewingOrder.orderId || viewingOrder.id;
                      let currentOrders = JSON.parse(localStorage.getItem("shopease_orders"));
                      if (!currentOrders || !Array.isArray(currentOrders) || currentOrders.length === 0) {
                        currentOrders = [...recentOrders];
                      }
                      const updated = currentOrders.map(order => {
                        const oid = order.orderId || order.id;
                        if (oid === id) {
                          return { ...order, adminMessage: adminNote };
                        }
                        return order;
                      });
                      localStorage.setItem("shopease_orders", JSON.stringify(updated));
                      setAdminOrders(updated);
                      setViewingOrder({ ...viewingOrder, adminMessage: adminNote });
                      success("Message updated and sent to customer!");
                    }}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                  >
                    Update & Send Message
                  </button>
                  {viewingOrder.adminMessage && (
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      <span className="font-bold">Sent Message:</span> "{viewingOrder.adminMessage}"
                    </div>
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {viewingOrder.total ? `Rs. ${viewingOrder.total.toLocaleString()}` : viewingOrder.amount}
                </span>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button 
                onClick={() => setViewingOrder(null)} 
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-sm transition cursor-pointer text-center"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

import { useState, useEffect } from "react"
import { Link } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useProducts } from "../context/ProductContext"
import { ProductRowSkeleton, StatCardSkeleton } from "../components/Skeleton"

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
  { id: "settings", label: "Settings" },
]

const emptyForm = { name: "", price: "", category: "Traditional Apparel", image: "", imageFile: null, description: "" }

const AdminDashboard = () => {
  const { user, logoutAdmin, changePassword, registeredUsers, updateUserViolations, toggleUserBan, theme, toggleTheme } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()

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



  // Loading state
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])



  const handleChangePassword = (e) => {
    e.preventDefault()
    setPasswordMessage({ type: "", text: "" })

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    const result = changePassword("admin", currentPassword, newPassword)
    if (result.success) {
      setPasswordMessage({ type: "success", text: result.message })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setPasswordMessage({ type: "error", text: result.message })
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
    if (editing) {
      updateProduct(editing.id, { ...form, price: parseFloat(form.price) })
    } else {
      addProduct({ ...form, price: parseFloat(form.price) })
    }
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (product) => {
    setForm({ name: product.name, price: String(product.price), category: product.category, image: product.image, imageFile: null, description: product.description || "" })
    setEditing(product)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("Delete this product?")) deleteProduct(id)
  }

  const sectionTitles = {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    users: "Users",
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
        <div className="p-4 border-t border-gray-700 dark:border-slate-700">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Back to Store
          </Link>
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.customer}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.product}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.amount}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === "Delivered"
                                  ? "bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                                  : order.status === "Processing"
                                    ? "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
                                    : order.status === "Shipped"
                                      ? "bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
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
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
                            <option>Traditional Apparel</option>
                            <option>Organic Tea & Coffee</option>
                            <option>Local Handicrafts</option>
                            <option>Herbs & Spices</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 dark:file:bg-amber-950/40 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-100 dark:hover:file:bg-amber-950/60 cursor-pointer file:cursor-pointer" />
                        {form.image && (
                          <div className="mt-2 flex items-center gap-3">
                            <img referrerPolicy="no-referrer" src={form.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-slate-700" />
                            <span className="text-xs text-gray-400 dark:text-gray-500">Image ready</span>
                          </div>
                        )}
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
                        <th className="px-4 py-3 font-medium">Added By</th>
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
                        <tr><td colSpan="6" className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">No products found</td></tr>
                      ) : (
                        filtered.map((product) => {
                          const canEdit = canModify(product)
                          return (
                            <tr key={product.id} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                              <td className="px-4 py-3">
                                <img referrerPolicy="no-referrer" src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                              <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-md text-xs">{product.category}</span></td>
                              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">₨{product.price}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-medium ${product.addedBy === "admin" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}>{product.addedBy}</span>
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
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.customer}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.product}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "Delivered"
                                ? "bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                                : order.status === "Processing"
                                  ? "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
                                  : order.status === "Shipped"
                                    ? "bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/40 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">A</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user?.username || "admin"}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "admin@shopease.com"}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-medium">Admin</span>
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
                            {regUser.banned && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold uppercase tracking-wider">Banned</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{regUser.email}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Username: <span className="font-mono font-medium">{regUser.username}</span></p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Violations Counter */}
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-1">
                          <button
                            onClick={() => updateUserViolations(regUser.username, -1)}
                            className="px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 font-bold rounded"
                            title="Decrease violations"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold px-2 text-gray-700 dark:text-gray-200">
                            Violations: <strong className="text-red-600">{regUser.violations}</strong>
                          </span>
                          <button
                            onClick={() => updateUserViolations(regUser.username, 1)}
                            className="px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 font-bold rounded"
                            title="Increase violations"
                          >
                            +
                          </button>
                        </div>

                        {/* Ban / Unban Button */}
                        <button
                          onClick={() => toggleUserBan(regUser.username)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                            regUser.banned
                              ? "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                              : "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                          }`}
                        >
                          {regUser.banned ? "Unban User" : "Ban User"}
                        </button>
                      </div>
                    </div>
                  ))}
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
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard

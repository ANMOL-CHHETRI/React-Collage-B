import { useState } from "react"
import { Link } from "react-router"
import { useAuth } from "../context/AuthContext"

const initialProducts = [
  { id: 1, name: "Wireless Headphones", price: 79.99, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", addedBy: "admin" },
  { id: 2, name: "Smart Watch", price: 199.99, category: "Electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop", addedBy: "admin" },
  { id: 3, name: "Premium Backpack", price: 59.99, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop", addedBy: "admin" },
  { id: 4, name: "Running Shoes", price: 129.99, category: "Sports", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop", addedBy: "user" },
  { id: 5, name: "Leather Wallet", price: 39.99, category: "Accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop", addedBy: "admin" },
  { id: 6, name: "Sunglasses", price: 89.99, category: "Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop", addedBy: "user" },
  { id: 7, name: "Camera Lens", price: 299.99, category: "Electronics", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop", addedBy: "admin" },
  { id: 8, name: "Leather Jacket", price: 149.99, category: "Clothing", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop", addedBy: "user" },
]

const emptyForm = { name: "", price: "", category: "Electronics", image: "", description: "" }

const CRUDDashboard = () => {
  const { user, logout } = useAuth()
  const [role, setRole] = useState("admin")
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("name")

  const isAdmin = role === "admin"
  const currentUser = user?.email === "admin@shopease.com" ? "admin" : "user"

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "price") return a.price - b.price
      if (sort === "category") return a.category.localeCompare(b.category)
      return 0
    })

  const canModify = (product) => isAdmin || product.addedBy === "user"

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setProducts(products.map((p) => p.id === editing.id ? { ...p, ...form, price: parseFloat(form.price) } : p))
    } else {
      setProducts([...products, { ...form, id: Date.now(), price: parseFloat(form.price), addedBy: currentUser }])
    }
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (product) => {
    setForm({ name: product.name, price: String(product.price), category: product.category, image: product.image, description: product.description || "" })
    setEditing(product)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("Delete this product?")) setProducts(products.filter((p) => p.id !== id))
  }

  const sidebarLinks = [
    { name: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", path: "/admin/dashboard" },
    { name: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", path: "#" },
    { name: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", path: "/admin/dashboard" },
    { name: "CRUD Ops", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", path: "/dashboard/crud" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-sm">{isAdmin ? "A" : "U"}</div>
            {isAdmin ? "Admin Panel" : "User Panel"}
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((item) => (
            <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${item.name === "CRUD Ops" ? "bg-amber-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">CRUD Operations</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => setRole("admin")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${isAdmin ? "bg-amber-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>Admin</button>
              <button onClick={() => setRole("user")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${!isAdmin ? "bg-amber-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>User</button>
            </div>
            <div className="w-9 h-9 bg-amber-600 rounded-full flex items-center justify-center text-white font-medium">{isAdmin ? "A" : "U"}</div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm mb-6 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Role: <strong className="text-gray-900">{isAdmin ? "Admin" : "User"}</strong></span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{isAdmin ? "Full CRUD" : "Limited (own items only)"}</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none w-48" />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="category">Sort by Category</option>
              </select>
              <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true) }} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition cursor-pointer">+ Add Product</button>
            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{editing ? "Edit Product" : "Add Product"}</h3>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                        <option>Electronics</option>
                        <option>Clothing</option>
                        <option>Accessories</option>
                        <option>Sports</option>
                        <option>Home</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-amber-600 text-white py-2.5 rounded-lg font-medium hover:bg-amber-700 transition cursor-pointer">{editing ? "Update" : "Create"}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition cursor-pointer">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Image</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Added By</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="6" className="px-4 py-12 text-center text-gray-400">No products found</td></tr>
                  ) : (
                    filtered.map((product) => {
                      const canEdit = canModify(product)
                      return (
                        <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">{product.category}</span></td>
                          <td className="px-4 py-3 font-semibold text-gray-900">${product.price}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium ${product.addedBy === "admin" ? "text-amber-600" : "text-blue-600"}`}>{product.addedBy}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {canEdit ? (
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleEdit(product)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer">Edit</button>
                                <button onClick={() => handleDelete(product.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition cursor-pointer">Delete</button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">Read only</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
              Showing {filtered.length} of {products.length} products
            </div>
          </div>

          {!isAdmin && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
              <strong>User mode:</strong> You can only edit or delete products you added (marked with "user" badge). Admin mode has full access.
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default CRUDDashboard

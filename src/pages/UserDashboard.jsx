import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { useProducts } from "../context/ProductContext"
import { useMemo } from "react"
import { useToast } from "../context/ToastContext"
import { OrderCardUserSkeleton } from "../components/Skeleton"
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
    storeName: "Palpa Weaver Cooperatives",
    status: "Completed",
    date: "Jun 15, 2026",
    items: [
      {
        name: "Premium Dhaka Topi (Handwoven)",
        attributes: "Size: Standard, Color: Traditional Red/Green",
        price: 1200,
        qty: 1,
        image: "https://i.pinimg.com/736x/d4/16/12/d41612e4db1ef4157d6e3f11e4b832c0.jpg"
      }
    ]
  },
  {
    id: "#ORD-NP-81724",
    storeName: "Ilam Tea Gardens",
    status: "Completed",
    date: "Jun 10, 2026",
    items: [
      {
        name: "Himalayan Orthodox Golden Tea",
        attributes: "Package: 250g, Type: Organic Loose Leaf",
        price: 850,
        qty: 2,
        image: "https://i.pinimg.com/736x/56/d0/7f/56d07fba8ab764c361db3999425b48f1.jpg"
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
        name: "Handmade Shakyamuni Buddha Statue",
        attributes: "Material: Copper, Finish: 24k Gold Gilded",
        price: 18500,
        qty: 1,
        image: "https://i.pinimg.com/736x/f2/df/28/f2df28734e8b2f896da2e4c7cad2f354.jpg"
      }
    ]
  }
]

const mockSellerCustomers = [
  { id: 1, name: "Aarav Sharma", email: "aarav.s@example.com", totalOrders: 3, totalSpent: 4500, lastOrder: "Jun 15, 2026" },
  { id: 2, name: "Sneha Thapa", email: "sneha.t@example.com", totalOrders: 1, totalSpent: 1200, lastOrder: "Jun 10, 2026" },
  { id: 3, name: "Rabin Shrestha", email: "rabin.sh@example.com", totalOrders: 5, totalSpent: 18500, lastOrder: "May 22, 2026" },
  { id: 4, name: "Pooja Karki", email: "pooja.k@example.com", totalOrders: 2, totalSpent: 3200, lastOrder: "May 10, 2026" },
]

const UserDashboard = () => {
  const { 
    user, 
    logout, 
    updateProfile,
    changePassword,
    registeredUsers, 
    theme, 
    toggleTheme, 
    sellerApplications, 
    submitSellerApplication 
  } = useAuth()
  const { addToCart, setIsCartOpen } = useCart()
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const { success, error: toastError, info } = useToast()
  const navigate = useNavigate()

  const dbUser = user && (user.role === "user" || user.role === "sub-admin") ? (registeredUsers || []).find(u => u.username === user.username) : null;
  const hasViolations = dbUser && dbUser.violations > 0;

  const [activeSection, setActiveSection] = useState("orders")
  const [activeTab, setActiveTab] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [trackingOrderId, setTrackingOrderId] = useState(null)
  const [showContactModal, setShowContactModal] = useState(null)
  const [contactSubject, setContactSubject] = useState("")
  const [contactMessage, setContactMessage] = useState("")

  const getActiveStep = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "processing" || s === "pending") return 0;
    if (s === "to ship") return 1;
    if (s === "shipped" || s === "to receive" || s === "out for delivery") return 2;
    if (s === "completed" || s === "delivered") return 3;
    return 0;
  };

  const [rawOrders, setRawOrders] = useState([])
  const [coupons, setCoupons] = useState([])
  const [couponForm, setCouponForm] = useState({ code: "", percent: "" })

  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const presetChars = [...Array(26)].map((_, i) => String.fromCharCode(65 + i)).concat([...Array(10)].map((_, i) => String(i)))

  const handlePresetSelect = (char) => {
    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#ffedd5"
    ctx.fillRect(0, 0, 200, 200)
    ctx.fillStyle = "#ea580c"
    ctx.font = "bold 100px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(char, 100, 110)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
    if (updateProfile) {
      updateProfile({ avatar: dataUrl })
      success("Profile avatar updated successfully!")
    }
    setShowAvatarPicker(false)
  }

  const handleUserAvatarUpload = (e) => {
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
        if (updateProfile) {
          updateProfile({ avatar: dataUrl });
          success("Profile avatar updated successfully!");
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }
  useEffect(() => {
    const loadDashboardData = async () => {
      let fetchedOrders = [];
      let fetchedCoupons = [];
      try {
        const dbOrders = await api.getOrders(user?.role === "admin" ? null : user?.username);
        fetchedOrders = dbOrders.map(o => ({
          id: o.id,
          storeName: o.storeName || "ShopEase Official",
          status: o.status,
          date: o.date ? new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown Date",
          items: o.items.map(item => ({
            name: item.name,
            attributes: "Qty: " + item.quantity,
            price: item.price,
            qty: item.quantity,
            image: item.image
          })),
          username: o.username
        }));
      } catch (err) {
        console.warn("Failed to fetch dashboard orders from API, checking local storage:", err);
        const rawDynamic = JSON.parse(localStorage.getItem("shopease_orders"));
        const dynamicOrders = Array.isArray(rawDynamic) ? rawDynamic : [];
        fetchedOrders = dynamicOrders.filter(o => o && (o.username === user?.username || o.fullName === user?.name || user?.username === "user")).map(o => ({
          id: o.orderId || o.id || "#ORD-UNKNOWN",
          storeName: o.storeName || "ShopEase Official",
          status: o.status || "Processing",
          date: o.date ? new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown Date",
          items: (Array.isArray(o.items) ? o.items : []).map(item => ({
            name: item?.name || "Unknown Product",
            attributes: "Qty: " + (item?.quantity || 1),
            price: item?.price || 0,
            qty: item?.quantity || 1,
            image: item?.image
          })),
          username: o.username
        }));
        const baseOrders = user?.username === "user" ? initialOrders : [];
        fetchedOrders = [...fetchedOrders, ...baseOrders];
      }

      try {
        const dbCoupons = await api.getCoupons();
        fetchedCoupons = dbCoupons;
      } catch (err) {
        console.warn("Failed to fetch dashboard coupons from API, checking local storage:", err);
        const rawCoupons = JSON.parse(localStorage.getItem("shopease_coupons"));
        fetchedCoupons = Array.isArray(rawCoupons) ? rawCoupons : [{ code: "FESTIVAL20", percent: 20, creator: "admin" }];
      }

      setRawOrders(fetchedOrders);
      setCoupons(fetchedCoupons);
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const orders = useMemo(() => {
    return rawOrders.map(order => {
      const validItems = (order.items || []).filter(item => 
        products.some(p => {
          if (!p?.name || !item?.name) return false;
          return p.name.toLowerCase() === item.name.toLowerCase() || item.name.toLowerCase().includes(p.name.toLowerCase())
        })
      )
      return { ...order, items: validItems }
    }).filter(order => order.items && order.items.length > 0)
  }, [rawOrders, products])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const [profileName, setProfileName] = useState(user?.name || "")
  const [profileEmail, setProfileEmail] = useState(user?.email || "")
  const [profilePhone, setProfilePhone] = useState(user?.phone ?? "")
  const [profileAddress, setProfileAddress] = useState(user?.address ?? "")
  const [profileSaved, setProfileSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" })

  // Seller Application Form State
  const [shopName, setShopName] = useState("")
  const [shopDescription, setShopDescription] = useState("")
  const [shopCategory, setShopCategory] = useState("Traditional Apparel")
  const [contactNumber, setContactNumber] = useState(user?.phone || "")
  const [shopAddress, setShopAddress] = useState(user?.address || "")
  const [appSubmitted, setAppSubmitted] = useState(false)
  const [sellerPolicyAgreed, setSellerPolicyAgreed] = useState(false)

  const [sellerTab, setSellerTab] = useState("overview")

  const handleApplySeller = (e) => {
    e.preventDefault()
    submitSellerApplication({
      shopName,
      shopDescription,
      shopCategory,
      contactNumber,
      shopAddress
    })
    setAppSubmitted(true)
    setTimeout(() => setAppSubmitted(false), 3000)
  }

  // Seller Product CRUD state
  const [sellerShowForm, setSellerShowForm] = useState(false)
  const [sellerEditing, setSellerEditing] = useState(null)
  const [sellerForm, setSellerForm] = useState({ name: "", price: "", category: "Traditional Apparel", image: "", imageFile: null, description: "" })
  const [sellerSearch, setSellerSearch] = useState("")
  const [sellerSort, setSellerSort] = useState("name")

  const handleSellerImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setSellerForm({ ...sellerForm, image: ev.target.result, imageFile: file })
    reader.readAsDataURL(file)
  }

  const handleSellerSave = (e) => {
    e.preventDefault()
    const parsedPrice = parseFloat(sellerForm.price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toastError("Please enter a valid price.")
      return
    }
    const payload = {
      name: sellerForm.name,
      price: parsedPrice,
      category: sellerForm.category,
      image: sellerForm.image || "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg",
      description: sellerForm.description,
      badge: null
    }

    if (sellerEditing) {
      updateProduct(sellerEditing.id, payload)
      success("Product updated successfully")
    } else {
      addProduct(payload, user?.username)
      success("Product added to catalog")
    }
    setSellerForm({ name: "", price: "", category: "Traditional Apparel", image: "", imageFile: null, description: "" })
    setSellerEditing(null)
    setSellerShowForm(false)
  }

  const handleSellerEdit = (product) => {
    setSellerForm({ name: product.name, price: String(product.price), category: product.category, image: product.image, imageFile: null, description: product.description || "" })
    setSellerEditing(product)
    setSellerShowForm(true)
  }

  const handleSellerDelete = (id) => {
    // Better to use custom modal, but for now we'll keep confirm for destructive actions,
    // and just add a success toast after. Or we can just use confirm.
    if (confirm("Delete this product?")) {
      deleteProduct(id)
      success("Product deleted")
    }
  }

  const myApp = (sellerApplications || []).find((app) => app.username === user?.username)
  const myProducts = products.filter((p) => p.addedBy === user?.username)
  const filteredMyProducts = myProducts
    .filter((p) => p.name.toLowerCase().includes(sellerSearch.toLowerCase()))
    .sort((a, b) => {
      if (sellerSort === "name") return a.name.localeCompare(b.name)
      if (sellerSort === "price") return a.price - b.price
      if (sellerSort === "category") return a.category.localeCompare(b.category)
      return 0
    })





  const handleSaveProfile = (e) => {
    e.preventDefault()
    
    // Validate phone number before saving
    if (profilePhone && !/^\d{10}$/.test(profilePhone)) {
      toastError("Phone number must be exactly 10 digits.");
      return;
    }

    const updatedProfile = {
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      address: profileAddress
    }
    localStorage.setItem("shopease_profile", JSON.stringify(updatedProfile))
    
    if (updateProfile) {
      updateProfile(updatedProfile)
    }
    
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

  const handleSendContactMessage = (e) => {
    e.preventDefault()
    if (!contactSubject || !contactMessage) {
      toastError("Please fill out all fields.")
      return
    }
    const newMessage = {
      id: "MSG-" + Math.floor(100000 + Math.random() * 900000),
      name: user?.name || "Customer",
      email: user?.email || "customer@shopease.com",
      subject: contactSubject,
      message: contactMessage,
      date: new Date().toISOString()
    }
    try {
      const rawMessages = JSON.parse(localStorage.getItem("shopease_messages"))
      const messages = Array.isArray(rawMessages) ? rawMessages : []
      localStorage.setItem("shopease_messages", JSON.stringify([newMessage, ...messages]))
      success("Message sent successfully to the admin!")
      setShowContactModal(null)
      setContactSubject("")
      setContactMessage("")
    } catch (err) {
      console.error(err)
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
            <div className="relative group w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-sm uppercase overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name[0] : "S"
              )}
              <label className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[8px] font-bold">
                 Upload
                 <input type="file" accept="image/*" className="hidden" onChange={handleUserAvatarUpload} onClick={(e) => (e.target.value = '')} />
              </label>
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">Hello,</span>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{user?.name || "Sahil Tuladhar"}</h2>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Tree */}
        <nav className="space-y-6 flex-1 text-sm">
          
          {/* Group 1: Manage My Account */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-500">Manage My Account</h3>
            <ul className={`space-y-1.5 pl-2 border-l-2 ${activeSection === "profile" ? "border-amber-900" : "border-slate-100 dark:border-slate-800"}`}>
              <li>
                <button 
                  onClick={() => setActiveSection("profile")} 
                  className={`w-full text-left font-medium block transition duration-200 cursor-pointer ${
                    activeSection === "profile" 
                      ? "text-amber-900 dark:text-amber-800 font-bold" 
                      : "text-slate-500 dark:text-slate-400 hover:text-amber-900 dark:hover:text-amber-900"
                  }`}
                >
                  My Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Group 2: My Orders */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-200">My Orders</h3>
            <ul className={`space-y-1.5 pl-2 border-l-2 ${activeSection === "orders" ? "border-amber-900" : "border-slate-100 dark:border-slate-800"}`}>
              <li>
                <button 
                  onClick={() => setActiveSection("orders")} 
                  className={`w-full text-left font-medium flex items-center justify-between transition duration-200 cursor-pointer ${
                    activeSection === "orders" 
                      ? "text-amber-900 dark:text-amber-800 font-bold" 
                      : "text-slate-500 dark:text-slate-400 hover:text-amber-900 dark:hover:text-amber-900"
                  }`}
                >
                  <span>My Orders</span>
                  {rawOrders.filter(o => o.adminMessage).length > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-white rounded-full leading-none mr-2">
                      {rawOrders.filter(o => o.adminMessage).length}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>

          {/* Group 3: Settings */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-500">Preferences</h3>
            <ul className={`space-y-1.5 pl-2 border-l-2 ${activeSection === "settings" ? "border-amber-900" : "border-slate-100 dark:border-slate-800"}`}>
              <li>
                <button
                  onClick={() => setActiveSection("settings")}
                  className={`w-full text-left font-medium block transition duration-200 cursor-pointer ${
                    activeSection === "settings"
                      ? "text-amber-900 dark:text-amber-800 font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-amber-900 dark:hover:text-amber-900"
                  }`}
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Group 4: Sell on ShopEase / Seller Dashboard */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            {user?.role === "sub-admin" ? (
              <button
                onClick={() => setActiveSection("seller-dashboard")}
                className={`w-full text-left font-bold text-xs uppercase tracking-wider block items-center gap-1.5 transition duration-200 cursor-pointer ${
                  activeSection === "seller-dashboard"
                    ? "text-amber-900 dark:text-amber-800"
                    : "text-slate-500 dark:text-slate-400 hover:text-amber-900 dark:hover:text-amber-800"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Seller Dashboard
              </button>
            ) : (
              <button
                onClick={() => setActiveSection("sell-on-shopease")}
                className={`w-full text-left font-bold text-xs uppercase tracking-wider block items-center gap-1.5 transition duration-200 cursor-pointer ${
                  activeSection === "sell-on-shopease"
                    ? "text-amber-900 dark:text-amber-800"
                    : "text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-amber-900"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sell On ShopEase
              </button>
            )}
          </div>
        </nav>

        {/* Back link and Logout */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 text-xs font-semibold transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Store
          </Link>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-xs font-bold py-2.5 rounded-xl transition duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
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
              <h1 className="text-2xl font-extrabold tracking-tight text-amber-900 dark:text-white">My Orders</h1>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Manage and track your delivery packages across Nepal.</p>
            </div>
          </div>

          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none">
            {["All", "To Pay", "To Ship", "To Receive", "To Review(3)"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-5 border-b-2 transition duration-200 cursor-pointer ${
                  activeTab === tab 
                    ? "border-amber-900 text-amber-900 dark:text-amber-800 font-bold" 
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

                     <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                       order.status === "Delivered" || order.status === "Completed"
                         ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30" 
                         : order.status === "Processing"
                           ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100/50 dark:border-blue-900/30"
                           : order.status === "Shipped"
                             ? "bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30"
                             : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/45"
                     }`}>
                       {order.status}
                     </span>
                   </div>
                    {/* Admin message alert / notification */}
                    {order.adminMessage && (
                      <div className="mt-3 text-xs bg-amber-500/10 dark:bg-amber-500/5 text-amber-800 dark:text-amber-300 p-3.5 rounded-2xl border border-amber-500/20 dark:border-amber-500/10 flex items-start gap-2.5">
                        <svg className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <div className="space-y-0.5">
                          <span className="font-bold text-[10px] uppercase tracking-wider block text-amber-700 dark:text-amber-400">Message from ShopEase Support:</span>
                          <p className="font-medium">{order.adminMessage}</p>
                        </div>
                      </div>
                    )}

                   {/* Status message details */}
                   <div className="mt-3 text-xs bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-900 flex items-center gap-2.5">
                     <div className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${
                       order.status === "Delivered" || order.status === "Completed"
                         ? "bg-green-500"
                         : order.status === "Processing"
                           ? "bg-blue-500"
                           : order.status === "Shipped"
                             ? "bg-amber-500"
                             : "bg-slate-400"
                     }`} />
                     <p className="text-slate-600 dark:text-slate-400 font-medium">
                       {order.status === "Pending" && "Your order is pending confirmation from ShopEase."}
                       {order.status === "Processing" && "We are processing and packaging your order at our warehouse."}
                       {order.status === "Shipped" && "Your order has been shipped and is in transit to your district."}
                       {(order.status === "Delivered" || order.status === "Completed") && "Your package has been successfully delivered! Thank you for shopping with us."}
                       {!["Pending", "Processing", "Shipped", "Delivered", "Completed"].includes(order.status) && "Your order status is being updated."}
                     </p>
                   </div>

                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-1">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shrink-0 border border-slate-100 dark:border-slate-800">
                          <ImageWithSkeleton 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 space-y-1">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed hover:text-amber-900 dark:hover:text-amber-800 cursor-pointer">
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
                            <span className="font-extrabold text-amber-900 dark:text-amber-800 text-sm">Rs. {item.price.toLocaleString()}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Collapsible Tracking Timeline */}
                  {trackingOrderId === order.id && (
                    <div className="mt-4 p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl animate-fade-in no-print">
                      <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-orange-500 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Order Tracker: {order.id}
                      </h5>
                      
                      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4 mt-2">
                        {/* Connector Line for Desktop */}
                        <div className="absolute hidden md:block left-8 right-8 top-[18px] h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full" />
                        <div 
                          className="absolute hidden md:block left-8 top-[18px] h-1 bg-orange-500 -z-10 rounded-full transition-all duration-500"
                          style={{ width: `${(getActiveStep(order.status) / 3) * 100}%`, maxWidth: 'calc(100% - 64px)' }}
                        />

                        {[
                          { name: "Processing", desc: "Order details verified & packing" },
                          { name: "Shipped", desc: "In transit to courier hub" },
                          { name: "Out for Delivery", desc: "On its way to your address" },
                          { name: "Delivered", desc: "Successfully received" }
                        ].map((step, idx) => {
                          const activeIdx = getActiveStep(order.status);
                          const isCompleted = idx < activeIdx;
                          const isActive = idx === activeIdx;
                          
                          return (
                            <div key={idx} className="flex md:flex-col items-center md:items-center text-left md:text-center flex-1 relative gap-4 md:gap-2 w-full">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 border-2 transition-all ${
                                isCompleted 
                                  ? "bg-amber-900 border-amber-900 text-white shadow-lg shadow-orange-500/20" 
                                  : isActive 
                                    ? "bg-white dark:bg-slate-900 border-amber-900 text-amber-900 ring-4 ring-orange-500/10 scale-110" 
                                    : "bg-white dark:bg-slate-955 border-slate-300 dark:border-slate-800 text-slate-400"
                              }`}>
                                {isCompleted ? (
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                ) : idx + 1}
                              </div>
                              <div className="space-y-0.5">
                                <span className={`block text-xs font-bold ${isActive ? "text-amber-900" : isCompleted ? "text-slate-800 dark:text-slate-250" : "text-slate-400 dark:text-slate-600"}`}>
                                  {step.name}
                                </span>
                                <span className="block text-[10px] text-slate-450 dark:text-slate-500 leading-normal max-w-[130px] md:mx-auto">
                                  {step.desc}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => {
                        setShowContactModal(order);
                        setContactSubject(`Inquiry regarding Order ${order.id}`);
                        setContactMessage("");
                      }} 
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl transition cursor-pointer"
                    >
                      Contact Seller
                    </button>
                    <button 
                      onClick={() => {
                        if (order.status === "Completed") {
                          handleBuyAgain(order.items)
                        } else {
                          setTrackingOrderId(trackingOrderId === order.id ? null : order.id)
                        }
                      }} 
                      className={`px-4 py-2 text-[11px] font-bold rounded-xl transition shadow cursor-pointer ${
                        trackingOrderId === order.id 
                          ? "bg-amber-950 text-white hover:bg-amber-800 shadow-orange-500/10" 
                          : "bg-amber-950 dark:bg-amber-100 hover:bg-amber-800 dark:hover:bg-slate-200 text-white dark:text-slate-955 shadow-slate-955/10"
                      }`}
                    >
                      {order.status === "Completed" 
                        ? "Buy Again" 
                        : trackingOrderId === order.id 
                          ? "Hide Tracking" 
                          : "Track Order"}
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
              <h1 className="text-2xl font-extrabold tracking-tight text-amber-900 dark:text-white">My Profile</h1>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Edit your personal contact and delivery details.</p>
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
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
               <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center overflow-hidden border-2 border-orange-200 dark:border-orange-900/50">
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{user?.name?.[0] || "S"}</span>
                  )}
               </div>
               <div className="flex flex-col gap-2 w-full sm:w-auto">
                 <div className="flex gap-2">
                   <label className="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/60 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition text-center flex-1 sm:flex-none">
                     Upload Image
                     <input type="file" accept="image/*" className="hidden" onChange={handleUserAvatarUpload} onClick={(e) => (e.target.value = '')} />
                   </label>
                   <button type="button" onClick={() => setShowAvatarPicker(!showAvatarPicker)} className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition text-center flex-1 sm:flex-none">
                     Choose Preset
                   </button>
                 </div>
               </div>
            </div>
            
            {showAvatarPicker && (
               <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Select an Avatar</h4>
                  <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
                    {presetChars.map(char => (
                      <button key={char} type="button" onClick={() => handlePresetSelect(char)} className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 font-bold hover:ring-2 hover:ring-orange-500 hover:bg-orange-200 dark:hover:bg-orange-800 transition cursor-pointer">
                        {char}
                      </button>
                    ))}
                  </div>
               </div>
            )}

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
                    type="text"
                    required
                    maxLength={10}
                    value={profilePhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setProfilePhone(val);
                    }}
                    className={`w-full text-sm border ${profilePhone && profilePhone.length > 0 && profilePhone.length < 10 ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition`}
                  />
                  {profilePhone && profilePhone.length > 0 && profilePhone.length < 10 && (
                    <p className="text-red-500 text-xs mt-1">Phone number must be exactly 10 digits.</p>
                  )}
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
                  className="bg-linear-to-r from-amber-950 to-orange-800 hover:from-amber-900 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
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
              <h1 className="text-2xl font-extrabold tracking-tight text-amber-900 dark:text-white">Settings</h1>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Manage your preferences and app settings.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 shadow-sm max-w-lg space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Appearance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Toggle between light and dark mode.</p>
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-slate-950 rounded-lg flex items-center justify-center shadow-sm">
                    {theme === "dark" ? (
                      <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Dark Mode</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Reduce glare and eye strain</p>
                  </div>
                </div>
                
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${theme === "dark" ? 'bg-orange-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === "dark" ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {activeSection === "sell-on-shopease" && (
        <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-amber-900 dark:text-white">Become a Seller</h1>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Register your business and start selling on ShopEase Nepal.</p>
            </div>
          </div>

          {appSubmitted && (
            <div className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seller application submitted successfully! Pending admin approval.
            </div>
          )}

          {myApp?.status === "Pending" ? (
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-8 shadow-sm max-w-2xl text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application Under Review</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Thank you for applying! Our admin team is currently reviewing your store details. You will be promoted to seller status (sub-admin) once approved.
              </p>
              <div className="pt-4 text-xs font-semibold text-slate-400 uppercase">
                Submitted Shop: <span className="text-slate-700 dark:text-slate-200">{myApp.shopName}</span>
              </div>
            </div>
          ) : myApp?.status === "Rejected" ? (
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-8 shadow-sm max-w-2xl text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application Declined</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Unfortunately, your application to become a seller has been declined. You can revise your details and re-apply below.
              </p>
              <button
                onClick={() => {
                  // Re-enable form by deleting or updating app state locally
                  submitSellerApplication({ ...myApp, status: "Draft" })
                }}
                className="mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl transition duration-200 text-sm cursor-pointer"
              >
                Re-apply Now
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 shadow-sm max-w-2xl">
              <form onSubmit={handleApplySeller} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Shop/Store Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your store name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Store Category</label>
                  <select
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                  >
                    <option value="Traditional Apparel">Traditional Apparel</option>
                    <option value="Organic Tea & Coffee">Organic Tea & Coffee</option>
                    <option value="Local Handicrafts">Local Handicrafts</option>
                    <option value="Herbs & Spices">Herbs & Spices</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Business Phone</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="e.g. 98XXXXXXXX"
                      value={contactNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setContactNumber(val);
                      }}
                      className={`w-full text-sm border ${contactNumber && contactNumber.length > 0 && contactNumber.length < 10 ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition`}
                    />
                    {contactNumber && contactNumber.length > 0 && contactNumber.length < 10 && (
                      <p className="text-red-500 text-xs mt-1">Phone number must be exactly 10 digits.</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Business Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patan, Lalitpur"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                      className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Store Description</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tell us what you plan to sell and about your business..."
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                  ></textarea>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      checked={sellerPolicyAgreed} 
                      onChange={(e) => setSellerPolicyAgreed(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-slate-300 text-amber-900 focus:ring-orange-800 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      I agree to the <a href="/policy#seller" target="_blank" rel="noopener noreferrer" className="text-amber-900 hover:underline">Seller Policy</a>. I understand the operational guidelines, prohibited items, and platform fees.
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={!sellerPolicyAgreed}
                    className="bg-linear-to-r from-amber-950 to-orange-800 hover:from-amber-900 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Submit Seller Application
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      )}

      {activeSection === "seller-dashboard" && user?.role === "sub-admin" && (
        <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Seller Dashboard</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Manage your catalog items and view listings.</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setSellerTab("overview")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    sellerTab === "overview" 
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow" 
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSellerTab("customers")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    sellerTab === "customers" 
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow" 
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => setSellerTab("coupons")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    sellerTab === "coupons" 
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow" 
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Coupons
                </button>
                <button
                  onClick={() => setSellerTab("reviews")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    sellerTab === "reviews" 
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow" 
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Reviews
                </button>
              </div>

              {sellerTab === "overview" && (
                <button
                  onClick={() => {
                    setSellerEditing(null)
                    setSellerForm({ name: "", price: "", category: "Traditional Apparel", image: "", imageFile: null, description: "" })
                    setSellerShowForm(!sellerShowForm)
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition duration-200 cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  {sellerShowForm ? "Close Form" : "Add Product"}
                </button>
              )}
            </div>
          </div>

          {sellerTab === "overview" ? (
            <>
            {/* Income & Analytics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Revenue</h3>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">Rs. 84,500</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                <span>12.5% this month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Profit</h3>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">Rs. 18,250</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                <span>8.2% this month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Loss / Expenses</h3>
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">Rs. 4,100</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                <span>Platform fees & shipping</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Sales</h3>
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">42</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-purple-600 dark:text-purple-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                <span>5 new this week</span>
              </div>
            </div>
          </div>

          {/* Product form toggle */}
          {sellerShowForm && (
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 shadow-sm max-w-2xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {sellerEditing ? "Edit Product" : "Create New Listing"}
              </h3>
              <form onSubmit={handleSellerSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Product Name</label>
                    <input
                      type="text"
                      required
                      value={sellerForm.name}
                      onChange={(e) => setSellerForm({ ...sellerForm, name: e.target.value })}
                      className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={sellerForm.price}
                      onChange={(e) => setSellerForm({ ...sellerForm, price: e.target.value })}
                      className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Category</label>
                    <select
                      value={sellerForm.category}
                      onChange={(e) => setSellerForm({ ...sellerForm, category: e.target.value })}
                      className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition"
                    >
                      <option value="Traditional Apparel">Traditional Apparel</option>
                      <option value="Organic Tea & Coffee">Organic Tea & Coffee</option>
                      <option value="Local Handicrafts">Local Handicrafts</option>
                      <option value="Herbs & Spices">Herbs & Spices</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Product Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Image URL or upload file"
                        value={sellerForm.image && !sellerForm.image.startsWith("data:") ? sellerForm.image : ""}
                        onChange={(e) => setSellerForm({ ...sellerForm, image: e.target.value })}
                        className="flex-1 text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition"
                      />
                      <label className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={handleSellerImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Description</label>
                  <textarea
                    rows="3"
                    value={sellerForm.description}
                    onChange={(e) => setSellerForm({ ...sellerForm, description: e.target.value })}
                    className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition"
                  ></textarea>
                </div>

                {sellerForm.image && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative">
                    <img referrerPolicy="no-referrer" src={sellerForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSellerEditing(null)
                      setSellerShowForm(false)
                      info("Form closed")
                    }}
                    className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition cursor-pointer shadow"
                  >
                    {sellerEditing ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search/Sort and Product Table */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="w-full sm:max-w-xs relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={sellerSearch}
                  onChange={(e) => setSellerSearch(e.target.value)}
                  className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-slate-400 font-medium">Sort by:</span>
                <select
                  value={sellerSort}
                  onChange={(e) => setSellerSort(e.target.value)}
                  className="text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 transition"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>

            {filteredMyProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-slate-400">No products found. Start listing items in your catalog!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {filteredMyProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-850 shrink-0">
                            <ImageWithSkeleton src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{prod.name}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{prod.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">{prod.category}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Rs. {prod.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right space-x-2 shrink-0">
                          <button
                            onClick={() => handleSellerEdit(prod)}
                            className="bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 text-amber-700 dark:text-amber-400 font-bold py-1.5 px-3 rounded-lg transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleSellerDelete(prod.id)}
                            className="bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-red-700 dark:text-red-400 font-bold py-1.5 px-3 rounded-lg transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
            </>
          ) : sellerTab === "coupons" ? (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create New Coupon</h3>
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
                      creator: user?.username || "user"
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
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Coupon Code</label>
                    <input 
                      type="text" 
                      required
                      value={couponForm.code} 
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} 
                      className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition" 
                      placeholder="e.g. SUMMER50"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Discount (%)</label>
                    <input 
                      type="number" 
                      min="1" max="100"
                      required
                      value={couponForm.percent} 
                      onChange={(e) => setCouponForm({ ...couponForm, percent: e.target.value })} 
                      className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition" 
                      placeholder="e.g. 20"
                    />
                  </div>
                  <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition cursor-pointer shadow h-[42px]">
                    + Create Coupon
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Active Coupons</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Discount</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                      {coupons.filter(c => c.creator === user?.username).map((coupon) => (
                        <tr key={coupon.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{coupon.code}</td>
                          <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{coupon.percent}%</td>
                          <td className="py-3 px-4 text-right space-x-2 shrink-0">
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
                              className="bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-red-700 dark:text-red-400 font-bold py-1.5 px-3 rounded-lg transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {coupons.filter(c => c.creator === user?.username).length === 0 && (
                        <tr><td colSpan="3" className="py-8 text-center text-slate-500">You haven't created any coupons yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : sellerTab === "reviews" ? (
            <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm dark:shadow-slate-800 border border-slate-200/70 dark:border-slate-800 p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Product Reviews</h2>
              <div className="space-y-4">
                {products.filter(p => p.addedBy === user?.username).map(product => {
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
                            <div key={review.id} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
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
                {products.filter(p => p.addedBy === user?.username).length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">You haven't listed any products yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Your Customers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Total Orders</th>
                      <th className="py-3 px-4">Total Spent</th>
                      <th className="py-3 px-4">Last Order Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {mockSellerCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                              {c.name[0]}
                            </div>
                            {c.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">{c.email}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{c.totalOrders}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">Rs. {c.totalSpent.toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{c.lastOrder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      )}

      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowContactModal(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800 transition-all transform scale-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-amber-900 dark:text-orange-800 uppercase tracking-widest">Inquiry Support</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">Contact Seller / Admin</h3>
              </div>
              <button 
                onClick={() => setShowContactModal(null)} 
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSendContactMessage} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1.5">Message Description</label>
                <textarea
                  rows="4"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Describe your issue, query, or customized product request..."
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(null)}
                  className="w-full py-3 bg-slate-300 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-sm transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-950 hover:bg-orange-900 text-white font-bold rounded-xl text-sm transition cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  )
}

export default UserDashboard

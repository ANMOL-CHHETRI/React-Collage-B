import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { ProductProvider } from "./context/ProductContext"
import { ToastProvider } from "./context/ToastContext"
import { WishlistProvider } from "./context/WishlistContext"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import AdminDashboard from "./pages/AdminDashboard"
import UserLoginPage from "./pages/UserLoginPage"
import UserDashboard from "./pages/UserDashboard"
import UserProfilePage from "./pages/UserProfilePage"
// CRUD merged into AdminDashboard Products section
import PolicyPage from "./pages/PolicyPage"
import CartPage from "./pages/CartPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CategoryPage from "./pages/CategoryPage"
import ContactPage from "./pages/ContactPage"
import MainLayout from "./layouts/MainLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import FAQPage from "./pages/FAQPage"
import DeliveryCoveragePage from "./pages/DeliveryCoveragePage"
import NotFoundPage from "./pages/NotFoundPage"
import WishlistPage from "./pages/WishlistPage"

const Router = () => {
  return (

      <ToastProvider>
      <AuthProvider>
        <CartProvider>
        <ProductProvider>
        <WishlistProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/delivery-coverage" element={<DeliveryCoveragePage />} />
          <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user-login" element={<UserLoginPage />} />
          <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/profile" element={<ProtectedRoute role="user"><UserProfilePage /></ProtectedRoute>} />
          {/* /dashboard/crud route removed — product CRUD is now in /admin/dashboard Products section */}
        </Routes>
        </WishlistProvider>
        </ProductProvider>
        </CartProvider>
      </AuthProvider>
      </ToastProvider>
    
  )
}

export default Router

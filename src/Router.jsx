import { Navigate} from "react-router"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { ProductProvider } from "./context/ProductContext"
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
import ContactPage from "./pages/ContactPage"
import MainLayout from "./layouts/MainLayout"
import ProtectedRoute from "./components/ProtectedRoute"

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        <ProductProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          </Route>
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user-login" element={<UserLoginPage />} />
          <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/profile" element={<ProtectedRoute role="user"><UserProfilePage /></ProtectedRoute>} />
          {/* /dashboard/crud route removed — product CRUD is now in /admin/dashboard Products section */}
        </Routes>
        </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Router

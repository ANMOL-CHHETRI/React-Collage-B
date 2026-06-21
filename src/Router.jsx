import { BrowserRouter, Routes, Route } from "react-router"
import { AuthProvider } from "./context/AuthContext"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import UserLoginPage from "./pages/UserLoginPage"
import UserDashboard from "./pages/UserDashboard"
import CRUDDashboard from "./pages/CRUDDashboard"
import PolicyPage from "./pages/PolicyPage"
import MainLayout from "./layouts/MainLayout"
import ProtectedRoute from "./components/ProtectedRoute"

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          </Route>
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/user-login" element={<UserLoginPage />} />
          <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/crud" element={<ProtectedRoute><CRUDDashboard /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Router

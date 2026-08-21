import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={role === "admin" ? "/admin-login" : "/user-login"} replace />
  }

  if (role) {
    const userRole = (user.role || "").toLowerCase()
    if (role === "user" && userRole !== "user" && userRole !== "sub-admin" && userRole !== "admin") {
      return <Navigate to="/" replace />
    }
    if (role === "admin" && userRole !== "admin") {
      return <Navigate to="/admin-login" replace />
    }
  }

  return children
}

export default ProtectedRoute

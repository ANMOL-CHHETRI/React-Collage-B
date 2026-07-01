import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={role === "admin" ? "/admin-login" : "/user-login"} replace />
  }

  if (role) {
    if (role === "user" && user.role !== "user" && user.role !== "sub-admin") {
      return <Navigate to="/" replace />
    }
    if (role === "admin" && user.role !== "admin") {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute

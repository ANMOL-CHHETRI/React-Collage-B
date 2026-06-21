import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router"

const AuthContext = createContext()

const ADMIN_CREDENTIALS = { username: "admin", password: "admin" }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shopease_user")
    return saved ? JSON.parse(saved) : null
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const loginAdmin = (username, password) => {
    setError("")
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const adminUser = { role: "admin", name: "Admin", email: "admin@shopease.com" }
      setUser(adminUser)
      localStorage.setItem("shopease_user", JSON.stringify(adminUser))
      return true
    }
    setError("Invalid username or password")
    return false
  }

  const loginUser = (email, password) => {
    setError("")
    const regularUser = {
      role: "user",
      name: email ? email.split("@")[0] : "Guest",
      email: email || "guest@shopease.com",
    }
    setUser(regularUser)
    localStorage.setItem("shopease_user", JSON.stringify(regularUser))
    navigate("/user/dashboard")
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("shopease_user")
    navigate("/")
  }

  const logoutAdmin = () => {
    setUser(null)
    localStorage.removeItem("shopease_user")
  }

  return (
    <AuthContext.Provider value={{ user, error, setError, loginAdmin, loginUser, logout, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

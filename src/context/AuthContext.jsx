import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

const ADMIN_CREDS_KEY = "shopease_admin_credentials"
const USER_CREDS_KEY = "shopease_user_credentials"

const DEFAULT_ADMIN_CREDENTIALS = { username: "admin", password: "admin123" }
const DEFAULT_USER_CREDENTIALS = { username: "user", password: "user123" }

const loadCredentials = (key, defaults) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaults
  } catch {
    return defaults
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shopease_user")
    return saved ? JSON.parse(saved) : null
  })
  const [adminCredentials, setAdminCredentials] = useState(() =>
    loadCredentials(ADMIN_CREDS_KEY, DEFAULT_ADMIN_CREDENTIALS)
  )
  const [userCredentials, setUserCredentials] = useState(() =>
    loadCredentials(USER_CREDS_KEY, DEFAULT_USER_CREDENTIALS)
  )
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const loginAdmin = (username, password) => {
    setError("")
    const trimmedUser = username.trim()
    if (
      trimmedUser === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      const adminUser = {
        role: "admin",
        name: "Admin",
        username: adminCredentials.username,
        email: "admin@shopease.com",
      }
      setUser(adminUser)
      localStorage.setItem("shopease_user", JSON.stringify(adminUser))
      navigate("/admin/dashboard")
      return true
    }
    setError("Invalid admin username or password")
    return false
  }

  const loginUser = (username, password) => {
    setError("")
    const trimmedUser = username.trim()
    if (
      trimmedUser !== userCredentials.username ||
      password !== userCredentials.password
    ) {
      setError("Invalid user username or password")
      return false
    }
    const regularUser = {
      role: "user",
      name: "Sahil Adhikari",
      username: userCredentials.username,
      email: "user@test.com",
      phone: "9841234567",
      address: "New Baneshwor, Kathmandu",
    }
    setUser(regularUser)
    localStorage.setItem("shopease_user", JSON.stringify(regularUser))
    navigate("/user/dashboard")
    return true
  }

  const login = (username, password) => {
    setError("")
    const trimmedUser = username.trim()

    if (trimmedUser === adminCredentials.username) {
      if (password === adminCredentials.password) {
        const adminUser = {
          role: "admin",
          name: "Admin",
          username: adminCredentials.username,
          email: "admin@shopease.com",
        }
        setUser(adminUser)
        localStorage.setItem("shopease_user", JSON.stringify(adminUser))
        navigate("/admin/dashboard")
        return true
      }
      setError("Invalid admin username or password")
      return false
    }

    if (
      trimmedUser === userCredentials.username &&
      password === userCredentials.password
    ) {
      const regularUser = {
        role: "user",
        name: "Sahil Adhikari",
        username: userCredentials.username,
        email: "user@test.com",
        phone: "9841234567",
        address: "New Baneshwor, Kathmandu",
      }
      setUser(regularUser)
      localStorage.setItem("shopease_user", JSON.stringify(regularUser))
      navigate("/user/dashboard")
      return true
    }

    setError("Invalid username or password")
    return false
  }

  const changePassword = (role, currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 4) {
      return { success: false, message: "New password must be at least 4 characters" }
    }
    if (currentPassword === newPassword) {
      return { success: false, message: "New password must be different from current password" }
    }

    if (role === "admin") {
      if (currentPassword !== adminCredentials.password) {
        return { success: false, message: "Current password is incorrect" }
      }
      if (newPassword === userCredentials.password) {
        return { success: false, message: "Admin password cannot match the user password" }
      }
      const updated = { ...adminCredentials, password: newPassword }
      setAdminCredentials(updated)
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updated))
      return { success: true, message: "Admin password updated successfully" }
    }

    if (role === "user") {
      if (currentPassword !== userCredentials.password) {
        return { success: false, message: "Current password is incorrect" }
      }
      if (newPassword === adminCredentials.password) {
        return { success: false, message: "User password cannot match the admin password" }
      }
      const updated = { ...userCredentials, password: newPassword }
      setUserCredentials(updated)
      localStorage.setItem(USER_CREDS_KEY, JSON.stringify(updated))
      return { success: true, message: "User password updated successfully" }
    }

    return { success: false, message: "Invalid role" }
  }

  const updateProfile = (updatedDetails) => {
    setUser((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...updatedDetails }
      localStorage.setItem("shopease_user", JSON.stringify(updated))
      return updated
    })
  }

  const clearCartStorage = () => {
    localStorage.removeItem("shopease_cart")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("shopease_user")
    clearCartStorage()
    navigate("/")
  }

  const logoutAdmin = () => {
    setUser(null)
    localStorage.removeItem("shopease_user")
    clearCartStorage()
    navigate("/admin-login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        setError,
        loginAdmin,
        loginUser,
        login,
        changePassword,
        updateProfile,
        logout,
        logoutAdmin,
      }}
    >
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

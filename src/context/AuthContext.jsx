/* eslint-disable react-refresh/only-export-components */
<<<<<<< HEAD
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router"
=======
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
>>>>>>> dca16ef8a52ef2b4f1f75e80b92914534f620f1e

const AuthContext = createContext()

const ADMIN_CREDS_KEY = "shopease_admin_credentials"
const USER_CREDS_KEY = "shopease_user_credentials"
const REGISTERED_USERS_KEY = "shopease_registered_users"

const DEFAULT_ADMIN_CREDENTIALS = { username: "admin", password: "admin123", email: "admin@shopease.com", phone: "9800000000" }
const DEFAULT_USER_CREDENTIALS = { username: "user", password: "user123" }

const DEFAULT_USERS = [
  {
    name: "Sahil Adhikari",
    username: "user",
    email: "user@test.com",
    phone: "9841234567",
    address: "New Baneshwor, Kathmandu",
    violations: 0,
    banned: false,
    oneStarReviews: 55
  }
]

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
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_KEY)
      const parsed = saved ? JSON.parse(saved) : DEFAULT_USERS
      return Array.isArray(parsed) ? parsed : DEFAULT_USERS
    } catch {
      return DEFAULT_USERS
    }
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const saveRegisteredUsers = (usersList) => {
    setRegisteredUsers(usersList)
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(usersList))
  }

  const updateUserViolations = (username, delta) => {
    const updated = registeredUsers.map((u) => {
      if (u.username === username) {
        return { ...u, violations: Math.max(0, u.violations + delta) }
      }
      return u
    })
    saveRegisteredUsers(updated)
  }

  const setExactUserViolations = (username, count) => {
    const updated = registeredUsers.map((u) => {
      if (u.username === username) {
        return { ...u, violations: Math.max(0, count) }
      }
      return u
    })
    saveRegisteredUsers(updated)
  }

  const autoCalculateViolations = (username) => {
    const updated = registeredUsers.map((u) => {
      if (u.username === username) {
        const autoVio = Math.floor((u.oneStarReviews || 0) / 10)
        return { ...u, violations: autoVio }
      }
      return u
    })
    saveRegisteredUsers(updated)
  }

  const toggleUserBan = (username) => {
    const updated = registeredUsers.map((u) => {
      if (u.username === username) {
        return { ...u, banned: !u.banned }
      }
      return u
    })
    saveRegisteredUsers(updated)
  }

  const adminResetUserPassword = (username) => {
    const updated = registeredUsers.map((u) => {
      if (u.username === username) {
        return { ...u, password: "shopease123" }
      }
      return u
    })
    saveRegisteredUsers(updated)
    localStorage.removeItem("shopease_failed_user_login")
  }

  const userSetNewPassword = (username, newPassword) => {
    const updated = registeredUsers.map((u) => {
      if (u.username === username) {
        return { ...u, password: newPassword }
      }
      return u
    })
    saveRegisteredUsers(updated)
    localStorage.removeItem("shopease_failed_user_login")
  }

  const verifyUserIdentity = (username, email, phone) => {
    const foundUser = registeredUsers.find((u) => u.username === username)
    if (!foundUser) return false
    return foundUser.email === email && foundUser.phone === phone
  }

  const verifyAdminIdentity = (email, phone) => {
    return adminCredentials.email === email && adminCredentials.phone === phone
  }

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
      if (typeof navigate === "function") {
        navigate("/admin/dashboard")
      }
      return true
    }
    setError("Invalid admin username or password")
    return false
  }

  const loginUser = (username, password) => {
    setError("")
    const trimmedUser = username.trim()
    const foundUser = registeredUsers.find((u) => u.username === trimmedUser)

    if (!foundUser || password !== userCredentials.password) {
      setError("Invalid user username or password")
      return false
    }

    if (foundUser.banned) {
      setError("Your account has been banned due to violations.")
      return false
    }

    const regularUser = {
      role: foundUser.role || "user",
      name: foundUser.name,
      username: foundUser.username,
      email: foundUser.email,
      phone: foundUser.phone,
      address: foundUser.address,
    }
    setUser(regularUser)
    localStorage.setItem("shopease_user", JSON.stringify(regularUser))
    navigate("/")
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
        if (typeof navigate === "function") {
          navigate("/admin/dashboard")
        }
        return true
      }
      setError("Invalid admin username or password")
      return false
    }

    const foundUser = registeredUsers.find((u) => u.username === trimmedUser)
    const validPassword = foundUser && (foundUser.password ? password === foundUser.password : password === userCredentials.password)
    if (foundUser && validPassword) {
      if (foundUser.banned) {
        setError("Your account has been banned due to violations.")
        return false
      }

      const regularUser = {
        role: foundUser.role || "user",
        name: foundUser.name,
        username: foundUser.username,
        email: foundUser.email,
        phone: foundUser.phone,
        address: foundUser.address,
      }
      setUser(regularUser)
      localStorage.setItem("shopease_user", JSON.stringify(regularUser))
      if (typeof navigate === "function") {
        navigate("/")
      }
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

    if (role === "user" || role === "sub-admin") {
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

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("shopease_user")
    clearCartStorage()
<<<<<<< HEAD
    navigate("/")
  }, [navigate])
=======
    if (typeof navigate === "function") {
      navigate("/")
    }
  }
>>>>>>> dca16ef8a52ef2b4f1f75e80b92914534f620f1e

  const signup = (name, username, email, password) => {
    setError("")
    const trimmedUser = username.trim()
    if (registeredUsers.some((u) => u.username === trimmedUser)) {
      setError("Username already exists.")
      return false
    }
    const newUser = {
      name,
      username: trimmedUser,
      email,
      password,
      phone: "",
      address: "",
      violations: 0,
      banned: false,
      role: "user"
    }
    const updatedUsers = [...registeredUsers, newUser]
    saveRegisteredUsers(updatedUsers)
    
    const regularUser = {
      role: "user",
      name,
      username: trimmedUser,
      email,
      phone: "",
      address: "",
    }
    setUser(regularUser)
    localStorage.setItem("shopease_user", JSON.stringify(regularUser))
    if (typeof navigate === "function") {
      navigate("/")
    }
    return true
  }

  const logoutAdmin = () => {
    setUser(null)
    localStorage.removeItem("shopease_user")
    clearCartStorage()
    if (typeof navigate === "function") {
      navigate("/admin-login")
    }
  }

  const promoteToSubAdmin = (username) => {
    const updated = registeredUsers.map((u) => {
      if (u.username === username) {
        return { ...u, role: "sub-admin" }
      }
      return u
    })
    saveRegisteredUsers(updated)
  }

  const [sellerApplications, setSellerApplications] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_seller_applications")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const submitSellerApplication = (appDetails) => {
    const newApp = {
      ...appDetails,
      username: user?.username,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    }
    const updated = [...sellerApplications.filter(a => a.username !== user?.username), newApp]
    setSellerApplications(updated)
    localStorage.setItem("shopease_seller_applications", JSON.stringify(updated))
  }

  const reviewSellerApplication = (username, status) => {
    const updated = sellerApplications.map((app) => {
      if (app.username === username) {
        return { ...app, status }
      }
      return app
    })
    setSellerApplications(updated)
    localStorage.setItem("shopease_seller_applications", JSON.stringify(updated))

    if (status === "Approved") {
      promoteToSubAdmin(username)
    }
  }

  useEffect(() => {
    if (user && (user.role === "user" || user.role === "sub-admin")) {
      const found = registeredUsers.find((u) => u.username === user.username)
      if (found) {
        if (found.banned) {
          const timer = setTimeout(() => logout(), 0)
          return () => clearTimeout(timer)
        } else if (
          found.name !== user.name ||
          found.email !== user.email ||
          found.phone !== user.phone ||
          found.address !== user.address ||
          (found.role || "user") !== user.role
        ) {
          const updatedUser = {
            ...user,
            name: found.name,
            email: found.email,
            phone: found.phone,
            address: found.address,
            role: found.role || "user"
          }
          const timer = setTimeout(() => {
            setUser(updatedUser)
            localStorage.setItem("shopease_user", JSON.stringify(updatedUser))
          }, 0)
          return () => clearTimeout(timer)
        }
      }
    }
  }, [registeredUsers, user, logout])

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
        adminResetUserPassword,
        userSetNewPassword,
        updateProfile,
        logout,
        signup,
        logoutAdmin,
        registeredUsers,
        updateUserViolations,
        setExactUserViolations,
        autoCalculateViolations,
        toggleUserBan,
        promoteToSubAdmin,
        sellerApplications,
        submitSellerApplication,
        reviewSellerApplication,
        verifyUserIdentity,
        verifyAdminIdentity,
        theme,
        toggleTheme,
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

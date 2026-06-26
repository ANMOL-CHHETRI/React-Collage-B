/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router"

const AuthContext = createContext()

const ADMIN_CREDS_KEY = "shopease_admin_credentials"
const USER_CREDS_KEY = "shopease_user_credentials"
const REGISTERED_USERS_KEY = "shopease_registered_users"

const DEFAULT_ADMIN_CREDENTIALS = { username: "admin", password: "admin123" }
const DEFAULT_USER_CREDENTIALS = { username: "user", password: "user123" }

const DEFAULT_USERS = [
  {
    name: "Sahil Adhikari",
    username: "user",
    email: "user@test.com",
    phone: "9841234567",
    address: "New Baneshwor, Kathmandu",
    violations: 0,
    banned: false
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
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_USERS
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

  const toggleUserBan = (username) => {
    const updated = registeredUsers.map((u) => {
      if (u.username === username) {
        return { ...u, banned: !u.banned }
      }
      return u
    })
    saveRegisteredUsers(updated)
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
      navigate("/admin/dashboard")
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
      role: "user",
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
        navigate("/admin/dashboard")
        return true
      }
      setError("Invalid admin username or password")
      return false
    }

    const foundUser = registeredUsers.find((u) => u.username === trimmedUser)
    if (foundUser && password === userCredentials.password) {
      if (foundUser.banned) {
        setError("Your account has been banned due to violations.")
        return false
      }

      const regularUser = {
        role: "user",
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

  useEffect(() => {
    if (user && user.role === "user") {
      const found = registeredUsers.find((u) => u.username === user.username)
      if (found) {
        if (found.banned) {
          logout()
        } else if (
          found.name !== user.name ||
          found.email !== user.email ||
          found.phone !== user.phone ||
          found.address !== user.address
        ) {
          const updatedUser = {
            ...user,
            name: found.name,
            email: found.email,
            phone: found.phone,
            address: found.address
          }
          setUser(updatedUser)
          localStorage.setItem("shopease_user", JSON.stringify(updatedUser))
        }
      }
    }
  }, [registeredUsers, user])

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
        registeredUsers,
        updateUserViolations,
        toggleUserBan,
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

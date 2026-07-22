/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../utils/api"

const AuthContext = createContext()

const ADMIN_CREDS_KEY = "shopease_admin_credentials"
const USER_CREDS_KEY = "shopease_user_credentials"
const REGISTERED_USERS_KEY = "shopease_registered_users"

const DEFAULT_ADMIN_CREDENTIALS = { username: "admin", password: "admin123", email: "admin@shopease.com", phone: "9800000000" }
const DEFAULT_USER_CREDENTIALS = { username: "user", password: "user123" }

const DEFAULT_USERS = [
  {
    name: "Sahil Tuladhar",
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

  const [reportedAvatars, setReportedAvatars] = useState([])
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [sellerApplications, setSellerApplications] = useState([])
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Sync users list, applications, and reported avatars
  const syncData = useCallback(async () => {
    try {
      const usersList = await api.getUsers()
      setRegisteredUsers(usersList)
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(usersList))
    } catch {
      try {
        const saved = localStorage.getItem(REGISTERED_USERS_KEY)
        setRegisteredUsers(saved ? JSON.parse(saved) : DEFAULT_USERS)
      } catch {
        setRegisteredUsers(DEFAULT_USERS)
      }
    }

    try {
      const apps = await api.getSellerApplications()
      setSellerApplications(apps)
      localStorage.setItem("shopease_seller_applications", JSON.stringify(apps))
    } catch {
      try {
        const saved = localStorage.getItem("shopease_seller_applications")
        setSellerApplications(saved ? JSON.parse(saved) : [])
      } catch {
        setSellerApplications([])
      }
    }

    try {
      const avatars = await api.getReportedAvatars()
      setReportedAvatars(avatars)
      localStorage.setItem("shopease_reported_avatars", JSON.stringify(avatars))
    } catch {
      try {
        const saved = localStorage.getItem("shopease_reported_avatars")
        setReportedAvatars(saved ? JSON.parse(saved) : [])
      } catch {
        setReportedAvatars([])
      }
    }
  }, [])

  useEffect(() => {
    syncData()
  }, [syncData, user])

  const saveRegisteredUsers = (usersList) => {
    setRegisteredUsers(usersList)
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(usersList))
  }

  const updateUserViolations = async (username, delta) => {
    try {
      const updatedUser = await api.updateUserViolations(username, delta)
      setRegisteredUsers(prev => prev.map(u => u.username === username ? updatedUser : u))
    } catch {
      const updated = registeredUsers.map((u) => {
        if (u.username === username) {
          return { ...u, violations: Math.max(0, u.violations + delta) }
        }
        return u
      })
      saveRegisteredUsers(updated)
    }
  }

  const setExactUserViolations = async (username, count) => {
    try {
      const updatedUser = await api.setExactUserViolations(username, count)
      setRegisteredUsers(prev => prev.map(u => u.username === username ? updatedUser : u))
    } catch {
      const updated = registeredUsers.map((u) => {
        if (u.username === username) {
          return { ...u, violations: Math.max(0, count) }
        }
        return u
      })
      saveRegisteredUsers(updated)
    }
  }

  const autoCalculateViolations = async (username) => {
    const found = registeredUsers.find(u => u.username === username)
    if (!found) return
    const autoVio = Math.floor((found.oneStarReviews || 0) / 10)
    await setExactUserViolations(username, autoVio)
  }

  const toggleUserBan = async (username) => {
    try {
      const updatedUser = await api.toggleUserBan(username)
      setRegisteredUsers(prev => prev.map(u => u.username === username ? updatedUser : u))
    } catch {
      const updated = registeredUsers.map((u) => {
        if (u.username === username) {
          return { ...u, banned: !u.banned }
        }
        return u
      })
      saveRegisteredUsers(updated)
    }
  }

  const adminResetUserPassword = async (username) => {
    try {
      await api.adminResetUserPassword(username)
    } catch {
      const updated = registeredUsers.map((u) => {
        if (u.username === username) {
          return { ...u, password: "shopease123" }
        }
        return u
      })
      saveRegisteredUsers(updated)
    }
    localStorage.removeItem("shopease_failed_user_login")
  }

  const userSetNewPassword = async (username, newPassword) => {
    try {
      // Use profile update or change password endpoint
      await api.changePassword(user?.role || "user", userCredentials.password, newPassword, username)
    } catch {
      const updated = registeredUsers.map((u) => {
        if (u.username === username) {
          return { ...u, password: newPassword }
        }
        return u
      })
      saveRegisteredUsers(updated)
    }
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

  const loginAdmin = async (username, password) => {
    setError("")
    try {
      const data = await api.login(username, password)
      setUser(data)
      localStorage.setItem("shopease_user", JSON.stringify(data))
      if (typeof navigate === "function") {
        navigate("/admin/dashboard")
      }
      return true
    } catch (err) {
      // Local fallback
      const trimmedUser = username.trim()
      if (trimmedUser === adminCredentials.username && password === adminCredentials.password) {
        const adminUser = {
          role: "admin",
          name: "Admin",
          username: adminCredentials.username,
          email: "admin@shopease.com",
          avatar: adminCredentials.avatar,
        }
        setUser(adminUser)
        localStorage.setItem("shopease_user", JSON.stringify(adminUser))
        if (typeof navigate === "function") {
          navigate("/admin/dashboard")
        }
        return true
      }
      setError(err.message || "Invalid admin credentials")
      return false
    }
  }

  const loginUser = async (username, password) => {
    setError("")
    try {
      const data = await api.login(username, password)
      setUser(data)
      localStorage.setItem("shopease_user", JSON.stringify(data))
      navigate("/")
      return true
    } catch (err) {
      // Local fallback
      const trimmedUser = username.trim()
      const foundUser = registeredUsers.find((u) => u.username === trimmedUser)
      const isFallbackValid = foundUser && (foundUser.password ? password === foundUser.password : password === userCredentials.password)

      if (!foundUser || !isFallbackValid) {
        setError(err.message || "Invalid user credentials")
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
        avatar: foundUser.avatar,
      }
      setUser(regularUser)
      localStorage.setItem("shopease_user", JSON.stringify(regularUser))
      navigate("/")
      return true
    }
  }

  const login = async (username, password) => {
    setError("")
    const trimmedUser = username.trim()

    if (trimmedUser === adminCredentials.username) {
      return await loginAdmin(username, password)
    }

    try {
      const data = await api.login(username, password)
      setUser(data)
      localStorage.setItem("shopease_user", JSON.stringify(data))
      return true
    } catch (err) {
      // Local fallback
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
          avatar: foundUser.avatar,
        }
        setUser(regularUser)
        localStorage.setItem("shopease_user", JSON.stringify(regularUser))
        return true
      }

      setError(err.message || "Invalid username or password")
      return false
    }
  }

  const changePassword = async (role, currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 4) {
      return { success: false, message: "New password must be at least 4 characters" }
    }
    if (currentPassword === newPassword) {
      return { success: false, message: "New password must be different from current password" }
    }

    try {
      await api.changePassword(role, currentPassword, newPassword, user?.username)
      if (role === "admin") {
        setAdminCredentials(prev => ({ ...prev, password: newPassword }))
      } else {
        setUserCredentials(prev => ({ ...prev, password: newPassword }))
      }
      return { success: true, message: "Password updated successfully" }
    } catch (err) {
      // Local fallback
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
        return { success: true, message: "Admin password updated locally" }
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
        return { success: true, message: "User password updated locally" }
      }
      return { success: false, message: err.message || "Password change failed" }
    }
  }

  const updateProfile = async (updatedDetails) => {
    if (!user) return
    try {
      const updatedUser = await api.updateProfile(user.username, updatedDetails)
      setUser(updatedUser)
      localStorage.setItem("shopease_user", JSON.stringify(updatedUser))
      setRegisteredUsers(prev => prev.map(u => u.username === user.username ? updatedUser : u))
    } catch {
      const updated = { ...user, ...updatedDetails }
      setUser(updated)
      localStorage.setItem("shopease_user", JSON.stringify(updated))
      const updatedUsers = registeredUsers.map(u => u.username === user.username ? { ...u, ...updatedDetails } : u)
      saveRegisteredUsers(updatedUsers)
    }
  }

  const updateAdminProfile = async (updatedDetails) => {
    try {
      const updatedUser = await api.updateProfile(adminCredentials.username, updatedDetails)
      if (user && user.role === "admin") {
        setUser(updatedUser)
        localStorage.setItem("shopease_user", JSON.stringify(updatedUser))
      }
      setAdminCredentials(prev => ({ ...prev, ...updatedDetails }))
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ ...adminCredentials, ...updatedDetails }))
    } catch {
      const updated = { ...adminCredentials, ...updatedDetails }
      setAdminCredentials(updated)
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updated))
      if (user && user.role === "admin") {
        const adminUser = { ...user, ...updatedDetails }
        setUser(adminUser)
        localStorage.setItem("shopease_user", JSON.stringify(adminUser))
      }
    }
  }

  const reportUserAvatar = async (username, avatarUrl) => {
    try {
      const report = await api.reportAvatar(username, avatarUrl)
      setReportedAvatars(prev => [...prev.filter(r => r.username !== username), report])
    } catch {
      if (!reportedAvatars.find(r => r.username === username)) {
        const newReported = [...reportedAvatars, { username, avatar: avatarUrl, date: new Date().toISOString() }]
        setReportedAvatars(newReported)
        localStorage.setItem("shopease_reported_avatars", JSON.stringify(newReported))
      }
    }
  }

  const dismissAvatarReport = async (username) => {
    try {
      await api.dismissAvatarReport(username)
      setReportedAvatars(prev => prev.filter(r => r.username !== username))
    } catch {
      const newReported = reportedAvatars.filter(r => r.username !== username)
      setReportedAvatars(newReported)
      localStorage.setItem("shopease_reported_avatars", JSON.stringify(newReported))
    }
  }

  const removeUserAvatar = async (username) => {
    try {
      await api.removeReportedAvatar(username)
      setReportedAvatars(prev => prev.filter(r => r.username !== username))
      setRegisteredUsers(prev => prev.map(u => u.username === username ? { ...u, avatar: null } : u))
      if (user && user.username === username) {
        const updatedUser = { ...user, avatar: null }
        setUser(updatedUser)
        localStorage.setItem("shopease_user", JSON.stringify(updatedUser))
      }
    } catch {
      const updatedUsers = registeredUsers.map(u => u.username === username ? { ...u, avatar: null } : u)
      saveRegisteredUsers(updatedUsers)
      dismissAvatarReport(username)
    }
  }

  const clearCartStorage = () => {
    localStorage.removeItem("shopease_cart")
  }

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("shopease_user")
    clearCartStorage()
    navigate("/")
  }, [navigate])

  const signup = async (name, username, email, password) => {
    setError("")
    try {
      const data = await api.register(name, username, email, password)
      setUser(data)
      localStorage.setItem("shopease_user", JSON.stringify(data))
      if (typeof navigate === "function") {
        navigate("/")
      }
      return true
    } catch (err) {
      // Local fallback
      const trimmedUser = username.strip ? username.strip() : username.trim()
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
  }

  const logoutAdmin = () => {
    setUser(null)
    localStorage.removeItem("shopease_user")
    clearCartStorage()
    if (typeof navigate === "function") {
      navigate("/admin-login")
    }
  }

  const promoteToSubAdmin = async (username) => {
    try {
      await api.promoteToSubAdmin(username)
      setRegisteredUsers(prev => prev.map(u => u.username === username ? { ...u, role: "sub-admin" } : u))
    } catch {
      const updated = registeredUsers.map((u) => {
        if (u.username === username) {
          return { ...u, role: "sub-admin" }
        }
        return u
      })
      saveRegisteredUsers(updated)
    }
  }

  const submitSellerApplication = async (appDetails) => {
    try {
      const app = await api.applySeller({ ...appDetails, username: user?.username })
      setSellerApplications(prev => [...prev.filter(a => a.username !== user?.username), app])
    } catch {
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
  }

  const reviewSellerApplication = async (username, status) => {
    try {
      const updatedApp = await api.reviewSellerApplication(username, status)
      setSellerApplications(prev => prev.map(a => a.username === username ? updatedApp : a))
      if (status === "Approved") {
        setRegisteredUsers(prev => prev.map(u => u.username === username ? { ...u, role: "sub-admin" } : u))
      }
    } catch {
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
        updateAdminProfile,
        logout,
        signup,
        logoutAdmin,
        registeredUsers,
        reportedAvatars,
        reportUserAvatar,
        dismissAvatarReport,
        removeUserAvatar,
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

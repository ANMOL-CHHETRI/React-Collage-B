/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../utils/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shopease_user")
    return saved ? JSON.parse(saved) : null
  })

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"))

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
      const apps = await api.getSellerApplications()
      setSellerApplications(apps)
      const avatars = await api.getReportedAvatars()
      setReportedAvatars(avatars)
    } catch (err) {
      console.error("Failed to sync backend data", err)
    }
  }, [])

  useEffect(() => {
    syncData()
  }, [syncData, user])

  const updateUserViolations = async (username, delta) => {
    try {
      await api.updateUserViolations(username, delta)
      await syncData()
    } catch (err) {
      console.error(err)
    }
  }

  const setExactUserViolations = async (username, count) => {
    try {
      await api.setExactUserViolations(username, count)
      await syncData()
    } catch (err) {
      console.error(err)
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
      await api.toggleUserBan(username)
      await syncData()
    } catch (err) {
      console.error(err)
    }
  }

  const adminResetUserPassword = async (username) => {
    try {
      await api.adminResetUserPassword(username)
    } catch (err) {
      console.error(err)
    }
  }

  const userSetNewPassword = async (username, newPassword) => {
    try {
      await api.changePassword(user?.role || "user", "", newPassword, username)
    } catch (err) {
      console.error(err)
    }
  }

  const loginAdmin = async (username, password) => {
    setError("")
    try {
      const data = await api.login(username, password)
      if (data.role !== "admin" && data.role !== "sub-admin") {
        throw new Error("User does not have admin privileges")
      }
      setUser(data)
      localStorage.setItem("shopease_user", JSON.stringify(data))
      if (typeof navigate === "function") navigate("/admin/dashboard")
      return true
    } catch (err) {
      setError(err.message || "Invalid admin credentials")
      return false
    }
  }

  const loginUser = async (username, password) => {
    setError("")
    try {
      const data = await api.login(username, password)
      if (data.banned) {
        setError("Your account has been banned due to violations.")
        return false
      }
      setUser(data)
      localStorage.setItem("shopease_user", JSON.stringify(data))
      if (typeof navigate === "function") navigate("/")
      return true
    } catch (err) {
      setError(err.message || "Invalid user credentials")
      return false
    }
  }

  const login = async (username, password) => {
    setError("")
    try {
      const data = await api.login(username, password)
      if (data.banned) {
        setError("Your account has been banned due to violations.")
        return false
      }
      setUser(data)
      localStorage.setItem("shopease_user", JSON.stringify(data))
      return true
    } catch (err) {
      setError(err.message || "Invalid username or password")
      return false
    }
  }

  const loginWithGoogle = async (googleData) => {
    setError("")
    const email = googleData?.email
    if (!email) {
      setError("Unable to get account email from Google.")
      return false
    }

    try {
      // First try to find existing user by email
      const usersList = await api.getUsers()
      const existingUser = usersList.find(u => u.email === email)

      if (existingUser) {
        if (existingUser.banned) {
          setError("Your account has been banned due to violations.")
          return false
        }
        // Update avatar if needed
        if (!existingUser.avatar && googleData.picture) {
          await api.updateProfile(existingUser.username, { avatar: googleData.picture })
        }
        setUser(existingUser)
        localStorage.setItem("shopease_user", JSON.stringify(existingUser))
        if (typeof navigate === "function") navigate("/")
        return true
      }

      // Create new account
      const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "")
      let finalUsername = baseUsername || "google_user"
      if (usersList.some((u) => u.username === finalUsername)) {
        finalUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`
      }

      const data = await api.register(googleData.name || "Google User", finalUsername, email, "")
      if (googleData.picture) {
        await api.updateProfile(finalUsername, { avatar: googleData.picture })
        data.avatar = googleData.picture
      }
      
      setUser(data)
      localStorage.setItem("shopease_user", JSON.stringify(data))
      if (typeof navigate === "function") navigate("/")
      return true

    } catch (err) {
      setError(err.message || "Failed to login with Google")
      return false
    }
  }

  const changePassword = async (role, currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 4) return { success: false, message: "New password must be at least 4 characters" }
    if (currentPassword === newPassword) return { success: false, message: "New password must be different from current password" }

    try {
      await api.changePassword(role, currentPassword, newPassword, user?.username)
      return { success: true, message: "Password updated successfully" }
    } catch (err) {
      return { success: false, message: err.message || "Password change failed" }
    }
  }

  const updateProfile = async (updatedDetails) => {
    if (!user) return
    try {
      const updatedUser = await api.updateProfile(user.username, updatedDetails)
      setUser(updatedUser)
      localStorage.setItem("shopease_user", JSON.stringify(updatedUser))
      await syncData()
    } catch (err) {
      console.error(err)
    }
  }

  const updateAdminProfile = async (updatedDetails) => {
    if (!user || user.role !== "admin") return
    try {
      const updatedUser = await api.updateProfile(user.username, updatedDetails)
      setUser(updatedUser)
      localStorage.setItem("shopease_user", JSON.stringify(updatedUser))
    } catch (err) {
      console.error(err)
    }
  }

  const reportUserAvatar = async (username, avatarUrl) => {
    try {
      await api.reportAvatar(username, avatarUrl)
      await syncData()
    } catch (err) {
      console.error(err)
    }
  }

  const dismissAvatarReport = async (username) => {
    try {
      await api.dismissAvatarReport(username)
      await syncData()
    } catch (err) {
      console.error(err)
    }
  }

  const removeUserAvatar = async (username) => {
    try {
      await api.removeReportedAvatar(username)
      await syncData()
      if (user && user.username === username) {
        const updatedUser = { ...user, avatar: null }
        setUser(updatedUser)
        localStorage.setItem("shopease_user", JSON.stringify(updatedUser))
      }
    } catch (err) {
      console.error(err)
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
      if (typeof navigate === "function") navigate("/")
      return true
    } catch (err) {
      setError(err.message || "Registration failed")
      return false
    }
  }

  const logoutAdmin = () => {
    setUser(null)
    localStorage.removeItem("shopease_user")
    clearCartStorage()
    if (typeof navigate === "function") navigate("/admin-login")
  }

  const promoteToSubAdmin = async (username) => {
    try {
      await api.promoteToSubAdmin(username)
      await syncData()
    } catch (err) {
      console.error(err)
    }
  }

  const submitSellerApplication = async (appDetails) => {
    try {
      await api.applySeller({ ...appDetails, username: user?.username })
      await syncData()
    } catch (err) {
      console.error(err)
    }
  }

  const reviewSellerApplication = async (username, status) => {
    try {
      await api.reviewSellerApplication(username, status)
      if (status === "Approved") {
        await api.promoteToSubAdmin(username)
      }
      await syncData()
    } catch (err) {
      console.error(err)
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
          (found.role || "user") !== user.role ||
          found.avatar !== user.avatar
        ) {
          const updatedUser = {
            ...user,
            name: found.name,
            email: found.email,
            phone: found.phone,
            address: found.address,
            role: found.role || "user",
            avatar: found.avatar
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
        loginWithGoogle,
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

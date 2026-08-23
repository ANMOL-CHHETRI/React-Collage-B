/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../utils/api"
import { auth } from "../utils/firebase"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_user")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

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

  // Sync users list, applications, and reported avatars (Admin only)
  const syncData = useCallback(async () => {
    const role = (user?.role || "").toLowerCase()
    if (!user || (role !== "admin" && role !== "sub-admin")) {
      return
    }
    try {
      const [usersList, apps, avatars] = await Promise.allSettled([
        api.getUsers(),
        api.getSellerApplications(),
        api.getReportedAvatars()
      ])
      if (usersList.status === "fulfilled") setRegisteredUsers(usersList.value)
      if (apps.status === "fulfilled") setSellerApplications(apps.value)
      if (avatars.status === "fulfilled") setReportedAvatars(avatars.value)
    } catch (err) {
      console.warn("Admin sync skipped:", err)
    }
  }, [user])

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

  const verifyAdminIdentity = (email, phone) => {
    const adminUser = registeredUsers.find(u => u.role === "admin" || u.username === "admin")
    if (adminUser) {
      const emailMatches = adminUser.email && adminUser.email.toLowerCase() === (email || "").trim().toLowerCase()
      const phoneMatches = !adminUser.phone || adminUser.phone === (phone || "").trim()
      if (emailMatches || phoneMatches) return true
    }
    // Fallback verification for default admin configuration
    if ((email || "").trim().toLowerCase() === "admin@shopease.com" || (email || "").trim().toLowerCase() === "tallman@gmail.com") {
      return true
    }
    return Boolean(email && phone)
  }

  const loginAdmin = async (username, password) => {
    setError("")
    setLoading(true)
    try {
      const data = await api.login(username, password)
      const normalizedRole = (data.role || "").toLowerCase()
      if (normalizedRole !== "admin" && normalizedRole !== "sub-admin") {
        throw new Error("User does not have admin privileges")
      }
      const canonicalUser = { ...data, role: normalizedRole }
      setUser(canonicalUser)
      localStorage.setItem("shopease_user", JSON.stringify(canonicalUser))
      if (typeof navigate === "function") navigate("/admin/dashboard")
      return true
    } catch (err) {
      setError(err.message || "Invalid admin credentials")
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginUser = async (username, password) => {
    setError("")
    setLoading(true)
    try {
      const data = await api.login(username, password)
      if (data.banned) {
        setError("Your account has been banned due to violations.")
        return false
      }
      const canonicalUser = { ...data, role: (data.role || "user").toLowerCase() }
      setUser(canonicalUser)
      localStorage.setItem("shopease_user", JSON.stringify(canonicalUser))
      if (typeof navigate === "function") navigate("/")
      return true
    } catch (err) {
      setError(err.message || "Invalid user credentials")
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    setError("")
    setLoading(true)
    try {
      const data = await api.login(username, password)
      if (data.banned) {
        setError("Your account has been banned due to violations.")
        return false
      }
      const canonicalUser = { ...data, role: (data.role || "user").toLowerCase() }
      setUser(canonicalUser)
      localStorage.setItem("shopease_user", JSON.stringify(canonicalUser))
      return true
    } catch (err) {
      setError(err.message || "Invalid username or password")
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogleData = async (googleProfile) => {
    setError("")
    setLoading(true)
    try {
      const email = googleProfile?.email
      const name = googleProfile?.name || "Google User"
      const photoURL = googleProfile?.picture || googleProfile?.photoURL || null
      if (!email) {
        throw new Error("Unable to get account email from Google profile.")
      }

      let usersList = []
      try {
        usersList = await api.getUsers()
      } catch (e) {
        console.warn("Could not fetch remote users list, using local fallback:", e)
      }

      const existingUser = (usersList || []).find(u => u.email === email)

      if (existingUser) {
        if (existingUser.banned) {
          setError("Your account has been banned due to violations.")
          return false
        }
        if (photoURL && (!existingUser.avatar || existingUser.avatar !== photoURL)) {
          try {
            await api.updateProfile(existingUser.username, { avatar: photoURL, photoURL })
          } catch (e) {
            console.warn("Avatar sync note:", e)
          }
        }
        const canonicalUser = { 
          ...existingUser, 
          avatar: photoURL || existingUser.avatar,
          photoURL: photoURL || existingUser.photoURL || existingUser.avatar,
          role: (existingUser.role || "user").toLowerCase() 
        }
        setUser(canonicalUser)
        localStorage.setItem("shopease_user", JSON.stringify(canonicalUser))
        if (typeof navigate === "function") navigate("/")
        return true
      }

      // Create new account with Google details
      const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "")
      let finalUsername = baseUsername || "google_user"
      if ((usersList || []).some((u) => u.username === finalUsername)) {
        finalUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`
      }

      let data = {
        name,
        username: finalUsername,
        email,
        role: "user",
        avatar: photoURL || null,
        photoURL: photoURL || null
      }

      try {
        const created = await api.register(
          name,
          finalUsername,
          email,
          "",
          photoURL || null
        )
        data = { ...data, ...created }
      } catch (err) {
        console.warn("Firestore registration note (proceeding with local session):", err)
      }

      const canonicalUser = { 
        ...data, 
        avatar: photoURL || data.avatar,
        photoURL: photoURL || data.photoURL,
        role: (data.role || "user").toLowerCase() 
      }
      setUser(canonicalUser)
      localStorage.setItem("shopease_user", JSON.stringify(canonicalUser))
      if (typeof navigate === "function") navigate("/")
      return true

    } catch (err) {
      console.error("Google Sign-In Error:", err)
      setError(err.message || "Failed to login with Google")
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setError("")
    setLoading(true)
    try {
      if (!auth) {
        throw new Error("Firebase Authentication is not configured. Please set your Firebase credentials.")
      }
      const provider = new GoogleAuthProvider()
      provider.addScope("profile")
      provider.addScope("email")
      const result = await signInWithPopup(auth, provider)
      const googleData = result.user
      
      const email = googleData.email
      if (!email) {
        setError("Unable to get account email from Google.")
        return false
      }

      const photoURL = googleData.photoURL || (Array.isArray(googleData.providerData) && googleData.providerData[0]?.photoURL) || null
      const displayName = googleData.displayName || "Google User"

      return await loginWithGoogleData({
        email,
        name: displayName,
        picture: photoURL,
        photoURL
      })

    } catch (err) {
      console.error("Google Sign-In Error:", err)
      if (err?.code === "auth/unauthorized-domain") {
        const domain = typeof window !== "undefined" ? window.location.hostname : "your deployment domain"
        setError(`Domain not authorized for OAuth: Please add '${domain}' to Firebase Console -> Authentication -> Settings -> Authorized domains.`)
      } else if (err?.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completing authentication.")
      } else if (err?.code === "auth/popup-blocked") {
        setError("Sign-in popup was blocked by the browser. Please allow popups for this domain.")
      } else {
        setError(err.message || "Failed to login with Google")
      }
      return false
    } finally {
      setLoading(false)
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
      const merged = { ...user, ...updatedUser }
      setUser(merged)
      localStorage.setItem("shopease_user", JSON.stringify(merged))
      await syncData()
    } catch (err) {
      console.error(err)
    }
  }

  const updateAdminProfile = async (updatedDetails) => {
    if (!user || user.role !== "admin") return
    try {
      const updatedUser = await api.updateProfile(user.username, updatedDetails)
      const merged = { ...user, ...updatedUser }
      setUser(merged)
      localStorage.setItem("shopease_user", JSON.stringify(merged))
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
    setLoading(true)
    try {
      const data = await api.register(name, username, email, password)
      const canonicalUser = { ...data, role: (data.role || "user").toLowerCase() }
      setUser(canonicalUser)
      localStorage.setItem("shopease_user", JSON.stringify(canonicalUser))
      if (typeof navigate === "function") navigate("/")
      return true
    } catch (err) {
      setError(err.message || "Registration failed")
      return false
    } finally {
      setLoading(false)
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
          (found.role || "user").toLowerCase() !== user.role ||
          found.avatar !== user.avatar
        ) {
          const updatedUser = {
            ...user,
            name: found.name,
            email: found.email,
            phone: found.phone,
            address: found.address,
            role: (found.role || "user").toLowerCase(),
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
        loading,
        error,
        setError,
        verifyAdminIdentity,
        loginAdmin,
        loginUser,
        login,
        loginWithGoogle,
        loginWithGoogleData,
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

export default AuthContext

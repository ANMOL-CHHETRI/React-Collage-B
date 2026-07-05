import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

const AdminLoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(localStorage.getItem("shopease_failed_admin_login") || "0", 10)
  })
  const [recoveryMode, setRecoveryMode] = useState(() => {
    return parseInt(localStorage.getItem("shopease_failed_admin_login") || "0", 10) >= 6
  })

  const { user, loginAdmin, verifyAdminIdentity, error, setError } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (recoveryMode) {
      if (verifyAdminIdentity(email, phone)) {
        setFailedAttempts(0)
        setRecoveryMode(false)
        localStorage.removeItem("shopease_failed_admin_login")
        setError("")
        success("Identity verified! You can now log in.")
      } else {
        setError("Invalid identity details. Please try again.")
      }
      return
    }

    if (failedAttempts >= 6) return

    const isSuccess = loginAdmin(username, password)
    if (!isSuccess) {
      setPassword("")
      const newCount = failedAttempts + 1
      setFailedAttempts(newCount)
      localStorage.setItem("shopease_failed_admin_login", newCount)
      if (newCount >= 6) {
        setRecoveryMode(true)
        setError("Account locked due to too many failed attempts. Please verify your identity.")
      }
    } else {
      setUsername("")
      setPassword("")
      setFailedAttempts(0)
      localStorage.removeItem("shopease_failed_admin_login")
    }
  }

  if (user?.role === "admin") {
    navigate("/admin/dashboard", { replace: true })
    return null
  }

  if (user?.role === "user") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <p className="text-gray-700 mb-2">You are signed in as a <strong>user</strong>.</p>
          <p className="text-sm text-gray-500 mb-6">Log out first to access the admin panel.</p>
          <Link to="/user/dashboard" className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition mr-3">
            My Dashboard
          </Link>
          <Link to="/" className="inline-block text-amber-600 font-medium hover:underline">
            Back to store
          </Link>
        </div>
      </div>
    )
  }

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

      <div className="px-8 py-10">
        {/* Icon + title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-200 rotate-3">
            <svg className="w-8 h-8 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {recoveryMode ? "Account Locked" : "Admin Portal"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {recoveryMode
              ? "Verify your identity to regain access"
              : "Sign in to manage ShopEase"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {recoveryMode ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
                <input type="email" required value={email}
                  onChange={e=>{ setEmail(e.target.value); setError("") }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm bg-gray-50 focus:bg-white"
                  autoComplete="off" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registered Phone</label>
                <input type="tel" required value={phone}
                  onChange={e=>{ setPhone(e.target.value); setError("") }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm bg-gray-50 focus:bg-white"
                  autoComplete="off" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" required value={username}
                  onChange={e=>{ setUsername(e.target.value); setError("") }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm bg-gray-50 focus:bg-white"
                  autoComplete="off" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" required value={password}
                  onChange={e=>{ setPassword(e.target.value); setError("") }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm bg-gray-50 focus:bg-white"
                  autoComplete="new-password" />
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition cursor-pointer shadow-md hover:shadow-lg">
            {recoveryMode ? "Verify Identity" : "Sign In"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-amber-600 hover:underline">
            ← Back to store
          </Link>
          <Link to="/user-login" className="text-sm text-gray-400 hover:text-amber-600 hover:underline">
            User login
          </Link>
        </div>
      </div>
    </div>
  </div>
)
}

export default AdminLoginPage

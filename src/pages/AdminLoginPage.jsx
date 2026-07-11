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

  const { user, loginAdmin, verifyAdminIdentity, error, setError, theme } = useAuth()
  const dark = theme === "dark"
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
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${dark ? "bg-slate-950" : "bg-white"}`}>
        <div className={`rounded-2xl shadow-xl p-8 w-full max-w-md text-center border ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          <p className={`mb-2 ${dark ? "text-slate-300" : "text-gray-700"}`}>You are signed in as a <strong>user</strong>.</p>
          <p className={`text-sm mb-6 ${dark ? "text-slate-400" : "text-gray-500"}`}>Log out first to access the admin panel.</p>
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
  <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${dark ? "bg-slate-950" : "bg-white"}`}>
    <div className={`rounded-2xl shadow-xl w-full max-w-md overflow-hidden border ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>

      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700" />

      <div className="px-8 py-10">
        {/* Icon + title */}
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg rotate-3 ${dark ? "shadow-red-500/20" : "shadow-red-200"}`}>
            <svg className="w-8 h-8 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
            {recoveryMode ? "Account Locked" : "Admin Portal"}
          </h1>
          <p className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-gray-500"}`}>
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
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Registered Email</label>
                <input type="email" required value={email}
                  onChange={e=>{ setEmail(e.target.value); setError("") }}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition text-sm ${dark ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"}`}
                  autoComplete="off" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Registered Phone</label>
                <input type="tel" required value={phone}
                  onChange={e=>{ setPhone(e.target.value); setError("") }}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition text-sm ${dark ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"}`}
                  autoComplete="off" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Username</label>
                <input type="text" required value={username}
                  onChange={e=>{ setUsername(e.target.value); setError("") }}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition text-sm ${dark ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"}`}
                  autoComplete="off" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Password</label>
                <input type="password" required value={password}
                  onChange={e=>{ setPassword(e.target.value); setError("") }}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition text-sm ${dark ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"}`}
                  autoComplete="new-password" />
              </div>
            </>
          )}

          {error && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 border text-sm ${dark ? "bg-red-950/30 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <button type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition cursor-pointer shadow-md hover:shadow-lg">
            {recoveryMode ? "Verify Identity" : "Sign In"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-red-600 hover:underline">
            ← Back to store
          </Link>
          <Link to="/user-login" className="text-sm text-gray-400 hover:text-red-600 hover:underline">
            User login
          </Link>
        </div>
      </div>
    </div>
  </div>
)
}

export default AdminLoginPage

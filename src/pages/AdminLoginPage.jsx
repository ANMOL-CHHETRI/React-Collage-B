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
          <Link to="/user/dashboard" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition mr-3">
            My Dashboard
          </Link>
          <Link to="/" className="inline-block text-purple-600 font-medium hover:underline">
            Back to store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${dark ? "bg-slate-950" : "bg-purple-50"}`}>
      <div className="w-full max-w-3xl">

        {/*hero */}
        <div className="relative bg-linear-to-br from-amber-950 to-amber-900 rounded-t-3xl pt-10 pb-24 px-8 text-center overflow-hidden">
          {/* soft dot texture */}
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle,_white_1px,_transparent_1px)] [background-size:16px_16px]" />
          <h2 className="relative text-white/90 text-sm font-bold tracking-[0.3em] uppercase mb-3">ShopeEase Nepal</h2>
          <h1 className="relative text-white text-2xl md:text-3xl font-bold">
            Hello <span className="inline-block">👋</span> Welcome!
          </h1>
        </div>

        {/* Card overlapping the hero */}
        <div className="relative -mt-16 px-4 md:px-30">
          <div className={`rounded-2xl shadow-2xl border overflow-hidden md:flex ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>

            {/* Form side */}
            <div className="flex-1 px-8 py-10">
              <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                {recoveryMode ? "Account Locked" : "Login"}
              </h1>
              <p className={`text-sm mt-1 mb-6 ${dark ? "text-slate-400" : "text-gray-500"}`}>
                {recoveryMode
                  ? "Verify your identity to regain access"
                  : "Please login to admin dashboard"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                {recoveryMode ? (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Registered Email</label>
                      <input type="email" required value={email}
                        onChange={e=>{ setEmail(e.target.value); setError("") }}
                        className={`w-full px-4 py-2.5 rounded-lg border outline-none transition text-sm ${dark ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"}`}
                        autoComplete="off" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Registered Phone</label>
                      <input type="tel" required value={phone}
                        onChange={e=>{ setPhone(e.target.value); setError("") }}
                        className={`w-full px-4 py-2.5 rounded-lg border outline-none transition text-sm ${dark ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"}`}
                        autoComplete="off" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Email/Username</label>
                      <input type="text" required value={username}
                        placeholder="tallman@gmail.com"
                        onChange={e=>{ setUsername(e.target.value); setError("") }}
                        className={`w-full px-4 py-2.5 rounded-lg border outline-none transition text-sm ${dark ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"}`}
                        autoComplete="off" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Password</label>
                      <input type="password" required value={password}
                        placeholder="••••••••"
                        onChange={e=>{ setPassword(e.target.value); setError("") }}
                        className={`w-full px-4 py-2.5 rounded-lg border outline-none transition text-sm ${dark ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"}`}
                        autoComplete="new-password" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className={`flex items-center gap-2 select-none ${dark ? "text-slate-400" : "text-gray-500"}`}>
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        Remember me
                      </label>
                      <span className="text-amber-900 font-medium hover:underline cursor-pointer">
                        Forgot password?
                      </span>
                    </div>
                  </>
                )}

                {error && (
                  <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 border text-sm ${dark ? "bg-red-950/30 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit"
                  className="w-full bg-gradient-to-r from-amber-950 to-amber-800 hover:from-amber-900 to-amber-900 text-white py-3 rounded-lg font-semibold transition cursor-pointer shadow-md hover:shadow-lg">
                  {recoveryMode ? "Verify Identity" : "LogIn"}
                </button>
              </form>

              <div className="flex items-center justify-between mt-6">
                <Link to="/" className={`text-sm hover:text-amber-950 hover:underline ${dark ? "text-slate-500" : "text-gray-600"}`}>
                  ← Back to store
                </Link>
                <Link to="/user-login" className={`text-sm hover:text-amber-950 hover:underline ${dark ? "text-slate-500" : "text-gray-600"}`}>
                  User login
                </Link>
              </div>
            </div>

            {/* Illustration side (decorative, hidden on small screens) */}
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"

const AdminLoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { user, loginAdmin, error, setError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    loginAdmin(username, password)
  }

  if (user?.role === "admin") {
    navigate("/admin/dashboard", { replace: true })
    return null
  }

  if (user?.role === "user") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex w-full max-w-6xl h-[650px]">

      {/* Left Side Image */}
      <div className="hidden md:flex md:w-2/5 items-center justify-center bg-amber-50">
        <img
          referrerPolicy="no-referrer"
          src="/login-banner.png"
          alt="Admin Login Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Admin Login
            </h1>

            <p className="text-gray-500 mt-2">
              Sign in to manage your store
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError("")
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                placeholder="••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            <div className="text-xs text-gray-400 text-center -mt-3">
              <p>
                Admin: <strong>admin</strong> / <strong>admin123</strong>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link
              to="/"
              className="text-amber-600 font-medium hover:underline"
            >
              Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
)
}

export default AdminLoginPage

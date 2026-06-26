import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const UserLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  if (user?.role === "user") {
    navigate("/", { replace: true });
    return null;
  }

  if (user?.role === "admin") {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex w-full max-w-6xl h-[650px]">

        {/* Left Side Image */}
        <div className="hidden md:flex md:w-2/5 items-center justify-center bg-amber-50">
          <img
            src="/login-banner.png"
            alt="Login Banner"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>

              <p className="text-gray-500 mt-2">Sign in to your account</p>
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
                    setUsername(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  placeholder="user or admin"
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
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  placeholder="••••••"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="text-xs text-gray-400 text-center space-y-1 -mt-3">
                <p>
                  User: <strong>user</strong> / <strong>user123</strong>
                </p>

                <p>
                  Admin: <strong>admin</strong> / <strong>admin123</strong>
                </p>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>

                <Link
                  to="/admin-login"
                  className="text-sm text-amber-600 hover:underline"
                >
                  Admin login page
                </Link>
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
  );
};

export default UserLoginPage;

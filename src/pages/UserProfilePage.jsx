import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const PROFILE_KEY = "shopease_profile"

const loadProfile = () => {
  try {
    const saved = localStorage.getItem(PROFILE_KEY)
    const parsed = saved ? JSON.parse(saved) : null
    return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) 
      ? parsed 
      : { name: "", email: "", phone: "", address: "" }
  } catch {
    return { name: "", email: "", phone: "", address: "" }
  }
}

const UserProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(() => {
    const local = loadProfile()
    return {
      name: local.name || user?.name || "",
      email: local.email || user?.email || "",
      phone: local.phone || user?.phone || "",
      address: local.address || user?.address || "",
    }
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Only allow digits and slice to 10
      const val = value.replace(/\D/g, '').slice(0, 10);
      setProfile({ ...profile, phone: val });
    } else {
      setProfile({ ...profile, [name]: value });
    }
    setSaved(false);
  }

  const handleSave = (e) => {
    e.preventDefault()
    
    // Validate phone number before saving
    if (profile.phone && !/^\d{10}$/.test(profile.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    if (updateProfile) {
      updateProfile(profile)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
  <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50 py-12">
    <div className="max-w-2xl mx-auto px-4">

      <Link
        to="/user/dashboard"
        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium mb-6 transition"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 to-orange-600 px-8 py-8 text-white">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-orange-100 mt-2">
            Manage your personal information and delivery details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-8 space-y-6">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder={user?.name || "Enter your name"}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder={user?.email || "Enter your email"}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              maxLength={10}
              value={profile.phone}
              onChange={handleChange}
              placeholder="98XXXXXXXX"
              className={`w-full px-4 py-3 rounded-xl border ${profile.phone && profile.phone.length > 0 && profile.phone.length < 10 ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-amber-500 focus:ring-amber-100'} focus:ring-4 outline-none transition`}
            />
            {profile.phone && profile.phone.length > 0 && profile.phone.length < 10 && (
              <p className="text-red-500 text-xs mt-1 font-medium">Phone number must be exactly 10 digits.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Delivery Address
            </label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows="4"
              placeholder="Street, City, Province"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">

            <button
              type="submit"
              className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Save Changes
            </button>

            {saved && (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Profile saved successfully!
              </div>
            )}

          </div>

        </form>
      </div>
    </div>
  </div>
)
}

export default UserProfilePage;

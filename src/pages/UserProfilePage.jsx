import { useState } from "react"
import { Link } from "react-router"
import { useAuth } from "../context/AuthContext"

const PROFILE_KEY = "shopease_profile"

const loadProfile = () => {
  try {
    const saved = localStorage.getItem(PROFILE_KEY)
    return saved ? JSON.parse(saved) : { name: "", email: "", phone: "", address: "" }
  } catch {
    return { name: "", email: "", phone: "", address: "" }
  }
}

const UserProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(loadProfile)
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4">
        <Link to="/user/dashboard" className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium inline-flex items-center gap-1 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">My Profile</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">Manage your personal information</p>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} placeholder={user?.name || "Enter your name"} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder={user?.email || "Enter your email"} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
              <input type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="e.g. 98XXXXXXXX" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Delivery Address</label>
              <textarea name="address" value={profile.address} onChange={handleChange} rows="3" placeholder="Street, city, province" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-white" />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button type="submit" className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition cursor-pointer">Save Changes</button>
              {saved && <span className="text-sm text-green-600 font-medium">Profile saved!</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage

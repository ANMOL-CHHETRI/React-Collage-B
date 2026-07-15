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
      avatar: local.avatar || user?.avatar || "",
    }
  })
  const [saved, setSaved] = useState(false)

  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const presetChars = [...Array(26)].map((_, i) => String.fromCharCode(65 + i)).concat([...Array(10)].map((_, i) => String(i)))

  const handlePresetSelect = (char) => {
    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#ffedd5"
    ctx.fillRect(0, 0, 200, 200)
    ctx.fillStyle = "#ea580c"
    ctx.font = "bold 100px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(char, 100, 110)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
    setProfile({...profile, avatar: dataUrl})
    setShowAvatarPicker(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        const newProfile = { ...profile, avatar: dataUrl };
        setProfile(newProfile);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
        if (updateProfile) {
          updateProfile(newProfile);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

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
  <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12">
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

      <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl border border-orange-100 dark:border-slate-800 overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 to-orange-600 px-8 py-8 text-white">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-orange-100 mt-2">
            Manage your personal information and delivery details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-8 space-y-6 bg-white dark:bg-slate-950">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center border-4 border-white shadow-md">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-orange-400">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <label className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs font-bold shadow-inner">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} onClick={(e) => (e.target.value = null)} />
              </label>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">Profile Photo</h3>
              <p className="text-sm text-gray-500 mb-3">Upload a new profile picture. Max size 5MB.</p>
              <div className="flex gap-2 justify-center sm:justify-start">
                <label className="px-4 py-2 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/60 cursor-pointer transition">
                  Choose Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} onClick={(e) => (e.target.value = null)} />
                </label>
                <button type="button" onClick={() => setShowAvatarPicker(!showAvatarPicker)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-semibold cursor-pointer transition">
                  Choose Preset
                </button>
              </div>
            </div>
          </div>

          {showAvatarPicker && (
             <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Select an Avatar</h4>
                <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
                  {presetChars.map(char => (
                    <button key={char} type="button" onClick={() => handlePresetSelect(char)} className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 font-bold hover:ring-2 hover:ring-orange-500 hover:bg-orange-200 dark:hover:bg-orange-800 transition cursor-pointer">
                      {char}
                    </button>
                  ))}
                </div>
             </div>
          )}

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
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/30 outline-none transition"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/30 outline-none transition"
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
              className={`w-full px-4 py-3 rounded-xl border ${profile.phone && profile.phone.length > 0 && profile.phone.length < 10 ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-gray-300 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-100 dark:focus:ring-amber-900/30'} bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-4 outline-none transition`}
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
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/30 outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">

            <button
              type="submit"
              className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Save Change
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

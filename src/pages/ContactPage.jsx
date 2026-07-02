import { useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../components/footer"
import { useAuth } from "../context/AuthContext"

const ContactPage = () => {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newMessage = {
      id: "MSG-" + Math.floor(1000 + Math.random() * 9000),
      ...form,
      date: new Date().toISOString()
    }

    try {
      const rawMessages = JSON.parse(localStorage.getItem("shopease_messages"));
      const existing = Array.isArray(rawMessages) ? rawMessages : [];
      localStorage.setItem("shopease_messages", JSON.stringify([newMessage, ...existing]))
    } catch (err) {
      console.error("Error saving message:", err)
    }

    setSent(true)
    setForm({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 pt-16 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header section with Breadcrumb */}
        <div className="flex flex-col gap-2 mb-10">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-600 dark:text-slate-300">Contact</span>
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">Get in Touch</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
            Have questions about our local products, delivery times, or partner cooperative sourcing? Drop us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-8">
            {user?.role === 'admin' ? (
              <div className="bg-white dark:bg-slate-950 rounded-2xl border border-amber-200 dark:border-amber-900 shadow-sm p-8 flex flex-col items-center justify-center text-center h-full space-y-4">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Account</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                  You are logged in as an Administrator. This contact form is disabled for staff accounts.
                </p>
                <Link to="/admin/dashboard" className="mt-2 px-6 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-amber-700 transition">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none transition" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Subject</label>
                <input 
                  type="text" 
                  required 
                  value={form.subject} 
                  onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Message</label>
                <textarea 
                  rows="5" 
                  required 
                  value={form.message} 
                  onChange={(e) => setForm({ ...form, message: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none transition" 
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-amber-700 transition cursor-pointer shadow-md shadow-amber-600/10"
                >
                  Send Message
                </button>
                {sent && (
                  <p className="text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1.5 animate-in fade-in duration-200">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Message sent successfully! We will be getting back to you shortly.
                  </p>
                )}
              </div>
            </form>
            )}
          </div>

          {/* Cards Side */}
          <div className="lg:col-span-4 space-y-6">
            {/* Map Link / Office Card */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4 hover:shadow-md transition duration-200">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wide">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Head Office
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                ShopEase Nepal Pvt. Ltd.<br />
                New Baneshwor, Kathmandu<br />
                Bagmati, Nepal
              </p>
              <a 
                href="https://maps.google.com/?q=New+Baneshwor,+Kathmandu,+Nepal" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline transition"
              >
                View on Google Maps
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Direct Contacts Card */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4 hover:shadow-md transition duration-200">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wide">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Details
              </h3>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[9px] font-bold uppercase mb-0.5">Email Support</span>
                  <a href="mailto:support@shopease.com.np" className="text-amber-600 dark:text-amber-400 hover:underline font-bold text-sm block">
                    support@shopease.com.np
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[9px] font-bold uppercase mb-0.5">Phone Hotline</span>
                  <a href="tel:+97714000000" className="text-amber-600 dark:text-amber-400 hover:underline font-bold text-sm block">
                    +977-1-4000000
                  </a>
                </div>
              </div>
            </div>

            {/* Instant Support Channels */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4 hover:shadow-md transition duration-200">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wide">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Instant Messaging
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal">
                Click one of our chat channels below to connect with a support agent instantly.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a 
                  href="https://wa.me/9779841234567" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-500 font-bold rounded-xl text-[10px] uppercase tracking-wider transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Chat on WhatsApp
                </a>
                <a 
                  href="viber://chat?number=+9779841234567" 
                  className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 dark:text-indigo-400 font-bold rounded-xl text-[10px] uppercase tracking-wider transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Message on Viber
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactPage

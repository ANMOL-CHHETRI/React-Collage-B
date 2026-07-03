import { Link, NavLink } from "react-router";

const Footer = () => (
  <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <img referrerPolicy="no-referrer" src="/logo.png" alt="ShopEase Nepal" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-xl font-bold tracking-tight text-white">ShopEase <span className="text-amber-500">Nepal</span></span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">Your premium destination for authentic Nepalese handicrafts and local products.</p>
        </div>
        <div className="md:col-span-8 text-xs text-slate-600">
          <div className="border-t border-slate-900 mt-12 pt-8 flex items-center justify-between">
            <p>© 2026 ShopEase Nepal. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/policy#privacy" className="hover:underline">Privacy Policy</Link>
              <Link to="/policy#terms" className="hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

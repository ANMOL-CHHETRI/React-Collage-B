import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/* ── Eye icon ── */
const EyeIcon = ({ show }) =>
  show ? (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

/* ── Password field ── */
const PwField = ({ label, value, onChange, show, onToggle, dark }) => (
  <div>
    <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition text-sm pr-11
          ${dark
            ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          }`}
      />
      <button type="button" onClick={onToggle}
        className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${dark ? "text-slate-400 hover:text-amber-400" : "text-gray-400 hover:text-amber-600"}`}>
        <EyeIcon show={show} />
      </button>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════ */
const UserLoginPage = () => {
  /* ── Auth ── */
  const { user, login, signup, verifyUserIdentity, userSetNewPassword,
          adminCredentials, error, setError, theme } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dark = theme === "dark";

  /* ── Login state ── */
  const [username, setUsername]           = useState("");
  const [password, setPassword]           = useState("");
  const [showLoginPw, setShowLoginPw]     = useState(false);
  const [loginSuccess, setLoginSuccess]   = useState(false);
  const [loginUserName, setLoginUserName] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(
    () => parseInt(localStorage.getItem("shopease_failed_user_login") || "0", 10)
  );

  /* ── 4-corner Easter egg ── */
  const [cornersHit, setCornersHit] = useState(new Set());
  const [cornerFlash, setCornerFlash] = useState(null); // which corner is flashing
  const cornerResetRef = React.useRef(null);

  const handleCornerClick = (corner) => {
    // Flash effect
    setCornerFlash(corner);
    setTimeout(() => setCornerFlash(null), 400);

    // Reset inactivity timer
    if (cornerResetRef.current) clearTimeout(cornerResetRef.current);
    cornerResetRef.current = setTimeout(() => setCornersHit(new Set()), 8000);

    setCornersHit(prev => {
      const next = new Set(prev);
      next.add(corner);
      // All 4 corners hit → go to admin login
      if (next.size === 4) {
        setTimeout(() => navigate("/admin-login"), 300);
        return new Set();
      }
      return next;
    });
  };

  /* ── Recovery state ── */
  const [recoveryMode, setRecoveryMode]         = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [rUser, setRUser]   = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [rPw, setRPw]       = useState("");
  const [rPw2, setRPw2]     = useState("");
  const [showRPw, setShowRPw] = useState(false);

  /* ── Sign-up modal state ── */
  const [signupOpen, setSignupOpen]       = useState(false);
  const [signupClosing, setSignupClosing] = useState(false);
  const [suName, setSuName]         = useState("");
  const [suUsername, setSuUsername] = useState("");
  const [suEmail, setSuEmail]       = useState("");
  const [suPhone, setSuPhone]       = useState("");
  const [suPw, setSuPw]             = useState("");
  const [suPw2, setSuPw2]           = useState("");
  const [showSuPw, setShowSuPw]     = useState(false);
  const [suError, setSuError]       = useState("");

  /* ── Auto-open signup from ?signup=1 URL param ── */
  useEffect(() => {
    if (searchParams.get("signup") === "1") {
      setSuError(""); setSignupOpen(true); setSignupClosing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Modal open/close ── */
  const openSignup  = () => { setSuError(""); setError(""); setSignupOpen(true); setSignupClosing(false); };
  const closeSignup = () => {
    setSignupClosing(true);
    setTimeout(() => { setSignupOpen(false); setSignupClosing(false); }, 360);
  };

  /* ── Signup submit ── */
  const handleSignup = (e) => {
    e.preventDefault();
    if (suPw !== suPw2)  { setSuError("Passwords do not match"); return; }
    if (suPw.length < 4) { setSuError("Password must be at least 4 characters"); return; }
    signup(suName, suUsername, suEmail, suPw);
    setSuName(""); setSuUsername(""); setSuEmail(""); setSuPhone(""); setSuPw(""); setSuPw2("");
    success("Account created! You can now sign in.");
    closeSignup();
  };

  /* ── Login submit ── */
  const handleLogin = (e) => {
    e.preventDefault();

    /* Recovery flow */
    if (recoveryMode) {
      if (!identityVerified) {
        if (verifyUserIdentity(rUser, rEmail, rPhone)) {
          setIdentityVerified(true); setError("");
          success("Identity verified! Set your new password.");
        } else { setError("Invalid details. Please try again."); }
      } else {
        if (rPw !== rPw2)   { setError("Passwords do not match"); return; }
        if (rPw.length < 4) { setError("Password must be at least 4 characters"); return; }
        userSetNewPassword(rUser, rPw);
        setFailedAttempts(0); setRecoveryMode(false); setIdentityVerified(false);
        setRUser(""); setREmail(""); setRPhone(""); setRPw(""); setRPw2("");
        localStorage.removeItem("shopease_failed_user_login");
        setError(""); success("Password reset! You can now sign in.");
      }
      return;
    }

    /* 🚫 Block admin from logging in via user login page */
    if (username.trim() === (adminCredentials?.username || "admin")) {
      setError("Admins must use the Admin login page.");
      return;
    }

    if (failedAttempts >= 5) {
      setError("Account locked. Use Forgot Password to reset."); return;
    }

    const cur = username;
    const ok = login(username, password);
    if (!ok) {
      setPassword("");
      const n = failedAttempts + 1;
      setFailedAttempts(n);
      localStorage.setItem("shopease_failed_user_login", n);
      if (n >= 5) setError("Account locked. Use Forgot Password to reset.");
    } else {
      setUsername(""); setPassword(""); setFailedAttempts(0);
      localStorage.removeItem("shopease_failed_user_login");
      setLoginUserName(cur);
      setLoginSuccess(true);
      setTimeout(() => navigate("/", { replace: true }), 2800);
    }
  };

  /* ── Redirect guards ── */
  if ((user?.role === "user" || user?.role === "sub-admin") && !loginSuccess) {
    navigate("/", { replace: true }); return null;
  }
  if (user?.role === "admin") { navigate("/admin/dashboard", { replace: true }); return null; }

  /* ─────────── Shared input class ─────────── */
  const inputCls = `w-full px-4 py-2.5 rounded-xl border outline-none transition text-sm
    ${dark
      ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
      : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"}`;

  /* ══════════════════════════════════ RENDER ══════════════════════════════════ */
  return (
    <>
      {/* ─── Keyframes ─── */}
      <style>{`
        @keyframes storeOverlayFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes storeZoomIn{0%{transform:scale(.05) translateY(60px);opacity:0}40%{transform:scale(1.08) translateY(-6px);opacity:1}60%{transform:scale(.97) translateY(0)}80%{transform:scale(1.02)}100%{transform:scale(1)}}
        @keyframes doorSlideLeft{0%{transform:scaleX(1);transform-origin:left}100%{transform:scaleX(0);transform-origin:left}}
        @keyframes doorSlideRight{0%{transform:scaleX(1);transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}
        @keyframes welcomeRise{0%{opacity:0;transform:translateY(30px) scale(.9)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes sparkle{0%{opacity:0;transform:translateY(0) scale(0)}20%{opacity:1;transform:translateY(-30px) scale(1)}100%{opacity:0;transform:translateY(-120px) scale(.3)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes bounceIn{0%{transform:scale(0) rotate(-15deg)}60%{transform:scale(1.2) rotate(5deg)}80%{transform:scale(.9) rotate(-2deg)}100%{transform:scale(1) rotate(0deg)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 30px rgba(245,158,11,.4)}50%{box-shadow:0 0 80px rgba(245,158,11,.9),0 0 120px rgba(251,191,36,.4)}}
        @keyframes groundGlow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
        @keyframes slideUpIn{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes slideDownOut{from{transform:translateY(0);opacity:1}to{transform:translateY(100%);opacity:0}}
        @keyframes bdIn{from{opacity:0}to{opacity:1}}
        @keyframes bdOut{from{opacity:1}to{opacity:0}}
        .store-building{animation:storeZoomIn .8s cubic-bezier(.22,1,.36,1) .2s both}
        .door-left{animation:doorSlideLeft .6s ease-in-out 1.4s both}
        .door-right{animation:doorSlideRight .6s ease-in-out 1.4s both}
        .welcome-text{animation:welcomeRise .7s ease-out 1.8s both}
        .store-glow{animation:glowPulse 1.2s ease-in-out .8s infinite}
        .ground-glow{animation:groundGlow .8s ease-out .6s both}
        .su-bd{animation:bdIn .3s ease both}
        .su-bd.closing{animation:bdOut .36s ease both}
        .su-sheet{animation:slideUpIn .38s cubic-bezier(.22,1,.36,1) both}
        .su-sheet.closing{animation:slideDownOut .36s ease both}
        @keyframes cornerPop{0%{transform:scale(1);opacity:.7}50%{transform:scale(1.8);opacity:1}100%{transform:scale(1);opacity:0}}
        .corner-flash{animation:cornerPop .4s ease-out both}
      `}</style>

      {/* ─── Login success overlay ─── */}
      {loginSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background:"linear-gradient(135deg,#1e1204 0%,#3d1f00 40%,#7c3a00 70%,#f59e0b 100%)", animation:"storeOverlayFadeIn .3s ease-out forwards" }}>
          {[...Array(18)].map((_, i) => (
            <div key={i} className="absolute rounded-full pointer-events-none" style={{
              left:`${5+(i*5.5)%92}%`, top:`${20+(i*17)%60}%`,
              width:`${4+(i%5)*3}px`, height:`${4+(i%5)*3}px`,
              background:i%3===0?"#f59e0b":i%3===1?"#fbbf24":"#fff",
              animation:`sparkle ${1.2+(i%4)*.3}s ease-out ${.6+(i%6)*.25}s both`
            }} />
          ))}
          <div className="relative flex flex-col items-center select-none store-building">
            <div className="mb-0 px-8 py-3 rounded-t-2xl text-center z-10"
              style={{ background:"linear-gradient(135deg,#92400e,#f59e0b,#fbbf24,#f59e0b,#92400e)", backgroundSize:"300% auto", animation:"shimmer 2s linear 1s infinite", minWidth:"260px" }}>
              <div style={{ animation:"bounceIn .6s cubic-bezier(.34,1.56,.64,1) .9s both" }}>
                <div className="text-2xl font-extrabold tracking-tight text-amber-950 drop-shadow-sm">🏪 ShopEase Nepal</div>
                <div className="text-xs font-semibold text-amber-800 mt-0.5 tracking-wide uppercase">Premium Ecommerce</div>
              </div>
            </div>
            <div className="relative store-glow" style={{ width:"300px", background:"linear-gradient(180deg,#78350f 0%,#451a03 100%)", borderRadius:"0 0 8px 8px", border:"3px solid #92400e", borderTop:"none", overflow:"hidden" }}>
              <div style={{ height:"22px", background:"repeating-linear-gradient(90deg,#f59e0b 0px,#f59e0b 18px,#92400e 18px,#92400e 36px)", borderBottom:"2px solid #78350f" }} />
              <div className="flex justify-between px-4 pt-3 pb-2">
                {[0,1].map(w=>(
                  <div key={w} style={{ width:"64px", height:"44px", background:"linear-gradient(135deg,#fef9c3,#fde68a,#fef3c7)", border:"2px solid #78350f", borderRadius:"4px", position:"relative", overflow:"hidden", boxShadow:"inset 0 0 12px rgba(251,191,36,.5)" }}>
                    <div style={{ position:"absolute", top:"50%", left:0, right:0, height:"2px", background:"#78350f", transform:"translateY(-50%)" }} />
                    <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:"2px", background:"#78350f", transform:"translateX(-50%)" }} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(120deg,transparent 30%,rgba(255,255,255,.5) 50%,transparent 70%)", backgroundSize:"200% auto", animation:"shimmer 1.8s linear 1.2s infinite" }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center pb-4">
                <div style={{ width:"100px", height:"70px", position:"relative", background:"#1e1204", border:"3px solid #92400e", borderRadius:"6px 6px 0 0", overflow:"hidden" }}>
                  <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,rgba(251,191,36,.6) 0%,transparent 80%)", animation:"glowPulse 1s ease-in-out 1.4s infinite" }} />
                  <div className="door-left" style={{ position:"absolute", left:0, top:0, bottom:0, width:"50%", background:"linear-gradient(90deg,#92400e,#b45309)", borderRight:"1px solid #78350f", transformOrigin:"left" }}>
                    <div style={{ position:"absolute", right:"8px", top:"50%", transform:"translateY(-50%)", width:"5px", height:"5px", background:"#f59e0b", borderRadius:"50%" }} />
                  </div>
                  <div className="door-right" style={{ position:"absolute", right:0, top:0, bottom:0, width:"50%", background:"linear-gradient(270deg,#92400e,#b45309)", borderLeft:"1px solid #78350f", transformOrigin:"right" }}>
                    <div style={{ position:"absolute", left:"8px", top:"50%", transform:"translateY(-50%)", width:"5px", height:"5px", background:"#f59e0b", borderRadius:"50%" }} />
                  </div>
                  <div style={{ position:"absolute", top:"-22px", left:"50%", transform:"translateX(-50%)", background:"#16a34a", color:"#fff", fontSize:"9px", fontWeight:"800", padding:"2px 8px", borderRadius:"3px", letterSpacing:"2px", animation:"bounceIn .5s ease 2s both", whiteSpace:"nowrap" }}>OPEN</div>
                </div>
              </div>
            </div>
            <div className="ground-glow" style={{ width:"320px", height:"6px", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(245,158,11,.7) 0%,transparent 70%)" }} />
            <div className="welcome-text mt-8 text-center">
              <div style={{ fontSize:"28px", fontWeight:"800", color:"#fbbf24", textShadow:"0 0 20px rgba(251,191,36,.6)", letterSpacing:".02em" }}>
                Welcome back{loginUserName ? `, ${loginUserName}` : ""}! 👋
              </div>
              <div style={{ color:"#d97706", fontSize:"14px", marginTop:"6px", fontWeight:"500" }}>Your store is ready for you…</div>
              <div className="flex justify-center gap-2 mt-4">
                {[0,1,2].map(d=>(
                  <div key={d} style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#f59e0b", animation:`sparkle .8s ease-in-out ${d*.2}s infinite alternate` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Sign-up Modal Drawer ─── */}
      {signupOpen && (
        <div
          className={`su-bd fixed inset-0 z-[500] flex items-end justify-center${signupClosing ? " closing" : ""}`}
          style={{ background:"rgba(10,5,0,0.7)", backdropFilter:"blur(6px)" }}
          onClick={e => { if (e.target === e.currentTarget) closeSignup(); }}
        >
          <div className={`su-sheet w-full max-w-lg rounded-t-3xl shadow-2xl flex flex-col${signupClosing ? " closing" : ""}
            ${dark ? "bg-slate-900 text-slate-100" : "bg-white text-gray-900"}`}
            style={{ maxHeight:"92vh" }}>

            {/* Modal header */}
            <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 rounded-t-3xl flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create New Account</h2>
                  <p className="text-amber-100 text-xs mt-0.5">Join ShopEase Nepal — it's free forever</p>
                </div>
              </div>
              <button onClick={closeSignup} aria-label="Close"
                className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center transition cursor-pointer">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="mx-auto mt-4 w-10 h-1 bg-white/30 rounded-full" />
            </div>

            {/* Modal form */}
            <div className="overflow-y-auto px-6 py-5 flex-1">
              <form onSubmit={handleSignup} autoComplete="off" className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" required value={suName}
                    onChange={e=>{setSuName(e.target.value);setSuError("");}}
                    placeholder="e.g. Ram Sharma"
                    className={inputCls} autoComplete="off" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-semibold mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>
                      Username <span className="text-red-400">*</span>
                    </label>
                    <input type="text" required value={suUsername}
                      onChange={e=>{setSuUsername(e.target.value);setSuError("");}}
                      placeholder="unique_handle"
                      className={inputCls} autoComplete="off" />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Phone</label>
                    <input type="tel" value={suPhone}
                      onChange={e=>setSuPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className={inputCls} autoComplete="off" />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input type="email" required value={suEmail}
                    onChange={e=>{setSuEmail(e.target.value);setSuError("");}}
                    placeholder="you@example.com"
                    className={inputCls} autoComplete="off" />
                </div>

                <PwField label="Password *" value={suPw}
                  onChange={e=>{setSuPw(e.target.value);setSuError("");}}
                  show={showSuPw} onToggle={()=>setShowSuPw(p=>!p)} dark={dark} />
                <PwField label="Confirm Password *" value={suPw2}
                  onChange={e=>{setSuPw2(e.target.value);setSuError("");}}
                  show={showSuPw} onToggle={()=>setShowSuPw(p=>!p)} dark={dark} />

                {suError && (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5">
                    <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{suError}</p>
                  </div>
                )}

                <button type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer mt-1 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create My Account
                </button>
                <p className={`text-center text-xs pb-1 ${dark ? "text-slate-500" : "text-gray-400"}`}>
                  Already have an account?{" "}
                  <button type="button" onClick={closeSignup} className="text-amber-500 font-semibold hover:underline cursor-pointer">
                    Sign in instead
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Login Page ─── */}
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300
        ${dark ? "bg-slate-950" : "bg-gradient-to-br from-amber-50 to-orange-100"}`}>
        <div className={`rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl min-h-[580px] md:h-[620px] max-h-[95vh]
          ${dark ? "bg-slate-900 shadow-slate-900/80" : "bg-white"}`}>

          {/* ── Left banner with 4-corner Easter egg ── */}
          <div className={`hidden md:block md:w-2/5 relative overflow-hidden ${dark ? "bg-slate-800" : "bg-amber-50"}`}>
            <img
              referrerPolicy="no-referrer"
              src="/login-banner.png"
              alt="ShopEase"
              className="w-full h-full object-cover object-center"
            />

            {/* Dark overlay for dark mode */}
            {dark && <div className="absolute inset-0 bg-slate-900/40 pointer-events-none" />}

            {/*
              ── 4-CORNER EASTER EGG ──
              Click all 4 corners of the banner (any order) to access admin login.
              Each corner is a 56×56px invisible zone. A tiny amber dot flashes on click.
            */}
            {[
              { id: "tl", top:    0, left:  0, bottom: "auto", right: "auto", origin: "top left" },
              { id: "tr", top:    0, right: 0, bottom: "auto", left:  "auto", origin: "top right" },
              { id: "bl", bottom: 0, left:  0, top:  "auto", right:  "auto", origin: "bottom left" },
              { id: "br", bottom: 0, right: 0, top:  "auto", left:   "auto", origin: "bottom right" },
            ].map(({ id, ...pos }) => (
              <div
                key={id}
                onClick={() => handleCornerClick(id)}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 64,
                  height: 64,
                  zIndex: 20,
                  cursor: "pointer",
                  ...pos,
                }}
              >
                {/* Amber dot that flashes on click */}
                <div
                  className={cornerFlash === id ? "corner-flash" : ""}
                  style={{
                    position: "absolute",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#f59e0b",
                    opacity: cornersHit.has(id) && cornerFlash !== id ? 0.55 : 0,
                    /* position dot toward inner corner */
                    top:    id.startsWith("t") ? 12 : "auto",
                    bottom: id.startsWith("b") ? 12 : "auto",
                    left:   id.endsWith("l")   ? 12 : "auto",
                    right:  id.endsWith("r")   ? 12 : "auto",
                    transition: "opacity .3s",
                    boxShadow: "0 0 6px 2px rgba(245,158,11,.6)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            ))}

            {/* Decorative amber gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none" />
          </div>

          {/* ── Right form ── */}
          <div className="w-full md:w-3/5 flex items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-md">

              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/25 rotate-3">
                  <svg className="w-8 h-8 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {recoveryMode
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    }
                  </svg>
                </div>
                <h1 className={`text-3xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                  {recoveryMode ? "Account Locked" : "Welcome Back"}
                </h1>
                <p className={`mt-2 text-sm ${dark ? "text-slate-400" : "text-gray-500"}`}>
                  {recoveryMode
                    ? (identityVerified ? "Set your new password" : "Verify your identity to unlock")
                    : "Sign in to your ShopEase account"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">

                {/* Recovery fields */}
                {recoveryMode ? (
                  !identityVerified ? (
                    <>
                      {[
                        { label:"Username",         val:rUser,  set:setRUser,  type:"text" },
                        { label:"Registered Email", val:rEmail, set:setREmail, type:"email" },
                        { label:"Registered Phone", val:rPhone, set:setRPhone, type:"tel" },
                      ].map(f => (
                        <div key={f.label}>
                          <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>{f.label}</label>
                          <input type={f.type} required value={f.val}
                            onChange={e=>{f.set(e.target.value);setError("");}}
                            className={inputCls} autoComplete="off" />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <PwField label="New Password" value={rPw}
                        onChange={e=>{setRPw(e.target.value);setError("");}}
                        show={showRPw} onToggle={()=>setShowRPw(p=>!p)} dark={dark} />
                      <PwField label="Confirm New Password" value={rPw2}
                        onChange={e=>{setRPw2(e.target.value);setError("");}}
                        show={showRPw} onToggle={()=>setShowRPw(p=>!p)} dark={dark} />
                    </>
                  )
                ) : (
                  /* Normal login */
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Username</label>
                      <input type="text" required value={username}
                        onChange={e=>{setUsername(e.target.value);setError("");}}
                        className={inputCls} autoComplete="off" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}>Password</label>
                      <div className="relative">
                        <input type={showLoginPw ? "text" : "password"} required value={password}
                          onChange={e=>{setPassword(e.target.value);setError("");}}
                          className={`${inputCls} pr-11`}
                          autoComplete="current-password" />
                        <button type="button" onClick={()=>setShowLoginPw(p=>!p)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${dark ? "text-slate-400 hover:text-amber-400" : "text-gray-400 hover:text-amber-600"}`}>
                          <EyeIcon show={showLoginPw} />
                        </button>
                      </div>
                      <div className="flex justify-end mt-1">
                        <button type="button" onClick={()=>{setRecoveryMode(true);setError("");}}
                          className="text-xs text-amber-500 hover:underline cursor-pointer">
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Error */}
                {error && (
                  <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 border text-sm
                    ${dark ? "bg-red-950/30 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Sign up link */}
                <div className="flex items-center">
                  <button type="button" onClick={openSignup}
                    className="flex items-center gap-1.5 text-sm text-amber-500 hover:text-amber-600 font-medium hover:underline cursor-pointer group">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center transition ${dark ? "bg-amber-900/40 group-hover:bg-amber-800/50" : "bg-amber-100 group-hover:bg-amber-200"}`}>
                      <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                    New here? Sign up
                  </button>
                </div>

                {/* Submit */}
                <button type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition cursor-pointer shadow-md hover:shadow-lg shadow-amber-500/20">
                  {recoveryMode ? (identityVerified ? "Reset Password" : "Verify Identity") : "Sign In"}
                </button>
              </form>

              <p className="text-center text-sm mt-6">
                <Link to="/" className="text-amber-500 font-medium hover:underline">← Back to store</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLoginPage;

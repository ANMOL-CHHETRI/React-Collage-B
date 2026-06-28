import os

def fix_skeletons_and_theme():
    # 1. Update ImageWithSkeleton definition in files
    skeleton_target = """const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className="relative w-full h-full">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
      )}
      <img
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        src={error ? (fallbackSrc || "https://i.pinimg.com/736x/01/be/df/01bedf72df9b4b035178652d88820f4f.jpg") : src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
      />
    </div>
  )
}"""

    skeleton_replacement = """const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(!src)

  return (
    <div className="relative w-full h-full">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
      )}
      <img
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        src={error ? (fallbackSrc || "https://i.pinimg.com/736x/01/be/df/01bedf72df9b4b035178652d88820f4f.jpg") : (src || "https://i.pinimg.com/736x/01/be/df/01bedf72df9b4b035178652d88820f4f.jpg")}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${(loaded || error) ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
      />
    </div>
  )
}"""

    files_with_skeletons = [
        'src/pages/HomePage.jsx',
        'src/pages/CategoryPage.jsx',
        'src/pages/ProductDetailPage.jsx',
        'src/pages/UserDashboard.jsx'
    ]

    for p in files_with_skeletons:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                content = f.read()
            content = content.replace(skeleton_target, skeleton_replacement)
            content = content.replace(skeleton_target.replace("\r\n", "\n"), skeleton_replacement)
            with open(p, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Fixed ImageWithSkeleton in {p}")

    # 2. Refactor Navbar theme state
    navbar_path = "src/components/Navbar.jsx"
    if os.path.exists(navbar_path):
        with open(navbar_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Pull theme and toggleTheme from useAuth
        content = content.replace(
            "const { user, logout, registeredUsers } = useAuth();",
            "const { user, logout, registeredUsers, theme, toggleTheme } = useAuth();"
        )
        # Remove local theme logic
        local_theme_logic_target = """  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };"""
        content = content.replace(local_theme_logic_target, "")
        content = content.replace(local_theme_logic_target.replace("\r\n", "\n"), "")
        with open(navbar_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Refactored theme in Navbar.jsx")

    # 3. Refactor UserDashboard theme state
    ud_path = "src/pages/UserDashboard.jsx"
    if os.path.exists(ud_path):
        with open(ud_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        content = content.replace(
            "const { user, updateProfile, changePassword, registeredUsers } = useAuth()",
            "const { user, updateProfile, changePassword, registeredUsers, theme, toggleTheme } = useAuth()"
        )
        
        # Remove local theme hook
        local_theme_hook = """  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")"""
        content = content.replace(local_theme_hook, "")
        content = content.replace(local_theme_hook.replace("\r\n", "\n"), "")
        
        # Remove local theme useEffect and toggleTheme
        local_theme_effects = """  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }"""
        content = content.replace(local_theme_effects, "")
        content = content.replace(local_theme_effects.replace("\r\n", "\n"), "")
        with open(ud_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Refactored theme in UserDashboard.jsx")

    # 4. Refactor AdminDashboard theme state
    ad_path = "src/pages/AdminDashboard.jsx"
    if os.path.exists(ad_path):
        with open(ad_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        content = content.replace(
            "const { user, logoutAdmin, changePassword, registeredUsers, updateUserViolations, toggleUserBan } = useAuth()",
            "const { user, logoutAdmin, changePassword, registeredUsers, updateUserViolations, toggleUserBan, theme, toggleTheme } = useAuth()"
        )
        
        local_theme_hook = """  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")"""
        content = content.replace(local_theme_hook, "")
        content = content.replace(local_theme_hook.replace("\r\n", "\n"), "")
        
        local_theme_effects = """  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }"""
        content = content.replace(local_theme_effects, "")
        content = content.replace(local_theme_effects.replace("\r\n", "\n"), "")
        with open(ad_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Refactored theme in AdminDashboard.jsx")

fix_skeletons_and_theme()

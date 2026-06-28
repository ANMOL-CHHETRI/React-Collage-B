import os

def fix_image_cache():
    skeleton_target = """const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(!src)

  return (
    <div className="relative w-full h-full">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
      )}
      <img referrerPolicy="no-referrer"
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

    skeleton_replacement = """const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(!src)
  const imgRef = useRef(null)

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true)
    }
  }, [src])

  return (
    <div className="relative w-full h-full">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
      )}
      <img
        ref={imgRef}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        src={error ? (fallbackSrc || "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg") : (src || "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg")}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${(loaded || error) ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
      />
    </div>
  )
}"""

    files = [
        'src/pages/HomePage.jsx',
        'src/pages/CategoryPage.jsx',
        'src/pages/ProductDetailPage.jsx',
        'src/pages/UserDashboard.jsx'
    ]

    for p in files:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Fix imports
            content = content.replace(
                'import { useEffect, useState } from "react";',
                'import { useEffect, useState, useRef } from "react";'
            )
            content = content.replace(
                'import { useEffect, useState } from "react"',
                'import { useEffect, useState, useRef } from "react"'
            )
            content = content.replace(
                'import { useState } from "react"',
                'import { useState, useEffect, useRef } from "react"'
            )

            # Replace component definition
            content = content.replace(skeleton_target, skeleton_replacement)
            content = content.replace(skeleton_target.replace("\r\n", "\n"), skeleton_replacement)

            with open(p, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Applied useRef fix to {p}")

fix_image_cache()

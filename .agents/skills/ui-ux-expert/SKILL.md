---
name: ui-ux-expert
description: Guidelines and patterns for maintaining premium, modern UI/UX design, dark/light theme styling, responsive layouts, and standard component patterns in the ShopEase ecommerce app.
---

# ShopEase UI/UX Expert Customization Skill

This skill outlines the strict visual, interaction, and styling invariants for the ShopEase ecommerce app to guarantee a premium, modern, and highly aesthetic look and feel. Use these guidelines when creating or updating any user interface components, pages, or layouts.

---

## 1. Visual Language & Color Palette
ShopEase uses a warm, premium color scheme:
- **Primary Color:** Amber (`amber-500` / `amber-600` / `amber-50`).
- **Neutrals:** Slate and Gray (`slate-50` to `slate-950`).
- **Backgrounds:** Pure white or slate-50 (`bg-slate-50`) in light mode; Slate-900 or Slate-950 (`dark:bg-slate-900` / `dark:bg-slate-950`) in dark mode.
- **Glassmorphism:** Use translucent backgrounds with backdrop blur for floating navigation headers or cards:
  ```html
  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50"
  ```
- **Text:** High-contrast `text-slate-800` (light) / `dark:text-slate-200` (dark). Muted text uses `text-slate-500` / `dark:text-slate-400`.

## 2. Invariant Component Rules
### Card Design
Every card (products, categories, testimonials, etc.) must adhere to these Tailwind rules:
- **Corners:** Must be `rounded-2xl` (1rem / 16px border-radius).
- **Shadows & Hover Effects:** Must animate on hover for a tactile, responsive feel:
  ```html
  className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  ```

### Crown Badge
- Product with `id = 1` is designated as the bestseller and must show a crown badge (`👑 MOST SOLD`) in product cards and detail pages.

### Iconography
- Use **inline SVGs** matching Heroicons (stroke style) rather than external library packages or font libraries.
- Keep stroke widths consistent (normally `strokeWidth={2}` or `1.5`) and style via Tailwind classes (e.g., `w-5 h-5 text-slate-500`).

## 3. Responsive Layouts
ShopEase is mobile-first:
- Use standard breakpoints: `sm:`, `md:`, `lg:`, `xl:`.
- Main content areas should be wrapped in a container that constraints maximum width and adds horizontal padding:
  ```html
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  ```
- Grids should dynamically adjust across screen widths:
  ```html
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
  ```

## 4. Theme & State Management
- **Global Theme (Dark/Light):** Managed strictly in [AuthContext.jsx](file:///d:/React-Collage-B/src/context/AuthContext.jsx).
- **State Check:** Never use local state or raw `document.documentElement` manipulation to handle theme switches locally. Always pull `theme` and `toggleTheme` from `useAuth()`.
- Ensure all interactive elements, text, borders, inputs, and buttons have corresponding `dark:...` styling.

## 5. Loading & Image Performance
- **Image URLs:** Must resolve to verified Pinterest pin CDN URLs (`i.pinimg.com`).
- **Referrer Policy:** To prevent Pinterest CDN hotlink blocks, you **MUST** include `referrerPolicy="no-referrer"` on all `<img>` tags.
- **Graceful Image Loading:** Product images must be wrapped in an `<ImageWithSkeleton>` component.
- **Local Declaration Rule:** Due to page bundle optimizations, define the `<ImageWithSkeleton>` component locally in the file that needs it.
- **Cached Image Bugfix:** Ensure you use a React `useRef` to track the image and check if `imgRef.current?.complete` is true to resolve cached loading issues where `onLoad` does not fire:
  ```jsx
  import { useState, useRef, useEffect } from 'react';

  const ImageWithSkeleton = ({ src, alt, className, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
      if (imgRef.current && imgRef.current.complete) {
        setLoaded(true);
      }
    }, []);

    return (
      <div className="relative w-full h-full overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-t-2xl">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700" />
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer"
          className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      </div>
    );
  };
  ```

## 6. Access Control & Violations
- Admin can warn/ban users. Banned users must receive a persistent violation banner on their screens and be restricted from logging in.

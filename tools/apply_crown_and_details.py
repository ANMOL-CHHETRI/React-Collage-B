import os

def apply_crown_and_details():
    homepage_path = "src/pages/HomePage.jsx"
    catpage_path = "src/pages/CategoryPage.jsx"
    detailpage_path = "src/pages/ProductDetailPage.jsx"

    # 1. Update HomePage.jsx
    if os.path.exists(homepage_path):
        with open(homepage_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        target = """                      {p.badge && (
                        <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {p.badge}
                        </span>
                      )}"""

        replacement = """                      {p.id === 1 ? (
                        <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-amber-300 animate-pulse">
                          <svg referrerPolicy="no-referrer" className="w-3 h-3 fill-current text-slate-950" viewBox="0 0 24 24">
                            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 14h14v2H5v-2z"/>
                          </svg>
                          Most Sold
                        </span>
                      ) : p.badge ? (
                        <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {p.badge}
                        </span>
                      ) : null}"""
        
        content = content.replace(target, replacement)
        content = content.replace(target.replace("\r\n", "\n"), replacement)
        with open(homepage_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated HomePage with Most Sold Crown Badge")

    # 2. Update CategoryPage.jsx
    if os.path.exists(catpage_path):
        with open(catpage_path, "r", encoding="utf-8") as f:
            content = f.read()

        target = """                      {p.badge && (
                        <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {p.badge}
                        </span>
                      )}"""
        
        replacement = """                      {p.id === 1 ? (
                        <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-amber-300 animate-pulse">
                          <svg referrerPolicy="no-referrer" className="w-3 h-3 fill-current text-slate-950" viewBox="0 0 24 24">
                            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 14h14v2H5v-2z"/>
                          </svg>
                          Most Sold
                        </span>
                      ) : p.badge ? (
                        <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {p.badge}
                        </span>
                      ) : null}"""

        content = content.replace(target, replacement)
        content = content.replace(target.replace("\r\n", "\n"), replacement)
        with open(catpage_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated CategoryPage with Most Sold Crown Badge")

    # 3. Update ProductDetailPage.jsx
    if os.path.exists(detailpage_path):
        with open(detailpage_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Badge replacement
        target = """              {product.badge && (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{product.badge}</span>
              )}"""
        
        replacement = """              {product.id === 1 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-extrabold rounded-full border border-amber-300 dark:border-amber-500/30 animate-pulse">
                  <svg referrerPolicy="no-referrer" className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 14h14v2H5v-2z"/>
                  </svg>
                  Most Sold (Best Seller)
                </span>
              ) : product.badge ? (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{product.badge}</span>
              ) : null}"""

        content = content.replace(target, replacement)
        content = content.replace(target.replace("\r\n", "\n"), replacement)

        # Dark mode classes updates
        content = content.replace(
            'className="min-h-screen bg-slate-50 py-12"',
            'className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-12 transition-colors duration-300"'
        )
        content = content.replace(
            'className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"',
            'className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"'
        )
        content = content.replace(
            'className="text-3xl font-bold text-slate-900"',
            'className="text-3xl font-bold text-slate-900 dark:text-white"'
        )
        content = content.replace(
            'className="text-slate-600 leading-relaxed"',
            'className="text-slate-600 dark:text-slate-300 leading-relaxed"'
        )
        content = content.replace(
            'className="text-sm text-slate-400"',
            'className="text-sm text-slate-400 dark:text-slate-500"'
        )
        content = content.replace(
            'className="text-xl font-bold text-slate-900 mb-6"',
            'className="text-xl font-bold text-slate-900 dark:text-white mb-6"'
        )
        content = content.replace(
            'className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition"',
            'className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 p-4 hover:shadow-md transition"'
        )
        content = content.replace(
            'className="text-sm font-semibold text-slate-900 truncate"',
            'className="text-sm font-semibold text-slate-900 dark:text-white truncate"'
        )
        content = content.replace(
            'className="aspect-square rounded-xl overflow-hidden bg-slate-50"',
            'className="aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900"'
        )
        
        with open(detailpage_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated ProductDetailPage with Most Sold Crown Badge and Dark Mode support")

apply_crown_and_details()

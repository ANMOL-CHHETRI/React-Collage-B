import os

skeleton_code = """
const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
  const [loaded, setLoaded] = React.useState(false)
  const [error, setError] = React.useState(false)

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
}
"""

# Wait, the React object should be imported, or since useState is imported, we can just use useState.
# In HomePage.jsx, CategoryPage.jsx, ProductDetailPage.jsx, and UserDashboard.jsx, useState is already imported from "react".
# So we can define:
skeleton_code_clean = """
const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
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
}
"""

def update_homepage():
    path = "src/pages/HomePage.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Insert Component after imports
    import_idx = content.find('import { ProductCardSkeleton } from "../components/Skeleton";')
    if import_idx == -1:
        import_idx = content.find('import')
    
    end_of_line = content.find('\n', import_idx)
    content = content[:end_of_line+1] + skeleton_code_clean + content[end_of_line+1:]
    
    # 2. Replace featuredProduct image
    featured_img_target = """                  <img
                    src={featuredProduct?.image}
                    alt={featuredProduct?.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />"""
    featured_img_replacement = """                  <ImageWithSkeleton
                    src={featuredProduct?.image}
                    alt={featuredProduct?.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />"""
    content = content.replace(featured_img_target, featured_img_replacement)

    # 3. Replace category image
    cat_img_target = """                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />"""
    cat_img_replacement = """                  <ImageWithSkeleton
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />"""
    content = content.replace(cat_img_target, cat_img_replacement)

    # 4. Replace product list image
    prod_img_target = """                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://i.pinimg.com/736x/01/be/df/01bedf72df9b4b035178652d88820f4f.jpg";
                        }}
                      />"""
    prod_img_replacement = """                      <ImageWithSkeleton
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />"""
    content = content.replace(prod_img_target, prod_img_replacement)

    # 5. Replace cart item image
    cart_img_target = """                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-50 dark:bg-slate-900 shrink-0"
                        />"""
    cart_img_replacement = """                        <ImageWithSkeleton
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-50 dark:bg-slate-900 shrink-0"
                        />"""
    content = content.replace(cart_img_target, cart_img_replacement)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated HomePage.jsx")

def update_categorypage():
    path = "src/pages/CategoryPage.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    import_idx = content.find('import { ProductCardSkeleton } from "../components/Skeleton"')
    end_of_line = content.find('\n', import_idx)
    content = content[:end_of_line+1] + skeleton_code_clean + content[end_of_line+1:]
    
    prod_img_target = """                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://i.pinimg.com/736x/01/be/df/01bedf72df9b4b035178652d88820f4f.jpg";
                        }}
                      />"""
    prod_img_replacement = """                      <ImageWithSkeleton
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />"""
    content = content.replace(prod_img_target, prod_img_replacement)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated CategoryPage.jsx")

def update_detailpage():
    path = "src/pages/ProductDetailPage.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    import_idx = content.find('import { ProductDetailSkeleton } from "../components/Skeleton"')
    end_of_line = content.find('\n', import_idx)
    content = content[:end_of_line+1] + skeleton_code_clean + content[end_of_line+1:]
    
    main_img_target = '<img src={product.image} alt={product.name} className="w-full h-full object-cover" />'
    main_img_replacement = '<ImageWithSkeleton src={product.image} alt={product.name} className="w-full h-full object-cover" />'
    content = content.replace(main_img_target, main_img_replacement)
    
    rel_img_target = '<img src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-lg mb-3" />'
    rel_img_replacement = '<ImageWithSkeleton src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-lg mb-3" />'
    content = content.replace(rel_img_target, rel_img_replacement)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated ProductDetailPage.jsx")

def update_userdashboard():
    path = "src/pages/UserDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    import_idx = content.find('import { OrderCardUserSkeleton } from "../components/Skeleton"')
    end_of_line = content.find('\n', import_idx)
    content = content[:end_of_line+1] + skeleton_code_clean + content[end_of_line+1:]
    
    img_target = '<img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-50 dark:bg-slate-900 shrink-0" />'
    img_replacement = '<ImageWithSkeleton src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-50 dark:bg-slate-900 shrink-0" />'
    content = content.replace(img_target, img_replacement)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated UserDashboard.jsx")

update_homepage()
update_categorypage()
update_detailpage()
update_userdashboard()
print("Skeletons added successfully!")

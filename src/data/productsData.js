export const defaultProducts = [
  {
    id: 1,
    name: "Premium Dhaka Topi (Handwoven)",
    price: 1200,
    image: "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg",
    badge: "Best Seller",
    category: "Traditional Apparel",
    description: "Authentic hand-loomed Dhaka Topi from Palpa, representing Nepal's rich cultural heritage.",
    addedBy: "admin",
  },
  {
    id: 2,
    name: "Himalayan Orthodox Golden Tea",
    price: 850,
    image: "https://i.pinimg.com/736x/21/df/97/21df97eb098e945c7e148cebbd8e3d09.jpg",
    badge: "Organic",
    category: "Organic Tea & Coffee",
    description: "Premium black tea hand-picked from the high-altitude hills of Ilam, Nepal.",
    addedBy: "admin",
  },
  {
    id: 3,
    name: "Handmade Shakyamuni Buddha Statue",
    price: 18500,
    image: "https://i.pinimg.com/736x/8f/58/01/8f5801314672479768bada91c28c8dbb.jpg",
    badge: "Handcrafted",
    category: "Local Handicrafts",
    description: "Exquisite copper statue with 24k gold gilding, handcrafted by master artisans in Patan.",
    addedBy: "admin",
  },
  {
    id: 4,
    name: "Organic Wild Himalayan Honey",
    price: 1500,
    image: "https://i.pinimg.com/736x/01/be/df/01bedf72df9b4b035178652d88820f4f.jpg",
    badge: "Pure & Raw",
    category: "Herbs & Spices",
    description: "100% pure raw honey harvested from the wild cliffs of Annapurna region.",
    addedBy: "admin",
  },
  {
    id: 5,
    name: "Pure Pashmina Cashmere Shawl",
    price: 9500,
    image: "https://i.pinimg.com/736x/11/49/74/114974246fa4d567c9c05e54d8ecdb2f.jpg",
    badge: "Premium Quality",
    category: "Traditional Apparel",
    description: "Ultra-soft, warm, and authentic Chyangra Pashmina shawl hand-woven in Kathmandu Valley.",
    addedBy: "admin",
  },
  {
    id: 6,
    name: "Gorkha Khukuri (Authentic Service)",
    price: 4500,
    image: "https://i.pinimg.com/736x/9f/fa/b1/9ffab17cfd6c62f275727931b26c04f5.jpg",
    badge: "Artisanal",
    category: "Local Handicrafts",
    description: "Genuine hand-forged steel Khukuri, crafted by traditional blacksmiths of Nepal.",
    addedBy: "admin",
  },
  {
    id: 7,
    name: "Organic Himalayan Cardamom (Alaichi)",
    price: 650,
    image: "https://i.pinimg.com/736x/3f/82/ff/3f82ff025c898c0d1279a557876a3e5c.jpg",
    badge: "Fresh Spice",
    category: "Herbs & Spices",
    description: "High-grade, aromatic large cardamom pods harvested in the Eastern hills of Taplejung.",
    addedBy: "admin",
  },
  {
    id: 8,
    name: "Mt. Everest Arabica Coffee Beans",
    price: 1100,
    image: "https://i.pinimg.com/736x/82/05/69/820569994589255755.jpg",
    badge: "Single Origin",
    category: "Organic Tea & Coffee",
    description: "Organic single-origin Arabica beans grown in the high altitude volcanic soils of Nuwakot.",
    addedBy: "admin",
  },
]

const mergeSavedProducts = (saved) => {
  const defaultIds = new Set(defaultProducts.map(p => p.id))
  
  // 1. Process default products, migrating old Unsplash links to Pinterest links
  const mergedDefaults = defaultProducts.map((def) => {
    const existing = saved.find((p) => p.id === def.id)
    if (!existing) return def
    
    // Auto-migrate if image is the old unsplash link or name/description matches defaults
    const image = (!existing.image || existing.image.includes("unsplash.com")) ? def.image : existing.image
    return { ...existing, image }
  })
  
  // 2. Preserve any user-added products (id > 8)
  const userAdded = saved.filter((p) => !defaultIds.has(p.id))
  
  return [...mergedDefaults, ...userAdded]
}

export const loadProducts = () => {
  try {
    const stored = localStorage.getItem("shopease_products")
    if (!stored) return defaultProducts
    return mergeSavedProducts(JSON.parse(stored))
  } catch {
    return defaultProducts
  }
}

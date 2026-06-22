export const defaultProducts = [
  {
    id: 1,
    name: "Premium Dhaka Topi (Handwoven)",
    price: 1200,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    badge: "Best Seller",
    category: "Traditional Apparel",
    description: "Authentic hand-loomed Dhaka Topi from Palpa, representing Nepal's rich cultural heritage.",
    addedBy: "admin",
  },
  {
    id: 2,
    name: "Himalayan Orthodox Golden Tea",
    price: 850,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    badge: "Organic",
    category: "Organic Tea & Coffee",
    description: "Premium black tea hand-picked from the high-altitude hills of Ilam, Nepal.",
    addedBy: "admin",
  },
  {
    id: 3,
    name: "Handmade Shakyamuni Buddha Statue",
    price: 18500,
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80",
    badge: "Handcrafted",
    category: "Local Handicrafts",
    description: "Exquisite copper statue with 24k gold gilding, handcrafted by master artisans in Patan.",
    addedBy: "admin",
  },
  {
    id: 4,
    name: "Organic Wild Himalayan Honey",
    price: 1500,
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&auto=format&fit=crop&q=80",
    badge: "Pure & Raw",
    category: "Herbs & Spices",
    description: "100% pure raw honey harvested from the wild cliffs of Annapurna region.",
    addedBy: "admin",
  },
  {
    id: 5,
    name: "Pure Pashmina Cashmere Shawl",
    price: 9500,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80",
    badge: "Premium Quality",
    category: "Traditional Apparel",
    description: "Ultra-soft, warm, and authentic Chyangra Pashmina shawl hand-woven in Kathmandu Valley.",
    addedBy: "admin",
  },
  {
    id: 6,
    name: "Gorkha Khukuri (Authentic Service)",
    price: 4500,
    image: "https://images.unsplash.com/photo-1599403032009-94bdaab0f3b7?w=600&auto=format&fit=crop&q=80",
    badge: "Artisanal",
    category: "Local Handicrafts",
    description: "Genuine hand-forged steel Khukuri, crafted by traditional blacksmiths of Nepal.",
    addedBy: "admin",
  },
  {
    id: 7,
    name: "Organic Himalayan Cardamom (Alaichi)",
    price: 650,
    image: "https://images.unsplash.com/photo-1622824497447-b284a5493027?w=600&auto=format&fit=crop&q=80",
    badge: "Fresh Spice",
    category: "Herbs & Spices",
    description: "High-grade, aromatic large cardamom pods harvested in the Eastern hills of Taplejung.",
    addedBy: "admin",
  },
  {
    id: 8,
    name: "Mt. Everest Arabica Coffee Beans",
    price: 1100,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&auto=format&fit=crop&q=80",
    badge: "Single Origin",
    category: "Organic Tea & Coffee",
    description: "Organic single-origin Arabica beans grown in the high altitude volcanic soils of Nuwakot.",
    addedBy: "admin",
  },
]

const mergeSavedProducts = (saved) => {
  return defaultProducts.map((def) => {
    const existing = saved.find((p) => p.id === def.id)
    if (!existing) return def
    return { ...existing, image: def.image, name: def.name, description: def.description }
  })
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

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
    image: "https://i.pinimg.com/736x/56/d0/7f/56d07fba8ab764c361db3999425b48f1.jpg",
    badge: "Organic",
    category: "Organic Tea & Coffee",
    description: "Premium black tea hand-picked from the high-altitude hills of Ilam, Nepal.",
    addedBy: "admin",
  },
  {
    id: 3,
    name: "Handmade Shakyamuni Buddha Statue",
    price: 18500,
    image: "https://i.pinimg.com/736x/f2/df/28/f2df28734e8b2f896da2e4c7cad2f354.jpg",
    badge: "Handcrafted",
    category: "Local Handicrafts",
    description: "Exquisite copper statue with 24k gold gilding, handcrafted by master artisans in Patan.",
    addedBy: "admin",
  },
  {
    id: 4,
    name: "Organic Wild Himalayan Honey",
    price: 1500,
    image: "https://i.pinimg.com/736x/aa/a0/66/aaa066bd92f5721e603358173e219353.jpg",
    badge: "Pure & Raw",
    category: "Herbs & Spices",
    description: "100% pure raw honey harvested from the wild cliffs of Annapurna region.",
    addedBy: "admin",
  },
  {
    id: 5,
    name: "Pure Pashmina Cashmere Shawl",
    price: 9500,
    image: "https://i.pinimg.com/736x/89/47/66/8947664cc2390cac2bdac2b4e9ee030b.jpg",
    badge: "Premium Quality",
    category: "Traditional Apparel",
    description: "Ultra-soft, warm, and authentic Chyangra Pashmina shawl hand-woven in Kathmandu Valley.",
    addedBy: "admin",
  },
  {
    id: 6,
    name: "Gorkha Khukuri (Authentic Service)",
    price: 4500,
    image: "https://i.pinimg.com/736x/09/41/ae/0941aefdc7b7a3151698e1c3dcc3853d.jpg",
    badge: "Artisanal",
    category: "Local Handicrafts",
    description: "Genuine hand-forged steel Khukuri, crafted by traditional blacksmiths of Nepal.",
    addedBy: "admin",
  },
  {
    id: 7,
    name: "Organic Himalayan Cardamom (Alaichi)",
    price: 650,
    image: "https://i.pinimg.com/736x/28/c6/48/28c648b0a74979111f737955b05d05cd.jpg",
    badge: "Fresh Spice",
    category: "Herbs & Spices",
    description: "High-grade, aromatic large cardamom pods harvested in the Eastern hills of Taplejung.",
    addedBy: "admin",
  },
  {
    id: 8,
    name: "Mt. Everest Arabica Coffee Beans",
    price: 1100,
    image: "https://i.pinimg.com/736x/63/0d/01/630d013345d875610fec89f4c28dd2b6.jpg",
    badge: "Single Origin",
    category: "Organic Tea & Coffee",
    description: "Organic single-origin Arabica beans grown in the high altitude volcanic soils of Nuwakot.",
    addedBy: "admin",
  },
  {
  id: 9,
  name: "Traditional Daura Suruwal Set",
  price: 3500,
  image: "/daura_suruwal.jpg",
  badge: "New Arrival",
  category: "Traditional Apparel",
  description: "Authentic Nepali Daura Suruwal made from premium cotton.",
  addedBy: "admin",
},
{
  id: 10,
  name: "Gunyu Cholo",
  price: 2800,
  image: "/gunyo-choli.jpg",
  badge: "Traditional",
  category: "Traditional Apparel",
  description: "Traditional Nepali women's dress handcrafted with quality fabric.",
  addedBy: "admin",
},
{
  id: 11,
  name: "Haku Patasi",
  price: 3200,
  image: "/hakupatasi.jpg",
  badge: "Handwoven",
  category: "Traditional Apparel",
  description: "Traditional Newari black and red sari, handwoven in Nepal.",
  addedBy: "admin",
},
{
  id: 12,
  name: "Traditional Bhadgaule Topi",
  price: 950,
  image: "/bhadgauletopi.jpg",
  badge: "Cultural",
  category: "Traditional Apparel",
  description: "Classic black Bhadgaule Topi handcrafted in Bhaktapur, a timeless symbol of Nepali tradition.",
  addedBy: "admin",
},
{
  id: 13,
  name: "Handwoven Dhaka Saree",
  price: 6500,
  image: "/dhakasaree.jpg",
  badge: "Handwoven",
  category: "Traditional Apparel",
  description: "Beautiful Dhaka saree woven with traditional Nepali patterns, ideal for festivals and special occasions.",
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
    const isOldOrBroken = !existing.image || 
      existing.image.includes("unsplash.com") || 
      existing.image.includes("21/df/97") || 
      existing.image.includes("8f/58/01") || 
      existing.image.includes("01/be/df") || 
      existing.image.includes("11/49/74") || 
      existing.image.includes("9f/fa/b1") || 
      existing.image.includes("3f/82/ff") || 
      existing.image.includes("82/05/69") || 
      existing.image.includes("d6/1f/26") || 
      existing.image.includes("91/9a/c0") || 
      existing.image.includes("c9/79/fb") || 
      existing.image.includes("be/98/94") || 
      existing.image.includes("21/bc/d0") || 
      existing.image.includes("e4/c7/2a") || 
      existing.image.includes("80/7e/61") || 
      existing.image.includes("43/e7/70")
    const image = isOldOrBroken ? def.image : existing.image
    return { ...existing, image }
  })
  
  // 2. Preserve any user-added products (id > 8)
  const userAdded = saved.filter((p) => !defaultIds.has(p.id))
  
  return [...mergedDefaults, ...userAdded]
}

export const loadProducts = () => {
  try {
    // Version bump forces a refresh of cached products so new images apply
    const DATA_VERSION = "v3-pinterest-2027-06"
    const storedVersion = localStorage.getItem("shopease_data_version")
    if (storedVersion !== DATA_VERSION) {
      // Clear stale product cache so new default images are used
      localStorage.removeItem("shopease_products")
      localStorage.setItem("shopease_data_version", DATA_VERSION)
      return defaultProducts
    }
    const stored = localStorage.getItem("shopease_products")
    if (!stored) return defaultProducts
    return mergeSavedProducts(JSON.parse(stored))
  } catch {
    return defaultProducts
  }
}

import { createContext, useContext, useState, useEffect } from "react"
import { defaultProducts, loadProducts } from "../data/productsData"

const STORAGE_KEY = "shopease_products"

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(loadProducts)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now(), addedBy: "admin" }])
  }

  const updateProduct = (id, updates) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error("useProducts must be used within ProductProvider")
  return ctx
}

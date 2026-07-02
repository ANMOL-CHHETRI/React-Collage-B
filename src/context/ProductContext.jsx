/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react"
import { loadProducts } from "../data/productsData"
import { useToast } from "./ToastContext"

const STORAGE_KEY = "shopease_products"

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const { error: toastError } = useToast()
  const [products, setProducts] = useState(loadProducts)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch (err) {
      console.error("Failed to save products to localStorage:", err)
      toastError("Local storage quota exceeded! The product image you uploaded might be too large. Try a smaller file or a URL.")
    }
  }, [products, toastError])

  const addProduct = (product, addedBy = "admin") => {
    setProducts((prev) => [...prev, { ...product, id: Date.now(), addedBy }])
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

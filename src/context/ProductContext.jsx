import { createContext, useContext, useState, useEffect } from "react"
import { loadProducts } from "../data/productsData"
import { useToast } from "./ToastContext"
import { api } from "../utils/api"

const STORAGE_KEY = "shopease_products"

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const { error: toastError, success: toastSuccess } = useToast()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts()
        setProducts(data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch (err) {
        console.warn("Backend products fetch failed, using local cache:", err)
        setProducts(loadProducts())
      }
    }
    fetchProducts()
  }, [])

  const addProduct = async (product, addedBy = "admin") => {
    try {
      const payload = {
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        images: product.images || [product.image],
        badge: product.badge || null,
        stock: parseInt(product.stock),
        category: product.category,
        description: product.description,
        longDescription: product.longDescription || "",
        addedBy
      }
      const newProduct = await api.createProduct(payload)
      setProducts((prev) => [...prev, newProduct])
      toastSuccess("Product added successfully!")
    } catch (err) {
      console.warn("Failed to add product to backend, saving locally:", err)
      const localProduct = { ...product, id: Date.now(), addedBy, images: product.images || [product.image] }
      setProducts((prev) => {
        const updated = [...prev, localProduct]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
      toastSuccess("Product added locally (offline mode)")
    }
  }

  const updateProduct = async (id, updates) => {
    const original = products.find(p => p.id === id)
    if (!original) return

    const payload = {
      name: updates.name !== undefined ? updates.name : original.name,
      price: updates.price !== undefined ? parseFloat(updates.price) : original.price,
      image: updates.image !== undefined ? updates.image : original.image,
      images: updates.images !== undefined ? updates.images : (original.images || [original.image]),
      badge: updates.badge !== undefined ? updates.badge : original.badge,
      stock: updates.stock !== undefined ? parseInt(updates.stock) : original.stock,
      category: updates.category !== undefined ? updates.category : original.category,
      description: updates.description !== undefined ? updates.description : original.description,
      longDescription: updates.longDescription !== undefined ? updates.longDescription : original.longDescription,
      addedBy: original.addedBy || "admin"
    }

    try {
      const updatedProduct = await api.updateProduct(id, payload)
      setProducts((prev) => prev.map((p) => p.id === id ? updatedProduct : p))
      toastSuccess("Product updated successfully!")
    } catch (err) {
      console.warn("Failed to update product on backend, updating locally:", err)
      setProducts((prev) => {
        const updated = prev.map((p) => p.id === id ? { ...p, ...updates } : p)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
      toastSuccess("Product updated locally (offline mode)")
    }
  }

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toastSuccess("Product deleted successfully!")
    } catch (err) {
      console.warn("Failed to delete product on backend, deleting locally:", err)
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
      toastSuccess("Product deleted locally (offline mode)")
    }
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

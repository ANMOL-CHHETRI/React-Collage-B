/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "./ToastContext"
import { api } from "../utils/api"

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const { error: toastError, success: toastSuccess } = useToast()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts()
        setProducts(data)
      } catch (err) {
        toastError(err.message || "Failed to load products from database.")
      }
    }
    fetchProducts()
  }, [toastError])

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
      toastError(err.message || "Failed to add product to database.")
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
      toastError(err.message || "Failed to update product.")
    }
  }

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toastSuccess("Product deleted successfully!")
    } catch (err) {
      toastError(err.message || "Failed to delete product.")
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

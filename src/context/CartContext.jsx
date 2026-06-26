/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

const cartKey = (user) => {
  const id = user?.username || user?.email || "guest"
  return `shopease_cart_${id}`
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const key = cartKey(user)

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  // re-load cart when user changes (login/logout)
  const [prevKey, setPrevKey] = useState(key)
  if (key !== prevKey) {
    setPrevKey(key)
    const saved = localStorage.getItem(key)
    setCartItems(saved ? JSON.parse(saved) : [])
  }

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(cartItems))
  }, [cartItems, key])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true) // Automatically open cart drawer when adding an item
  }

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

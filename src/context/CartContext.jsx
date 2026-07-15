/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext();

const cartKey = (user) => {
  const id = user?.username || user?.email || "guest";
  return `shopease_cart_${id}`;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { error: toastError } = useToast();

  const key = cartKey(user);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [outOfStockAlert, setOutOfStockAlert] = useState(null); // holds product name, or null

  // re-load cart when user changes (login/logout)
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    try {
      const saved = localStorage.getItem(key);
      const parsed = saved ? JSON.parse(saved) : [];
      setCartItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setCartItems([]);
    }
  }

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, key]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      toastError("Please log in to add items to your cart.");
      if (typeof navigate === "function") {
        navigate("/user-login");
      }
      return;
    }

    const maxStock = product.stock ?? Infinity;

    // Case 1: product has no stock at all
    if (maxStock === 0) {
      setOutOfStockAlert(product.name);
      return;
    }

    const existing = cartItems.find((item) => item.id === product.id);

    // Case 2: customer already has ALL available stock in their cart
    if (existing && existing.quantity >= maxStock) {
      setOutOfStockAlert(product.name);
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        const newQty = Math.min(existingItem.quantity + quantity, maxStock);
        if (newQty < existingItem.quantity + quantity) {
          toastError(`Only ${maxStock} of ${product.name} available. Cart updated to max stock.`);
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item,
        );
      }

      const cappedQuantity = Math.min(quantity, maxStock);
      if (cappedQuantity < quantity) {
        toastError(`Only ${maxStock} of ${product.name} available.`);
      }
      return [...prev, { ...product, quantity: cappedQuantity }];
    });

    setIsCartOpen(true); // Automatically open cart drawer when adding an item
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        const maxStock = item.stock ?? Infinity;

        if (quantity >= maxStock) {
          setOutOfStockAlert(item.name);
          return { ...item, quantity: maxStock };
        }
        return { ...item, quantity };
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

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
        outOfStockAlert,
        setOutOfStockAlert,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
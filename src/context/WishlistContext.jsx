/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    // Stores the product that was just added so the popup can display it
    const [wishlistPopupProduct, setWishlistPopupProduct] = useState(null);
    // Controls whether the wishlist popup is visible
    const [showWishlistPopup, setShowWishlistPopup] = useState(false);

    try {
      const saved = localStorage.getItem("shopease_wishlist");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const { success } = useToast();

  useEffect(() => {
    localStorage.setItem("shopease_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        success(`Removed ${product.name} from wishlist`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        success(`Added ${product.name} to wishlist`);

        // Save the added product so popup can display its details
        setWishlistPopupProduct(product);

        // Open popup
        setShowWishlistPopup(true);

        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,

        wishlistPopupProduct,
        showWishlistPopup,
        setShowWishlistPopup,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

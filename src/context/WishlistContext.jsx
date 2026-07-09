/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_wishlist");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Stores information for the wishlist popup
  const [wishlistModal, setWishlistModal] = useState({
    open: false,
    product: null,
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

        // Open the wishlist popup (Disabled as per request)
        // setWishlistModal({
        //   open: true,
        //   product: product,
        // });

        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
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
        removeFromWishlist,
        isInWishlist,
        wishlistModal,
        setWishlistModal,
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

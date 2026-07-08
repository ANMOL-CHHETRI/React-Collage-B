import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const WishlistModal = () => {
  const { wishlistModal, wishlistCount, setWishlistModal } = useWishlist();

  // Don't render anything if popup is closed
  if (!wishlistModal.open) return null;

  const product = wishlistModal.product;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative">

        {/* Success Title */}
        <h2 className="text-2xl font-bold text-green-600 mb-6">
          ✓ Product Added to Wishlist
        </h2>

        {/* Product */}
        <div className="flex gap-4 items-center">

          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 rounded-xl object-cover"
          />

          <div>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {product.name}
            </h3>

            <p className="text-amber-600 font-semibold mt-2">
              Rs. {product.price}
            </p>

          </div>

        </div>

        {/* Wishlist Count */}
        <p className="mt-6 text-slate-600 dark:text-slate-300">
          There {wishlistCount === 1 ? "is" : "are"}{" "}
          <span className="font-bold">{wishlistCount}</span>{" "}
          item{wishlistCount > 1 ? "s" : ""} in your wishlist.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-3">

          <button
            onClick={() =>
              setWishlistModal({
                open: false,
                product: null,
              })
            }
            className="flex-1 border rounded-lg py-3 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Continue Shopping
          </button>

          <Link
            to="/wishlist"
            onClick={() =>
              setWishlistModal({
                open: false,
                product: null,
              })
            }
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg py-3 text-center"
          >
            Go To Wishlist
          </Link>

        </div>

      </div>
    </div>
  );
};

export default WishlistModal;
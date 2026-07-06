import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <svg
              className="w-8 h-8 text-red-500 animate-float"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            My Wishlist
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Items you've saved for later.
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 animate-float"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            You haven't added any products to your wishlist yet. Browse our
            catalog and click the heart icon to save items.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-8 py-3.5 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Wishlist Table */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          {/* Table */}
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-amber-500 text-white">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {wishlist.map((product) => {
                return (
                  <tr
                    key={product.id}
                    className="border-t border-slate-200 dark:border-slate-800"
                  >
                    {/* Product Column */}
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-xl border"
                        />

                        <div className="space-y-2">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                            {product.name}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {product.category}
                          </p>

                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {product.description}
                          </p>

                          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-semibold">
                            {product.badge}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="text-center font-bold text-slate-800 dark:text-white">
                      Rs {product.price}
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            addToCart(product);
                            removeFromWishlist(product.id);
                          }}
                          className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                        >
                          Add to Cart
                        </button>

                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-slate-200 dark:border-slate-800">
            <Link
              to="/"
              className="px-6 py-3 rounded-lg border bg-gray-300 border-slate-300 dark:border-slate-700 hover:bg-slate-500 dark:hover:bg-slate-900 transition font-medium"
            >
              ← Continue Shopping
            </Link>

            <button
              onClick={clearWishlist}
              className="px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-700 transition font-medium"
            >
              Clear Wishlist
            </button>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-5">
  <div className="flex items-center gap-3 flex-wrap">
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      Your wishlist URL for sharing:
    </span>

    <span className="text-sm text-emerald-500">
      {window.location.origin}/wishlist
    </span>

    <button
      onClick={() => {
        navigator.clipboard.writeText(
          `${window.location.origin}/wishlist`
        );
      }}
      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
    >
      Copy Link
    </button>
  </div>
</div>
</div>
      )}
    </div>
  );
};

export default WishlistPage;

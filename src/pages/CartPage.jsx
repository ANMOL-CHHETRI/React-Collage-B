import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { provincesData } from "../data/provincesData"
import NepalInteractiveMap from "../components/NepalInteractiveMap"
import { CartItemSkeleton } from "../components/Skeleton"
import { useToast } from "../context/ToastContext"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import CheckoutModal from "../components/CheckoutModal"

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartSubtotal } = useCart()
  const { user } = useAuth()
  const [selectedProvince, setSelectedProvince] = useState("bagmati")
  const [loading, setLoading] = useState(true)
  const [checkoutModal, setCheckoutModal] = useState(false)
  const { error: toastError } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const shipping = provincesData[selectedProvince]?.shippingFee || 0
  const grandTotal = cartSubtotal + shipping

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
          <Link to="/" className="text-sm text-amber-600 hover:underline font-medium">&larr; Continue Shopping</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
            {/* Order Summary skeleton */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-32" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-20" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-20" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-16" />
                  <div className="h-4 bg-slate-200 rounded w-20" />
                </div>
              </div>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Your cart is Empty</h2>
            <p className="text-sm text-slate-400 mb-6">Add some products to get started</p>
            <Link to="/" className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 flex items-center gap-4 border border-slate-100 shadow-sm">
                  <img referrerPolicy="no-referrer" src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{item.name}</h3>
                    <p className="text-amber-600 font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer">&minus;</button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline mt-1 cursor-pointer">Remove</button>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-red-500 hover:underline cursor-pointer">Clear Cart</button>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>Rs. {shipping.toLocaleString()}</span>
                  </div>
                  <hr className="border-slate-100" />
                  <div className="flex justify-between font-bold text-slate-900 text-base">
                    <span>Total</span>
                    <span>Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (!user) {
                      toastError("Please log in to proceed to checkout.")
                      navigate("/user-login")
                    } else {
                      setCheckoutModal(true)
                    }
                  }}
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  Proceed to Checkout
                </button>
                <p className="text-xs text-slate-400 text-center mt-2">Select a province below to calculate shipping</p>
              </div>

              <NepalInteractiveMap selectedProvince={selectedProvince} onSelectProvince={setSelectedProvince} />
            </div>
          </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={checkoutModal} 
        onClose={() => setCheckoutModal(false)} 
        grandTotal={grandTotal} 
      />
    </div>
  )
}

export default CartPage

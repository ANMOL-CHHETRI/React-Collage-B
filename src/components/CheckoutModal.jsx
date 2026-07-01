import { useState } from "react"
import { useNavigate } from "react-router"
import { useToast } from "../context/ToastContext"
import { useCart } from "../context/CartContext"

const CheckoutModal = ({ isOpen, onClose, grandTotal }) => {
  const [checkoutStep, setCheckoutStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review
  const [shippingDetails, setShippingDetails] = useState({ fullName: "", phone: "", address: "", city: "" })
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [checkingOut, setCheckingOut] = useState(false)
  const [agreedToPolicy, setAgreedToPolicy] = useState(false)
  
  const { clearCart, cartItems } = useCart()
  const { success } = useToast()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleCheckout = () => {
    setCheckingOut(true)
    setTimeout(() => {
      setCheckingOut(false)
      clearCart()
      success("Order placed successfully! Check your dashboard for tracking.")
      navigate("/user/dashboard")
      onClose()
    }, 2000)
  }

  const handleClose = () => {
    if (checkingOut) return
    setCheckoutStep(1)
    onClose()
  }

  const isShippingValid = shippingDetails.fullName && shippingDetails.phone && shippingDetails.address && shippingDetails.city

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-fade-in-up border border-slate-200 dark:border-slate-800">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-10 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-500 -z-10 rounded-full transition-all duration-300"
            style={{ width: checkoutStep === 1 ? '0%' : checkoutStep === 2 ? '50%' : '100%' }}
          />
          
          {[1, 2, 3].map(step => (
            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              checkoutStep >= step 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}>
              {step}
            </div>
          ))}
        </div>

        {checkoutStep === 1 && (
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Shipping Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={shippingDetails.fullName}
                  onChange={e => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={shippingDetails.phone}
                  onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white" 
                  placeholder="+977 98XXXXXXX"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                  <input 
                    type="text" 
                    value={shippingDetails.address}
                    onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white" 
                    placeholder="Street, House No"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input 
                    type="text" 
                    value={shippingDetails.city}
                    onChange={e => setShippingDetails({...shippingDetails, city: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white" 
                    placeholder="Kathmandu"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={() => isShippingValid && setCheckoutStep(2)}
              disabled={!isShippingValid}
              className="w-full mt-6 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-3.5 px-4 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {checkoutStep === 2 && (
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Payment Selection</h3>
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'credit_card' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'credit_card'} onChange={() => setPaymentMethod('credit_card')} className="w-5 h-5 text-orange-500 focus:ring-orange-500" />
                <div className="flex-1">
                  <span className="block font-bold text-slate-900 dark:text-white">Credit / Debit Card</span>
                  <span className="text-xs text-slate-500">Pay securely with Visa or Mastercard</span>
                </div>
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </label>
              
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'digital_wallet' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'digital_wallet'} onChange={() => setPaymentMethod('digital_wallet')} className="w-5 h-5 text-orange-500 focus:ring-orange-500" />
                <div className="flex-1">
                  <span className="block font-bold text-slate-900 dark:text-white">Digital Wallet</span>
                  <span className="text-xs text-slate-500">eSewa, Khalti, or IME Pay</span>
                </div>
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-orange-500 focus:ring-orange-500" />
                <div className="flex-1">
                  <span className="block font-bold text-slate-900 dark:text-white">Cash on Delivery</span>
                  <span className="text-xs text-slate-500">Pay when you receive the package</span>
                </div>
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setCheckoutStep(1)}
                className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition cursor-pointer"
              >
                Back
              </button>
              <button 
                onClick={() => setCheckoutStep(3)}
                className="flex-1 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-3.5 px-4 rounded-xl shadow-md transition cursor-pointer"
              >
                Continue to Review
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 3 && (
          <div className="animate-fade-in-up text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Order Review</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Almost there! Review your details below.</p>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-left mb-6 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 dark:text-slate-400">Total Items:</span>
                <span className="font-bold text-slate-900 dark:text-white">{cartItems.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 dark:text-slate-400">Total Amount:</span>
                <span className="font-bold text-orange-600">Rs. {grandTotal.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Shipping To:</span>
                <span className="font-bold text-slate-900 dark:text-white block">{shippingDetails.fullName}</span>
                <span className="text-slate-600 dark:text-slate-300 block">{shippingDetails.address}, {shippingDetails.city}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Payment Method:</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize block">{paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="mb-6 text-left bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreedToPolicy} 
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  I agree to ShopEase Nepal's <a href="/policy" target="_blank" className="text-orange-600 hover:underline">Terms of Use</a> and <a href="/policy" target="_blank" className="text-orange-600 hover:underline">Purchase Policy</a>. I understand this is required to complete my order.
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setCheckoutStep(2)}
                disabled={checkingOut}
                className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition disabled:opacity-50 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleCheckout}
                disabled={checkingOut || !agreedToPolicy}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {checkingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutModal
